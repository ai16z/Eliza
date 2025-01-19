import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    MsgBeginRedelegate,
    MsgDelegate,
    MsgUndelegate,
    MsgCreateValidator,
    MsgEditValidator,
    MsgCancelUnbondingDelegation,
} from "@injectivelabs/sdk-ts";
import type * as StakingTypes from "../types/staking";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

// Staking Module Async Functions with Error Handling

/**
 * Fetches the staking module parameters.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing module parameters or an error.
 */
export async function getStakingModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcStakingApi.fetchModuleParams();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getStakingModuleParamsError", err);
    }
}

/**
 * Fetches the staking pool information.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing pool information or an error.
 */
export async function getPool(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcStakingApi.fetchPool();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPoolError", err);
    }
}

/**
 * Fetches a list of validators with optional pagination.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetValidatorsParams} params - Parameters including pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing validators or an error.
 */
export async function getValidators(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetValidatorsParams = {}
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcStakingApi.fetchValidators(
            params.pagination
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getValidatorsError", err);
    }
}

/**
 * Fetches a specific validator by address.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetValidatorParams} params - Parameters including the validator's address.
 * @returns {Promise<StandardResponse>} The standard response containing the validator or an error.
 */
export async function getValidator(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetValidatorParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcStakingApi.fetchValidator(
            params.address
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getValidatorError", err);
    }
}

/**
 * Fetches delegations for a specific validator.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetValidatorDelegationsParams} params - Parameters including the validator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing delegations or an error.
 */
export async function getValidatorDelegations(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetValidatorDelegationsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcStakingApi.fetchValidatorDelegations(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getValidatorDelegationsError", err);
    }
}

/**
 * Fetches delegations for a specific validator without throwing an error.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetValidatorDelegationsParams} params - Parameters including the validator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing delegations or an error.
 */
export async function getValidatorDelegationsNoThrow(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetValidatorDelegationsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcStakingApi.fetchValidatorDelegationsNoThrow(
                params
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getValidatorDelegationsNoThrowError", err);
    }
}

/**
 * Fetches unbonding delegations for a specific validator.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetValidatorDelegationsParams} params - Parameters including the validator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing unbonding delegations or an error.
 */
export async function getValidatorUnbondingDelegations(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetValidatorDelegationsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcStakingApi.fetchValidatorUnbondingDelegations(
                params
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "getValidatorUnbondingDelegationsError",
            err
        );
    }
}

/**
 * Fetches unbonding delegations for a specific validator without throwing an error.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetValidatorDelegationsParams} params - Parameters including the validator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing unbonding delegations or an error.
 */
export async function getValidatorUnbondingDelegationsNoThrow(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetValidatorDelegationsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcStakingApi.fetchValidatorUnbondingDelegationsNoThrow(
                params
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "getValidatorUnbondingDelegationsNoThrowError",
            err
        );
    }
}

/**
 * Fetches a specific delegation.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetDelegationParams} params - Parameters including delegator and validator addresses.
 * @returns {Promise<StandardResponse>} The standard response containing the delegation or an error.
 */
export async function getDelegation(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetDelegationParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcStakingApi.fetchDelegation(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDelegationError", err);
    }
}

/**
 * Fetches all delegations for a delegator.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetDelegationsParams} params - Parameters including the delegator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing delegations or an error.
 */
export async function getDelegations(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetDelegationsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcStakingApi.fetchDelegations(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDelegationsError", err);
    }
}

/**
 * Fetches all delegations for a delegator without throwing an error.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetDelegationsParams} params - Parameters including the delegator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing delegations or an error.
 */
export async function getDelegationsNoThrow(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetDelegationsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcStakingApi.fetchDelegationsNoThrow(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDelegationsNoThrowError", err);
    }
}

/**
 * Fetches all delegators for a validator.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetDelegatorsParams} params - Parameters including the validator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing delegators or an error.
 */
export async function getDelegators(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetDelegatorsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcStakingApi.fetchDelegators(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDelegatorsError", err);
    }
}

/**
 * Fetches all delegators for a validator without throwing an error.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetDelegatorsParams} params - Parameters including the validator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing delegators or an error.
 */
