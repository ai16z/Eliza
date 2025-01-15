import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
    ModelClass,
    Content,
    elizaLogger,
    composeContext,
    generateMessageResponse,
    parseJSONObjectFromText,
    generateText,
    messageCompletionFooter,
} from "@elizaos/core";
import { fetchTokenOverview } from "../utils/birdeye";

interface TokenQuery {
    address?: string;
    symbol?: string;
}

const tokenExtractionTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
    "address": "So11111111111111111111111111111111111111112",
    "symbol": "SOL"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the token query, please refer to last message for context:
- Token contract address if provided
- Token symbol if provided

NOTE: If you see addresses like this 2gkevSAUExkSUwwwj6uNbzwwNCXyzEBkGLg4wAyUpump remember that pump suffix IS PART OF THE ADDRESS, do not remove it.

Respond with a JSON markdown block containing only the extracted values. Use "" (empty string) for any values that cannot be determined.
IMPORTANT: Response format should be in this format:
\`\`\`json
{
    "address": "So11111111111111111111111111111111111111112",
    "symbol": "SOL"
}
\`\`\``;

const marketAnalysisTemplate = `You are {{agentName}}, a professional market analyst.

About you:
{{bio}}
{{lore}}

Recent conversation:
{{recentMessages}}

Available market data:
{{marketData}}

Analyze the market data and provide insights about:
1. Price performance across different timeframes
2. Trading volume and liquidity
3. Holder behavior and wallet activity
4. Overall market sentiment

Keep the analysis concise and data-driven, focusing on the most relevant metrics.` + messageCompletionFooter;

export const getTokenOverviewAction: Action = {
    name: "GET_TOKEN_OVERVIEW",
    similes: ["CHECK_TOKEN", "TOKEN_INFO", "MARKET_DATA", "TOKEN_ANALYSIS"],
    description: "Retrieve and analyze token market data from Birdeye",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        //const text = (message.content as Content).text?.toLowerCase() || "";
        //return text.includes("token") || text.includes("price") || text.includes("market");
        return true;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        try {
            // Initialize or update state
            if (!state) {
                state = await runtime.composeState(message);
            } else {
                state = await runtime.updateRecentMessageState(state);
            }

            // Extract token information from message
            const extractionContext = composeContext({
                state,
                template: tokenExtractionTemplate,
            });

            elizaLogger.log(`Extracting token info...`);

            const response = await generateText({
                runtime,
                context: extractionContext,
                modelClass: ModelClass.SMALL,
            });

            const tokenQuery = parseJSONObjectFromText(response) as TokenQuery;

            elizaLogger.info(`Token query: ${JSON.stringify(tokenQuery)}`);

            if (!tokenQuery.address && !tokenQuery.symbol) {
                callback?.({
                    text: "I couldn't identify which token you're asking about. Could you please provide a token symbol or contract address?",
                });
                return false;
            }

            if (tokenQuery.symbol && !tokenQuery.address) {
                callback?.({
                    text: "Ticker is not enough please provide me the contract address",
                });
                return false;
            }

            elizaLogger.log(`Fetching token data...`);

            // Fetch token data
            const tokenAddress = tokenQuery.address || "So11111111111111111111111111111111111111112"; // Default to SOL if only symbol provided
            const tokenData = await fetchTokenOverview(tokenAddress as string, runtime.character.settings.secrets.BIRDEYE_API_KEY);


            elizaLogger.log(`Market data: ${JSON.stringify(tokenData, null, 2)}`);

            // Update state with market data
            if (!state) {
                state = await runtime.composeState(message);
            }

            state = {
                ...state,
                marketData: JSON.stringify(tokenData, null, 2),
            };

            // Generate market analysis
            const analysisContext = composeContext({
                state,
                template: marketAnalysisTemplate,
            });

            const analysis = await generateMessageResponse({
                runtime,
                context: analysisContext,
                modelClass: ModelClass.LARGE,
            });

            callback?.(analysis);

            return true;
        } catch (error) {
            elizaLogger.error(`Error in GET_TOKEN_OVERVIEW action: ${error}`);
            callback?.({
                text: "I encountered an error while fetching the token data. Please try again later.",
            });
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "What's the current market data for DV44rX6H8pEu4qwruwUvjswyRPTUib5qHTjWNRigpump?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Let me analyze the market data for DV44rX6H8pEu4qwruwUvjswyRPTUib5qHTjWNRigpump",
                    action: "GET_TOKEN_OVERVIEW",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "DV44rX6H8pEu4qwruwUvjswyRPTUib5qHTjWNRigpump" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Checking market data for DV44rX6H8pEu4qwruwUvjswyRPTUib5qHTjWNRigpump",
                    action: "GET_TOKEN_OVERVIEW",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you check the token at address So11111111111111111111111111111111111111112?"
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll fetch the market data for this token...",
                    action: "GET_TOKEN_OVERVIEW",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Can you make an analysis of $AVB?" },
            },
            {
                user: "{{agentName}}",
                content: { text: "Can you provide the address of $AVB?", action: "NONE" },
            },
            {
                user: "{{user1}}",
                content: { text: "6d5zHW5B8RkGKd51Lpb9RqFQSqDudr9GJgZ1SgQZpump" },
            },
            {
                user: "{{agentName}}",
                content: { text: "Checking market data for $AVB", action: "GET_TOKEN_OVERVIEW" },
            },
        ],
    ],
};