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
import { SpotTradeSchema } from "../types";

const spotTradeTemplate = `Look at your LAST RESPONSE in the conversation where you confirmed a trade/swap request.
Based on ONLY that last message, extract the trading details:

Trading pairs on Binance must include USDT or BUSD or USDC. For example:
- For "swap SOL for USDC" -> use "SOLUSDC" as symbol
- For "swap ETH for USDT" -> use "ETHUSDT" as symbol
- For "buy BTC with USDT" -> use "BTCUSDT" as symbol

\`\`\`json
{
    "symbol": "<pair with stable coin>",
    "side": "SELL",
    "type": "MARKET",
    "quantity": "<amount from your last response>"
}
\`\`\`

Recent conversation:
{{recentMessages}}`;

export const spotTrade: Action = {
    name: "EXECUTE_SPOT_TRADE",
    similes: [
        "SPOT_TRADE",
        "MARKET_ORDER",
        "LIMIT_ORDER",
        "BUY_CRYPTO",
        "SELL_CRYPTO",
        "PLACE_ORDER",
    ],
    description: "Execute a spot trade on Binance",
    validate: async (runtime: IAgentRuntime) => {
        return !!(
            runtime.getSetting("BINANCE_API_KEY") &&
            runtime.getSetting("BINANCE_SECRET_KEY")
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: Record<string, unknown>,
        callback?: HandlerCallback
    ): Promise<boolean> => {
        let content;
        try {
            state = !state
                ? await runtime.composeState(message)
                : await runtime.updateRecentMessageState(state);

            const context = composeContext({
                state,
                template: spotTradeTemplate,
            });

            content = await generateObjectDeprecated({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
            });

            // Convert quantity to number if it's a string
            if (content && typeof content.quantity === "string") {
                content.quantity = Number.parseFloat(content.quantity);
            }

            const parseResult = SpotTradeSchema.safeParse(content);
            if (!parseResult.success) {
                throw new Error(
                    `Invalid spot trade content: ${JSON.stringify(parseResult.error.errors, null, 2)}`
                );
            }

            const binanceService = new BinanceService({
                apiKey: runtime.getSetting("BINANCE_API_KEY"),
                secretKey: runtime.getSetting("BINANCE_SECRET_KEY"),
            });

            const tradeResult = await binanceService.executeTrade(content);

            if (callback) {
                const orderType =
                    content.type === "MARKET"
                        ? "market"
                        : `limit at ${BinanceService.formatPrice(content.price!)}`;

                callback({
                    text: `Successfully placed a ${orderType} order to ${content.side.toLowerCase()} ${content.quantity} ${content.symbol}\nOrder ID: ${tradeResult.orderId}\nStatus: ${tradeResult.status}`,
                    content: tradeResult,
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error executing trade:", {
                content,
                message: error.message,
                code: error.code,
            });
            if (callback) {
                callback({
                    text: `Error executing trade: ${error.message}`,
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
                    text: "Buy 0.1 BTC at market price",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll execute a market order to buy 0.1 BTC now.",
                    action: "EXECUTE_SPOT_TRADE",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully placed a market order to buy 0.1 BTCUSDT\nOrder ID: 123456789\nStatus: FILLED",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Place a limit order to sell 100 BNB at 250 USDT",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll place a limit order to sell 100 BNB at 250 USDT.",
                    action: "EXECUTE_SPOT_TRADE",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully placed a limit order to sell 100 BNBUSDT at 250\nOrder ID: 987654321\nStatus: NEW",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
