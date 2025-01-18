import { type Action, elizaLogger } from "@elizaos/core";
import type { IAgentRuntime, Memory, State, HandlerCallback, Content, ActionExample } from "@elizaos/core";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { validateAkashConfig } from "../environment";
import { AkashError, AkashErrorCode } from "../error/error";
import * as fs from 'fs';
import * as path from 'path';
import { getDeploymentsPath } from "../utils/paths";

export interface DeploymentInfo {
    owner: string;
    dseq: string;
    status: string;
    createdHeight: number;
    cpuUnits: number;
    gpuUnits: number;
    memoryQuantity: number;
    storageQuantity: number;
}

export interface DeploymentListResponse {
    count: number;
    results: DeploymentInfo[];
}

interface GetDeploymentsContent extends Content {
    status?: 'active' | 'closed';
    skip?: number;
    limit?: number;
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            }

            const error = await response.text();
            elizaLogger.warn(`API request failed (attempt ${i + 1}/${retries})`, {
                status: response.status,
                error
            });

            if (i < retries - 1) {
                await sleep(delay * Math.pow(2, i)); // Exponential backoff
                continue;
            }

            throw new AkashError(
                `API request failed after ${retries} attempts: ${response.status} - ${error}`,
                AkashErrorCode.API_ERROR
            );
        } catch (error) {
            if (i === retries - 1) {
                throw error;
            }
            elizaLogger.warn(`API request error (attempt ${i + 1}/${retries})`, {
                error: error instanceof Error ? error.message : String(error)
            });
            await sleep(delay * Math.pow(2, i));
        }
    }
    throw new AkashError(
        `Failed to fetch after ${retries} retries`,
        AkashErrorCode.API_ERROR
    );
}

export async function initializeWallet(runtime: IAgentRuntime): Promise<{wallet: DirectSecp256k1HdWallet | null, address: string}> {
    try {
        // Validate configuration and get mnemonic
        const config = await validateAkashConfig(runtime);

        elizaLogger.info("Initializing wallet with config", {
            hasMnemonic: !!config.AKASH_MNEMONIC,
            hasWalletAddress: !!config.AKASH_WALLET_ADDRESS
        });

        // First try to get the wallet address directly
        if (config.AKASH_WALLET_ADDRESS) {
            elizaLogger.info("Using provided wallet address", {
                address: config.AKASH_WALLET_ADDRESS
            });
            return {
                wallet: null,
                address: config.AKASH_WALLET_ADDRESS
            };
        }

        // If no wallet address, create wallet from mnemonic
        if (!config.AKASH_MNEMONIC) {
            throw new AkashError(
                "Neither AKASH_WALLET_ADDRESS nor AKASH_MNEMONIC provided",
                AkashErrorCode.WALLET_NOT_INITIALIZED
            );
        }

        try {
            elizaLogger.info("Creating wallet from mnemonic");
            const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.AKASH_MNEMONIC, {
                prefix: "akash"
            });

            // Get account address
            const accounts = await wallet.getAccounts();
            const address = accounts[0].address;

            elizaLogger.info("Wallet initialized from mnemonic", {
                address,
                accountCount: accounts.length
            });

            return { wallet, address };
        } catch (error) {
            throw new AkashError(
                `Failed to initialize wallet: ${error instanceof Error ? error.message : String(error)}`,
                AkashErrorCode.WALLET_NOT_INITIALIZED,
                { originalError: error instanceof Error ? error.message : String(error) }
            );
        }
    } catch (error) {
        // Ensure all errors are properly wrapped as AkashError
        if (error instanceof AkashError) {
            throw error;
        }
        throw new AkashError(
            `Failed to initialize wallet: ${error instanceof Error ? error.message : String(error)}`,
            AkashErrorCode.WALLET_NOT_INITIALIZED,
            { originalError: error instanceof Error ? error.message : String(error) }
        );
    }
}

