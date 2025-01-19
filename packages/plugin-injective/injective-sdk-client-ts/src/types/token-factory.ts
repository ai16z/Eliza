import type {
    AuthorityMetadata,
    TokenFactoryModuleParams,
    TokenFactoryModuleState,
} from "@injectivelabs/sdk-ts";
import type { CosmosBankV1Beta1Bank } from "@injectivelabs/core-proto-ts";
// Token Factory Module Params// Param interfaces
export interface GetDenomsFromCreatorParams {
    creator: string;
}

export interface GetDenomAuthorityMetadataParams {
    creator: string;
    subDenom: string;
}

// Response interfaces
export interface GetDenomsFromCreatorResponse {
    denoms: string[];
}

export interface GetDenomAuthorityMetadataResponse {
    metadata: AuthorityMetadata;
}

export interface GetTokenFactoryModuleParamsResponse {
    params: TokenFactoryModuleParams;
}

export interface GetTokenFactoryModuleStateResponse {
    state: TokenFactoryModuleState;
}
export interface TokenFactoryParams {
    creator: string;
    subDenom: string;
}

export interface MsgBurnParams {
    amount: {
        amount: string;
        denom: string;
    };
}
export interface MsgChangeAdminParams {
    denom: string;
    newAdmin: string;
}

export interface MsgCreateDenomParams {
    subdenom: string;
    decimals?: number;
    name?: string;
    symbol?: string;
}
export interface MsgMintParams {
    totalAmount: {
        amount: string;
        denom: string;
    };
}
export interface MsgSetDenomMetadataParams {
    metadata: CosmosBankV1Beta1Bank.Metadata;
}
