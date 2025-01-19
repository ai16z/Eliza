import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    BinaryOptionsMarket,
    DerivativeLimitOrder,
    DerivativeOrderHistory,
    Position,
    PositionV2,
    DerivativeTrade,
    FundingPayment,
    FundingRate,
    type ExchangePagination,
    SubaccountTransfer,
    SpotLimitOrder,
    SpotOrderHistory,
    SpotTrade,
    type AtomicSwap,
    MsgAdminUpdateBinaryOptionsMarket,
    MsgBatchCancelBinaryOptionsOrders,
    MsgBatchCancelDerivativeOrders,
    MsgBatchCancelSpotOrders,
    MsgBatchUpdateOrders,
    MsgCancelBinaryOptionsOrder,
    MsgCancelDerivativeOrder,
    MsgCancelSpotOrder,
    MsgCreateBinaryOptionsLimitOrder,
    MsgCreateBinaryOptionsMarketOrder,
    MsgCreateDerivativeLimitOrder,
    MsgCreateDerivativeMarketOrder,
    MsgCreateSpotLimitOrder,
    MsgCreateSpotMarketOrder,
    MsgDeposit,
    MsgIncreasePositionMargin,
    MsgInstantSpotMarketLaunch,
    MsgLiquidatePosition,
    MsgReclaimLockedFunds,
    MsgRewardsOptOut,
    MsgSignData,
    MsgWithdraw,
    MsgExternalTransfer,
} from "@injectivelabs/sdk-ts";
import type * as ExchangeTypes from "../types/exchange";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

/**
 * Exchange Module Chain GRPC Async Functions with Error Handling
 */

/**
 * Fetches the exchange module parameters.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetModuleParamsParams} [params] - Optional parameters to filter module parameters.
 * @returns {Promise<StandardResponse>} The standard response containing module parameters or an error.
 */
export async function getModuleParams(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetModuleParamsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcExchangeApi.fetchModuleParams();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getModuleParamsError", err);
    }
}

/**
 * Fetches the current state of the exchange module.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetModuleStateParams} [params] - Optional parameters to filter module state.
 * @returns {Promise<StandardResponse>} The standard response containing module state or an error.
 */
export async function getModuleState(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetModuleStateParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcExchangeApi.fetchModuleState();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getModuleStateError", err);
    }
}

/**
 * Fetches the fee discount schedule.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetFeeDiscountScheduleParams} [params] - Optional parameters to filter fee discount schedule.
 * @returns {Promise<StandardResponse>} The standard response containing fee discount schedule or an error.
 */
export async function getFeeDiscountSchedule(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetFeeDiscountScheduleParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcExchangeApi.fetchFeeDiscountSchedule();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getFeeDiscountScheduleError", err);
    }
}

/**
 * Fetches the fee discount account information for a specific Injective address.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetFeeDiscountAccountInfoParams} params - Parameters including the Injective address.
 * @returns {Promise<StandardResponse>} The standard response containing fee discount account info or an error.
 */
export async function getFeeDiscountAccountInfo(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetFeeDiscountAccountInfoParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcExchangeApi.fetchFeeDiscountAccountInfo(
                params.injAddress
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getFeeDiscountAccountInfoError", err);
    }
}

/**
 * Fetches the trading rewards campaign details.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetTradingRewardsCampaignParams} [params] - Optional parameters to filter trading rewards campaign.
 * @returns {Promise<StandardResponse>} The standard response containing trading rewards campaign details or an error.
 */
export async function getTradingRewardsCampaign(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetTradingRewardsCampaignParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcExchangeApi.fetchTradingRewardsCampaign();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getTradingRewardsCampaignError", err);
    }
}

/**
 * Fetches the trade reward points for specified Injective addresses.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetTradeRewardPointsParams} params - Parameters including Injective addresses.
 * @returns {Promise<StandardResponse>} The standard response containing trade reward points or an error.
 */
