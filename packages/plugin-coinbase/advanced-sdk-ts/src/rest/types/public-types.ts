import type {
    Candles,
    ContractExpiryType,
    ExpiringContractStatus,
    HistoricalMarketTrade,
    PriceBook,
    Product,
    Products,
    ProductType,
} from './common-types';

// Get Server Time
export type GetServerTimeResponse = {
    iso?: string;
    epochSeconds?: number;
    epochMillis?: number;
};

// Get Public Product Book
export type GetPublicProductBookRequest = {
    // Query Params
    productId: string;
    limit?: number;
    aggregationPriceIncrement?: number;
};

export type GetPublicProductBookResponse = {
    pricebook: PriceBook;
};

// List Public Products
export type ListPublicProductsRequest = {
    // Query Params
    limit?: number;
    offset?: number;
    productType?: ProductType;
    productIds?: string[];
    contractExpiryType?: ContractExpiryType;
    expiringContractStatus?: ExpiringContractStatus;
    getAllProducts?: boolean;
};

export type ListPublicProductsResponse = {
    body?: Products;
};

// Get Public Product
export type GetPublicProductRequest = {
    // Path Params
    productId: string;
};

export type GetPublicProductResponse = {
    body?: Product;
};

//Get Public Product Candles
export type GetPublicProductCandlesRequest = {
    // Path Params
    productId: string;

    // Query Params
    start: string;
    end: string;
    granularity: string;
    limit?: number;
};

export type GetPublicProductCandlesResponse = {
    body?: Candles;
};

// Get Public Market Trades
export type GetPublicMarketTradesRequest = {
    // Path Params
    productId: string;

    // Query Params
    limit: number;
    start?: string;
    end?: string;
};

export type GetPublicMarketTradesResponse = {
    trades?: HistoricalMarketTrade[];
    best_bid?: string;
    best_ask?: string;
};
