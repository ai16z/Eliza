import {
    type Action,
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    elizaLogger,
    getEmbeddingZeroVector,
} from "@elizaos/core";

interface TokenProfile {
    url: string;
    description?: string;
    chainId: string;
    tokenAddress: string;
}

const createTokenMemory = async (
    runtime: IAgentRuntime,
    _message: Memory,
    formattedOutput: string
) => {
    const memory: Memory = {
        userId: _message.userId,
        agentId: _message.agentId,
        roomId: _message.roomId,
        content: { text: formattedOutput },
        createdAt: Date.now(),
        embedding: getEmbeddingZeroVector(),
    };
    await runtime.messageManager.createMemory(memory);
};

export const latestTokensTemplate = `Determine if this is a request for latest tokens. If it is one of the specified situations, perform the corresponding action:

Situation 1: "Get latest tokens"
- Message contains: words like "latest", "new", "recent" AND "tokens"
- Example: "Show me the latest tokens" or "What are the new tokens?"
- Action: Get the most recent tokens listed

Previous conversation for context:
{{conversation}}

You are replying to: {{message}}
`;

export class LatestTokensAction implements Action {
    name = "GET_LATEST_TOKENS";
    similes = ["FETCH_NEW_TOKENS", "CHECK_RECENT_TOKENS", "LIST_NEW_TOKENS"];
    description = "Get the latest tokens from DexScreener API";
    suppressInitialMessage = true;
    template = latestTokensTemplate;