export async function getTradeRewardPoints(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetTradeRewardPointsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcExchangeApi.fetchTradeRewardPoints(
            params.injectiveAddresses
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getTradeRewardPointsError", err);
    }
}

/**
 * Fetches the pending trade reward points for specified Injective addresses.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetPendingTradeRewardPointsParams} params - Parameters including Injective addresses.
 * @returns {Promise<StandardResponse>} The standard response containing pending trade reward points or an error.
 */
export async function getPendingTradeRewardPoints(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetPendingTradeRewardPointsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcExchangeApi.fetchPendingTradeRewardPoints(
                params.injectiveAddresses
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPendingTradeRewardPointsError", err);
    }
}

/**
 * Fetches the exchange positions based on provided parameters.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.getPositionsParams} [params] - Optional parameters to filter exchange positions.
 * @returns {Promise<StandardResponse>} The standard response containing exchange positions or an error.
 */
export async function getExchangePositions(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetExchangePositionsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcExchangeApi.fetchPositions();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPositionsError", err);
    }
}

/**
 * Fetches the trade nonce for a specific subaccount.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSubaccountTradeNonceParams} params - Parameters including the subaccount ID.
 * @returns {Promise<StandardResponse>} The standard response containing trade nonce or an error.
 */
export async function getSubaccountTradeNonce(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetSubaccountTradeNonceParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcExchangeApi.fetchSubaccountTradeNonce(
                params.subaccountId
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSubaccountTradeNonceError", err);
    }
}

/**
 * Checks if an account is opted out of rewards.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetIsOptedOutOfRewardsParams} params - Parameters including the account address.
 * @returns {Promise<StandardResponse>} The standard response indicating opt-out status or an error.
 */
export async function getIsOptedOutOfRewards(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetIsOptedOutOfRewardsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcExchangeApi.fetchIsOptedOutOfRewards(
            params.account
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getIsOptedOutOfRewardsError", err);
    }
}

/**
 * Fetches all derivative markets.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetDerivativeMarketsParams} [params] - Optional parameters to filter derivative markets.
 * @returns {Promise<StandardResponse>} The standard response containing derivative markets or an error.
 */
export async function getDerivativeMarkets(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetDerivativeMarketsParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcDerivativesApi.fetchMarkets(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDerivativeMarketsError", err);
    }
}

/**
 * Fetches a specific derivative market by its ID.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetDerivativeMarketParams} params - Parameters including the market ID.
 * @returns {Promise<StandardResponse>} The standard response containing derivative market details or an error.
 */
export async function getDerivativeMarket(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetDerivativeMarketParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcDerivativesApi.fetchMarket(
            params.marketId
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDerivativeMarketError", err);
    }
}

/**
 * Fetches all binary options markets.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetBinaryOptionsMarketsParams} [params] - Optional parameters to filter binary options markets.
 * @returns {Promise<StandardResponse>} The standard response containing binary options markets or an error.
 */
export async function getBinaryOptionsMarkets(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetBinaryOptionsMarketsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcDerivativesApi.fetchBinaryOptionsMarkets(
                params || {}
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getBinaryOptionsMarketsError", err);
    }
}

/**
 * Fetches a specific binary options market by its ID.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetBinaryOptionsMarketParams} params - Parameters including the market ID.
 * @returns {Promise<StandardResponse>} The standard response containing binary options market details or an error.
 */
export async function getBinaryOptionsMarket(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetBinaryOptionsMarketParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcDerivativesApi.fetchBinaryOptionsMarket(
                params.marketId
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getBinaryOptionsMarketError", err);
    }
}

/**
 * Fetches all derivative orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetDerivativeOrdersParams} [params] - Optional parameters to filter derivative orders.
 * @returns {Promise<StandardResponse>} The standard response containing derivative orders or an error.
 */
export async function getDerivativeOrders(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetDerivativeOrdersParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcDerivativesApi.fetchOrders(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDerivativeOrdersError", err);
    }
}

