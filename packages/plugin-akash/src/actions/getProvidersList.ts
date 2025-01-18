import { type Action, elizaLogger } from "@elizaos/core";
import type { IAgentRuntime, Memory, State, HandlerCallback, Content, ActionExample } from "@elizaos/core";
import { AkashError, AkashErrorCode } from "../error/error";
import { validateAkashConfig } from "../environment";

interface GetProvidersListContent extends Content {
    filter?: {
        active?: boolean;
        hasGPU?: boolean;
        region?: string;
    };
}

interface ProviderAttributes {
    key: string;
    value: string;
}

interface ProviderInfo {
    owner: string;
    hostUri: string;
    attributes: ProviderAttributes[];
    active: boolean;
    uptime: number;
    leaseCount: number;
    info?: {
        email?: string;
        website?: string;
        capabilities?: string[];
    };
    status?: {
        available: boolean;
        error?: string;
        lastCheckTime: string;
        resources?: {
            cpu: {
                total: number;
                available: number;
            };
            memory: {
                total: number;
                available: number;
            };
            storage: {
                total: number;
                available: number;
            };
        };
    };
}

const API_BASE_URL = "https://console-api.akash.network/v1";

async function fetchProviders(): Promise<ProviderInfo[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/providers`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new AkashError(
                "Failed to fetch providers list: Invalid response from API",
                AkashErrorCode.API_RESPONSE_INVALID,
                {
                    status: response.status,
                    statusText: response.statusText
                }
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof AkashError) {
            throw error;
        }
        throw new AkashError(
            `Failed to fetch providers list: ${error instanceof Error ? error.message : String(error)}`,
            AkashErrorCode.API_REQUEST_FAILED,
            {
                error: error instanceof Error ? error.message : String(error)
            }
        );
    }
}

function filterProviders(providers: ProviderInfo[], filter?: GetProvidersListContent['filter']): ProviderInfo[] {
    if (!filter) return providers;

    try {
        let filtered = [...providers];

        if (filter.active !== undefined) {
            filtered = filtered.filter(p => {
                const isActive = p.active && p.status?.available !== false;
                return isActive === filter.active;
            });
        }

        if (filter.hasGPU) {
            filtered = filtered.filter(p =>
                p.attributes.some(attr =>
                    attr.key.toLowerCase().includes('gpu') &&
                    attr.value.toLowerCase() !== 'false' &&
                    attr.value !== '0'
                )
            );
        }

        if (filter.region) {
            const regionFilter = filter.region.toLowerCase();
            filtered = filtered.filter(p =>
                p.attributes.some(attr =>
                    attr.key.toLowerCase() === 'region' &&
                    attr.value.toLowerCase().includes(regionFilter)
                )
            );
        }

        return filtered;
    } catch (error) {
        throw new AkashError(
            "Failed to apply provider filters",
            AkashErrorCode.PROVIDER_FILTER_ERROR,
            { filter, error: error instanceof Error ? error.message : String(error) }
        );
    }
}

export const getProvidersListAction: Action = {
    name: "GET_PROVIDERS_LIST",
    similes: ["LIST_PROVIDERS", "FETCH_PROVIDERS", "GET_ALL_PROVIDERS"],
    description: "Get a list of all available providers on the Akash Network with their details and status",
    examples: [[
        {
            user: "user",
            content: {
                text: "Get a list of all active providers"
            } as GetProvidersListContent
        } as ActionExample,
        {
            user: "assistant",
            content: {
                text: "Fetching list of active Akash providers...",
                filter: {
                    active: true
                }
            } as GetProvidersListContent
        } as ActionExample
    ], [
        {
            user: "user",
            content: {
                text: "Show me all GPU providers in the US region",
                filter: {
                    hasGPU: true,
                    region: "us"
                }
            } as GetProvidersListContent
        } as ActionExample
    ]],

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        elizaLogger.debug("Validating get providers list request", { message });
        try {
            const params = message.content as Partial<GetProvidersListContent>;

            // Validate filter parameters if provided
            if (params.filter) {
                if (params.filter.region && typeof params.filter.region !== 'string') {
                    throw new AkashError(
                        "Region filter must be a string",
                        AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                        { parameter: "filter.region" }
                    );
                }

                if (params.filter.active !== undefined && typeof params.filter.active !== 'boolean') {
                    throw new AkashError(
                        "Active filter must be a boolean",
                        AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                        { parameter: "filter.active" }
                    );
                }

                if (params.filter.hasGPU !== undefined && typeof params.filter.hasGPU !== 'boolean') {
                    throw new AkashError(
                        "HasGPU filter must be a boolean",
                        AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                        { parameter: "filter.hasGPU" }
                    );
                }
            }

            return true;
        } catch (error) {
            elizaLogger.error("Get providers list validation failed", {
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
        _options: { [key: string]: unknown; } = {},
        callback?: HandlerCallback
    ): Promise<boolean> => {
        const actionId = Date.now().toString();
        elizaLogger.info("Starting providers list request", { actionId });

        try {
            await validateAkashConfig(runtime);
            const params = message.content as GetProvidersListContent;

            elizaLogger.info("Fetching providers list", {
                filter: params.filter,
                actionId
            });

            // Fetch providers
            const allProviders = await fetchProviders();

            // Apply filters
            const filteredProviders = filterProviders(allProviders, params.filter);

            elizaLogger.info("Providers list retrieved successfully", {
                totalProviders: allProviders.length,
                filteredProviders: filteredProviders.length,
                filter: params.filter,
                actionId
            });

            if (callback) {
                const callbackResponse = {
                    text: `Retrieved ${filteredProviders.length} providers${params.filter ? ' (filtered)' : ''} from total ${allProviders.length}`,
                    content: {
                        success: true,
                        data: {
                            summary: {
                                total: allProviders.length,
                                filtered: filteredProviders.length,
                                activeCount: filteredProviders.filter(p => p.active && p.status?.available !== false).length,
                                gpuCount: filteredProviders.filter(p =>
                                    p.attributes.some(attr =>
                                        attr.key.toLowerCase().includes('gpu') &&
                                        attr.value.toLowerCase() !== 'false' &&
                                        attr.value !== '0'
                                    )
                                ).length
                            },
                            providers: filteredProviders.map(p => ({
                                owner: p.owner,
                                hostUri: p.hostUri,
                                active: p.active && p.status?.available !== false,
                                uptime: p.uptime,
                                leaseCount: p.leaseCount,
                                attributes: p.attributes,
                                info: {
                                    ...p.info,
                                    capabilities: p.info?.capabilities || [],
                                    region: p.attributes.find(a => a.key.toLowerCase() === 'region')?.value || 'unknown'
                                },
                                resources: p.status?.resources || {
                                    cpu: { total: 0, available: 0 },
                                    memory: { total: 0, available: 0 },
                                    storage: { total: 0, available: 0 }
                                },
                                status: {
                                    available: p.status?.available || false,
                                    lastCheckTime: p.status?.lastCheckTime || new Date().toISOString(),
                                    error: p.status?.error
                                }
                            }))
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'getProvidersList',
                            version: '1.0.0',
                            actionId,
                            filters: params.filter || {}
                        }
                    }
                };

                callback(callbackResponse);
            }

            return true;
        } catch (error) {
            elizaLogger.error("Get providers list request failed", {
                error: error instanceof Error ? error.message : String(error),
                code: error instanceof AkashError ? error.code : undefined,
                actionId
            });

            if (callback) {
                const errorResponse = {
                    text: "Failed to get providers list",
                    content: {
                        success: false,
                        error: {
                            code: error instanceof AkashError ? error.code : AkashErrorCode.API_REQUEST_FAILED,
                            message: error instanceof Error ? error.message : String(error)
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'getProvidersList',
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
};
export default getProvidersListAction;

