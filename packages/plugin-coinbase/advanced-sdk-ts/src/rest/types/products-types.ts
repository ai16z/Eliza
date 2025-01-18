import type {
    Candles,
    ContractExpiryType,
    ExpiringContractStatus,
    Granularity,
    HistoricalMarketTrade,
    PriceBook,
    Product,
    Products,
    ProductType,
} from './common-types';

// Get Best Bid Ask
export type GetBestBidAskRequest = {
    // Query Params
    productIds?: string[];
};

export type GetBestBidAskResponse = {
    pricebooks: PriceBook[];
};

// Get Product Book
export type GetProductBookRequest = {
    // Query Params
    productId: string;
    limit?: number;
    aggregationPriceIncrement?: number;
};

export type GetProductBookResponse = {
    pricebook: PriceBook;
};

// List Products
export type ListProductsRequest = {
    // Query Params
    limit?: number;
    offset?: number;
    productType?: ProductType;
    productIds?: string[];
    contractExpiryType?: ContractExpiryType;
    expiringContractStatus?: ExpiringContractStatus;
    getTradabilityStatus?: boolean;
    getAllProducts?: boolean;
};

export type ListProductsResponse = {
    body?: Products;
};

// Get Product
export type GetProductRequest = {
    // Path Params
    productId: string;

    // Query Params
    getTradabilityStatus?: boolean;
};

export type GetProductResponse = {
    body?: Product;
};

// Get Product Candles
export type GetProductCandlesRequest = {
    // Path Params
    productId: string;

    // Query Params
    start: string;
    end: string;
    granularity: Granularity;
    limit?: number;
};

export type GetProductCandlesResponse = {
    body?: Candles;
};

// Get Market Trades
export type GetMarketTradesRequest = {
    // Path Params
    productId: string;

    // Query Params
    limit: number;
    start?: string;
    end?: string;
};

export type GetMarketTradesResponse = {
    trades?: HistoricalMarketTrade[];
    best_bid?: string;
    best_ask?: string;
};