/**
 * Fetches the history of derivative orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetDerivativeOrderHistoryParams} [params] - Optional parameters to filter derivative order history.
 * @returns {Promise<StandardResponse>} The standard response containing derivative order history or an error.
 */
export async function getDerivativeOrderHistory(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetDerivativeOrderHistoryParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcDerivativesApi.fetchOrderHistory(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDerivativeOrderHistoryError", err);
    }
}

/**
 * Fetches all positions.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetPositionsParams} [params] - Optional parameters to filter positions.
 * @returns {Promise<StandardResponse>} The standard response containing positions or an error.
 */
export async function getPositionsList(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetPositionsParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcDerivativesApi.fetchPositions(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPositionsListError", err);
    }
}

/**
 * Fetches all positions version 2.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetPositionsV2Params} [params] - Optional parameters to filter positions version 2.
 * @returns {Promise<StandardResponse>} The standard response containing positions version 2 or an error.
 */
export async function getPositionsV2(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetPositionsV2Params
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcDerivativesApi.fetchPositionsV2(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPositionsV2Error", err);
    }
}

/**
 * Fetches all derivative trades.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetDerivativeTradesParams} [params] - Optional parameters to filter derivative trades.
 * @returns {Promise<StandardResponse>} The standard response containing derivative trades or an error.
 */
export async function getDerivativeTrades(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetDerivativeTradesParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcDerivativesApi.fetchTrades(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDerivativeTradesError", err);
    }
}

/**
 * Fetches all funding payments.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetFundingPaymentsParams} [params] - Optional parameters to filter funding payments.
 * @returns {Promise<StandardResponse>} The standard response containing funding payments or an error.
 */
export async function getFundingPayments(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetFundingPaymentsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcDerivativesApi.fetchFundingPayments(
                params || {}
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getFundingPaymentsError", err);
    }
}

/**
 * Fetches all funding rates.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetFundingRatesParams} [params] - Optional parameters to filter funding rates.
 * @returns {Promise<StandardResponse>} The standard response containing funding rates or an error.
 */
export async function getFundingRates(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetFundingRatesParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcDerivativesApi.fetchFundingRates(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getFundingRatesError", err);
    }
}

/**
 * Fetches the list of derivative subaccount orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetDerivativeSubaccountOrdersListParams} [params] - Optional parameters to filter subaccount orders.
 * @returns {Promise<StandardResponse>} The standard response containing subaccount orders or an error.
 */
export async function getDerivativeSubaccountOrdersList(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetDerivativeSubaccountOrdersListParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcDerivativesApi.fetchSubaccountOrdersList(
                params || {}
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "getDerivativeSubaccountOrdersListError",
            err
        );
    }
}

/**
 * Fetches the list of derivative subaccount trades.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetDerivativeSubaccountTradesListParams} params - Parameters to filter subaccount trades.
 * @returns {Promise<StandardResponse>} The standard response containing subaccount trades or an error.
 */
export async function getDerivativeSubaccountTradesList(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetDerivativeSubaccountTradesListParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcDerivativesApi.fetchSubaccountTradesList(
                params
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "getDerivativeSubaccountTradesListError",
            err
        );
    }
}

/**
 * Fetches the orderbooks version 2 for specified market IDs.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetDerivativeOrderbooksV2Params} params - Parameters including market IDs.
 * @returns {Promise<{
 *   marketId: string;
 *   orderbook: OrderbookWithSequence;
 * }[] | StandardResponse>} The standard response containing orderbooks or an error.
 */
export async function getDerivativeOrderbooksV2(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetDerivativeOrderbooksV2Params
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcDerivativesApi.fetchOrderbooksV2(
            params.marketIds
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDerivativeOrderbooksV2Error", err);
    }
}

/**
 * Fetches the orderbook version 2 for a specific market ID.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetDerivativeOrderbookV2Params} params - Parameters including the market ID.
 * @returns {Promise<StandardResponse>} The standard response containing the orderbook or an error.
 */
