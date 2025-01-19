import type { Plugin } from "@elizaos/core";
import { spotTrade } from "./actions/spotTrade";
import { priceCheck } from "./actions/priceCheck";
import { cancelOrders } from "./actions/cancelOrders";

export const hyperliquidPlugin: Plugin = {
    name: "hyperliquid",
    description: "Hyperliquid plugin",
    actions: [spotTrade, priceCheck, cancelOrders],
    providers: [],
    evaluators: [],
    services: [],
    clients: [],
};

export default hyperliquidPlugin;
