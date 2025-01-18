import { type Action, elizaLogger } from "@elizaos/core";
import type { IAgentRuntime, Memory, State, HandlerCallback, Content, ActionExample } from "@elizaos/core";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { QueryDeploymentRequest, QueryClientImpl as DeploymentQueryClient } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { getRpc } from "@akashnetwork/akashjs/build/rpc";
import { validateAkashConfig } from "../environment";
import { AkashError, AkashErrorCode } from "../error/error";

interface GetDeploymentStatusContent extends Content {
    text: string;
    dseq?: string;
}

interface DeploymentGroup {
    groupId?: {
        owner: string;
        dseq: string;
        gseq: number;
    };
    state: string;
    resources: Array<{
        resources: {
            cpu: {
                units: {
                    val: string;
                };
            };
            memory: {
                quantity: {
                    val: string;
                };
            };
            storage: Array<{
                quantity: {
                    val: string;
                };
            }>;
        };
        count: number;
        price: {
            denom: string;
            amount: string;
        };
    }>;
}

interface DeploymentResponse {
    deploymentId?: {
        owner: string;
        dseq: string;
    };
    state: string;
    version: string;
    createdAt: string;
    escrowAccount?: {
        balance?: {
            denom: string;
            amount: string;
        };
    };
    groups?: DeploymentGroup[];
}

enum DeploymentState {
    UNKNOWN = 0,
    ACTIVE = 1,
    CLOSED = 2,
    INSUFFICIENT_FUNDS = 3,
}

