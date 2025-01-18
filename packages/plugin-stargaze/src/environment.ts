import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const stargazeEnvSchema = z.object({
    STARGAZE_ENDPOINT: z.string().min(1, "Stargaze API endpoint is required"),
});

export type StargazeConfig = z.infer<typeof stargazeEnvSchema>;

export async function validateStargazeConfig(
    runtime: IAgentRuntime
): Promise<StargazeConfig> {
    try {
        const config = {
            STARGAZE_ENDPOINT: runtime.getSetting("STARGAZE_ENDPOINT"),
        };
        return stargazeEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Stargaze configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}