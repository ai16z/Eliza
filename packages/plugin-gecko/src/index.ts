export * from "./actions/price";
export * from "./actions/pricePerAddress";
export * from "./actions/trending";
export * from "./providers/coins";
export * from "./types";

import type { Plugin } from "@elizaos/core";
import { getPriceAction } from "./actions/price";
import { getTrendingAction } from "./actions/trending";
import { getPriceByAddressAction } from "./actions/pricePerAddress";
import { coingeckoProvider } from "./providers/coins";

export const coingeckoPlugin: Plugin = {
    name: "coingecko",
    description: "CoinGecko cryptocurrency price integration plugin",
    providers: [coingeckoProvider],
    evaluators: [],
    services: [],
    actions: [getPriceAction, getPriceByAddressAction, getTrendingAction],
};

export default coingeckoPlugin;
