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
import { validateBinanceConfig } from "../environment";
import { BinanceService } from "../services";
import type { BalanceCheckRequest } from "../types";

const spotBalanceTemplate = `Look at ONLY your LAST RESPONSE message in this conversation, where you just confirmed which cryptocurrency balance to check.
Based on ONLY that last message, extract the cryptocurrency symbol.

For example:
- If your last message was "I'll fetch your Solana wallet balance..." -> return "SOL"
- If your last message was "I'll check your BTC balance..." -> return "BTC"
- If your last message was "I'll get your ETH balance..." -> return "ETH"

\`\`\`json
{
    "asset": "<symbol from your LAST response only>"
}
\`\`\`

Last part of conversation:
{{recentMessages}}`;

export const spotBalance: Action = {
    name: "GET_SPOT_BALANCE",
    similes: [
        "CHECK_BALANCE",
        "BALANCE_CHECK",
        "GET_WALLET_BALANCE",
        "WALLET_BALANCE",
        "CHECK_WALLET",
        "VIEW_BALANCE",
        "SHOW_BALANCE",
    ],
    description: "Get current spot wallet balance for one or all assets",
    validate: async (runtime: IAgentRuntime) => {
        try {
            await validateBinanceConfig(runtime);
            return true;
        } catch {
            return false;
        }
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const balanceContext = composeContext({
            state,
            template: spotBalanceTemplate,
        });

        const content = (await generateObjectDeprecated({
            runtime,
            context: balanceContext,
            modelClass: ModelClass.SMALL,
        })) as BalanceCheckRequest;

        try {
            const binanceService = new BinanceService({
                apiKey: runtime.getSetting("BINANCE_API_KEY"),
                secretKey: runtime.getSetting("BINANCE_SECRET_KEY"),
            });

            const balanceData = await binanceService.getBalance(content);

            if (content.asset) {
                const assetBalance = balanceData.balances[0];
                if (assetBalance) {
                    if (callback) {
                        callback({
                            text: `${content.asset} Balance:\nAvailable: ${assetBalance.free}\nLocked: ${assetBalance.locked}`,
                            content: assetBalance,
                        });
                    }
                } else {
                    if (callback) {
                        callback({
                            text: `No balance found for ${content.asset}`,
                            content: { error: "Asset not found" },
                        });
                    }
                }
            } else {
                const balanceText = balanceData.balances
                    .map(
                        (b) =>
                            `${b.asset}: Available: ${b.free}, Locked: ${b.locked}`
                    )
                    .join("\n");

                if (callback) {
                    callback({
                        text: `Spot Wallet Balances:\n${balanceText}`,
                        content: balanceData.balances,
                    });
                }
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error in balance check:", {
                message: error.message,
                code: error.code,
            });
            if (callback) {
                callback({
                    text: error.message,
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
                    text: "What's my current Bitcoin balance?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll check your BTC balance for you.",
                    action: "GET_SPOT_BALANCE",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "BTC Balance:\nAvailable: 0.5\nLocked: 0.1",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me all my wallet balances",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll fetch all your spot wallet balances.",
                    action: "GET_SPOT_BALANCE",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Spot Wallet Balances:\nBTC: Available: 0.5, Locked: 0.1\nETH: Available: 2.0, Locked: 0.0\nUSDT: Available: 1000.0, Locked: 0.0",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
