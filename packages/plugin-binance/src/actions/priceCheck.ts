import {
    type ActionExample,
    composeContext,
    elizaLogger,
    generateObjectDeprecated,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    type Action,
} from "@elizaos/core";
import { BinanceService } from "../services";

const priceCheckTemplate = `Look at ONLY your LAST RESPONSE message in this conversation, where you just said which cryptocurrency price you would check.
Based on ONLY that last message, provide the trading symbol.

For example:
- If your last message was "I'll check the current Ethereum price..." -> return "ETH"
- If your last message was "I'll check the current Solana price..." -> return "SOL"
- If your last message was "I'll check the current Bitcoin price..." -> return "BTC"

\`\`\`json
{
    "symbol": "<symbol from your LAST response only>",
    "quoteCurrency": "<quote currency from your LAST response, or USDT if none mentioned>"
}
\`\`\`

Last part of conversation:
{{recentMessages}}`;

export const priceCheck: Action = {
    name: "GET_PRICE",
    similes: [
        "CHECK_PRICE",
        "PRICE_CHECK",
        "GET_CRYPTO_PRICE",
        "CRYPTO_PRICE",
        "CHECK_CRYPTO_PRICE",
        "PRICE_LOOKUP",
        "CURRENT_PRICE",
    ],
    description: "Get current price information for a cryptocurrency pair",
    validate: async () => true, // Public endpoint
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: Record<string, unknown>,
        callback?: HandlerCallback
    ): Promise<boolean> => {
        try {
            // Initialize or update state
            state = !state
                ? await runtime.composeState(message)
                : await runtime.updateRecentMessageState(state);

            const context = composeContext({
                state,
                template: priceCheckTemplate,
            });

            const rawContent = await generateObjectDeprecated({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
            });

            if (!rawContent?.symbol) {
                throw new Error(
                    "Could not determine which cryptocurrency to check"
                );
            }

            // Ensure the content has the required shape
            const content = {
                symbol: rawContent.symbol.toString().toUpperCase().trim(),
                quoteCurrency: (rawContent.quoteCurrency || "USDT")
                    .toString()
                    .toUpperCase()
                    .trim(),
            };

            if (content.symbol.length < 2 || content.symbol.length > 10) {
                throw new Error("Invalid cryptocurrency symbol");
            }

            const binanceService = new BinanceService();
            const priceData = await binanceService.getPrice(content);

            if (callback) {
                callback({
                    text: `The current ${content.symbol} price is ${BinanceService.formatPrice(priceData.price)} ${content.quoteCurrency}`,
                    content: priceData,
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error in price check:", error);
            if (callback) {
                const errorMessage = error.message.includes("Invalid API key")
                    ? "Unable to connect to Binance API"
                    : error.message.includes("Invalid symbol")
                      ? `Sorry, could not find price for the cryptocurrency symbol you provided`
                      : `Sorry, I encountered an error: ${error.message}`;

                callback({
                    text: errorMessage,
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
                    text: "What's the current price of Bitcoin?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll check the current Bitcoin price for you right away.",
                    action: "GET_PRICE",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "The current BTC price is 42,150.25 USDT",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you check ETH price in EUR?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll fetch the current Ethereum price in euros for you.",
                    action: "GET_PRICE",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "The current ETH price is 2,245.80 EUR",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
