// Distribution Module Params
// Start of Get Distribution Module Parameters

import type {
    DistributionModuleParams,
    ValidatorRewards,
    Coin,
} from "@injectivelabs/sdk-ts";
export interface DelegatorValidatorParams {
    delegatorAddress: string;
    validatorAddress: string;
}
export interface MsgWithdrawDelegatorRewardParams {
    delegatorAddress: string;
    validatorAddress: string;
}
export interface MsgWithdrawValidatorCommissionParams {
    validatorAddress: string;
}
export interface GetDelegatorRewardsForValidatorParams {
    delegatorAddress: string;
    validatorAddress: string;
}

export interface GetDelegatorRewardsParams {
    injectiveAddress: string;
}
// End of Get Distribution Module Request parameters
// Start of Distribution Module Response
export interface DistributionModuleParamsResponse {
    params: DistributionModuleParams;
}

export interface DelegatorRewardsForValidatorResponse {
    rewards: Coin[];
}

export interface DelegatorRewardsResponse {
    rewards: ValidatorRewards[];
}
// End of Distribution Module Response parameters