export async function fetchDeployments(
    runtime: IAgentRuntime,
    status?: 'active' | 'closed',
    skip = 0,
    limit = 10
): Promise<DeploymentListResponse> {
    elizaLogger.info("Initializing deployment fetch", {
        status: status || 'all',
        skip,
        limit
    });

    try {
        // Initialize wallet and get address
        const { address } = await initializeWallet(runtime);

        if (!address) {
            throw new AkashError(
                "Failed to get wallet address",
                AkashErrorCode.WALLET_NOT_INITIALIZED
            );
        }

        elizaLogger.info("Fetching deployments from API", {
            address,
            status: status || 'all',
            skip,
            limit
        });

        // Map status for API compatibility
        const apiStatus = status;

        // Don't include status in URL if not specified
        const params = new URLSearchParams();
        if (apiStatus) {
            params.append('status', apiStatus);
        }
        params.append('reverseSorting', 'true');
        const url = `https://console-api.akash.network/v1/addresses/${address}/deployments/${skip}/${limit}?${params.toString()}`;
        elizaLogger.debug("Making API request", { url });

        const response = await fetchWithRetry(url, {
            headers: {
                'accept': 'application/json'
            }
        });

        const data = await response.json() as DeploymentListResponse;
        elizaLogger.info("Deployments fetched successfully", {
            count: data.count,
            resultCount: data.results.length,
            status: status || 'all'
        });

        // Keep status as-is from API
        data.results = data.results.map(deployment => ({
            ...deployment,
            status: deployment.status.toLowerCase()
        }));

        // Save deployments to files, organized by their actual status
        const deploymentDir = getDeploymentsPath(import.meta.url);
        elizaLogger.info("Using deployments directory", { deploymentDir });

        // Create base deployments directory if it doesn't exist
        if (!fs.existsSync(deploymentDir)) {
            elizaLogger.info("Creating deployments directory", { deploymentDir });
            fs.mkdirSync(deploymentDir, { recursive: true });
        }

        // Group deployments by status
        const deploymentsByStatus = data.results.reduce((acc, deployment) => {
            const status = deployment.status.toLowerCase();
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(deployment);
            return acc;
        }, {} as Record<string, DeploymentInfo[]>);

        // Save deployments by status
        for (const [status, deployments] of Object.entries(deploymentsByStatus)) {
            const statusDir = path.join(deploymentDir, status);
            elizaLogger.info("Processing status directory", { statusDir, status, deploymentCount: deployments.length });

            // Ensure status directory exists
            if (!fs.existsSync(statusDir)) {
                elizaLogger.info("Creating status directory", { statusDir });
                fs.mkdirSync(statusDir, { recursive: true });
            }

            // Save all deployments for this status in parallel
            await Promise.all(deployments.map(async (deployment) => {
                const filePath = path.join(statusDir, `${deployment.dseq}.json`);
                elizaLogger.debug("Saving deployment file", { filePath, dseq: deployment.dseq });
                await saveDeploymentInfo(deployment, filePath);
            }));
        }

        return data;
    } catch (error) {
        elizaLogger.error("Failed to fetch deployments", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
}

export async function saveDeploymentInfo(deploymentInfo: DeploymentInfo, filePath: string): Promise<void> {
    elizaLogger.info("Saving deployment info", {
        dseq: deploymentInfo.dseq,
        owner: deploymentInfo.owner,
        filePath
    });

    try {
        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Save deployment info
        fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2), 'utf8');
        elizaLogger.debug("Deployment info saved successfully");
    } catch (error) {
        elizaLogger.error("Failed to save deployment info", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            filePath
        });
        throw error;
    }
}

