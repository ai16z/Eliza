import {Action, IAgentRuntime, Memory, State} from "@ai16z/eliza";
import { dadJokeActionContent, dadJokeData } from "./types.ts";
import { dadJokeProvider } from "./provider.ts";

export const getDadJokeAction: Action = {
    name: "GET_DAD_JOKE",
    description: "Retrieves a random dad joke",
    similes: [
        "DAD_JOKE",
        "JOKE",
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Tell me a dad joke",
                } as dadJokeActionContent,
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Why couldn't the bicycle stand up by itself? It was two tired.",
                    action: "GET_DAD_JOKE",
                },
            },

        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "You got any dad jokes?",
                } as dadJokeActionContent,
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "What do you call a fake noodle? An impasta.",
                    action: "GET_DAD_JOKE",
                },
            },
        ],
    ],

    validate: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
    ): Promise<boolean> => {
        try {
            const content = message.content as dadJokeActionContent;
            return (
                typeof content.text === "string" &&
                content.text.toLowerCase().includes("joke")
            );
        } catch {
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
    ): Promise<dadJokeData> => {
        try {
            const response = await dadJokeProvider.get(runtime, message, state);
            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to retrieve dad joke");
        }
    }
}