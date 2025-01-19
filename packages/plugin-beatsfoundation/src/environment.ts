import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const beatsFoundationEnvSchema = z.object({
    BEATSFOUNDATION_API_KEY: z
        .string()
        .min(1, "BeatsFoundation API key is required"),
});

export type BeatsFoundationConfig = z.infer<typeof beatsFoundationEnvSchema>;

export async function validateBeatsFoundationConfig(
    runtime: IAgentRuntime
): Promise<BeatsFoundationConfig> {
    try {
        const config = {
            BEATSFOUNDATION_API_KEY: runtime.getSetting("BEATSFOUNDATION_API_KEY"),
        };

        return beatsFoundationEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Beats Foundation configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}

