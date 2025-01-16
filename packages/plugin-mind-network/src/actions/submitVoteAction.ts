import type { Action } from "@elizaos/core";
import { ActionExample, HandlerCallback, IAgentRuntime, Memory, State, elizaLogger } from "@elizaos/core";
import { submitVote } from "mind-randgen-sdk";
import cache from "../utils/cache";

const voteIntervalSeconds = 600;

export const submitVoteAction: Action = {
    name: "MIND_FHE_VOTE",
    similes: [
        "MIND_VOTE",
        "MIND_SUBMIT_VOTE",
    ],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        if (runtime.getSetting("MIND_HOT_WALLET_PRIVATE_KEY")) {
            return true;
        } else {
            return false;
        }
    },
    description: "Submit the encrypted number as a vote to Mind Network.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting Mind Network MIND_FHE_VOTE handler...");

        if (!cache.latestEncryptedNumber) {
            const reply = `You need to encrypt a number of your choice first. Tell me your number of choice for FHE encryption.`
            elizaLogger.success(reply);
            if (callback) {
                callback({
                    text: reply,
                    content: {},
                });
            }
            return true;
        }

        const voteInterval = Math.floor((Date.now() - cache.lastVoteTs)/1000);
        if(voteInterval < voteIntervalSeconds){
            const reply = `You are voting too fast. Please wait for ${voteIntervalSeconds-voteInterval} seconds to try again.`;
            elizaLogger.success(reply);
            if (callback) {
                callback({
                    text: reply,
                    content: {},
                });
            }
            return true;
        }

        try {
            await submitVote(cache.latestEncryptedNumber);
            cache.lastVoteTs = Date.now();
            const reply = `You vote has been submitted successfully.`
            elizaLogger.success(reply);
            if (callback) {
                callback({
                    text: reply,
                    content: {},
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error during voting:", error);
            if (callback) {
                callback({
                    text: `Error during voting. Make sure you have registered. Or contact Mind Network with following: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I want to submit my vote to Mind Network.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Sure, I'll do the voting.",
                    action: "MIND_FHE_VOTE",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Vote has been sumitted successfully!",
                },
            },
        ], [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you help to submit this encrypted number as my vote?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Sure, let me do the voting for you.",
                    action: "MIND_FHE_VOTE",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "You have voted successfully in Mind Network!",
                },
            },
        ],
    ] as ActionExample[][],
};