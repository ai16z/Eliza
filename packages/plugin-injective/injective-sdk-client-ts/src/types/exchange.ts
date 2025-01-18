import type {
    PaginationOption,
    TradeDirection,
    TradeExecutionType,
    TradeExecutionSide,
    GrpcMarketStatus,
    MarketType,
    GridStrategyType,
} from "@injectivelabs/sdk-ts";
import type { PaginationParams, TimeRangeParams } from "./base";
import type {
    InjectiveExchangeV1Beta1Exchange,
    InjectiveOracleV1Beta1Oracle,
} from "@injectivelabs/core-proto-ts";
import type { OrderSide, OrderState } from "@injectivelabs/ts-types";

export interface MarketIdParam {
    marketId: string;
}

export interface SubaccountIdParam {
    subaccountId: string;
}
// Exchange Module
// Start of Get Exchange Module Params
export type GetModuleParamsParams = {}

export type GetModuleStateParams = {}

export type GetFeeDiscountScheduleParams = {}

export interface GetFeeDiscountAccountInfoParams {
    injAddress: string;
}

export type GetTradingRewardsCampaignParams = {}

export interface GetTradeRewardPointsParams {
    injectiveAddresses: string[];
}

export interface GetPendingTradeRewardPointsParams {
    injectiveAddresses: string[];
}

export type GetExchangePositionsParams = {}

export interface GetSubaccountTradeNonceParams {
    subaccountId: string;
}

export interface GetIsOptedOutOfRewardsParams {
    account: string;
}

export interface GetDerivativeMarketsParams {
    quoteDenom?: string;
    marketStatus?: string;
    marketStatuses?: string[];
}

export interface GetDerivativeMarketParams {
    marketId: string;
}

export interface GetBinaryOptionsMarketsParams {
    marketStatus?: string;
    quoteDenom?: string;
    pagination?: PaginationOption;
}

export interface GetBinaryOptionsMarketParams {
    marketId: string;
}

export interface GetDerivativeOrdersParams {
    marketId?: string;
    marketIds?: string[];
    orderSide?: OrderSide;
    isConditional?: boolean;
    subaccountId?: string;
    pagination?: PaginationOption;
}

export interface GetDerivativeOrderHistoryParams {
    subaccountId?: string;
    marketId?: string;
    marketIds?: string[];
    orderTypes?: OrderSide[];
    executionTypes?: TradeExecutionType[];
    direction?: TradeDirection;
    isConditional?: boolean;
    state?: OrderState;
    pagination?: PaginationOption;
}

export interface GetPositionsParams {
    marketId?: string;
    marketIds?: string[];
    subaccountId?: string;
    direction?: TradeDirection;
    pagination?: PaginationOption;
}

export interface GetPositionsV2Params {
    address?: string;
    marketId?: string;
    marketIds?: string[];
    subaccountId?: string;
    direction?: TradeDirection;
    pagination?: PaginationOption;
}

export interface GetDerivativeTradesParams {
    endTime?: number;
    tradeId?: string;
    marketId?: string;
    startTime?: number;
    marketIds?: string[];
    subaccountId?: string;
    accountAddress?: string;
    direction?: TradeDirection;
    pagination?: PaginationOption;
    executionSide?: TradeExecutionSide;
    executionTypes?: TradeExecutionType[];
}

export interface GetFundingPaymentsParams {
    marketId?: string;
    marketIds?: string[];
    subaccountId?: string;
    pagination?: PaginationOption;
}

export interface GetFundingRatesParams {
    marketId?: string;
    pagination?: PaginationOption;
}

export interface GetDerivativeSubaccountOrdersListParams {
    marketId?: string;
    subaccountId?: string;
    pagination?: PaginationOption;
}

export interface GetDerivativeSubaccountTradesListParams {
    marketId?: string;
    subaccountId?: string;
    direction?: TradeDirection;
    executionType?: TradeExecutionType;
    pagination?: PaginationOption;
}

export interface GetDerivativeOrderbooksV2Params {
    marketIds: string[];
}

