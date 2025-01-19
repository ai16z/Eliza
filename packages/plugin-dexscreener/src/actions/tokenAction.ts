import type { Action, IAgentRuntime, Memory, State, HandlerCallback } from "@elizaos/core";
import { TokenPriceProvider } from "../providers/tokenProvider";

export const priceTemplate = `Determine if this is a token price request. If it is one of the specified situations, perform the corresponding action:

Situation 1: "Get token price"
- Message contains: words like "price", "value", "cost", "worth" AND a token symbol/address
- Example: "What's the price of ETH?" or "How much is BTC worth?"
- Action: Get the current price of the token

Previous conversation for context:
{{conversation}}

You are replying to: {{message}}
`;

export class TokenPriceAction implements Action {
    name = "GET_TOKEN_PRICE";
    similes = ["FETCH_TOKEN_PRICE", "CHECK_TOKEN_PRICE", "TOKEN_PRICE"];
    description = "Fetches and returns token price information";
    suppressInitialMessage = true;
    template = priceTemplate;

    async validate(runtime: IAgentRuntime, message: Memory): Promise<boolean> {
        const content = typeof message.content === 'string'
            ? message.content
            : message.content?.text;

        if (!content) return false;

        const hasPriceKeyword = /\b(price|value|worth|cost)\b/i.test(content);
        const hasToken = (
            /0x[a-fA-F0-9]{40}/.test(content) ||
            /[$#]?[a-zA-Z0-9]+/i.test(content)
        );

        return hasPriceKeyword && hasToken;
    }

    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options: { [key: string]: unknown } = {},
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            // Get the provider
            const provider = runtime.providers.find(p => p instanceof TokenPriceProvider);
            if (!provider) {
                throw new Error("Token price provider not found");
            }

            // Get price data
            console.log("Fetching price data...");
            const priceData = await provider.get(runtime, message, state);
            console.log("Received price data:", priceData);

            if (priceData.includes("Error")) {
                throw new Error(priceData);
            }

            // If we have a callback, use it to send the response
            if (callback) {
                await callback({
                    text: priceData,
                    action: this.name
                });
            }

            // Set the response in state to prevent further processing
            if (state) {
                state.responseData = {
                    text: priceData,
                    action: this.name
                };
            }

            return true;

        } catch (error) {
            console.error("Error in price action handler:", error);

            if (callback) {
                await callback({
                    text: `Sorry, I couldn't fetch the token price: ${error.message}`,
                    action: this.name
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
                    text: "check price of eth"
                }
            },
            {
                user: "{{system}}",
                content: {
                    text: "The current price of Ethereum (ETH) is $2,345.67 with a 24h trading volume of $9.87B. The liquidity pool holds $1.23B, and the price has changed +5.43% in the last 24 hours.",
                    action: "GET_TOKEN_PRICE"
                }
            }
        ],
        [
            {
                user: "{{user}}",
                content: {
                    text: "How much is BTC worth right now?"
                }
            },
            {
                user: "{{system}}",
                content: {
                    text: "Bitcoin (BTC) is currently trading at $42,567.89. There's $15.23B in liquidity, with a 24h volume of $25.87B. The price is up 2.15% in the last 24 hours.",
                    action: "GET_TOKEN_PRICE"
                }
            }
        ],
        [
            {
                user: "{{user}}",
                content: {
                    text: "what's the current value of $bnb"
                }
            },
            {
                user: "{{system}}",
                content: {
                    text: "Binance Coin (BNB) is priced at $345.67 with $5.23B in liquidity. The trading volume over the last 24h is $1.87B, and the price has decreased by 1.23% during this period.",
                    action: "GET_TOKEN_PRICE"
                }
            }
        ],
        [
            {
                user: "{{user}}",
                content: {
                    text: "can you tell me the price for USDT?"
                }
            },
            {
                user: "{{system}}",
                content: {
                    text: "Tether (USDT) is maintaining its peg at $1.00 with minimal change (+0.01%). The token has $25.23B in liquidity and has seen $45.87B in trading volume over the past 24 hours.",
                    action: "GET_TOKEN_PRICE"
                }
            }
        ],
        [
            {
                user: "{{user}}",
                content: {
                    text: "show me the cost of #SOL"
                }
            },
            {
                user: "{{system}}",
                content: {
                    text: "Solana (SOL) is trading at $123.45, showing strong momentum with an 8.75% increase in the last 24 hours. The liquidity stands at $3.23B with a 24h trading volume of $987.54M.",
                    action: "GET_TOKEN_PRICE"
                }
            }
        ],
        [
            {
                user: "{{user}}",
                content: {
                    text: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0 price please"
                }
            },
            {
                user: "{{system}}",
                content: {
                    text: "The price of Polygon (MATIC) is currently $1.23, up 3.45% in the past 24 hours. The token has $2.23B in liquidity and has seen $567.54M in trading volume today.",
                    action: "GET_TOKEN_PRICE"
                }
            }
        ]
    ];
}

export const tokenPriceAction = new TokenPriceAction();