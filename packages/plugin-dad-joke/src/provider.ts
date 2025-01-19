import { IAgentRuntime, Memory, State, Provider } from "@ai16z/eliza";
import { dadJokeProviderResponse, dadJokeData, dadJokeConfig} from "./types.ts";

let providerConfig: dadJokeConfig;

export const dadJokeProvider: Provider = {
    get: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
    ): Promise<dadJokeProviderResponse> => {
        try {
            if (!providerConfig?.provider?.baseUrl) {
                throw new Error("Dad Joke API url is required");
            }

            const baseUrl =
                providerConfig.provider.baseUrl ||
                "https://icanhazdadjoke.com";

            // Fetch dad joke
            const response = await fetch(baseUrl, {
                headers: {
                    Accept: "application/json",
                },
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();

            // Transform API response to dadJokeData
            const dadJokeData: dadJokeData = {
                joke: data.joke,
            };

            return {
                success: true,
                data: dadJokeData,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to retrieve dad joke",
            };
        }
    }
}

export const initializeDadJokeProvider = (config: dadJokeConfig): void => {
    providerConfig = config;
}