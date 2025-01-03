import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action,
    elizaLogger,
} from "@elizaos/core";
import { WalletProvider, walletProvider } from "../../providers/wallet";
import API from "../../utils/api";

export default {
    name: "RUNES_GET_PORTFOLIO",
    similes: ["GET_RUNES_PORTFOLIO", "RETRIEVE_RUNES_BALANCE"],
    validate: async () => {
        return true;
    },
    description: "Retrieves the agents Ordinals wallet's runes portfolio.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        try {
            const wallet: WalletProvider = await walletProvider.get(
                runtime,
                message,
                state
            );
            const addresses = wallet.getAddresses();
            const taprootAddress = addresses.taprootAddress;

            const ordiscan = new API(runtime.getSetting("ORDISCAN_API_KEY"));

            const portfolio = await ordiscan.getRunesPortfolio(taprootAddress);

            const balances = portfolio?.results;

            elizaLogger.info(JSON.stringify(portfolio));

            callback({
                text: `Runes portfolio for address ${taprootAddress}:\n${balances?.map((item, idx) => `${idx + 1}: ${item?.rune?.spaced_name} - ${item.balance}\n`)}`,
            });

            return true;
        } catch (error) {
            elizaLogger.error("Error during address retrieval:", error);
            callback({
                text: `Error during address retrieval: ${error.message}`,
                error: true,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What does my Runes portfolio look like?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Your runes portfolio:",
                    action: "RUNES_GET_PORTFOLIO",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is my runes balance?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Your runes portfolio:",
                    action: "RUNES_GET_PORTFOLIO",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
