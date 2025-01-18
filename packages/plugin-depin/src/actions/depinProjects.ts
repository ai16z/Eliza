import {
    type Action,
    composeContext,
    generateText,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
} from "@elizaos/core";

import { projectsTemplate } from "../template";

export const depinProjects: Action = {
    name: "DEPIN_PROJECTS",
    similes: [
        "DEPIN_TOKENS",
        "DEPIN_DATA",
        "DEPIN_STATS",
        "DEPIN_ANALYTICS",
        "PROJECT_TOKENS",
        "PROJECT_STATS",
        "PROJECT_DATA",
        "TOKEN_PROJECTS",
        "CHAIN_PROJECTS",
        "BLOCKCHAIN_PROJECTS",
        "PROJECT_ANALYTICS",
        "PROJECT_DETAILS",
    ],
    description: "Analyzes DePINScan projects",
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: [
        [
            {
                user: "user",
                content: {
                    text: "What is the token price of Render?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "The current token price of Render (RNDR) is $9.02.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "Which token has a higher price: Helium or Render?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "Helium (HNT) is priced at $3.21, which is lower than Render (RNDR) at $9.02.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "Can you give me the prices of all available tokens?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "Sure! Solana (SOL) is $221.91, Render (RNDR) is $9.02, and Helium (HNT) is $3.21.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "Which token costs more than $200?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "The only token priced above $200 is Solana (SOL) at $221.91.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "What is the market cap of Render?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "The market cap of Render (RNDR) is $4,659,773,671.85.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "Can you give me the categories for Solana?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "Solana (SOL) belongs to the following categories: Chain.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "What is the fully diluted valuation of Helium?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "The fully diluted valuation of Helium (HNT) is $450,000,000.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "What are the projects running on Solana?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "The projects running on Solana include Render and Helium.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "What is the token price of an unlisted project?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "I'm sorry, but I don't have information on the token price for the specified project.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "What is the launch date of Solana?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "I'm sorry, but I don't have information on the launch date of Solana.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "Can you tell me the founder of Render?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "I currently don't have information on the founder of Render.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "Do you have the total supply for Helium?",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "I'm sorry, but I don't have data on the total supply of Helium.",
                    action: "DEPIN_TOKENS",
                },
            },
        ],
    ],
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const projectsContext = composeContext({
            state,
            template: projectsTemplate,
        });

        try {
            const text = await generateText({
                runtime,
                context: projectsContext,
                modelClass: ModelClass.LARGE,
            });

            if (callback) {
                callback({
                    text,
                    inReplyTo: message.id,
                });
            }

            return true;
        } catch (error) {
            console.error("Error in depin project plugin:", error);
            if (callback) {
                callback({
                    text: `Error processing request, try again`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
};