export async function getDerivativeOrderbookV2(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetDerivativeOrderbookV2Params
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcDerivativesApi.fetchOrderbookV2(
            params.marketId
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDerivativeOrderbookV2Error", err);
    }
}

/**
 * Fetches the rewards for specified Injective addresses.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetRewardsParams} params - Parameters including Injective addresses.
 * @returns {Promise<StandardResponse>} The standard response containing rewards or an error.
 */
export async function getRewards(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetRewardsParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcAccountApi.fetchRewards(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getRewardsError", err);
    }
}

/**
 * Fetches the list of subaccounts for a specific address.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSubaccountsListParams} params - Parameters including the account address.
 * @returns {Promise<StandardResponse>} The standard response containing subaccounts list or an error.
 */
export async function getSubaccountsList(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetSubaccountsListParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcAccountApi.fetchSubaccountsList(
            params.address
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSubaccountsListError", err);
    }
}

/**
 * Fetches the balances list for a specific subaccount.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSubaccountBalancesListParams} params - Parameters including the subaccount ID.
 * @returns {Promise<StandardResponse>} The standard response containing subaccount balances list or an error.
 */
export async function getSubaccountBalancesList(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetSubaccountBalancesListParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcAccountApi.fetchSubaccountBalancesList(
                params.subaccountId
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSubaccountBalancesListError", err);
    }
}

/**
 * Fetches the history of a specific subaccount.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSubaccountHistoryParams} params - Parameters including subaccount details.
 * @returns {Promise<StandardResponse>} The standard response containing subaccount history or an error.
 */
export async function getSubaccountHistory(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetSubaccountHistoryParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcAccountApi.fetchSubaccountHistory(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSubaccountHistoryError", err);
    }
}

/**
 * Fetches the order summary for a specific subaccount.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSubaccountOrderSummaryParams} params - Parameters including subaccount details.
 * @returns {Promise<StandardResponse>} The standard response containing subaccount order summary or an error.
 */
export async function getSubaccountOrderSummary(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetSubaccountOrderSummaryParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcAccountApi.fetchSubaccountOrderSummary(
                params
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSubaccountOrderSummaryError", err);
    }
}

/**
 * Fetches the states of orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetOrderStatesParams} [params] - Optional parameters to filter order states.
 * @returns {Promise<StandardResponse>} The standard response containing order states or an error.
 */
export async function getOrderStates(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetOrderStatesParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcAccountApi.fetchOrderStates(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getOrderStatesError", err);
    }
}

/**
 * Fetches the account portfolio for a specific address.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetAccountPortfolioParams} params - Parameters including the account address.
 * @returns {Promise<StandardResponse>} The standard response containing account portfolio or an error.
 */
export async function getAccountPortfolio(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetAccountPortfolioParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcAccountPortfolioApi.fetchAccountPortfolio(
                params.address
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAccountPortfolioError", err);
    }
}

/**
 * Fetches the balances of the account portfolio for a specific address.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetAccountPortfolioBalancesParams} params - Parameters including the account address.
 * @returns {Promise<StandardResponse>} The standard response containing account portfolio balances or an error.
 */
export async function getAccountPortfolioBalances(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetAccountPortfolioBalancesParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcAccountPortfolioApi.fetchAccountPortfolioBalances(
                params.address
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAccountPortfolioBalancesError", err);
    }
}

/**
 * Fetches all spot markets.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSpotMarketsParams} [params] - Optional parameters to filter spot markets.
 * @returns {Promise<StandardResponse>} The standard response containing spot markets or an error.
 */
export async function getSpotMarkets(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetSpotMarketsParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcSpotApi.fetchMarkets(params || {});
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSpotMarketsError", err);
    }
}

/**
 * Fetches a specific spot market by its ID.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSpotMarketParams} params - Parameters including the market ID.
 * @returns {Promise<StandardResponse>} The standard response containing spot market details or an error.
 */
