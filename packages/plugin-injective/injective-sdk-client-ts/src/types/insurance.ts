import type { InsuranceFund, InsuranceModuleParams } from "@injectivelabs/sdk-ts";
import type { InjectiveOracleV1Beta1Oracle } from "@injectivelabs/core-proto-ts";

// Insurance Fund Module Params
export interface GetInsuranceFundParams {
    marketId: string;
}

export interface GetEstimatedRedemptionsParams {
    marketId: string;
    address: string;
}

export interface GetPendingRedemptionsParams {
    marketId: string;
    address: string;
}

// Response interfaces
export interface InsuranceModuleParamsResponse {
    params: InsuranceModuleParams;
}

export interface GetInsuranceFundsResponse {
    funds: InsuranceFund[];
}

export interface GetInsuranceFundResponse {
    fund: InsuranceFund;
}

export interface RedemptionAmount {
    amount: string;
    denom: string;
}

export interface GetEstimatedRedemptionsResponse {
    redemption: RedemptionAmount;
}

export interface GetPendingRedemptionsResponse {
    redemptions: RedemptionAmount[];
}
export interface InsuranceFundParams {
    marketId: string;
    address: string;
}

export interface MsgCreateInsuranceFundParams {
    fund: {
        ticker: string;
        quoteDenom: string;
        oracleBase: string;
        oracleQuote: string;
        oracleType: InjectiveOracleV1Beta1Oracle.OracleType;
        expiry?: number;
    };
    deposit: {
        amount: string;
        denom: string;
    };
}

export interface MsgRequestRedemptionParams {
    marketId: string;
    amount: {
        denom: string;
        amount: string;
    };
}

export interface MsgUnderwriteParams {
    marketId: string;
    amount: {
        denom: string;
        amount: string;
    };
}
