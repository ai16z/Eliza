import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const spheronEnvSchema = z.object({
    PRIVATE_KEY: z.string().min(1, "Private key is required"),
    PROVIDER_PROXY_URL: z
        .string()
        .url("Provider proxy URL must be a valid URL"),
    WALLET_ADDRESS: z.string().min(1, "Wallet address is required"),
    SPHERON_PROXY_PORT: z.string().optional(),
});

export const requiredEnvVars = [
    "SPHERON_PRIVATE_KEY",
    "SPHERON_WALLET_ADDRESS",
    "SPHERON_PROVIDER_PROXY_URL",
] as const;

export type SpheronConfig = z.infer<typeof spheronEnvSchema>;

export async function validateSpheronConfig(
    runtime: IAgentRuntime
): Promise<SpheronConfig> {
    try {
        const config = {
            PRIVATE_KEY:
                runtime.getSetting("PRIVATE_KEY") ||
                process.env.SPHERON_PRIVATE_KEY ||
                process.env.PRIVATE_KEY,
            PROVIDER_PROXY_URL:
                runtime.getSetting("PROVIDER_PROXY_URL") ||
                process.env.SPHERON_PROVIDER_PROXY_URL ||
                process.env.PROVIDER_PROXY_URL,
            WALLET_ADDRESS:
                runtime.getSetting("WALLET_ADDRESS") ||
                process.env.SPHERON_WALLET_ADDRESS ||
                process.env.WALLET_ADDRESS,
        };

        return spheronEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Spheron configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
