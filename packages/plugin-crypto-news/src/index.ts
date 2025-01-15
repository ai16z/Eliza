import { Plugin } from "@elizaos/core";
import { cryptoNewsData } from "./providers/cryptoNewsData";
//import { getTokenOverviewAction } from "./actions/tokenOverview";
//import { twitterTrendingMarketData } from "./providers/twitterTrendingMarketData";

export const cryptoNewsPlugin: Plugin = {
    name: "crypto-news",
    description: "Provides crypto news as providers",
    actions: [],
    providers: [cryptoNewsData],
    evaluators: [],
};