export interface GetDerivativeOrderbookV2Params {
    marketId: string;
}

export interface GetRewardsParams {
    address: string;
    epoch: number;
}

export interface GetSubaccountsListParams {
    address: string;
}

export interface GetSubaccountBalancesListParams {
    subaccountId: string;
}

export interface GetSubaccountHistoryParams {
    subaccountId: string;
    denom?: string;
    transferTypes?: string[];
    pagination?: PaginationOption;
}

export interface GetSubaccountOrderSummaryParams {
    subaccountId: string;
    marketId?: string;
    orderDirection?: string;
}

export interface GetOrderStatesParams {
    spotOrderHashes?: string[];
    derivativeOrderHashes?: string[];
}

export interface GetAccountPortfolioParams {
    address: string;
}

export interface GetAccountPortfolioBalancesParams {
    address: string;
}

export interface GetSpotMarketsParams {
    baseDenom?: string;
    marketStatus?: string;
    quoteDenom?: string;
    marketStatuses?: string[];
}

export interface GetSpotMarketParams {
    marketId: string;
}

export interface GetSpotOrdersParams {
    marketId?: string;
    marketIds?: string[];
    subaccountId?: string;
    orderSide?: OrderSide;
    isConditional?: boolean;
    pagination?: PaginationOption;
}

export interface GetSpotOrderHistoryParams {
    subaccountId?: string;
    marketId?: string;
    marketIds?: string[];
    orderTypes?: OrderSide[];
    executionTypes?: TradeExecutionType[];
    direction?: TradeDirection;
    isConditional?: boolean;
    state?: OrderState;
    pagination?: PaginationOption;
}

export interface GetSpotTradesParams {
    endTime?: number;
    tradeId?: string;
    marketId?: string;
    startTime?: number;
    marketIds?: string[];
    subaccountId?: string;
    accountAddress?: string;
    direction?: TradeDirection;
    pagination?: PaginationOption;
    executionSide?: TradeExecutionSide;
    executionTypes?: TradeExecutionType[];
}

export interface GetSpotSubaccountOrdersListParams {
    subaccountId?: string;
    marketId?: string;
    pagination?: PaginationOption;
}

export interface GetSpotSubaccountTradesListParams {
    subaccountId?: string;
    marketId?: string;
    direction?: TradeDirection;
    executionType?: TradeExecutionType;
    pagination?: PaginationOption;
}

export interface GetSpotOrderbooksV2Params {
    marketIds: string[];
}

export interface GetSpotOrderbookV2Params {
    marketId: string;
}

export interface GetAtomicSwapHistoryParams {
    address: string;
    contractAddress: string;
    pagination?: PaginationOption;
}

export interface GetGridStrategiesParams {
    accountAddress?: string;
    subaccountId?: string;
    state?: string;
    marketId?: string;
    limit?: number;
    skip?: number;
    marketType?: MarketType;
    strategyType?: GridStrategyType[];
}

export interface GetHistoricalBalanceParams {
    account: string;
    resolution: string;
}

export interface GetHistoricalRpnlParams {
    account: string;
    resolution: string;
}

export interface GetHistoricalVolumesParams {
    account: string;
    resolution: string;
}

export interface GetPnlLeaderboardParams {
    startDate: string;
    endDate: string;
    limit?: number;
    account?: string;
}

export interface GetVolLeaderboardParams {
    startDate: string;
    endDate: string;
    limit?: number;
    account?: string;
}

export interface GetPnlLeaderboardFixedResolutionParams {
    resolution: string;
    limit?: number;
    account?: string;
}

export interface GetVolLeaderboardFixedResolutionParams {
    resolution: string;
    limit?: number;
    account?: string;
}

export interface GetDenomHoldersParams {
    denom: string;
    token?: string;
    limit?: number;
}
export interface MarketParams extends PaginationParams {
    baseDenom?: string;
    quoteDenom?: string;
    marketStatus?: string;
    marketStatuses?: string[];
}