export const getDeploymentStatusAction: Action = {
    name: "GET_DEPLOYMENT_STATUS",
    similes: ["CHECK_DEPLOYMENT", "DEPLOYMENT_STATUS", "DEPLOYMENT_STATE", "CHECK DSEQ"],
    description: "Get the current status of a deployment on Akash Network",
    examples: [[
        {
            user: "user",
            content: {
                text: "Can you check the deployment status of the DSEQ 123456?",
            } as GetDeploymentStatusContent
        } as ActionExample
    ]],

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        elizaLogger.debug("Validating get deployment status request", { message });
        try {
            const params = message.content as Partial<GetDeploymentStatusContent>;
            const config = await validateAkashConfig(runtime);

            // Extract DSEQ from text if present
            if (params.text && !params.dseq) {
                // Pattern to match DSEQ followed by numbers
                const dseqMatch = params.text.match(/(?:DSEQ|dseq)\s*(\d+)/i);
                if (dseqMatch) {
                    params.dseq = dseqMatch[1];
                    elizaLogger.debug("Extracted DSEQ from text", {
                        text: params.text,
                        extractedDseq: params.dseq
                    });
                }
            }

            // If no dseq provided, check environment configuration
            if (!params.dseq) {
                if (config.AKASH_DEP_STATUS === "dseq" && config.AKASH_DEP_DSEQ) {
                    params.dseq = config.AKASH_DEP_DSEQ;
                } else if (config.AKASH_DEP_STATUS === "param_passed") {
                    elizaLogger.info("DSEQ parameter is required when AKASH_DEP_STATUS is set to param_passed", {
                        current_status: config.AKASH_DEP_STATUS
                    });
                    return true; // Allow validation to pass, we'll handle the missing parameter in the handler
                } else {
                    elizaLogger.info("No DSEQ provided and no valid environment configuration found", {
                        dep_status: config.AKASH_DEP_STATUS,
                        dep_dseq: config.AKASH_DEP_DSEQ
                    });
                    return true; // Allow validation to pass, we'll handle the missing configuration in the handler
                }
            }

            // If dseq is provided, validate its format
            if (params.dseq && !/^\d+$/.test(params.dseq)) {
                throw new AkashError(
                    "Invalid DSEQ format. Must be a numeric string",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                    { parameter: "dseq", value: params.dseq }
                );
            }

            return true;
        } catch (error) {
            elizaLogger.error("Get deployment status validation failed", {
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
        elizaLogger.info("Starting deployment status request", { actionId });

        try {
            const config = await validateAkashConfig(runtime);
            const params = message.content as Partial<GetDeploymentStatusContent>;
            let dseqSource = "parameter"; // Track where the DSEQ came from

            // Handle missing dseq parameter based on environment configuration
            if (!params.dseq) {
                if (config.AKASH_DEP_STATUS === "dseq") {
                    if (config.AKASH_DEP_DSEQ) {
                        params.dseq = config.AKASH_DEP_DSEQ;
                        dseqSource = "environment";
                    } else {
                        if (callback) {
                            callback({
                                text: "AKASH_DEP_DSEQ is not set in your environment. Please set a valid deployment sequence number.",
                                content: {
                                    success: false,
                                    error: {
                                        code: AkashErrorCode.VALIDATION_PARAMETER_MISSING,
                                        message: "Missing AKASH_DEP_DSEQ",
                                        help: "When AKASH_DEP_STATUS is set to 'dseq', you must also set AKASH_DEP_DSEQ in your .env file."
                                    },
                                    metadata: {
                                        timestamp: new Date().toISOString(),
                                        source: 'akash-plugin',
                                        action: 'getDeploymentStatus',
                                        version: '1.0.0',
                                        actionId
                                    }
                                }
                            });
                        }
                        return false;
                    }
                } else if (config.AKASH_DEP_STATUS === "param_passed") {
                    if (callback) {
                        callback({
                            text: "DSEQ parameter is required. Please provide a deployment sequence number.",
                            content: {
                                success: false,
                                error: {
                                    code: AkashErrorCode.VALIDATION_PARAMETER_MISSING,
                                    message: "Missing required parameter: dseq",
                                    help: "You need to provide a deployment sequence number (dseq) to check its status."
                                },
                                metadata: {
                                    timestamp: new Date().toISOString(),
                                    source: 'akash-plugin',
                                    action: 'getDeploymentStatus',
                                    version: '1.0.0',
                                    actionId
                                }
                            }
                        });
                    }
                    return false;
                } else {
                    if (callback) {
                        callback({
                            text: "No deployment configuration found. Please set AKASH_DEP_STATUS and AKASH_DEP_DSEQ in your environment or provide a dseq parameter.",
                            content: {
                                success: false,
                                error: {
                                    code: AkashErrorCode.VALIDATION_PARAMETER_MISSING,
                                    message: "Missing configuration",
                                    help: "Set AKASH_DEP_STATUS='dseq' and AKASH_DEP_DSEQ in your .env file, or set AKASH_DEP_STATUS='param_passed' and provide dseq parameter in your request."
                                },
                                metadata: {
                                    timestamp: new Date().toISOString(),
                                    source: 'akash-plugin',
                                    action: 'getDeploymentStatus',
                                    version: '1.0.0',
                                    actionId
                                }
                            }
                        });
                    }
                    return false;
                }
            }

            // Initialize wallet from mnemonic
            const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.AKASH_MNEMONIC, { prefix: "akash" });
            const [account] = await wallet.getAccounts();

            // Initialize query client
            const queryClient = new DeploymentQueryClient(await getRpc(config.RPC_ENDPOINT));

            // Query deployment
            elizaLogger.info("Querying deployment status", {
                dseq: params.dseq,
                owner: account.address
            });

            try {
                const request = QueryDeploymentRequest.fromPartial({
                    id: {
                        owner: account.address,
                        dseq: params.dseq
                    }
                });

                const response = await queryClient.Deployment(request);

                if (!response.deployment) {
                    // Different messages based on DSEQ source
                    if (dseqSource === "environment") {
                        if (callback) {
                            callback({
                                text: "The deployment sequence number in your environment configuration was not found. Please check AKASH_DEP_DSEQ value.",
                                content: {
                                    success: false,
                                    error: {
                                        code: AkashErrorCode.DEPLOYMENT_NOT_FOUND,
                                        message: "Invalid AKASH_DEP_DSEQ",
                                        help: "Update AKASH_DEP_DSEQ in your .env file with a valid deployment sequence number, or switch to AKASH_DEP_STATUS='param_passed' to provide DSEQ as a parameter.",
                                        current_dseq: params.dseq
                                    },
                                    metadata: {
                                        timestamp: new Date().toISOString(),
                                        source: 'akash-plugin',
                                        action: 'getDeploymentStatus',
                                        version: '1.0.0',
                                        actionId
                                    }
                                }
                            });
                        }
                    } else {
                        throw new AkashError(
                            "Deployment not found",
                            AkashErrorCode.DEPLOYMENT_NOT_FOUND,
                            {
                                dseq: params.dseq,
                                owner: account.address,
                                actionId
                            }
                        );
                    }
                    return false;
                }

                // Format deployment status
                const deployment = response.deployment as unknown as DeploymentResponse;
                const status = {
                    owner: deployment.deploymentId?.owner,
                    dseq: deployment.deploymentId?.dseq,
                    state: deployment.state,
                    version: deployment.version,
                    createdAt: deployment.createdAt,
                    balance: deployment.escrowAccount?.balance,
                    groups: deployment.groups?.map((group: DeploymentGroup) => ({
                        groupId: group.groupId,
                        state: group.state,
                        resources: group.resources
                    }))
                };

                elizaLogger.info("Deployment status retrieved successfully", {
                    dseq: params.dseq,
                    state: status.state,
                    owner: status.owner,
                    actionId
                });

                if (callback) {
                    // Convert numeric state to readable string
                    const stateString = DeploymentState[status.state as keyof typeof DeploymentState] || 'UNKNOWN';

                    const formattedBalance = deployment.escrowAccount?.balance
                        ? `${deployment.escrowAccount.balance.amount}${deployment.escrowAccount.balance.denom}`
                        : 'No balance information';

                    elizaLogger.info("=== Preparing callback response for deployment status ===", {
                        hasCallback: true,
                        actionId,
                        dseq: params.dseq
                    });

                    const callbackResponse = {
                        text: `Deployment ${params.dseq} Status:\nState: ${stateString}\nBalance: ${formattedBalance}\nCreated At: ${status.createdAt}`,
                        content: {
                            success: true,
                            data: {
                                deployment: status,
                                queryResponse: response.deployment
                            },
                            metadata: {
                                timestamp: new Date().toISOString(),
                                source: 'akash-plugin',
                                action: 'getDeploymentStatus',
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

                return true;
            } catch (queryError) {
                // Handle query errors differently based on DSEQ source
                if (dseqSource === "environment") {
                    elizaLogger.warn("Failed to query deployment from environment configuration", {
                        dseq: params.dseq,
                        error: queryError instanceof Error ? queryError.message : String(queryError)
                    });
                    if (callback) {
                        callback({
                            text: "Could not find deployment with the configured DSEQ. Please check your environment settings.",
                            content: {
                                success: false,
                                error: {
                                    code: AkashErrorCode.API_ERROR,
                                    message: "Invalid AKASH_DEP_DSEQ configuration",
                                    help: "Verify that AKASH_DEP_DSEQ contains a valid deployment sequence number, or switch to AKASH_DEP_STATUS='param_passed' to provide DSEQ as a parameter.",
                                    current_dseq: params.dseq
                                },
                                metadata: {
                                    timestamp: new Date().toISOString(),
                                    source: 'akash-plugin',
                                    action: 'getDeploymentStatus',
                                    version: '1.0.0',
                                    actionId
                                }
                            }
                        });
                    }
                } else {
                    elizaLogger.error("Failed to query deployment", {
                        error: queryError instanceof Error ? queryError.message : String(queryError),
                        actionId
                    });
                    if (callback) {
                        elizaLogger.info("=== Preparing error callback response ===", {
                            actionId,
                            hasCallback: true,
                            errorType: queryError instanceof AkashError ? 'AkashError' : 'Error'
                        });

                        const errorResponse = {
                            text: `Failed to get deployment status: ${queryError instanceof Error ? queryError.message : String(queryError)}`,
                            content: {
                                success: false,
                                error: {
                                    code: queryError instanceof AkashError ? queryError.code : AkashErrorCode.API_ERROR,
                                    message: queryError instanceof Error ? queryError.message : String(queryError)
                                },
                                metadata: {
                                    timestamp: new Date().toISOString(),
                                    source: 'akash-plugin',
                                    action: 'getDeploymentStatus',
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
                }
                return false;
            }
        } catch (error) {
            elizaLogger.error("Get deployment status request failed", {
                error: error instanceof Error ? error.message : String(error),
                actionId
            });

            if (callback) {
                elizaLogger.info("=== Preparing error callback response ===", {
                    actionId,
                    hasCallback: true,
                    errorType: error instanceof AkashError ? 'AkashError' : 'Error'
                });

                const errorResponse = {
                    text: `Failed to get deployment status: ${error instanceof Error ? error.message : String(error)}`,
                    content: {
                        success: false,
                        error: {
                            code: error instanceof AkashError ? error.code : AkashErrorCode.API_ERROR,
                            message: error instanceof Error ? error.message : String(error)
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'getDeploymentStatus',
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

export default getDeploymentStatusAction;