export async function getDelegatorsNoThrow(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetDelegatorsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcStakingApi.fetchDelegatorsNoThrow(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDelegatorsNoThrowError", err);
    }
}

/**
 * Fetches all unbonding delegations for a delegator.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetUnbondingDelegationsParams} params - Parameters including the delegator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing unbonding delegations or an error.
 */
export async function getUnbondingDelegations(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetUnbondingDelegationsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcStakingApi.fetchUnbondingDelegations(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getUnbondingDelegationsError", err);
    }
}

/**
 * Fetches all unbonding delegations for a delegator without throwing an error.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetUnbondingDelegationsParams} params - Parameters including the delegator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing unbonding delegations or an error.
 */
export async function getUnbondingDelegationsNoThrow(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetUnbondingDelegationsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcStakingApi.fetchUnbondingDelegationsNoThrow(
                params
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getUnbondingDelegationsNoThrowError", err);
    }
}

/**
 * Fetches all redelegations for a delegator.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetReDelegationsParams} params - Parameters including the delegator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing redelegations or an error.
 */
export async function getReDelegations(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetReDelegationsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcStakingApi.fetchReDelegations(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getReDelegationsError", err);
    }
}

/**
 * Fetches all redelegations for a delegator without throwing an error.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.GetReDelegationsParams} params - Parameters including the delegator's address and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing redelegations or an error.
 */
export async function getReDelegationsNoThrow(
    this: InjectiveGrpcBase,
    params: StakingTypes.GetReDelegationsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcStakingApi.fetchReDelegationsNoThrow(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getReDelegationsNoThrowError", err);
    }
}

/**
 * Broadcasts a message to begin redelegating tokens.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.MsgBeginRedelegateParams} params - Parameters including delegator address, source validator address, destination validator address, and amount.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgBeginRedelegate(
    this: InjectiveGrpcBase,
    params: StakingTypes.MsgBeginRedelegateParams
): Promise<StandardResponse> {
    try {
        const msg = MsgBeginRedelegate.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgBeginRedelegateError", err);
    }
}

/**
 * Broadcasts a message to delegate tokens to a validator.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.MsgDelegateParams} params - Parameters including delegator address, validator address, and amount.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgDelegate(
    this: InjectiveGrpcBase,
    params: StakingTypes.MsgDelegateParams
): Promise<StandardResponse> {
    try {
        const msg = MsgDelegate.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgDelegateError", err);
    }
}

/**
 * Broadcasts a message to undelegate tokens from a validator.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.MsgUndelegateParams} params - Parameters including delegator address, validator address, and amount.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgUndelegate(
    this: InjectiveGrpcBase,
    params: StakingTypes.MsgUndelegateParams
): Promise<StandardResponse> {
    try {
        const msg = MsgUndelegate.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgUndelegateError", err);
    }
}

/**
 * Broadcasts a message to create a new validator.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.MsgCreateValidatorParams} params - Parameters including delegator address, validator details, and commission rates.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCreateValidator(
    this: InjectiveGrpcBase,
    params: StakingTypes.MsgCreateValidatorParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCreateValidator.fromJSON({
            ...params,
            delegatorAddress: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCreateValidatorError", err);
    }
}

/**
 * Broadcasts a message to edit an existing validator.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.MsgEditValidatorParams} params - Parameters including validator address and updated details.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgEditValidator(
    this: InjectiveGrpcBase,
    params: StakingTypes.MsgEditValidatorParams
): Promise<StandardResponse> {
    try {
        const msg = MsgEditValidator.fromJSON({
            ...params,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgEditValidatorError", err);
    }
}

/**
 * Broadcasts a message to cancel an unbonding delegation.
 *
 * @this InjectiveGrpcBase
 * @param {StakingTypes.MsgCancelUnbondingDelegationParams} params - Parameters including delegator address, validator address, and completion time.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCancelUnbondingDelegation(
    this: InjectiveGrpcBase,
    params: StakingTypes.MsgCancelUnbondingDelegationParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCancelUnbondingDelegation.fromJSON({
            ...params,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCancelUnbondingDelegationError", err);
    }
}
