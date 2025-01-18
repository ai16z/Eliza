import { type Action, elizaLogger } from "@elizaos/core";
import type { IAgentRuntime, Memory, State, HandlerCallback, Content, ActionExample } from "@elizaos/core";
import { getConfig } from "../environment";

interface GetGPUPricingContent extends Content {
    cpu?: number;      // CPU units in millicores (e.g., 1000 = 1 CPU)
    memory?: number;   // Memory in bytes (e.g., 1000000000 = 1GB)
    storage?: number;  // Storage in bytes (e.g., 1000000000 = 1GB)
}

interface PricingResponse {
    spec: {
        cpu: number;
        memory: number;
        storage: number;
    };
    akash: number;
    aws: number;
    gcp: number;
    azure: number;
}

// Get configuration with defaults
const config = getConfig(process.env.AKASH_ENV);
const PRICING_API_URL = config.AKASH_PRICING_API_URL;
const DEFAULT_CPU = Number.parseInt(config.AKASH_DEFAULT_CPU || "1000");
const DEFAULT_MEMORY = Number.parseInt(config.AKASH_DEFAULT_MEMORY || "1000000000");
const DEFAULT_STORAGE = Number.parseInt(config.AKASH_DEFAULT_STORAGE || "1000000000");

// Custom error class for GPU pricing errors
class GPUPricingError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'GPUPricingError';
    }
}

export const getGPUPricingAction: Action = {
    name: "GET_GPU_PRICING",
    similes: ["GET_PRICING", "COMPARE_PRICES", "CHECK_PRICING"],
    description: "Get GPU pricing comparison between Akash and major cloud providers",
    examples: [[
        {
            user: "user",
            content: {
                text: "Get GPU pricing for 2 CPUs, 2GB memory, and 10GB storage",
                cpu: 2000,
                memory: 2000000000,
                storage: 10000000000
            } as GetGPUPricingContent
        } as ActionExample
    ], [
        {
            user: "user",
            content: {
                text: "Compare GPU prices across providers"
            } as GetGPUPricingContent
        } as ActionExample
    ]],

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        elizaLogger.debug("Validating GPU pricing request", { message });
        try {
            const params = message.content as Partial<GetGPUPricingContent>;

            // Validate CPU if provided
            if (params.cpu !== undefined && (isNaN(params.cpu) || params.cpu <= 0)) {
                throw new GPUPricingError("CPU units must be a positive number", "INVALID_CPU");
            }

            // Validate memory if provided
            if (params.memory !== undefined && (isNaN(params.memory) || params.memory <= 0)) {
                throw new GPUPricingError("Memory must be a positive number", "INVALID_MEMORY");
            }

            // Validate storage if provided
            if (params.storage !== undefined && (isNaN(params.storage) || params.storage <= 0)) {
                throw new GPUPricingError("Storage must be a positive number", "INVALID_STORAGE");
            }

            return true;
        } catch (error) {
            elizaLogger.error("GPU pricing validation failed", {
                error: error instanceof GPUPricingError ? {
                    code: error.code,
                    message: error.message
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
        elizaLogger.info("Starting GPU pricing request", { actionId });

        try {
            const params = message.content as GetGPUPricingContent;

            // Use provided values or defaults
            const requestBody = {
                cpu: params.cpu || DEFAULT_CPU,
                memory: params.memory || DEFAULT_MEMORY,
                storage: params.storage || DEFAULT_STORAGE
            };

            elizaLogger.info("Fetching pricing information", {
                specs: requestBody,
                apiUrl: PRICING_API_URL
            });

            // Make API request using fetch
            const response = await fetch(PRICING_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new GPUPricingError(
                    `API request failed with status ${response.status}: ${response.statusText}`,
                    "API_ERROR"
                );
            }

            const data = await response.json() as PricingResponse;

            // Calculate savings percentages
            const savings = {
                vs_aws: ((data.aws - data.akash) / data.aws * 100).toFixed(2),
                vs_gcp: ((data.gcp - data.akash) / data.gcp * 100).toFixed(2),
                vs_azure: ((data.azure - data.akash) / data.azure * 100).toFixed(2)
            };

            elizaLogger.info("Pricing information retrieved successfully", {
                specs: data.spec,
                pricing: {
                    akash: data.akash,
                    aws: data.aws,
                    gcp: data.gcp,
                    azure: data.azure
                },
                savings
            });

            if (callback) {
                const callbackResponse = {
                    text: `GPU Pricing Comparison\nAkash: $${data.akash}\nAWS: $${data.aws} (${savings.vs_aws}% savings)\nGCP: $${data.gcp} (${savings.vs_gcp}% savings)\nAzure: $${data.azure} (${savings.vs_azure}% savings)`,
                    content: {
                        success: true,
                        data: {
                            specs: {
                                cpu: data.spec.cpu,
                                memory: data.spec.memory,
                                storage: data.spec.storage
                            },
                            pricing: {
                                akash: data.akash,
                                aws: data.aws,
                                gcp: data.gcp,
                                azure: data.azure
                            },
                            savings: {
                                vs_aws: `${savings.vs_aws}%`,
                                vs_gcp: `${savings.vs_gcp}%`,
                                vs_azure: `${savings.vs_azure}%`
                            }
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'getGPUPricing',
                            version: '1.0.0',
                            actionId
                        }
                    }
                };

                callback(callbackResponse);
            }

            return true;
        } catch (error) {
            elizaLogger.error("GPU pricing request failed", {
                error: error instanceof Error ? error.message : String(error),
                actionId
            });

            if (callback) {
                const errorResponse = {
                    text: "Failed to get GPU pricing information",
                    content: {
                        success: false,
                        error: {
                            code: error instanceof GPUPricingError ? error.code : 'UNKNOWN_ERROR',
                            message: error instanceof Error ? error.message : String(error)
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'getGPUPricing',
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

export default getGPUPricingAction;
