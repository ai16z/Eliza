import type { PaginationOption, Pagination, Coin } from "@injectivelabs/sdk-ts";
import type { CosmosBaseV1Beta1Coin } from "@injectivelabs/core-proto-ts";
import type { DenomParam } from "./base";
// Bank Module Params
// Start of Get Bank Request Parameters
export interface GetBankBalanceParams {
    denom: string;
}

export interface GetBankBalancesParams {
    pagination?: PaginationOption;
}

export interface GetSupplyOfParams {
    denom: string;
}

export interface GetDenomMetadataParams {
    denom: string;
}

export interface GetDenomOwnersParams {
    denom: string;
}

export interface BankBalanceParams {
    accountAddress: string;
    denom: string;
}

export interface MsgSendParams {
    amount:
        | {
              denom: string;
              amount: string;
          }
        | {
              denom: string;
              amount: string;
          }[];
    srcInjectiveAddress: string;
    dstInjectiveAddress: string;
}

export interface MsgMultiSendParams {
    inputs: {
        address: string;
        coins: CosmosBaseV1Beta1Coin.Coin[];
    }[];
    outputs: {
        address: string;
        coins: CosmosBaseV1Beta1Coin.Coin[];
    }[];
}
// End of Get Bank Module Parameters
// Start of Bank Module Response Parameters
export interface BankModuleParamsResponse {
    params: any; // Replace 'any' with actual params type from your SDK
}

export interface BankBalanceResponse {
    balance: Coin;
}

export interface BankBalancesResponse {
    balances: Coin[];
    pagination: Pagination;
}

export interface TotalSupplyResponse {
    supply: { denom: string; amount: string }[];
    pagination: Pagination;
}

export interface SupplyOfResponse {
    amount: Coin;
}

export interface DenomsMetadataResponse {
    metadatas: Metadata[];
    pagination: Pagination;
}

export interface DenomMetadataResponse {
    metadata: Metadata;
}

export interface DenomOwnersResponse {
    denomOwners: {
        address: string;
        balance: Coin | undefined;
    }[];
    pagination: Pagination;
}

export interface DenomMetadataParams extends DenomParam {}

export interface DenomOwnerParams extends DenomParam {}
// End of Bank Module Response parameters