export async function getSpotMarket(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetSpotMarketParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcSpotApi.fetchMarket(
            params.marketId
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSpotMarketError", err);
    }
}

/**
 * Fetches all spot orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSpotOrdersParams} [params] - Optional parameters to filter spot orders.
 * @returns {Promise<StandardResponse>} The standard response containing spot orders or an error.
 */
export async function getSpotOrders(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetSpotOrdersParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcSpotApi.fetchOrders(params || {});
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSpotOrdersError", err);
    }
}

/**
 * Fetches the history of spot orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSpotOrderHistoryParams} [params] - Optional parameters to filter spot order history.
 * @returns {Promise<StandardResponse>} The standard response containing spot order history or an error.
 */
export async function getSpotOrderHistory(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetSpotOrderHistoryParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcSpotApi.fetchOrderHistory(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSpotOrderHistoryError", err);
    }
}

/**
 * Fetches all spot trades.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSpotTradesParams} [params] - Optional parameters to filter spot trades.
 * @returns {Promise<StandardResponse>} The standard response containing spot trades or an error.
 */
export async function getSpotTrades(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetSpotTradesParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcSpotApi.fetchTrades(params || {});
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSpotTradesError", err);
    }
}

/**
 * Fetches the list of spot subaccount orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSpotSubaccountOrdersListParams} [params] - Optional parameters to filter spot subaccount orders.
 * @returns {Promise<StandardResponse>} The standard response containing spot subaccount orders or an error.
 */
export async function getSpotSubaccountOrdersList(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetSpotSubaccountOrdersListParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcSpotApi.fetchSubaccountOrdersList(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSpotSubaccountOrdersListError", err);
    }
}

/**
 * Fetches the list of spot subaccount trades.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSpotSubaccountTradesListParams} [params] - Optional parameters to filter spot subaccount trades.
 * @returns {Promise<StandardResponse>} The standard response containing spot subaccount trades or an error.
 */
export async function getSpotSubaccountTradesList(
    this: InjectiveGrpcBase,
    params?: ExchangeTypes.GetSpotSubaccountTradesListParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcSpotApi.fetchSubaccountTradesList(
            params || {}
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSpotSubaccountTradesListError", err);
    }
}

/**
 * Fetches the orderbooks version 2 for specified spot market IDs.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSpotOrderbooksV2Params} params - Parameters including spot market IDs.
 * @returns {Promise<StandardResponse>} The standard response containing spot orderbooks or an error.
 */
export async function getSpotOrderbooksV2(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetSpotOrderbooksV2Params
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcSpotApi.fetchOrderbooksV2(
            params.marketIds
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSpotOrderbooksV2Error", err);
    }
}

/**
 * Fetches the orderbook version 2 for a specific spot market ID.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetSpotOrderbookV2Params} params - Parameters including the spot market ID.
 * @returns {Promise<StandardResponse>} The standard response containing the spot orderbook or an error.
 */
export async function getSpotOrderbookV2(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetSpotOrderbookV2Params
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcSpotApi.fetchOrderbookV2(
            params.marketId
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSpotOrderbookV2Error", err);
    }
}

/**
 * Fetches the atomic swap history.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetAtomicSwapHistoryParams} params - Parameters to filter atomic swap history.
 * @returns {Promise<StandardResponse>} The standard response containing atomic swap history or an error.
 */
export async function getAtomicSwapHistory(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetAtomicSwapHistoryParams
): Promise<
    | {
          swapHistory: AtomicSwap[];
          pagination: ExchangePagination;
      }
    | StandardResponse
