import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const openWeatherEnvSchema = z.object({
    OPEN_WEATHER_API_KEY: z.string().min(1, "OpenWeather API key is required"),
});

export type OpenWeatherConfig = z.infer<typeof openWeatherEnvSchema>;

export async function validateOpenWeatherConfig(
    runtime: IAgentRuntime
): Promise<OpenWeatherConfig> {
    try {
        const config = {
            OPEN_WEATHER_API_KEY: runtime.getSetting("OPEN_WEATHER_API_KEY"),
        };

        return openWeatherEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `OpenWeather configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
