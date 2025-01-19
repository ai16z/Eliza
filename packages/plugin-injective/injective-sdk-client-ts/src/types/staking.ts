import type {
    PaginationOption,
    Pagination,
    StakingModuleParams,
    Pool,
    Validator,
    Delegation,
    UnBondingDelegation,
    ReDelegation,
} from "@injectivelabs/sdk-ts";
import type { PaginationParams } from "./base";
// Staking Module Params
// Param interfaces

export interface GetValidatorsParams {
    pagination?: PaginationOption;
}

export interface GetValidatorParams {
    address: string;
}

export interface GetValidatorDelegationsParams {
    validatorAddress: string;
    pagination?: PaginationOption;
}

export interface GetDelegationParams {
    injectiveAddress: string;
    validatorAddress: string;
}

export interface GetDelegationsParams {
    injectiveAddress: string;
    pagination?: PaginationOption;
}

export interface GetDelegatorsParams {
    validatorAddress: string;
    pagination?: PaginationOption;
}

export interface GetUnbondingDelegationsParams {
    injectiveAddress: string;
    pagination?: PaginationOption;
}

export interface GetReDelegationsParams {
    injectiveAddress: string;
    pagination?: PaginationOption;
}

// Response interfaces
export interface GetStakingModuleParamsResponse {
    params: StakingModuleParams;
}

export interface GetPoolResponse {
    pool: Pool;
}

export interface GetValidatorsResponse {
    validators: Validator[];
    pagination: Pagination;
}

export interface GetValidatorResponse {
    validator: Validator;
}

export interface GetValidatorDelegationsResponse {
    delegations: Delegation[];
    pagination: Pagination;
}

export interface GetDelegationResponse {
    delegation: Delegation;
}

export interface GetDelegationsResponse {
    delegations: Delegation[];
    pagination: Pagination;
}

export interface GetUnbondingDelegationsResponse {
    unbondingDelegations: UnBondingDelegation[];
    pagination: Pagination;
}

export interface GetReDelegationsResponse {
    redelegations: ReDelegation[];
    pagination: Pagination;
}
export interface MsgBeginRedelegateParams {
    amount: {
        denom: string;
        amount: string;
    };
    srcValidatorAddress: string;
    dstValidatorAddress: string;
}

export interface MsgDelegateParams {
    amount: {
        denom: string;
        amount: string;
    };
    validatorAddress: string;
}

export interface MsgUndelegateParams {
    amount: {
        denom: string;
        amount: string;
    };
    validatorAddress: string;
}

export interface MsgCreateValidatorParams {
    description: {
        moniker: string;
        identity: string;
        website: string;
        securityContact?: string;
        details: string;
    };
    value: {
        amount: string;
        denom: string;
    };
    pubKey: {
        type: string;
        value: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
    commission: {
        maxChangeRate: string;
        rate: string;
        maxRate: string;
    };
}

export interface MsgEditValidatorParams {
    description: {
        moniker: string;
        identity: string;
        website: string;
        securityContact?: string;
        details: string;
    };
    validatorAddress: string;
    commissionRate?: string;
    minSelfDelegation?: string;
}

export interface MsgCancelUnbondingDelegationParams {
    amount: {
        denom: string;
        amount: string;
    };
    validatorAddress: string;
    delegatorAddress: string;
    creationHeight: string;
}

export interface ValidatorParams extends PaginationParams {
    validatorAddress: string;
}

export interface DelegationParams {
    validatorAddress: string;
}

export interface DelegationsParams extends PaginationParams {}
