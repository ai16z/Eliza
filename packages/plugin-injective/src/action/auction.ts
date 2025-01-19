import { createGenericAction } from "./base";
import * as AuctionTemplates from "@injective/template/auction";
import * as AuctionExamples from "@injective/examples/auction";
import * as AuctionSimilies from "@injective/similes/auction";
export const GetAuctionModuleParamsAction = createGenericAction({
    name: "GET_AUCTION_MODULE_PARAMS",
    description: "Fetches the auction module parameters",
    template: AuctionTemplates.getAuctionModuleParamsTemplate,
    examples: AuctionExamples.getAuctionModuleParamsExample,
    similes: AuctionSimilies.getAuctionModuleParamsSimiles,
    functionName: "getAuctionModuleParams",
    validateContent: () => true,
});

export const GetAuctionModuleStateAction = createGenericAction({
    name: "GET_AUCTION_MODULE_STATE",
    description: "Fetches the auction module state",
    template: AuctionTemplates.getAuctionModuleStateTemplate,
    examples: AuctionExamples.getAuctionModuleStateExample,
    similes: AuctionSimilies.getAuctionModuleStateSimiles,
    functionName: "getAuctionModuleState",
    validateContent: () => true,
});

export const GetCurrentBasketAction = createGenericAction({
    name: "GET_CURRENT_BASKET",
    description: "Fetches the current auction basket",
    template: AuctionTemplates.getCurrentBasketTemplate,
    examples: AuctionExamples.getCurrentBasketExample,
    functionName: "getCurrentBasket",
    similes: AuctionSimilies.getCurrentBasketSimiles,
    validateContent: () => true,
});

export const GetAuctionRoundAction = createGenericAction({
    name: "GET_AUCTION_ROUND",
    description: "Fetches details of a specific auction round",
    template: AuctionTemplates.getAuctionRoundTemplate,
    examples: AuctionExamples.getAuctionRoundExample,
    similes: AuctionSimilies.getAuctionRoundSimiles,
    functionName: "getAuctionRound",
    validateContent: () => true,
});

export const GetAuctionsAction = createGenericAction({
    name: "GET_AUCTIONS",
    description: "Fetches a list of auctions",
    template: AuctionTemplates.getAuctionsTemplate,
    examples: AuctionExamples.getAuctionsExample,
    similes: AuctionSimilies.getAuctionsSimiles,
    functionName: "getAuctions",
    validateContent: () => true,
});

export const MsgBidAction = createGenericAction({
    name: "MSG_BID",
    description: "Places a bid in an auction round",
    template: AuctionTemplates.msgBidTemplate,
    examples: AuctionExamples.msgBidExample,
    similes: AuctionSimilies.MsgBidSimiles,
    functionName: "msgBid",
    validateContent: () => true,
});

export const AuctionActions = [
    GetAuctionModuleParamsAction,
    GetAuctionModuleStateAction,
    GetCurrentBasketAction,
    GetAuctionRoundAction,
    GetAuctionsAction,
    MsgBidAction,
];