export interface OrderParams extends PaginationParams {
    marketId?: string;
    marketIds?: string[];
    subaccountId?: string;
    orderSide?: OrderSide;
    isConditional?: boolean;
}

export interface OrderHistoryParams extends PaginationParams {
    subaccountId?: string;
    marketId?: string;
    marketIds?: string[];
    orderTypes?: OrderSide[];
    executionTypes?: TradeExecutionType[];
    direction?: TradeDirection;
    isConditional?: boolean;
    state?: OrderState;
}

export interface PositionParams extends PaginationParams {
    marketId?: string;
    marketIds?: string[];
    subaccountId?: string;
    direction?: TradeDirection;
    address?: string;
}

export interface TradeParams extends TimeRangeParams, PaginationParams {
    tradeId?: string;
    marketId?: string;
    marketIds?: string[];
    subaccountId?: string;
    accountAddress?: string;
    direction?: TradeDirection;
    executionSide?: TradeExecutionSide;
    executionTypes?: TradeExecutionType[];
}

export interface FundingParams extends PaginationParams {
    marketId?: string;
    marketIds?: string[];
    subaccountId?: string;
}

export interface SubaccountOrderParams extends PaginationParams {
    marketId?: string;
    subaccountId?: string;
}

export interface SubaccountTradeParams extends SubaccountOrderParams {
    direction?: TradeDirection;
    executionType?: TradeExecutionType;
}

export interface SubaccountHistoryParams extends SubaccountIdParam {
    denom?: string;
    transferTypes?: string[];
    pagination?: PaginationOption;
}

export interface SubaccountOrderSummaryParams extends SubaccountIdParam {
    marketId?: string;
    orderDirection?: string;
}

export interface OrderStateParams {
    spotOrderHashes?: string[];
    derivativeOrderHashes?: string[];
}

export interface GetSpotOrderbookV2Params {
    marketId: string;
}

export interface MsgAdminUpdateBinaryOptionsMarketParams {
    sender: string;
    marketId: string;
    settlementPrice: string;
    expirationTimestamp: string;
    settlementTimestamp: string;
    status: GrpcMarketStatus;
}

export interface MsgAuthorizeStakeGrantsParams {
    grantee: string;
    amount: string;
}

export interface MsgBatchCancelBinaryOptionsOrdersParams {
    orders: {
        marketId: string;
        subaccountId: string;
        orderHash?: string;
        orderMask?: InjectiveExchangeV1Beta1Exchange.OrderMask;
        cid?: string;
    }[];
}

export interface MsgBatchCancelDerivativeOrdersParams {
    orders: {
        marketId: string;
        subaccountId: string;
        orderHash?: string;
        orderMask?: InjectiveExchangeV1Beta1Exchange.OrderMask;
        cid?: string;
    }[];
}

export interface MsgBatchCancelSpotOrdersParams {
    orders: {
        marketId: string;
        subaccountId: string;
        orderHash?: string;
        orderMask?: InjectiveExchangeV1Beta1Exchange.OrderMask;
        cid?: string;
    }[];
}

export interface MsgBatchUpdateOrdersParams {
    subaccountId: string;
    spotMarketIdsToCancelAll?: string[];
    derivativeMarketIdsToCancelAll?: string[];
    binaryOptionsMarketIdsToCancelAll?: string[];
    spotOrdersToCancel?: {
        marketId: string;
        subaccountId: string;
        orderHash?: string;
        cid?: string;
    }[];
}

export interface MsgCancelBinaryOptionsOrderParams {
    marketId: string;
    subaccountId: string;
    orderHash?: string;
    orderMask?: InjectiveExchangeV1Beta1Exchange.OrderMask;
    cid?: string;
}

export interface MsgCancelDerivativeOrderParams {
    marketId: string;
    subaccountId: string;
    orderHash?: string;
    orderMask?: InjectiveExchangeV1Beta1Exchange.OrderMask;
    cid?: string;
}

export interface MsgCancelSpotOrderParams {
    marketId: string;
    subaccountId: string;
    orderHash?: string;
    cid?: string;
}

