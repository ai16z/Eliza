import { InjectiveGrpcBase } from "../grpc/grpc-base.js";
import {
    MsgBeginRedelegate,
    MsgDelegate,
    MsgUndelegate,
    MsgCreateValidator,
    MsgEditValidator,
    MsgCancelUnbondingDelegation,
    TxResponse,
} from "@injectivelabs/sdk-ts";
import {
    MsgBeginRedelegateParams,
    MsgDelegateParams,
    MsgUndelegateParams,
    MsgCreateValidatorParams,
    MsgEditValidatorParams,
    MsgCancelUnbondingDelegationParams,
    GetValidatorsParams,
    GetValidatorParams,
    GetValidatorDelegationsParams,
    GetDelegationParams,
    GetDelegationsParams,
    GetDelegatorsParams,
    GetUnbondingDelegationsParams,
    GetReDelegationsParams,
    GetStakingModuleParamsResponse,
    GetPoolResponse,
    GetValidatorsResponse,
    GetValidatorResponse,
    GetValidatorDelegationsResponse,
    GetDelegationResponse,
    GetDelegationsResponse,
    GetUnbondingDelegationsResponse,
    GetReDelegationsResponse,
} from "../types/index";
export async function getStakingModuleParams(
    this: InjectiveGrpcBase
): Promise<GetStakingModuleParamsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchModuleParams,
        params: {},
    });
}

export async function getPool(
    this: InjectiveGrpcBase
): Promise<GetPoolResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchPool,
        params: {},
    });
}

export async function getValidators(
    this: InjectiveGrpcBase,
    params: GetValidatorsParams = {}
): Promise<GetValidatorsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchValidators,
        params: params.pagination || {},
    });
}

export async function getValidator(
    this: InjectiveGrpcBase,
    params: GetValidatorParams
): Promise<GetValidatorResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchValidator,
        params: params.address,
    });
}

export async function getValidatorDelegations(
    this: InjectiveGrpcBase,
    params: GetValidatorDelegationsParams
): Promise<GetValidatorDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchValidatorDelegations,
        params,
    });
}

export async function getValidatorDelegationsNoThrow(
    this: InjectiveGrpcBase,
    params: GetValidatorDelegationsParams
): Promise<GetValidatorDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchValidatorDelegationsNoThrow,
        params,
    });
}

export async function getValidatorUnbondingDelegations(
    this: InjectiveGrpcBase,
    params: GetValidatorDelegationsParams
): Promise<GetUnbondingDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchValidatorUnbondingDelegations,
        params,
    });
}

export async function getValidatorUnbondingDelegationsNoThrow(
    this: InjectiveGrpcBase,
    params: GetValidatorDelegationsParams
): Promise<GetUnbondingDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi
            .fetchValidatorUnbondingDelegationsNoThrow,
        params,
    });
}

export async function getDelegation(
    this: InjectiveGrpcBase,
    params: GetDelegationParams
): Promise<GetDelegationResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchDelegation,
        params,
    });
}

export async function getDelegations(
    this: InjectiveGrpcBase,
    params: GetDelegationsParams
): Promise<GetDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchDelegations,
        params,
    });
}

export async function getDelegationsNoThrow(
    this: InjectiveGrpcBase,
    params: GetDelegationsParams
): Promise<GetDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchDelegationsNoThrow,
        params,
    });
}

export async function getDelegators(
    this: InjectiveGrpcBase,
    params: GetDelegatorsParams
): Promise<GetDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchDelegators,
        params,
    });
}

export async function getDelegatorsNoThrow(
    this: InjectiveGrpcBase,
    params: GetDelegatorsParams
): Promise<GetDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchDelegatorsNoThrow,
        params,
    });
}

export async function getUnbondingDelegations(
    this: InjectiveGrpcBase,
    params: GetUnbondingDelegationsParams
): Promise<GetUnbondingDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchUnbondingDelegations,
        params,
    });
}

export async function getUnbondingDelegationsNoThrow(
    this: InjectiveGrpcBase,
    params: GetUnbondingDelegationsParams
): Promise<GetUnbondingDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchUnbondingDelegationsNoThrow,
        params,
    });
}

export async function getReDelegations(
    this: InjectiveGrpcBase,
    params: GetReDelegationsParams
): Promise<GetReDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchReDelegations,
        params,
    });
}

export async function getReDelegationsNoThrow(
    this: InjectiveGrpcBase,
    params: GetReDelegationsParams
): Promise<GetReDelegationsResponse> {
    return this.request({
        method: this.chainGrpcStakingApi.fetchReDelegationsNoThrow,
        params,
    });
}

export async function msgBeginRedelegate(
    this: InjectiveGrpcBase,
    params: MsgBeginRedelegateParams
): Promise<TxResponse> {
    const msg = MsgBeginRedelegate.fromJSON({
        ...params,
        injectiveAddress: this.injAddress,
    });
    return await this.msgBroadcaster.broadcast({ msgs: msg });
}

export async function msgDelegate(
    this: InjectiveGrpcBase,
    params: MsgDelegateParams
): Promise<TxResponse> {
    const msg = MsgDelegate.fromJSON({
        ...params,
        injectiveAddress: this.injAddress,
    });
    return await this.msgBroadcaster.broadcast({ msgs: msg });
}

export async function msgUndelegate(
    this: InjectiveGrpcBase,
    params: MsgUndelegateParams
): Promise<TxResponse> {
    const msg = MsgUndelegate.fromJSON({
        ...params,
        injectiveAddress: this.injAddress,
    });
    return await this.msgBroadcaster.broadcast({ msgs: msg });
}

export async function msgCreateValidator(
    this: InjectiveGrpcBase,
    params: MsgCreateValidatorParams
): Promise<TxResponse> {
    const msg = MsgCreateValidator.fromJSON({
        ...params,
        delegatorAddress: this.injAddress,
    });
    return await this.msgBroadcaster.broadcast({ msgs: msg });
}

export async function msgEditValidator(
    this: InjectiveGrpcBase,
    params: MsgEditValidatorParams
): Promise<TxResponse> {
    const msg = MsgEditValidator.fromJSON({
        ...params,
    });
    return await this.msgBroadcaster.broadcast({ msgs: msg });
}

export async function msgCancelUnbondingDelegation(
    this: InjectiveGrpcBase,
    params: MsgCancelUnbondingDelegationParams
): Promise<TxResponse> {
    const msg = MsgCancelUnbondingDelegation.fromJSON({
        ...params,
    });
    return await this.msgBroadcaster.broadcast({ msgs: msg });
}
