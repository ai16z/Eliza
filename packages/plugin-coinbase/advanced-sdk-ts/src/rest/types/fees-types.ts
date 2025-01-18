import type { ContractExpiryType, ProductType, ProductVenue } from './common-types';

// Get Transactions Summary
export type GetTransactionsSummaryRequest = {
    // Query Params
    productType?: ProductType;
    contractExpiryType?: ContractExpiryType;
    productVenue?: ProductVenue;
};

export type GetTransactionsSummaryResponse = {
    total_volume: number;
    total_fees: number;
    fee_tier: Record<string, any>;
    margin_rate?: Record<string, any>;
    goods_and_services_tax?: Record<string, any>;
    advanced_trade_only_volumes?: number;
    advanced_trade_only_fees?: number;
    coinbase_pro_volume?: number; // deprecated
    coinbase_pro_fees?: number; // deprecated
    total_balance?: string;
    has_promo_fee?: boolean;
};