export interface MsgCreateBinaryOptionsLimitOrderParams {
    marketId: string;
    subaccountId: string;
    orderType: InjectiveExchangeV1Beta1Exchange.OrderType;
    triggerPrice?: string;
    feeRecipient: string;
    price: string;
    margin: string;
    quantity: string;
    cid?: string;
}

export interface MsgCreateBinaryOptionsMarketOrderParams {
    marketId: string;
    subaccountId: string;
    orderType: InjectiveExchangeV1Beta1Exchange.OrderType;
    triggerPrice?: string;
    feeRecipient: string;
    price: string;
    margin: string;
    quantity: string;
    cid?: string;
}

export interface MsgCreateDerivativeLimitOrderParams {
    marketId: string;
    subaccountId: string;
    orderType: InjectiveExchangeV1Beta1Exchange.OrderType;
    triggerPrice?: string;
    feeRecipient: string;
    price: string;
    margin: string;
    quantity: string;
    cid?: string;
}

export interface MsgCreateDerivativeMarketOrderParams {
    marketId: string;
    subaccountId: string;
    orderType: InjectiveExchangeV1Beta1Exchange.OrderType;
    triggerPrice?: string;
    feeRecipient: string;
    price: string;
    margin: string;
    quantity: string;
    cid?: string;
}

export interface MsgCreateSpotLimitOrderParams {
    marketId: string;
    subaccountId: string;
    orderType: InjectiveExchangeV1Beta1Exchange.OrderType;
    triggerPrice?: string;
    feeRecipient: string;
    price: string;
    quantity: string;
    cid?: string;
}

export interface MsgCreateSpotMarketOrderParams {
    marketId: string;
    subaccountId: string;
    orderType: InjectiveExchangeV1Beta1Exchange.OrderType;
    triggerPrice?: string;
    feeRecipient: string;
    price: string;
    quantity: string;
    cid?: string;
}

export interface MsgDepositParams {
    subaccountId: string;
    amount: {
        amount: string;
        denom: string;
    };
}

export interface MsgExternalTransferParams {
    srcSubaccountId: string;
    dstSubaccountId: string;
    totalAmount: {
        amount: string;
        denom: string;
    };
}

export interface MsgIncreasePositionMarginParams {
    marketId: string;
    srcSubaccountId: string;
    dstSubaccountId: string;
    amount: string;
}

export interface MsgInstantBinaryOptionsMarketLaunchParams {
    proposer: string;
    market: {
        ticker: string;
        admin: string;
        oracleSymbol: string;
        oracleProvider: string;
        oracleScaleFactor: number;
        oracleType: InjectiveOracleV1Beta1Oracle.OracleType;
        quoteDenom: string;
        makerFeeRate: string;
        takerFeeRate: string;
        expirationTimestamp: number;
        settlementTimestamp: number;
        minPriceTickSize: string;
        minQuantityTickSize: string;
        minNotional: string;
    };
}

export interface MsgInstantSpotMarketLaunchParams {
    proposer: string;
    market: {
        sender: string;
        ticker: string;
        baseDenom: string;
        quoteDenom: string;
        minNotional: string;
        minPriceTickSize: string;
        minQuantityTickSize: string;
    };
}

export interface MsgLiquidatePositionParams {
    subaccountId: string;
    injectiveAddress: string;
    marketId: string;
    /** optional order to provide for liquidation */
    order?: {
        marketId: string;
        subaccountId: string;
        orderType: InjectiveExchangeV1Beta1Exchange.OrderType;
        triggerPrice?: string;
        feeRecipient: string;
        price: string;
        margin: string;
        quantity: string;
        cid?: string;
    };
}

export interface MsgReclaimLockedFundsParams {
    sender: string;
    lockedAccountPubKey: string;
    signature: Uint8Array;
}

export interface MsgRewardsOptOutParams {
    sender: string;
}

export interface MsgSignDataParams {
    sender: string;
    data: string;
}

export interface MsgWithdrawParams {
    subaccountId: string;
    amount: {
        amount: string;
        denom: string;
    };
}
