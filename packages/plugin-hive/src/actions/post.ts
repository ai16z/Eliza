import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
} from "@elizaos/core";
import { Client, PrivateKey } from "@hiveio/dhive";
import { PostContentSchema, POST_ACTIONS } from "./defs";
import { validateHiveConfig } from "../environment";

const generatePermlink = (title: string): string => {
    return (
        title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") +
        "-" +
        Math.floor(Date.now() / 1000)
    );
};

export const createPost: Action = {
    name: POST_ACTIONS[0],
    description: "Create a post or comment on the Hive blockchain",
    similes: [
        "Create a new post on Hive",
        "Write a blog post on Hive",
        "Make a comment on a Hive post",
        "Publish content to Hive",
    ],
    examples: [
        [
            {
                user: "alice",
                content: {
                    text: "Create a post titled 'My First Post' with content 'Hello Hive!'",
                    action: "CREATE_POST",
                    title: "My First Post",
                    body: "Hello Hive!",
                    tags: ["hive", "introduction"],
                },
            },
        ],
        [
            {
                user: "bob",
                content: {
                    text: "Comment on @alice/my-first-post: 'Great post!'",
                    action: "CREATE_COMMENT",
                    parentAuthor: "alice",
                    parentPermlink: "my-first-post",
                    title: "",
                    body: "Great post!",
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
            await PostContentSchema.parseAsync(content);
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
            const validatedContent = PostContentSchema.parse(message.content);

            const client = new Client([config.HIVE_API_NODE]);

            const operations = [];

            // Create the post operation
            const postOp = [
                "comment",
                {
                    parent_author: validatedContent.parentAuthor || "",
                    parent_permlink: validatedContent.parentPermlink || "hive",
                    author: config.HIVE_ACCOUNT,
                    permlink:
                        validatedContent.permlink ||
                        generatePermlink(validatedContent.title),
                    title: validatedContent.title,
                    body: validatedContent.body,
                    json_metadata: JSON.stringify({
                        tags: validatedContent.tags || ["hive"],
                        app: "eliza-hive-plugin",
                    }),
                },
            ];
            operations.push(postOp);

            // Add beneficiaries if specified
            if (validatedContent.beneficiaries?.length) {
                const commentOptionsOp = [
                    "comment_options",
                    {
                        author: config.HIVE_ACCOUNT,
                        permlink:
                            validatedContent.permlink ||
                            generatePermlink(validatedContent.title),
                        max_accepted_payout: "1000000.000 HBD",
                        percent_hbd: 10000,
                        allow_votes: true,
                        allow_curation_rewards: true,
                        extensions: [
                            [
                                0,
                                {
                                    beneficiaries:
                                        validatedContent.beneficiaries.map(
                                            (b) => ({
                                                account: b.account,
                                                weight: b.weight,
                                            })
                                        ),
                                },
                            ],
                        ],
                    },
                ];
                operations.push(commentOptionsOp);
            }

            const result = await client.broadcast.sendOperations(
                operations,
                PrivateKey.fromString(config.HIVE_POSTING_KEY)
            );

            const response = {
                success: true,
                data: {
                    transactionId: result.id,
                    author: config.HIVE_ACCOUNT,
                    permlink: (postOp[1] as { permlink: string }).permlink,
                    category: (postOp[1] as { parent_permlink: string })
                        .parent_permlink,
                    title: validatedContent.title,
                },
            };

            // If there's a callback, use it
            if (callback) {
                const postType = validatedContent.parentAuthor
                    ? "comment"
                    : "post";
                const url = `https://hive.blog/@${config.HIVE_ACCOUNT}/${(postOp[1] as { permlink: string }).permlink}`;
                await callback(
                    {
                        text: `Successfully created ${postType}! View it here: ${url}`,
                        action: message.content.action,
                    },
                    undefined
                );
            }

            return response;
        } catch (error) {
            throw new Error(`Post creation failed: ${error.message}`);
        }
    },
};
