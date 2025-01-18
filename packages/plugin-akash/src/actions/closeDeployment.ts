import { type Action, elizaLogger } from "@elizaos/core";
import type { IAgentRuntime, Memory, State, HandlerCallback, Content, ActionExample } from "@elizaos/core";
import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { getAkashTypeRegistry, getTypeUrl } from "@akashnetwork/akashjs/build/stargate";
import { MsgCloseDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { validateAkashConfig } from "../environment";
import { fetchDeployments } from "./getDeploymentApi";
import { AkashError, AkashErrorCode } from "../error/error";
// import { getCertificatePath } from "../utils/paths";
import { isPluginLoaded } from "../runtime_inspect";

interface CloseDeploymentContent extends Content {
    dseq?: string;
    closeAll?: boolean;
}

// Certificate file path
// const CERTIFICATE_PATH = getCertificatePath(import.meta.url);

// Initialize wallet and client
async function initializeClient(runtime: IAgentRuntime) {
    elizaLogger.info("=== Initializing Client for Deployment Closure ===");
    const config = await validateAkashConfig(runtime);

    if (!config.AKASH_MNEMONIC) {
        throw new AkashError(
            "AKASH_MNEMONIC is required for closing deployments",
            AkashErrorCode.WALLET_NOT_INITIALIZED
        );
    }

    elizaLogger.debug("Initializing wallet", {
        rpcEndpoint: config.RPC_ENDPOINT,
        chainId: config.AKASH_CHAIN_ID,
        version: config.AKASH_VERSION,
        hasMnemonic: !!config.AKASH_MNEMONIC
    });

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.AKASH_MNEMONIC, {
        prefix: "akash"
    });

    const [account] = await wallet.getAccounts();
    elizaLogger.debug("Wallet initialized successfully", {
        address: account.address,
        prefix: "akash"
    });

    // Initialize registry and client
    const myRegistry = new Registry(getAkashTypeRegistry());
    const client = await SigningStargateClient.connectWithSigner(
        config.AKASH_NODE || "https://rpc.akash.forbole.com:443",
        wallet,
        { registry: myRegistry }
    );

    elizaLogger.info("Client initialization complete", {
        nodeUrl: config.AKASH_NODE || "https://rpc.akash.forbole.com:443",
        address: account.address
    });

    return { client, account, wallet };
}

// Verify deployment status before closing
async function verifyDeploymentStatus(runtime: IAgentRuntime, dseq: string): Promise<boolean> {
    elizaLogger.info("Verifying deployment status", { dseq });

    try {
        const deployments = await fetchDeployments(runtime, undefined, 0, 100);
        const deployment = deployments.results.find(d => d.dseq === dseq);

        if (!deployment) {
            throw new AkashError(
                `Deployment not found with DSEQ: ${dseq}`,
                AkashErrorCode.DEPLOYMENT_NOT_FOUND
            );
        }

        if (deployment.status.toLowerCase() !== 'active') {
            throw new AkashError(
                `Deployment ${dseq} is not active (current status: ${deployment.status})`,
                AkashErrorCode.DEPLOYMENT_CLOSE_FAILED
            );
        }

        return true;
    } catch (error) {
        if (error instanceof AkashError) {
            throw error;
        }
        throw new AkashError(
            `Failed to verify deployment status: ${error instanceof Error ? error.message : String(error)}`,
            AkashErrorCode.DEPLOYMENT_NOT_FOUND
        );
    }
}

