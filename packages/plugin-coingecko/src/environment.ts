import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

const coingeckoConfigSchema = z.object({
    COINGECKO_API_KEY: z.string().nullable(),
    COINGECKO_PRO_API_KEY: z.string().nullable(),
}).refine(data => data.COINGECKO_API_KEY || data.COINGECKO_PRO_API_KEY, {
    message: "Either COINGECKO_API_KEY or COINGECKO_PRO_API_KEY must be provided"
});

export type CoingeckoConfig = z.infer<typeof coingeckoConfigSchema>;

export async function validateCoingeckoConfig(runtime: IAgentRuntime): Promise<CoingeckoConfig> {
    const config = {
        COINGECKO_API_KEY: runtime.getSetting("COINGECKO_API_KEY"),
        COINGECKO_PRO_API_KEY: runtime.getSetting("COINGECKO_PRO_API_KEY"),
    };

    return coingeckoConfigSchema.parse(config);
}

export function getApiConfig(config: CoingeckoConfig) {
    const isPro = !!config.COINGECKO_PRO_API_KEY;
    return {
        baseUrl: isPro ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3",
        apiKey: isPro ? config.COINGECKO_PRO_API_KEY : config.COINGECKO_API_KEY,
        headerKey: isPro ? "x-cg-pro-api-key" : "x-cg-demo-api-key"
    };
}
