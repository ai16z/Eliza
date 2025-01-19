import type {
    CancelOrderObject,
    ContractExpiryType,
    MarginType,
    Order,
    OrderConfiguration,
    OrderPlacementSource,
    OrderSide,
    ProductType,
    SortBy,
} from './common-types';

// Create Order
export type CreateOrderRequest = {
    // Body Params
    clientOrderId: string;
    productId: string;
    side: OrderSide;
    orderConfiguration: OrderConfiguration;
    selfTradePreventionId?: string;
    leverage?: string;
    marginType?: MarginType;
    retailPortfolioId?: string;
};

export type CreateOrderResponse = {
    success: boolean;
    failure_reason?: Record<string, any>; // deprecated
    order_id?: string; // deprecated
    response?:
        | { success_response: Record<string, any> }
        | { error_response: Record<string, any> };
    order_configuration?: OrderConfiguration;
};

// Cancel Orders
export type CancelOrdersRequest = {
    // Body Params
    orderIds: string[];
};

export type CancelOrdersResponse = {
    results?: CancelOrderObject[];
};

// Edit Order
export type EditOrderRequest = {
    // Body Params
    orderId: string;
    price?: string;
    size?: string;
};

export type EditOrderResponse = {
    success: boolean;
    response?:
        | { success_response: Record<string, any> } // deprecated
        | { error_response: Record<string, any> }; // deprecated
    errors?: Record<string, any>[];
};

// Edit Order Preview
export type EditOrderPreviewRequest = {
    // Body Params
    orderId: string;
    price?: string;
    size?: string;
};

export type EditOrderPreviewResponse = {
    errors: Record<string, any>[];
    slippage?: string;
    order_total?: string;
    commission_total?: string;
    quote_size?: string;
    base_size?: string;
    best_bid?: string;
    average_filled_price?: string;
};

// List Orders
export type ListOrdersRequest = {
    // Query Params
    orderIds?: string[];
    productIds?: string[];
    orderStatus?: string[];
    limit?: number;
    startDate?: string;
    endDate?: string;
    orderType?: string;
    orderSide?: OrderSide;
    cursor?: string;
    productType?: ProductType;
    orderPlacementSource?: OrderPlacementSource;
    contractExpiryType?: ContractExpiryType;
    assetFilters?: string[];
    retailPortfolioId?: string;
    timeInForces?: string;
    sortBy?: SortBy;
};

export type ListOrdersResponse = {
    orders: Order[];
    sequence?: number; // deprecated
    has_next: boolean;
    cursor?: string;
};

// List Fills
export type ListFillsRequest = {
    // Query Params
    orderIds?: string[];
    tradeIds?: string[];
    productIds?: string[];
    startSequenceTimestamp?: string;
    endSequenceTimestamp?: string;
    retailPortfolioId?: string;
    limit?: number;
    cursor?: string;
    sortBy?: SortBy;
};

export type ListFillsResponse = {
    fills?: Record<string, any>[];
    cursor?: string;
};

// Get Order
export type GetOrderRequest = {
    // Path Params
    orderId: string;
};

export type GetOrderResponse = {
    order?: Order;
};

// Preview Order
export type PreviewOrderRequest = {
    // Body Params
    productId: string;
    side: OrderSide;
    orderConfiguration: OrderConfiguration;
    leverage?: string;
    marginType?: MarginType;
    retailPortfolioId?: string;
};

export type PreviewOrderResponse = {
    order_total: string;
    commission_total: string;
    errs: Record<string, any>[];
    warning: Record<string, any>[];
    quote_size: string;
    base_size: string;
    best_bid: string;
    best_ask: string;
    is_max: boolean;
    order_margin_total?: string;
    leverage?: string;
    long_leverage?: string;
    short_leverage?: string;
    slippage?: string;
    preview_id?: string;
    current_liquidation_buffer?: string;
    projected_liquidation_buffer?: string;
    max_leverage?: string;
    pnl_configuration?: Record<string, any>;
};

// Close Position
export type ClosePositionRequest = {
    // Body Params
    clientOrderId: string;
    productId: string;
    size?: string;
};

export type ClosePositionResponse = {
    success: boolean;
    response?:
        | { success_response: Record<string, any> }
        | { error_response: Record<string, any> };
    order_configuration?: OrderConfiguration;
};