> {
    try {
        const result =
            await this.indexerGrpcSpotApi.fetchAtomicSwapHistory(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAtomicSwapHistoryError", err);
    }
}

/**
 * Fetches all grid strategies.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetGridStrategiesParams} params - Parameters to filter grid strategies.
 * @returns {Promise<StandardResponse>} The standard response containing grid strategies or an error.
 */
export async function getGridStrategies(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetGridStrategiesParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcTradingApi.fetchGridStrategies(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getGridStrategiesError", err);
    }
}

/**
 * Fetches the historical balance.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetHistoricalBalanceParams} params - Parameters to filter historical balance.
 * @returns {Promise<StandardResponse>} The standard response containing historical balance or an error.
 */
export async function getHistoricalBalance(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetHistoricalBalanceParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcArchiverApi.fetchHistoricalBalance(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getHistoricalBalanceError", err);
    }
}

/**
 * Fetches the historical realized PnL (Rpnl).
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetHistoricalRpnlParams} params - Parameters to filter historical Rpnl.
 * @returns {Promise<StandardResponse>} The standard response containing historical Rpnl or an error.
 */
export async function getHistoricalRpnl(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetHistoricalRpnlParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcArchiverApi.fetchHistoricalRpnl(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getHistoricalRpnlError", err);
    }
}

/**
 * Fetches the historical trading volumes.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetHistoricalVolumesParams} params - Parameters to filter historical volumes.
 * @returns {Promise<StandardResponse>} The standard response containing historical volumes or an error.
 */
export async function getHistoricalVolumes(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetHistoricalVolumesParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcArchiverApi.fetchHistoricalVolumes(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getHistoricalVolumesError", err);
    }
}

/**
 * Fetches the PnL leaderboard.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetPnlLeaderboardParams} params - Parameters to filter PnL leaderboard.
 * @returns {Promise<StandardResponse>} The standard response containing PnL leaderboard or an error.
 */
export async function getPnlLeaderboard(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetPnlLeaderboardParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcArchiverApi.fetchPnlLeaderboard(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPnlLeaderboardError", err);
    }
}

/**
 * Fetches the volume leaderboard.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetVolLeaderboardParams} params - Parameters to filter volume leaderboard.
 * @returns {Promise<StandardResponse>} The standard response containing volume leaderboard or an error.
 */
export async function getVolLeaderboard(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetVolLeaderboardParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcArchiverApi.fetchVolLeaderboard(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getVolLeaderboardError", err);
    }
}

/**
 * Fetches the PnL leaderboard with fixed resolution.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetPnlLeaderboardFixedResolutionParams} params - Parameters to filter PnL leaderboard with fixed resolution.
 * @returns {Promise<StandardResponse>} The standard response containing PnL leaderboard with fixed resolution or an error.
 */
export async function getPnlLeaderboardFixedResolution(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetPnlLeaderboardFixedResolutionParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcArchiverApi.fetchPnlLeaderboardFixedResolution(
                params
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "getPnlLeaderboardFixedResolutionError",
            err
        );
    }
}

/**
 * Fetches the volume leaderboard with fixed resolution.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetVolLeaderboardFixedResolutionParams} params - Parameters to filter volume leaderboard with fixed resolution.
 * @returns {Promise<StandardResponse>} The standard response containing volume leaderboard with fixed resolution or an error.
 */
export async function getVolLeaderboardFixedResolution(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetVolLeaderboardFixedResolutionParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcArchiverApi.fetchVolLeaderboardFixedResolution(
                params
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "getVolLeaderboardFixedResolutionError",
            err
        );
    }
}

/**
 * Fetches the holders of a specific denomination.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.GetDenomHoldersParams} params - Parameters including the denomination.
 * @returns {Promise<StandardResponse>} The standard response containing denomination holders or an error.
 */
export async function getDenomHolders(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.GetDenomHoldersParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcArchiverApi.fetchDenomHolders(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDenomHoldersError", err);
    }
}

