// Create Convert Quote
import type { RatConvertTrade, TradeIncentiveMetadata } from './common-types';

export type CreateConvertQuoteRequest = {
    // Body Params
    fromAccount: string;
    toAccount: string;
    amount: string;
    tradeIncentiveMetadata?: TradeIncentiveMetadata;
};

export type CreateConvertQuoteResponse = {
    trade?: RatConvertTrade;
};

// Get Convert Trade
export type GetConvertTradeRequest = {
    // Path Params
    tradeId: string;

    //Query Params
    fromAccount: string;
    toAccount: string;
};

export type GetConvertTradeResponse = {
    trade?: RatConvertTrade;
};

// Commit Convert Trade
export type CommitConvertTradeRequest = {
    // Path Params
    tradeId: string;

    // Body Params
    fromAccount: string;
    toAccount: string;
};

export type CommitConvertTradeResponse = {
    trade?: RatConvertTrade;
};
