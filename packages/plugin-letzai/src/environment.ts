import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const imageGenEnvSchema = z
    .object({
        LETZAI_API_KEY: z.string().optional(),
    })
    .refine(
        (data) => {
            return !!data.LETZAI_API_KEY;
        },
        {
            message: "The LetzAI API KEY has not been set.",
        },
    );

export type ImageGenConfig = z.infer<typeof imageGenEnvSchema>;

export async function validateImageGenConfig(
    runtime: IAgentRuntime,
): Promise<ImageGenConfig> {
    try {
        const config = {
            LETZAI_API_KEY: runtime.getSetting("LETZAI_API_KEY"),
        };

        return imageGenEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Image generation configuration validation failed:\n${errorMessages}`,
            );
        }
        throw error;
    }
}
