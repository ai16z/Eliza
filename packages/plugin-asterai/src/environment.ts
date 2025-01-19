import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

const envSchema = z.object({
    ASTERAI_AGENT_ID: z
        .string()
        .min(1, "ASTERAI_AGENT_ID is required"),
    ASTERAI_PUBLIC_QUERY_KEY: z
        .string()
        .min(1, "ASTERAI_PUBLIC_QUERY_KEY is required"),
});

export type AsteraiConfig = z.infer<typeof envSchema>;

export async function validateAsteraiConfig(
    runtime: IAgentRuntime
): Promise<AsteraiConfig> {
    try {
        const config = {
            ASTERAI_AGENT_ID:
                runtime.getSetting("ASTERAI_AGENT_ID") ||
                process.env.ASTERAI_AGENT_ID,
            ASTERAI_PUBLIC_QUERY_KEY:
                runtime.getSetting("ASTERAI_PUBLIC_QUERY_KEY") || process.env.ASTERAI_PUBLIC_QUERY_KEY,
        };

        return envSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Asterai plugin configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
