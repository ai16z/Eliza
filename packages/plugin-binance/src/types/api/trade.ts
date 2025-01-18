import type { ORDER_SIDES, ORDER_TYPES, TIME_IN_FORCE } from "../../constants/api";

export type OrderType = (typeof ORDER_TYPES)[keyof typeof ORDER_TYPES];
export type OrderSide = (typeof ORDER_SIDES)[keyof typeof ORDER_SIDES];
export type TimeInForce = (typeof TIME_IN_FORCE)[keyof typeof TIME_IN_FORCE];

/**
 * Binance API new order response
 */
export interface BinanceOrderResponse {
    symbol: string;
    orderId: number;
    orderListId: number;
    clientOrderId: string;
    transactTime: number;
    price: string;
    origQty: string;
    executedQty: string;
    cummulativeQuoteQty: string;
    status: OrderStatus;
    timeInForce: TimeInForce;
    type: OrderType;
    side: OrderSide;
    fills?: OrderFill[];
}

/**
 * Order fill information
 */
export interface OrderFill {
    price: string;
    qty: string;
    commission: string;
    commissionAsset: string;
    tradeId: number;
}

/**
 * Order status types
 */
export type OrderStatus =
    | "NEW"
    | "PARTIALLY_FILLED"
    | "FILLED"
    | "CANCELED"
    | "PENDING_CANCEL"
    | "REJECTED"
    | "EXPIRED";

/**
 * New order parameters for Binance API
 */
export interface BinanceNewOrderParams {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    timeInForce?: TimeInForce;
    quantity?: string | number;
    quoteOrderQty?: string | number;
    price?: string | number;
    newClientOrderId?: string;
    stopPrice?: string | number;
    icebergQty?: string | number;
    newOrderRespType?: "ACK" | "RESULT" | "FULL";
}

/**
 * Order query parameters
 */
export interface BinanceOrderQueryParams {
    symbol: string;
    orderId?: number;
    origClientOrderId?: string;
}

/**
 * Cancel order parameters
 */
export interface BinanceCancelOrderParams extends BinanceOrderQueryParams {
    newClientOrderId?: string;
}
