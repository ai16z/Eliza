import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const envSchema = z.object({
    TON_PRIVATE_KEY: z.string().min(1, "Ton private key is required"),
    TON_RPC_URL: z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export async function validateEnvConfig(
    runtime: IAgentRuntime
): Promise<EnvConfig> {
    try {
        const config = {
            TON_PRIVATE_KEY:
                runtime.getSetting("TON_PRIVATE_KEY") ||
                process.env.TON_PRIVATE_KEY,
            TON_RPC_URL:
                runtime.getSetting("TON_RPC_URL") || process.env.TON_RPC_URL,
        };

        return envSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Ton configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
