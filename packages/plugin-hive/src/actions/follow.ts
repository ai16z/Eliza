import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
} from "@elizaos/core";
import { Client, PrivateKey } from "@hiveio/dhive";
import { FollowContentSchema, FOLLOW_ACTIONS } from "./defs";
import { validateHiveConfig } from "../environment";

export const executeFollow: Action = {
    name: FOLLOW_ACTIONS[0],
    description: "Follow or unfollow an account on the Hive blockchain",
    similes: [
        "Follow a user on Hive",
        "Unfollow a Hive account",
        "Start following someone",
        "Stop following a user",
    ],
    examples: [
        [
            {
                user: "alice",
                content: {
                    text: "follow @bob",
                    action: "FOLLOW",
                    account: "bob",
                    type: "blog",
                },
            },
        ],
        [
            {
                user: "alice",
                content: {
                    text: "unfollow @charlie",
                    action: "UNFOLLOW",
                    account: "charlie",
                    type: "blog",
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
            await FollowContentSchema.parseAsync(content);
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
            const validatedContent = FollowContentSchema.parse(message.content);

            const client = new Client([config.HIVE_API_NODE]);

            // Determine if this is a follow or unfollow action
            const isFollow =
                !(message.content.name as string)?.includes("UNFOLLOW") &&
                !(message.content.name as string)?.includes("UNMUTE");
            const isMute = (message.content.name as string)?.includes("MUTE");

            // Create the custom JSON operation for follow
            const customJson = {
                required_auths: [],
                required_posting_auths: [config.HIVE_ACCOUNT],
                id: isMute ? "follow" : "follow",
                json: JSON.stringify([
                    "follow",
                    {
                        follower: config.HIVE_ACCOUNT,
                        following: validatedContent.account,
                        what: isFollow ? [validatedContent.type] : [],
                    },
                ]),
            };

            const result = await client.broadcast.json(
                customJson,
                PrivateKey.fromString(config.HIVE_POSTING_KEY)
            );

            const response = {
                success: true,
                data: {
                    transactionId: result.id,
                    follower: config.HIVE_ACCOUNT,
                    following: validatedContent.account,
                    action: isFollow ? "follow" : "unfollow",
                    type: validatedContent.type,
                },
            };

            // If there's a callback, use it
            if (callback) {
                await callback(
                    {
                        text: `Successfully ${isFollow ? "followed" : "unfollowed"} @${validatedContent.account}`,
                        action: message.content.action,
                    },
                    undefined
                );
            }

            return response;
        } catch (error) {
            throw new Error(`Follow operation failed: ${error.message}`);
        }
    },
};
