import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import { MsgBid } from "@injectivelabs/sdk-ts";
import type * as AuctionTypes from "../types/auction";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";
import { INJ_DENOM } from "@injectivelabs/utils";

/**
 * Fetches the auction module parameters.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing module parameters or an error.
 */
export async function getAuctionModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = this.chainGrpcAuctionApi.fetchModuleParams();

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAuctionModuleParamsError", err);
    }
}

/**
 * Fetches the auction module state.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing module state or an error.
 */
export async function getAuctionModuleState(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcAuctionApi.fetchModuleState();

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAuctionModuleStateError", err);
    }
}

/**
 * Fetches the current auction basket.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing the current basket or an error.
 */
export async function getCurrentBasket(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcAuctionApi.fetchCurrentBasket();

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getCurrentBasketError", err);
    }
}

/**
 * Fetches details of a specific auction round.
 *
 * @this InjectiveGrpcBase
 * @param {AuctionTypes.GetAuctionRoundParams} params - Parameters including the auction round number.
 * @returns {Promise<StandardResponse>} The standard response containing auction round details or an error.
 */
export async function getAuctionRound(
    this: InjectiveGrpcBase,
    params: AuctionTypes.GetAuctionRoundParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcAuctionApi.fetchAuction(
            params.round
        );

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAuctionRoundError", err);
    }
}

/**
 * Fetches a list of auctions based on provided parameters.
 *
 * @this InjectiveGrpcBase
 * @param {AuctionTypes.GetAuctionsParams} params - Parameters to filter auctions.
 * @returns {Promise<StandardResponse>} The standard response containing a list of auctions or an error.
 */
export async function getAuctions(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcAuctionApi.fetchAuctions();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAuctionsError", err);
    }
}

/**
 * Places a bid in an auction round.
 *
 * @this InjectiveGrpcBase
 * @param {AuctionTypes.MsgBidRequestParams} params - Parameters including round number and bid amount.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgBid(
    this: InjectiveGrpcBase,
    params: AuctionTypes.MsgBidRequestParams
): Promise<StandardResponse> {
    try {
        const amount = { denom: INJ_DENOM, amount: params.amount };
        const msg = MsgBid.fromJSON({
            round: params.round,
            injectiveAddress: this.injAddress,
            amount: amount,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgBidError", err);
    }
}