// Close a single deployment by DSEQ
async function closeSingleDeployment(
    runtime: IAgentRuntime,
    dseq: string
): Promise<boolean> {
    elizaLogger.info("Closing single deployment", { dseq });

    try {
        // Verify deployment exists and is active
        await verifyDeploymentStatus(runtime, dseq);

        const { client, account } = await initializeClient(runtime);

        // Create close deployment message
        const message = MsgCloseDeployment.fromPartial({
            id: {
                dseq: dseq,
                owner: account.address
            }
        });

        const msgAny = {
            typeUrl: getTypeUrl(MsgCloseDeployment),
            value: message
        };

        // Set fee
        const fee = {
            amount: [{ denom: "uakt", amount: "20000" }],
            gas: "800000"
        };

        // Send transaction
        elizaLogger.info("Sending close deployment transaction", { dseq });
        const result = await client.signAndBroadcast(
            account.address,
            [msgAny],
            fee,
            `close deployment ${dseq}`
        );

        if (result.code !== 0) {
            throw new AkashError(
                `Transaction failed: ${result.rawLog}`,
                AkashErrorCode.DEPLOYMENT_CLOSE_FAILED,
                { rawLog: result.rawLog }
            );
        }

        elizaLogger.info("Deployment closed successfully", {
            dseq,
            transactionHash: result.transactionHash
        });

        return true;
    } catch (error) {
        elizaLogger.error("Failed to close deployment", {
            dseq,
            error: error instanceof Error ? error.message : String(error),
            code: error instanceof AkashError ? error.code : AkashErrorCode.DEPLOYMENT_CLOSE_FAILED,
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
}

// Close all active deployments
async function closeAllDeployments(
    runtime: IAgentRuntime
): Promise<{ success: string[], failed: string[] }> {
    elizaLogger.info("Closing all active deployments");

    try {
        // Fetch active deployments
        const deployments = await fetchDeployments(runtime, undefined, 0, 100);
        const activeDeployments = deployments.results.filter(d =>
            d.status.toLowerCase() === 'active'
        );

        if (activeDeployments.length === 0) {
            elizaLogger.info("No active deployments found to close");
            return { success: [], failed: [] };
        }

        elizaLogger.info("Found active deployments to close", {
            count: activeDeployments.length,
            dseqs: activeDeployments.map(d => d.dseq)
        });

        // Close each deployment
        const results = { success: [] as string[], failed: [] as string[] };
        for (const deployment of activeDeployments) {
            try {
                await closeSingleDeployment(runtime, deployment.dseq);
                results.success.push(deployment.dseq);
            } catch (error) {
                elizaLogger.error("Failed to close deployment", {
                    dseq: deployment.dseq,
                    error: error instanceof Error ? error.message : String(error),
                    code: error instanceof AkashError ? error.code : AkashErrorCode.DEPLOYMENT_CLOSE_FAILED
                });
                results.failed.push(deployment.dseq);
            }
        }

        elizaLogger.info("Finished closing deployments", results);
        return results;
    } catch (error) {
        elizaLogger.error("Failed to close deployments", {
            error: error instanceof Error ? error.message : String(error),
            code: error instanceof AkashError ? error.code : AkashErrorCode.DEPLOYMENT_CLOSE_FAILED,
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
}

export const closeDeploymentAction: Action = {
    name: "CLOSE_DEPLOYMENT",
    similes: ["CLOSE_AKASH_DEPLOYMENT", "STOP_DEPLOYMENT", "TERMINATE_DEPLOYMENT"],
    description: "Close an active deployment on the Akash Network",
    examples: [[
        {
            user: "user",
            content: {
                text: "Close deployment with DSEQ 123456",
                dseq: "123456"
            } as CloseDeploymentContent
        } as ActionExample,
        {
            user: "assistant",
            content: {
                text: "Closing deployment with DSEQ 123456..."
            } as CloseDeploymentContent
        } as ActionExample
    ], [
        {
            user: "user",
            content: {
                text: "Close all active deployments",
                closeAll: true
            } as CloseDeploymentContent
        } as ActionExample,
        {
            user: "assistant",
            content: {
                text: "Closing all active deployments..."
            } as CloseDeploymentContent
        } as ActionExample
    ]],

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        elizaLogger.debug("=== Starting Close Deployment Validation ===");
        elizaLogger.debug("Validating close deployment request", { message });

        // Check if plugin is properly loaded
        if (!isPluginLoaded(runtime, "akash")) {
            elizaLogger.error("Akash plugin not properly loaded during validation");
            return false;
        }

        try {
            const params = message.content as Partial<CloseDeploymentContent>;
            const config = await validateAkashConfig(runtime);
            elizaLogger.debug("Validating parameters", { params });

            // If no parameters provided, use environment defaults
            if (!params.dseq && !params.closeAll) {
                if (config.AKASH_CLOSE_DEP === "closeAll") {
                    params.closeAll = true;
                } else if (config.AKASH_CLOSE_DEP === "dseq" && config.AKASH_CLOSE_DSEQ) {
                    params.dseq = config.AKASH_CLOSE_DSEQ;
                } else {
                    throw new AkashError(
                        "Either dseq or closeAll parameter is required",
                        AkashErrorCode.VALIDATION_PARAMETER_MISSING,
                        { parameters: ["dseq", "closeAll"] }
                    );
                }
            }

            if (params.dseq && params.closeAll) {
                throw new AkashError(
                    "Cannot specify both dseq and closeAll parameters",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                    { parameters: ["dseq", "closeAll"] }
                );
            }

            if (params.dseq && !/^\d+$/.test(params.dseq)) {
                throw new AkashError(
                    "DSEQ must be a numeric string",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                    { parameter: "dseq", value: params.dseq }
                );
            }

            elizaLogger.debug("Validation completed successfully");
            return true;
        } catch (error) {
            elizaLogger.error("Close deployment validation failed", {
                error: error instanceof AkashError ? {
                    code: error.code,
                    message: error.message,
                    details: error.details
                } : String(error)
            });
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        _options: { [key: string]: unknown } = {},
        callback?: HandlerCallback
    ): Promise<boolean> => {
        const actionId = Date.now().toString();
        elizaLogger.info("=== Starting Close Deployment Request ===", {
            actionId,
            messageId: message.id,
            userId: message.userId
        });

        try {
            const config = await validateAkashConfig(runtime);
            const params = message.content as Partial<CloseDeploymentContent>;

            // If no parameters provided, use environment defaults
            if (!params.dseq && !params.closeAll) {
                if (config.AKASH_CLOSE_DEP === "closeAll") {
                    params.closeAll = true;
                } else if (config.AKASH_CLOSE_DEP === "dseq" && config.AKASH_CLOSE_DSEQ) {
                    params.dseq = config.AKASH_CLOSE_DSEQ;
                } else {
                    if (callback) {
                        elizaLogger.info("=== Preparing error callback response ===", {
                            actionId,
                            hasCallback: true,
                            errorType: 'AkashError'
                        });

                        const errorResponse = {
                            text: "Either DSEQ or closeAll parameter is required",
                            content: {
                                success: false,
                                error: {
                                    code: AkashErrorCode.VALIDATION_PARAMETER_MISSING,
                                    message: "Either dseq or closeAll parameter is required"
                                },
                                metadata: {
                                    timestamp: new Date().toISOString(),
                                    source: 'akash-plugin',
                                    action: 'closeDeployment',
                                    version: '1.0.0',
                                    actionId
                                }
                            }
                        };

                        callback(errorResponse);
                    }
                    return false;
                }
            }

            if (params.closeAll) {
                const results = await closeAllDeployments(runtime);

                if (callback) {
                    elizaLogger.info("=== Preparing callback response for bulk closure ===", {
                        hasCallback: true,
                        actionId,
                        successCount: results.success.length,
                        failedCount: results.failed.length
                    });

                    const callbackResponse = {
                        text: `Deployment Closure Results:\n\nSuccessfully closed: ${results.success.length} deployments${
                            results.success.length > 0 ? `\nDSEQs: ${results.success.join(', ')}` : ''
                        }${
                            results.failed.length > 0 ? `\n\nFailed to close: ${results.failed.length} deployments\nDSEQs: ${results.failed.join(', ')}` : ''
                        }`,
                        content: {
                            success: results.failed.length === 0,
                            data: {
                                successful: results.success,
                                failed: results.failed,
                                totalClosed: results.success.length,
                                totalFailed: results.failed.length
                            },
                            metadata: {
                                timestamp: new Date().toISOString(),
                                source: 'akash-plugin',
                                action: 'closeDeployment',
                                version: '1.0.0',
                                actionId
                            }
                        }
                    };

                    elizaLogger.info("=== Executing callback with response ===", {
                        actionId,
                        responseText: callbackResponse.text,
                        hasContent: !!callbackResponse.content,
                        contentKeys: Object.keys(callbackResponse.content),
                        metadata: callbackResponse.content.metadata
                    });

                    callback(callbackResponse);

                    elizaLogger.info("=== Callback executed successfully ===", {
                        actionId,
                        timestamp: new Date().toISOString()
                    });
                }
                return results.failed.length === 0;

            } else if (params.dseq) {
                const success = await closeSingleDeployment(runtime, params.dseq);

                if (callback) {
                    elizaLogger.info("=== Preparing callback response for single closure ===", {
                        hasCallback: true,
                        actionId,
                        dseq: params.dseq,
                        success
                    });

                    const callbackResponse = {
                        text: success ?
                            `Successfully closed deployment DSEQ: ${params.dseq}` :
                            `Failed to close deployment DSEQ: ${params.dseq}`,
                        content: {
                            success,
                            data: {
                                dseq: params.dseq
                            },
                            metadata: {
                                timestamp: new Date().toISOString(),
                                source: 'akash-plugin',
                                action: 'closeDeployment',
                                version: '1.0.0',
                                actionId
                            }
                        }
                    };

                    elizaLogger.info("=== Executing callback with response ===", {
                        actionId,
                        responseText: callbackResponse.text,
                        hasContent: !!callbackResponse.content,
                        contentKeys: Object.keys(callbackResponse.content),
                        metadata: callbackResponse.content.metadata
                    });

                    callback(callbackResponse);

                    elizaLogger.info("=== Callback executed successfully ===", {
                        actionId,
                        timestamp: new Date().toISOString()
                    });
                }
                return success;
            }

            return false;

        } catch (error) {
            elizaLogger.error("Close deployment request failed", {
                error: error instanceof Error ? error.message : String(error),
                code: error instanceof AkashError ? error.code : AkashErrorCode.DEPLOYMENT_CLOSE_FAILED,
                actionId
            });

            if (callback) {
                elizaLogger.info("=== Preparing error callback response ===", {
                    actionId,
                    hasCallback: true,
                    errorType: error instanceof AkashError ? 'AkashError' : 'Error'
                });

                const errorResponse = {
                    text: `Failed to close deployment: ${error instanceof Error ? error.message : String(error)}`,
                    content: {
                        success: false,
                        error: {
                            code: error instanceof AkashError ? error.code : AkashErrorCode.DEPLOYMENT_CLOSE_FAILED,
                            message: error instanceof Error ? error.message : String(error)
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'closeDeployment',
                            version: '1.0.0',
                            actionId
                        }
                    }
                };

                elizaLogger.info("=== Executing error callback ===", {
                    actionId,
                    responseText: errorResponse.text,
                    hasContent: !!errorResponse.content,
                    contentKeys: Object.keys(errorResponse.content)
                });

                callback(errorResponse);

                elizaLogger.info("=== Error callback executed ===", {
                    actionId,
                    timestamp: new Date().toISOString()
                });
            }

            return false;
        }
    }
};

export default closeDeploymentAction;