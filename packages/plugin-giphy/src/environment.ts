import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const giphyEnvSchema = z.object({
    GIPHY_API_KEY: z.string().min(1, "Giphy API key is required"),
});

export type GiphyConfig = z.infer<typeof giphyEnvSchema>;

export async function validateGiphyConfig(
    runtime: IAgentRuntime
): Promise<GiphyConfig> {
    try {
        const config = {
            GIPHY_API_KEY: runtime.getSetting("GIPHY_API_KEY"),
        };
        return giphyEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Giphy configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
