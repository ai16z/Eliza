import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const imageGenEnvSchema = z
    .object({
        ANTHROPIC_API_KEY: z.string().optional(),
        NINETEEN_AI_API_KEY: z.string().optional(),
        TOGETHER_API_KEY: z.string().optional(),
        HEURIST_API_KEY: z.string().optional(),
        FAL_API_KEY: z.string().optional(),
        OPENAI_API_KEY: z.string().optional(),
        VENICE_API_KEY: z.string().optional(),
        LIVEPEER_GATEWAY_URL: z.string().optional(),
    })
    .refine(
        (data) => {
            return !!(
                data.ANTHROPIC_API_KEY ||
                data.NINETEEN_AI_API_KEY ||
                data.TOGETHER_API_KEY ||
                data.HEURIST_API_KEY ||
                data.FAL_API_KEY ||
                data.OPENAI_API_KEY ||
                data.VENICE_API_KEY ||
                data.LIVEPEER_GATEWAY_URL
            );
        },
        {
            message:
                "At least one of ANTHROPIC_API_KEY, NINETEEN_AI_API_KEY, TOGETHER_API_KEY, HEURIST_API_KEY, FAL_API_KEY, OPENAI_API_KEY, VENICE_API_KEY or LIVEPEER_GATEWAY_URL is required",
        }
    );

export type ImageGenConfig = z.infer<typeof imageGenEnvSchema>;

export async function validateImageGenConfig(
    runtime: IAgentRuntime
): Promise<ImageGenConfig> {
    try {
        const config = {
            ANTHROPIC_API_KEY:
                runtime.getSetting("ANTHROPIC_API_KEY") ||
                process.env.ANTHROPIC_API_KEY,
            NINETEEN_AI_API_KEY:
                runtime.getSetting("NINETEEN_AI_API_KEY") ||
                process.env.NINETEEN_AI_API_KEY,
            TOGETHER_API_KEY:
                runtime.getSetting("TOGETHER_API_KEY") ||
                process.env.TOGETHER_API_KEY,
            HEURIST_API_KEY:
                runtime.getSetting("HEURIST_API_KEY") ||
                process.env.HEURIST_API_KEY,
            FAL_API_KEY:
                runtime.getSetting("FAL_API_KEY") ||
                process.env.FAL_API_KEY,
            OPENAI_API_KEY:
                runtime.getSetting("OPENAI_API_KEY") ||
                process.env.OPENAI_API_KEY,
            VENICE_API_KEY:
                runtime.getSetting("VENICE_API_KEY") ||
                process.env.VENICE_API_KEY,
            LIVEPEER_GATEWAY_URL:
                runtime.getSetting("LIVEPEER_GATEWAY_URL") ||
                process.env.LIVEPEER_GATEWAY_URL,
        };

        return imageGenEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Image generation configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
