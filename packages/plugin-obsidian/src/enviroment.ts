import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const obsidianEnvSchema = z
    .object({
        OBSIDIAN_API_URL: z.string().nullable().optional(),
        OBSIDIAN_API_PORT: z.string().default("27123"),
        OBSIDIAN_API_TOKEN: z.string(),
    })
    .refine((data) => !!data.OBSIDIAN_API_TOKEN, {
        message: "OBSIDIAN_API_TOKEN is required",
    });

export type ObsidianConfig = z.infer<typeof obsidianEnvSchema>;

export async function validateObsidianConfig(
    runtime: IAgentRuntime
): Promise<ObsidianConfig> {
    try {
        const config = {
            OBSIDIAN_API_URL:
                runtime.getSetting("OBSIDIAN_API_URL") ||
                process.env.OBSIDIAN_API_URL ||
                null,
            OBSIDIAN_API_PORT:
                runtime.getSetting("OBSIDIAN_API_PORT") ||
                process.env.OBSIDIAN_API_PORT ||
                "27123",
            OBSIDIAN_API_TOKEN:
                runtime.getSetting("OBSIDIAN_API_TOKEN") ||
                process.env.OBSIDIAN_API_TOKEN,
        };

        return obsidianEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Obsidian configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