    async validate(runtime: IAgentRuntime, message: Memory): Promise<boolean> {
        const content =
            typeof message.content === "string"
                ? message.content
                : message.content?.text;

        if (!content) return false;

        const hasLatestKeyword = /\b(latest|new|recent)\b/i.test(content);
        const hasTokensKeyword = /\b(tokens?|coins?|crypto)\b/i.test(content);

        return hasLatestKeyword && hasTokensKeyword;
    }

    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options: { [key: string]: unknown } = {},
        callback?: HandlerCallback
    ): Promise<boolean> {
        elizaLogger.log("Starting GET_LATEST_TOKENS handler...");

        try {
            const response = await fetch(
                "https://api.dexscreener.com/token-profiles/latest/v1",
                {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const tokens: TokenProfile[] = await response.json();

            const formattedOutput = tokens
                .map((token) => {
                    const description =
                        token.description || "No description available";
                    return `Chain: ${token.chainId}\nToken Address: ${token.tokenAddress}\nURL: ${token.url}\nDescription: ${description}\n\n`;
                })
                .join("");

            await createTokenMemory(runtime, message, formattedOutput);

            if (callback) {
                await callback({
                    text: formattedOutput,
                    action: this.name,
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error fetching latest tokens:", error);

            if (callback) {
                await callback({
                    text: `Failed to fetch latest tokens: ${error.message}`,
                    action: this.name,
                });
            }

            return false;
        }
    }

    examples = [
        [
            {
                user: "{{user}}",
                content: {
                    text: "show me the latest tokens",
                },
            },
            {
                user: "{{system}}",
                content: {
                    text: "Here are the latest tokens added to DexScreener...",
                    action: "GET_LATEST_TOKENS",
                },
            },
        ],
    ];
}

export const latestBoostedTemplate = `Determine if this is a request for latest boosted tokens. If it is one of the specified situations, perform the corresponding action:

Situation 1: "Get latest boosted tokens"
- Message contains: words like "latest", "new", "recent" AND "boosted tokens"
- Example: "Show me the latest boosted tokens" or "What are the new promoted tokens?"
- Action: Get the most recent boosted tokens

Previous conversation for context:
{{conversation}}

You are replying to: {{message}}
`;

export class LatestBoostedTokensAction implements Action {
    name = "GET_LATEST_BOOSTED_TOKENS";
    similes = [
        "FETCH_NEW_BOOSTED_TOKENS",
        "CHECK_RECENT_BOOSTED_TOKENS",
        "LIST_NEW_BOOSTED_TOKENS",
    ];
    description = "Get the latest boosted tokens from DexScreener API";
    suppressInitialMessage = true;
    template = latestBoostedTemplate;

    async validate(runtime: IAgentRuntime, message: Memory): Promise<boolean> {
        const content =
            typeof message.content === "string"
                ? message.content
                : message.content?.text;

        if (!content) return false;

        const hasLatestKeyword = /\b(latest|new|recent)\b/i.test(content);
        const hasBoostedKeyword = /\b(boosted|promoted|featured)\b/i.test(
            content
        );
        const hasTokensKeyword = /\b(tokens?|coins?|crypto)\b/i.test(content);

        return hasLatestKeyword && (hasBoostedKeyword || hasTokensKeyword);
    }

    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options: { [key: string]: unknown } = {},
        callback?: HandlerCallback
    ): Promise<boolean> {
        elizaLogger.log("Starting GET_LATEST_BOOSTED_TOKENS handler...");

        try {
            const response = await fetch(
                "https://api.dexscreener.com/token-boosts/latest/v1",
                {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const tokens: TokenProfile[] = await response.json();

            const formattedOutput = tokens
                .map((token) => {
                    const description =
                        token.description || "No description available";
                    return `Chain: ${token.chainId}\nToken Address: ${token.tokenAddress}\nURL: ${token.url}\nDescription: ${description}\n\n`;
                })
                .join("");

            await createTokenMemory(runtime, message, formattedOutput);

            if (callback) {
                await callback({
                    text: formattedOutput,
                    action: this.name,
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error fetching latest boosted tokens:", error);

            if (callback) {
                await callback({
                    text: `Failed to fetch latest boosted tokens: ${error.message}`,
                    action: this.name,
                });
            }

            return false;
        }
    }

    examples = [
        [
            {
                user: "{{user}}",
                content: {
                    text: "show me the latest boosted tokens",
                },
            },
            {
                user: "{{system}}",
                content: {
                    text: "Here are the latest boosted tokens on DexScreener...",
                    action: "GET_LATEST_BOOSTED_TOKENS",
                },
            },
        ],
    ];
}

export const topBoostedTemplate = `Determine if this is a request for top boosted tokens. If it is one of the specified situations, perform the corresponding action:

Situation 1: "Get top boosted tokens"
- Message contains: words like "top", "best", "most" AND "boosted tokens"
- Example: "Show me the top boosted tokens" or "What are the most promoted tokens?"
- Action: Get the tokens with most active boosts

Previous conversation for context:
{{conversation}}

You are replying to: {{message}}
`;

export class TopBoostedTokensAction implements Action {
    name = "GET_TOP_BOOSTED_TOKENS";
    similes = [
        "FETCH_MOST_BOOSTED_TOKENS",
        "CHECK_HIGHEST_BOOSTED_TOKENS",
        "LIST_TOP_BOOSTED_TOKENS",
    ];
    description = "Get tokens with most active boosts from DexScreener API";
    suppressInitialMessage = true;
    template = topBoostedTemplate;

    async validate(runtime: IAgentRuntime, message: Memory): Promise<boolean> {
        const content =
            typeof message.content === "string"
                ? message.content
                : message.content?.text;

        if (!content) return false;

        const hasTopKeyword = /\b(top|best|most)\b/i.test(content);
        const hasBoostedKeyword = /\b(boosted|promoted|featured)\b/i.test(
            content
        );
        const hasTokensKeyword = /\b(tokens?|coins?|crypto)\b/i.test(content);

        return hasTopKeyword && (hasBoostedKeyword || hasTokensKeyword);
    }

    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options: { [key: string]: unknown } = {},
        callback?: HandlerCallback
    ): Promise<boolean> {
        elizaLogger.log("Starting GET_TOP_BOOSTED_TOKENS handler...");

        try {
            const response = await fetch(
                "https://api.dexscreener.com/token-boosts/top/v1",
                {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const tokens: TokenProfile[] = await response.json();

            const formattedOutput = tokens
                .map((token) => {
                    const description =
                        token.description || "No description available";
                    return `Chain: ${token.chainId}\nToken Address: ${token.tokenAddress}\nURL: ${token.url}\nDescription: ${description}\n\n`;
                })
                .join("");

            await createTokenMemory(runtime, message, formattedOutput);

            if (callback) {
                await callback({
                    text: formattedOutput,
                    action: this.name,
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error fetching top boosted tokens:", error);

            if (callback) {
                await callback({
                    text: `Failed to fetch top boosted tokens: ${error.message}`,
                    action: this.name,
                });
            }

            return false;
        }
    }

    examples = [
        [
            {
                user: "{{user}}",
                content: {
                    text: "show me the top boosted tokens",
                },
            },
            {
                user: "{{system}}",
                content: {
                    text: "Here are the tokens with the most active boosts on DexScreener...",
                    action: "GET_TOP_BOOSTED_TOKENS",
                },
            },
        ],
    ];
}

export const latestTokensAction = new LatestTokensAction();
export const latestBoostedTokensAction = new LatestBoostedTokensAction();
export const topBoostedTokensAction = new TopBoostedTokensAction();
