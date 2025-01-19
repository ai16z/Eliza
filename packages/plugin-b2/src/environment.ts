import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const b2NetworkEnvSchema = z.object({
    B2_PRIVATE_KEY: z
        .string()
        .min(1, "b2 network private key is required"),
});

export type b2NetworkConfig = z.infer<typeof b2NetworkEnvSchema>;
export async function validateB2NetworkConfig(
    runtime: IAgentRuntime
): Promise<b2NetworkConfig> {
    try {
        const config = {
            B2_PRIVATE_KEY:
                runtime.getSetting("B2_PRIVATE_KEY") ||
                process.env.B2_PRIVATE_KEY,
        };

        return b2NetworkEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(errorMessages);
        }
        throw error;
    }
}
