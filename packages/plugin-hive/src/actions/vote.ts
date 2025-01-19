import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
} from "@elizaos/core";
import { Client, PrivateKey } from "@hiveio/dhive";
import { VoteContentSchema, VOTE_ACTIONS } from "./defs";
import { validateHiveConfig } from "../environment";

export const executeVote: Action = {
    name: VOTE_ACTIONS[0],
    description: "Vote on a post or comment on the Hive blockchain",
    similes: [
        "Upvote a post on Hive",
        "Downvote a Hive post",
        "Like a post or comment",
        "Vote on Hive content",
    ],
    examples: [
        [
            {
                user: "alice",
                content: {
                    text: "upvote @bob/my-first-post",
                    action: "VOTE",
                    author: "bob",
                    permlink: "my-first-post",
                    weight: 10000,
                },
            },
        ],
        [
            {
                user: "bob",
                content: {
                    text: "downvote @charlie/spam-post",
                    action: "VOTE",
                    author: "charlie",
                    permlink: "spam-post",
                    weight: -10000,
                },
            },
        ],
    ],
    validate: async (
        runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> => {
        try {
            const content = message.content;
            await VoteContentSchema.parseAsync(content);
            return true;
        } catch {
            return false;
        }
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<unknown> => {
        try {
            const config = await validateHiveConfig(runtime);
            const validatedContent = VoteContentSchema.parse(message.content);

            const client = new Client([config.HIVE_API_NODE]);

            // Ensure we have posting authority
            if (!config.HIVE_POSTING_KEY) {
                throw new Error("Posting key required for voting");
            }

            const vote = await client.broadcast.vote(
                {
                    voter: config.HIVE_ACCOUNT,
                    author: validatedContent.author,
                    permlink: validatedContent.permlink,
                    weight: validatedContent.weight,
                },
                PrivateKey.fromString(config.HIVE_POSTING_KEY)
            );

            const response = {
                success: true,
                data: {
                    transactionId: vote.id,
                    voter: config.HIVE_ACCOUNT,
                    author: validatedContent.author,
                    permlink: validatedContent.permlink,
                    weight: validatedContent.weight,
                },
            };

            // If there's a callback, use it
            if (callback) {
                const voteType =
                    validatedContent.weight > 0 ? "upvoted" : "downvoted";
                await callback(
                    {
                        text: `Successfully ${voteType} @${validatedContent.author}/${validatedContent.permlink} with weight ${validatedContent.weight / 100}%`,
                        action: message.content.action,
                    },
                    undefined
                );
            }

            return response;
        } catch (error) {
            throw new Error(`Vote failed: ${error.message}`);
        }
    },
};
