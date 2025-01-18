import type { Plugin } from "@elizaos/core";
import { tokenSearchAddressAction } from "./actions/token-search-address";
import { tokenSearchSymbolAction } from "./actions/token-search-symbol";
import { walletSearchAddressAction } from "./actions/wallet-search-address";
import { agentPortfolioProvider } from "./providers/agent-portfolio-provider";

export const birdeyePlugin: Plugin = {
    name: "birdeye",
    description: "Birdeye Plugin for token data and analytics",
    actions: [
        tokenSearchSymbolAction,
        tokenSearchAddressAction,
        walletSearchAddressAction,
        // testAllEndpointsAction, // this action can be used to optionally test all endpoints
    ],
    evaluators: [],
    providers: [agentPortfolioProvider],
};

export default birdeyePlugin;
