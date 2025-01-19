import { z } from "zod";
import { type IAgentRuntime } from "@elizaos/core";

export const twilioEnvSchema = z.object({
    NGROK_DOMAIN: z.string().min(1, "Twilio ngrok domain is required"),
    NGROK_AUTHTOKEN: z.string().min(1, "Twilio ngrok auth token is required"),
    ELEVENLABS_XI_API_KEY: z.string().min(1, "ElevenLabs API key is required"),
    ELEVENLABS_MODEL_ID: z.string().min(1, "ElevenLabs model ID is required"),
    ELEVENLABS_VOICE_ID: z.string().min(1, "ElevenLabs voice ID is required"),
});

export type TwilioConfig = z.infer<typeof twilioEnvSchema>;

export async function validateTwilioConfig(
    runtime: IAgentRuntime
): Promise<TwilioConfig> {
    try {
        const config = {
            NGROK_DOMAIN:
                runtime.getSetting("NGROK_DOMAIN") ||
                process.env.NGROK_DOMAIN,
            NGROK_AUTHTOKEN:
                runtime.getSetting("NGROK_AUTHTOKEN") ||
                process.env.NGROK_AUTHTOKEN,
            ELEVENLABS_XI_API_KEY:
                runtime.getSetting("ELEVENLABS_XI_API_KEY") ||
                process.env.ELEVENLABS_XI_API_KEY,
            ELEVENLABS_MODEL_ID:
                runtime.getSetting("ELEVENLABS_MODEL_ID") ||
                process.env.ELEVENLABS_MODEL_ID,
            ELEVENLABS_VOICE_ID:
                runtime.getSetting("ELEVENLABS_VOICE_ID") ||
                process.env.ELEVENLABS_VOICE_ID,
        };

        return twilioEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Twilio configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
