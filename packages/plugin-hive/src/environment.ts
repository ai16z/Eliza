import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

const HIVE_MAINNET_API = "https://api.hive.blog";

export const hiveEnvSchema = z.object({
    HIVE_ACCOUNT: z.string().min(1, "Hive account name is required"),
    HIVE_POSTING_KEY: z.string().min(1, "Hive posting key is required"),
    HIVE_ACTIVE_KEY: z
        .string()
        .min(1, "Hive active key is required for token transfers"),
    HIVE_NETWORK: z.enum(["mainnet", "testnet"]).default("mainnet"),
    HIVE_API_NODE: z
        .string()
        .url("Invalid API node URL")
        .default(HIVE_MAINNET_API),
    HIVE_MEMO_KEY: z.string().optional(),
    HIVE_OWNER_KEY: z.string().optional(),
});

export type HiveConfig = z.infer<typeof hiveEnvSchema>;

export async function validateHiveConfig(
    runtime: IAgentRuntime
): Promise<HiveConfig> {
    try {
        const config = {
            HIVE_ACCOUNT:
                runtime.getSetting("HIVE_ACCOUNT") || process.env.HIVE_ACCOUNT,
            HIVE_POSTING_KEY:
                runtime.getSetting("HIVE_POSTING_KEY") ||
                process.env.HIVE_POSTING_KEY,
            HIVE_ACTIVE_KEY:
                runtime.getSetting("HIVE_ACTIVE_KEY") ||
                process.env.HIVE_ACTIVE_KEY,
            HIVE_NETWORK:
                runtime.getSetting("HIVE_NETWORK") ||
                process.env.HIVE_NETWORK ||
                "mainnet",
            HIVE_API_NODE:
                runtime.getSetting("HIVE_API_NODE") ||
                process.env.HIVE_API_NODE ||
                HIVE_MAINNET_API,
            HIVE_MEMO_KEY:
                runtime.getSetting("HIVE_MEMO_KEY") ||
                process.env.HIVE_MEMO_KEY,
            HIVE_OWNER_KEY:
                runtime.getSetting("HIVE_OWNER_KEY") ||
                process.env.HIVE_OWNER_KEY,
        };

        return hiveEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Hive configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