/**
 * Broadcasts a message to update a binary options market as an admin.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgAdminUpdateBinaryOptionsMarketParams} params - Parameters to update the binary options market.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgAdminUpdateBinaryOptionsMarket(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgAdminUpdateBinaryOptionsMarketParams
): Promise<StandardResponse> {
    try {
        const msg = MsgAdminUpdateBinaryOptionsMarket.fromJSON({ ...params });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "msgAdminUpdateBinaryOptionsMarketError",
            err
        );
    }
}

/**
 * Broadcasts a message to batch cancel binary options orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgBatchCancelBinaryOptionsOrdersParams} params - Parameters to batch cancel binary options orders.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgBatchCancelBinaryOptionsOrders(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgBatchCancelBinaryOptionsOrdersParams
): Promise<StandardResponse> {
    try {
        const msg = MsgBatchCancelBinaryOptionsOrders.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "msgBatchCancelBinaryOptionsOrdersError",
            err
        );
    }
}

/**
 * Broadcasts a message to batch cancel derivative orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgBatchCancelDerivativeOrdersParams} params - Parameters to batch cancel derivative orders.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgBatchCancelDerivativeOrders(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgBatchCancelDerivativeOrdersParams
): Promise<StandardResponse> {
    try {
        const msg = MsgBatchCancelDerivativeOrders.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgBatchCancelDerivativeOrdersError", err);
    }
}

/**
 * Broadcasts a message to batch cancel spot orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgBatchCancelSpotOrdersParams} params - Parameters to batch cancel spot orders.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgBatchCancelSpotOrders(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgBatchCancelSpotOrdersParams
): Promise<StandardResponse> {
    try {
        const msg = MsgBatchCancelSpotOrders.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgBatchCancelSpotOrdersError", err);
    }
}

/**
 * Broadcasts a message to batch update orders.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgBatchUpdateOrdersParams} params - Parameters to batch update orders.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgBatchUpdateOrders(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgBatchUpdateOrdersParams
): Promise<StandardResponse> {
    try {
        const msg = MsgBatchUpdateOrders.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgBatchUpdateOrdersError", err);
    }
}

/**
 * Broadcasts a message to cancel a binary options order.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgCancelBinaryOptionsOrderParams} params - Parameters to cancel a binary options order.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCancelBinaryOptionsOrder(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgCancelBinaryOptionsOrderParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCancelBinaryOptionsOrder.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCancelBinaryOptionsOrderError", err);
    }
}

/**
 * Broadcasts a message to cancel a derivative order.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgCancelDerivativeOrderParams} params - Parameters to cancel a derivative order.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCancelDerivativeOrder(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgCancelDerivativeOrderParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCancelDerivativeOrder.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCancelDerivativeOrderError", err);
    }
}

/**
 * Broadcasts a message to cancel a spot order.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgCancelSpotOrderParams} params - Parameters to cancel a spot order.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCancelSpotOrder(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgCancelSpotOrderParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCancelSpotOrder.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCancelSpotOrderError", err);
    }
}

/**
 * Broadcasts a message to create a binary options limit order.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgCreateBinaryOptionsLimitOrderParams} params - Parameters to create a binary options limit order.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCreateBinaryOptionsLimitOrder(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgCreateBinaryOptionsLimitOrderParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCreateBinaryOptionsLimitOrder.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "msgCreateBinaryOptionsLimitOrderError",
            err
        );
    }
}

/**
 * Broadcasts a message to create a binary options market order.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgCreateBinaryOptionsMarketOrderParams} params - Parameters to create a binary options market order.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCreateBinaryOptionsMarketOrder(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgCreateBinaryOptionsMarketOrderParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCreateBinaryOptionsMarketOrder.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "msgCreateBinaryOptionsMarketOrderError",
            err
        );
    }
}

/**
 * Broadcasts a message to create a derivative limit order.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgCreateDerivativeLimitOrderParams} params - Parameters to create a derivative limit order.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCreateDerivativeLimitOrder(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgCreateDerivativeLimitOrderParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCreateDerivativeLimitOrder.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCreateDerivativeLimitOrderError", err);
    }
}

/**
 * Broadcasts a message to create a derivative market order.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgCreateDerivativeMarketOrderParams} params - Parameters to create a derivative market order.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCreateDerivativeMarketOrder(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgCreateDerivativeMarketOrderParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCreateDerivativeMarketOrder.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCreateDerivativeMarketOrderError", err);
    }
}

/**
 * Broadcasts a message to create a spot limit order.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgCreateSpotLimitOrderParams} params - Parameters to create a spot limit order.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCreateSpotLimitOrder(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgCreateSpotLimitOrderParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCreateSpotLimitOrder.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCreateSpotLimitOrderError", err);
    }
}

/**
 * Broadcasts a message to create a spot market order.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgCreateSpotMarketOrderParams} params - Parameters to create a spot market order.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCreateSpotMarketOrder(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgCreateSpotMarketOrderParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCreateSpotMarketOrder.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCreateSpotMarketOrderError", err);
    }
}

/**
 * Broadcasts a message to deposit funds.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgDepositParams} params - Parameters to deposit funds.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgDeposit(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgDepositParams
): Promise<StandardResponse> {
    try {
        const msg = MsgDeposit.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgDepositError", err);
    }
}

/**
 * Broadcasts a message to perform an external transfer.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgExternalTransferParams} params - Parameters to perform an external transfer.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgExternalTransfer(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgExternalTransferParams
): Promise<StandardResponse> {
    try {
        const msg = MsgExternalTransfer.fromJSON({
            ...params,
            amount: params.totalAmount,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgExternalTransferError", err);
    }
}

/**
 * Broadcasts a message to increase position margin.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgIncreasePositionMarginParams} params - Parameters to increase position margin.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgIncreasePositionMargin(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgIncreasePositionMarginParams
): Promise<StandardResponse> {
    try {
        const msg = MsgIncreasePositionMargin.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgIncreasePositionMarginError", err);
    }
}

/**
 * Broadcasts a message to instantly launch a spot market.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgInstantSpotMarketLaunchParams} params - Parameters to instantly launch a spot market.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgInstantSpotMarketLaunch(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgInstantSpotMarketLaunchParams
): Promise<StandardResponse> {
    try {
        const msg = MsgInstantSpotMarketLaunch.fromJSON({ ...params });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgInstantSpotMarketLaunchError", err);
    }
}

/**
 * Broadcasts a message to liquidate a position.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgLiquidatePositionParams} params - Parameters to liquidate a position.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgLiquidatePosition(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgLiquidatePositionParams
): Promise<StandardResponse> {
    try {
        const msg = MsgLiquidatePosition.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgLiquidatePositionError", err);
    }
}

/**
 * Broadcasts a message to reclaim locked funds.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgReclaimLockedFundsParams} params - Parameters to reclaim locked funds.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgReclaimLockedFunds(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgReclaimLockedFundsParams
): Promise<StandardResponse> {
    try {
        const msg = MsgReclaimLockedFunds.fromJSON({ ...params });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgReclaimLockedFundsError", err);
    }
}

/**
 * Broadcasts a message to opt out of rewards.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgRewardsOptOutParams} params - Parameters to opt out of rewards.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgRewardsOptOut(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgRewardsOptOutParams
): Promise<StandardResponse> {
    try {
        const msg = MsgRewardsOptOut.fromJSON({ ...params });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgRewardsOptOutError", err);
    }
}

/**
 * Broadcasts a message to sign data.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgSignDataParams} params - Parameters to sign data.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgSignData(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgSignDataParams
): Promise<StandardResponse> {
    try {
        const msg = MsgSignData.fromJSON({ ...params });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgSignDataError", err);
    }
}

/**
 * Broadcasts a message to withdraw funds.
 *
 * @this InjectiveGrpcBase
 * @param {ExchangeTypes.MsgWithdrawParams} params - Parameters to withdraw funds.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgWithdraw(
    this: InjectiveGrpcBase,
    params: ExchangeTypes.MsgWithdrawParams
): Promise<StandardResponse> {
    try {
        const msg = MsgWithdraw.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgWithdrawError", err);
    }
}
