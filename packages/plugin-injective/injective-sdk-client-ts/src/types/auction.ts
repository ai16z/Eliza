//Auction Module Params
export interface MsgBidRequestParams {
    amount: string;
    round: number;
}
export interface GetAuctionRoundParams {
    round: number;
}

export interface GetAuctionsParams {
    startRound: number;
    limit: number;
}