export async function loadDeploymentInfo(filePath: string): Promise<DeploymentInfo> {
    elizaLogger.info("Loading deployment info", { filePath });

    try {
        if (!fs.existsSync(filePath)) {
            throw new AkashError(
                `Deployment info file not found: ${filePath}`,
                AkashErrorCode.FILE_NOT_FOUND
            );
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const deploymentInfo = JSON.parse(data) as DeploymentInfo;
        elizaLogger.debug("Deployment info loaded successfully", {
            dseq: deploymentInfo.dseq,
            owner: deploymentInfo.owner
        });

        return deploymentInfo;
    } catch (error) {
        elizaLogger.error("Failed to load deployment info", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            filePath
        });
        throw error;
    }
}

export const getDeploymentApiAction: Action = {
    name: "GET_DEPLOYMENTS",
    similes: ["LIST_DEPLOYMENTS", "FETCH_DEPLOYMENTS", "SHOW_DEPLOYMENTS"],
    description: "Fetch deployments from Akash Network",
    examples: [[
        {
            user: "user",
            content: {
                text: "Get all deployments",
            } as GetDeploymentsContent
        } as ActionExample,
        {
            user: "assistant",
            content: {
                text: "Fetching all deployments..."
            } as GetDeploymentsContent
        } as ActionExample
    ], [
        {
            user: "user",
            content: {
                text: "Get active deployments",
                status: "active"
            } as GetDeploymentsContent
        } as ActionExample,
        {
            user: "assistant",
            content: {
                text: "Fetching active deployments..."
            } as GetDeploymentsContent
        } as ActionExample
    ]],

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        elizaLogger.debug("Validating get deployments request", { message });
        try {
            const params = message.content as Partial<GetDeploymentsContent>;

            if (params.status && !['active', 'closed'].includes(params.status)) {
                throw new AkashError(
                    "Status must be either 'active' or 'closed'",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                    { parameter: "status", value: params.status }
                );
            }

            if (params.skip !== undefined && (typeof params.skip !== 'number' || params.skip < 0)) {
                throw new AkashError(
                    "Skip must be a non-negative number",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                    { parameter: "skip", value: params.skip }
                );
            }

            if (params.limit !== undefined && (typeof params.limit !== 'number' || params.limit <= 0)) {
                throw new AkashError(
                    "Limit must be a positive number",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                    { parameter: "limit", value: params.limit }
                );
            }

            return true;
        } catch (error) {
            elizaLogger.error("Get deployments validation failed", {
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
        elizaLogger.info("Starting deployment API request", { actionId });

        try {
            // const config = await validateAkashConfig(runtime);
            const params = message.content as Partial<GetDeploymentsContent>;

            // Fetch deployments
            const deployments = await fetchDeployments(
                runtime,
                params.status,
                params.skip,
                params.limit
            );

            if (callback) {
                elizaLogger.info("=== Preparing callback response for deployments ===", {
                    hasCallback: true,
                    actionId,
                    deploymentCount: deployments.count
                });

                const callbackResponse = {
                    text: `Found ${deployments.count} deployment${deployments.count !== 1 ? 's' : ''}${params.status ? ` with status: ${params.status}` : ''}\n\nDeployments:\n${deployments.results.map(dep =>
                        `- DSEQ: ${dep.dseq}\n  Status: ${dep.status}\n  CPU: ${dep.cpuUnits} units\n  Memory: ${dep.memoryQuantity} units\n  Storage: ${dep.storageQuantity} units`
                    ).join('\n\n')}`,
                    content: {
                        success: true,
                        data: {
                            deployments: deployments.results,
                            total: deployments.count,
                            status: params.status || 'all'
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'getDeploymentApi',
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
        } catch (error) {
            elizaLogger.error("Get deployments request failed", {
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
                    text: `Failed to get deployments: ${error instanceof Error ? error.message : String(error)}`,
                    content: {
                        success: false,
                        error: {
                            code: error instanceof AkashError ? error.code : AkashErrorCode.API_ERROR,
                            message: error instanceof Error ? error.message : String(error)
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'getDeploymentApi',
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

export default getDeploymentApiAction;