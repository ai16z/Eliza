import type { IAgentRuntime } from "@elizaos/core";
import {
    convertBaseUnitToDisplayUnit,
    getSymbolByDenom,
} from "@chain-registry/utils";
import { assets } from "chain-registry";
import { initWalletChainsData } from "./utils";
import type { ICosmosPluginOptions } from "../../shared/interfaces";
import { getAvailableAssets } from "../../shared/helpers/cosmos-assets";

export const createCosmosWalletProvider = (
    pluginOptions: ICosmosPluginOptions
) => ({
    get: async (runtime: IAgentRuntime) => {
        let providerContextMessage = "";

        const customAssets = (pluginOptions?.customChainData ?? []).map(
            (chainData) => chainData.assets
        );

        const availableAssets = getAvailableAssets(assets, customAssets);

        try {
            const provider = await initWalletChainsData(runtime);

            for (const [chainName, { wallet }] of Object.entries(
                provider.walletChainsData
            )) {
                const address = await wallet.getWalletAddress();
                const balances = await wallet.getWalletBalances();

                const convertedCoinsToDisplayDenom = balances.map((balance) => {
                    const symbol = getSymbolByDenom(
                        availableAssets,
                        balance.denom,
                        chainName
                    );

                    return {
                        amount: symbol
                            ? convertBaseUnitToDisplayUnit(
                                  availableAssets,
                                  symbol,
                                  balance.amount,
                                  chainName
                              )
                            : balance.amount,
                        symbol: symbol ?? balance.denom,
                    };
                });

                const balancesToString = convertedCoinsToDisplayDenom
                    .map((balance) => `- ${balance.amount} ${balance.symbol}`)
                    .join("\n");

                providerContextMessage += `Chain: ${chainName}\nAddress: ${address}\nBalances:\n${balancesToString}\n________________\n`;
            }

            return providerContextMessage;
        } catch (error) {
            console.error(
                "Error Initializing in Cosmos wallet provider:",
                error
            );

            return null;
        }
    },
});
