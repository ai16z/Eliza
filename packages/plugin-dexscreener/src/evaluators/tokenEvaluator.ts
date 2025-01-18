import type { Evaluator, IAgentRuntime, Memory, State } from "@elizaos/core";

export class TokenPriceEvaluator implements Evaluator {
    name = "TOKEN_PRICE_EVALUATOR";
    similes = ["price", "token price", "check price"];
    description = "Evaluates messages for token price requests";

    async validate(runtime: IAgentRuntime, message: Memory): Promise<boolean> {
        const content = typeof message.content === 'string'
            ? message.content
            : message.content?.text;

        if (!content) return false;

        // Check for price-related keywords
        const hasPriceKeyword = /\b(price|value|worth|cost)\b/i.test(content);

        // Look for either:
        // 1. Ethereum address
        // 2. Token symbol starting with $ or #
        // 3. Token symbol after "of" or "for" (case insensitive)
        const hasToken = (
            /0x[a-fA-F0-9]{40}/.test(content) || // Ethereum address
            /[$#][a-zA-Z]+/.test(content) || // $TOKEN or #TOKEN format
            /\b(of|for)\s+[a-zA-Z0-9]+\b/i.test(content) // "price of TOKEN" format
        );

        return hasPriceKeyword && hasToken;
    }

    async handler(_runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<string> {
        return "GET_TOKEN_PRICE";
    }

    examples = [
        {
            context: "User asking for token price with address",
            messages: [
                {
                    user: "{{user}}",
                    content: {
                        text: "What's the price of 0x1234567890123456789012345678901234567890?",
                        action: "GET_TOKEN_PRICE"
                    }
                }
            ],
            outcome: "GET_TOKEN_PRICE"
        },
        {
            context: "User checking token price with $ symbol",
            messages: [
                {
                    user: "{{user}}",
                    content: {
                        text: "Check price of $eth",
                        action: "GET_TOKEN_PRICE"
                    }
                }
            ],
            outcome: "GET_TOKEN_PRICE"
        },
        {
            context: "User checking token price with plain symbol",
            messages: [
                {
                    user: "{{user}}",
                    content: {
                        text: "What's the value for btc",
                        action: "GET_TOKEN_PRICE"
                    }
                }
            ],
            outcome: "GET_TOKEN_PRICE"
        }
    ];
}

export const tokenPriceEvaluator = new TokenPriceEvaluator();