import { type Action, elizaLogger } from "@elizaos/core";
import type { IAgentRuntime, Memory, State, HandlerCallback, Content, ActionExample } from "@elizaos/core";
import { QueryProviderRequest, QueryClientImpl as ProviderQueryClient } from "@akashnetwork/akash-api/akash/provider/v1beta3";
import { getRpc } from "@akashnetwork/akashjs/build/rpc";
import { AkashError, AkashErrorCode } from "../error/error";
import { validateAkashConfig } from "../environment";

interface GetProviderInfoContent extends Content {
    text: string;
    provider?: string;
}

interface ProviderResponse {
    provider?: {
        owner: string;
        hostUri: string;
        attributes: Array<{
            key: string;
            value: string;
        }>;
        info?: {
            email: string;
            website: string;
            capabilities: string[];
        };
        status?: ProviderStatus;
    };
}

interface ProviderStatus {
    cluster?: {
        nodes: Array<{
            name: string;
            capacity: {
                cpu: string;
                memory: string;
                storage: string;
            };
            allocatable: {
                cpu: string;
                memory: string;
                storage: string;
            };
        }>;
    };
    leases?: {
        active: number;
        pending: number;
        available: number;
    };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProviderInfoAction: Action = {
    name: "GET_PROVIDER_INFO",
    similes: ["CHECK_PROVIDER", "PROVIDER_INFO", "PROVIDER_STATUS", "CHECK PROVIDER"],
    description: "Get detailed information about a provider on Akash Network",
    examples: [[
        {
            user: "user",
            content: {
                text: "Can you check the provider info for akash1ccktptfkvdc67msasmesuy5m7gpc76z75kukpz?",
            } as GetProviderInfoContent
        } as ActionExample
    ]],

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        elizaLogger.debug("Validating get provider info request", { message });
        try {
            const params = message.content as Partial<GetProviderInfoContent>;
            const config = await validateAkashConfig(runtime);

            // Extract provider address from text if present
            if (params.text && !params.provider) {
                // Pattern to match akash1 followed by address characters
                const providerMatch = params.text.match(/akash1[a-zA-Z0-9]{38}/);
                if (providerMatch) {
                    params.provider = providerMatch[0];
                    elizaLogger.debug("Extracted provider address from text", {
                        text: params.text,
                        extractedProvider: params.provider
                    });
                }
            }

            // If still no provider specified, use environment default
            if (!params.provider && config.AKASH_PROVIDER_INFO) {
                params.provider = config.AKASH_PROVIDER_INFO;
            }

            if (!params.provider) {
                throw new AkashError(
                    "Provider address is required",
                    AkashErrorCode.VALIDATION_PARAMETER_MISSING,
                    { parameter: "provider" }
                );
            }

            // Validate provider address format
            if (!params.provider.startsWith("akash1")) {
                throw new AkashError(
                    "Invalid provider address format. Must start with 'akash1'",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                    { parameter: "provider", value: params.provider }
                );
            }

            return true;
        } catch (error) {
            elizaLogger.error("Get provider info validation failed", {
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
        options: { [key: string]: unknown } = {},
        callback?: HandlerCallback
    ): Promise<boolean> => {
        const actionId = Date.now().toString();
        elizaLogger.info("Starting provider info request", { actionId });

        elizaLogger.debug("=== Handler Parameters ===", {
            hasRuntime: !!runtime,
            hasMessage: !!message,
            hasState: !!state,
            hasOptions: !!options,
            hasCallback: !!callback,
            actionId
        });

        try {
            const config = await validateAkashConfig(runtime);
            const params = message.content as Partial<GetProviderInfoContent>;

            // If no provider specified, use environment default
            if (!params.provider && config.AKASH_PROVIDER_INFO) {
                params.provider = config.AKASH_PROVIDER_INFO;
            }

            if (!params.provider) {
                throw new AkashError(
                    "Provider address is required",
                    AkashErrorCode.VALIDATION_PARAMETER_MISSING,
                    { parameter: "provider" }
                );
            }

            // Query provider information
            elizaLogger.info("Querying provider information", {
                provider: params.provider,
                actionId
            });

            const queryClient = new ProviderQueryClient(await getRpc(config.RPC_ENDPOINT));
            const request = QueryProviderRequest.fromPartial({
                owner: params.provider
            });

            try {
                const response = await queryClient.Provider(request) as ProviderResponse;

                if (!response.provider) {
                    throw new AkashError(
                        "Failed to query provider: Provider not found",
                        AkashErrorCode.PROVIDER_NOT_FOUND,
                        {
                            provider: params.provider,
                            actionId
                        }
                    );
                }

                // Add a delay before querying status
                await sleep(2000); // 2 second delay

                // Query provider status from their API
                elizaLogger.info("Querying provider status", {
                    hostUri: response.provider.hostUri,
                    actionId
                });

                const hostUri = response.provider.hostUri.replace(/^https?:\/\//, '');
                elizaLogger.debug("Making provider status request", { url: `https://${hostUri}/status` });

                try {
                    const statusResponse = await fetch(`https://${hostUri}/status`, {
                        headers: {
                            'Accept': 'application/json'
                        },
                        signal: AbortSignal.timeout(5000)
                    });

                    if (!statusResponse.ok) {
                        elizaLogger.debug("Provider status not available", {
                            status: statusResponse.status,
                            provider: params.provider,
                            hostUri: response.provider.hostUri,
                            actionId
                        });
                    } else {
                        const statusData = await statusResponse.json();
                        response.provider.status = statusData;
                    }
                } catch (statusError) {
                    elizaLogger.debug("Provider status fetch failed", {
                        error: statusError instanceof Error ? statusError.message : String(statusError),
                        provider: params.provider,
                        hostUri: response.provider.hostUri,
                        actionId
                    });
                }

                // Format provider information
                const info = {
                    owner: response.provider.owner,
                    hostUri: response.provider.hostUri,
                    attributes: response.provider.attributes,
                    info: response.provider.info,
                    status: response.provider.status ? {
                        nodes: response.provider.status.cluster?.nodes.map(node => ({
                            name: node.name,
                            capacity: node.capacity,
                            allocatable: node.allocatable
                        })),
                        leases: response.provider.status.leases
                    } : undefined
                };

                elizaLogger.info("Provider information retrieved successfully", {
                    provider: params.provider,
                    hostUri: response.provider.hostUri,
                    hasStatus: !!response.provider.status,
                    actionId
                });

                if (callback) {
                    elizaLogger.info("=== Preparing callback response for provider info ===", {
                        hasCallback: true,
                        actionId,
                        provider: params.provider
                    });

                    const callbackResponse = {
                        text: `Provider ${params.provider} information:\nHost URI: ${info.hostUri}\nOwner: ${info.owner}${info.info ? `\nEmail: ${info.info.email}\nWebsite: ${info.info.website}` : ''}\nAttributes: ${info.attributes.map(attr => `${attr.key}: ${attr.value}`).join(', ')}`,
                        content: {
                            success: true,
                            data: {
                                provider: info,
                                queryResponse: response.provider
                            },
                            metadata: {
                                timestamp: new Date().toISOString(),
                                source: 'akash-plugin',
                                action: 'getProviderInfo',
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
                // Handle specific error cases
                const errorMessage = queryError instanceof Error ? queryError.message : String(queryError);

                if (errorMessage.toLowerCase().includes("invalid address")) {
                    throw new AkashError(
                        "Failed to query provider: Invalid address format",
                        AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                        {
                            provider: params.provider,
                            error: errorMessage,
                            actionId
                        }
                    );
                }

                // For all other query errors, treat as provider not found
                throw new AkashError(
                    "Failed to query provider: Provider not found or not accessible",
                    AkashErrorCode.PROVIDER_NOT_FOUND,
                    {
                        provider: params.provider,
                        error: errorMessage,
                        actionId
                    }
                );
            }
        } catch (error) {
            elizaLogger.error("Get provider info request failed", {
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
                    code: error instanceof AkashError ? error.code : AkashErrorCode.API_ERROR,
                    message: error instanceof Error ? error.message : String(error),
                    details: error instanceof AkashError ? error.details : undefined
                };

                const response = {
                    text: `Failed to get provider information: ${errorResponse.message}`,
                    content: {
                        success: false,
                        error: errorResponse,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'getProviderInfo',
                            version: '1.0.0',
                            actionId
                        }
                    }
                };

                elizaLogger.info("=== Executing error callback ===", {
                    actionId,
                    errorResponse,
                    hasContent: !!response.content,
                    contentKeys: Object.keys(response.content)
                });

                callback(response);

                elizaLogger.info("=== Error callback executed ===", {
                    actionId,
                    timestamp: new Date().toISOString()
                });
            }

            return false;
        }
    }
};

export default getProviderInfoAction;