import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    MsgWithdrawDelegatorReward,
    MsgWithdrawValidatorCommission,
} from "@injectivelabs/sdk-ts";
import type * as DistributionTypes from "../types/distribution";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

// Distribution Module Async Functions with Error Handling

/**
 * Fetches the distribution module parameters.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing module parameters or an error.
 */
export async function getDistributionModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcDistributionApi.fetchModuleParams();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDistributionModuleParamsError", err);
    }
}

/**
 * Fetches the delegator rewards for a specific validator.
 *
 * @this InjectiveGrpcBase
 * @param {DistributionTypes.GetDelegatorRewardsForValidatorParams} params - Parameters including delegator and validator addresses.
 * @returns {Promise<StandardResponse>} The standard response containing delegator rewards or an error.
 */
export async function getDelegatorRewardsForValidator(
    this: InjectiveGrpcBase,
    params: DistributionTypes.GetDelegatorRewardsForValidatorParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcDistributionApi.fetchDelegatorRewardsForValidator(
                {
                    delegatorAddress: params.delegatorAddress,
                    validatorAddress: params.validatorAddress,
                }
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDelegatorRewardsForValidatorError", err);
    }
}

/**
 * Fetches the delegator rewards for a specific validator without throwing an error.
 *
 * @this InjectiveGrpcBase
 * @param {DistributionTypes.GetDelegatorRewardsForValidatorParams} params - Parameters including delegator and validator addresses.
 * @returns {Promise<StandardResponse>} The standard response containing delegator rewards or an error.
 */
export async function getDelegatorRewardsForValidatorNoThrow(
    this: InjectiveGrpcBase,
    params: DistributionTypes.GetDelegatorRewardsForValidatorParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcDistributionApi.fetchDelegatorRewardsForValidatorNoThrow(
                {
                    delegatorAddress: params.delegatorAddress,
                    validatorAddress: params.validatorAddress,
                }
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "getDelegatorRewardsForValidatorNoThrowError",
            err
        );
    }
}

/**
 * Fetches the rewards for a delegator.
 *
 * @this InjectiveGrpcBase
 * @param {DistributionTypes.GetDelegatorRewardsParams} params - Parameters including the delegator's Injective address.
 * @returns {Promise<StandardResponse>} The standard response containing delegator rewards or an error.
 */
export async function getDelegatorRewards(
    this: InjectiveGrpcBase,
    params: DistributionTypes.GetDelegatorRewardsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcDistributionApi.fetchDelegatorRewards(
                params.injectiveAddress
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDelegatorRewardsError", err);
    }
}

/**
 * Fetches the rewards for a delegator without throwing an error.
 *
 * @this InjectiveGrpcBase
 * @param {DistributionTypes.GetDelegatorRewardsParams} params - Parameters including the delegator's Injective address.
 * @returns {Promise<StandardResponse>} The standard response containing delegator rewards or an error.
 */
export async function getDelegatorRewardsNoThrow(
    this: InjectiveGrpcBase,
    params: DistributionTypes.GetDelegatorRewardsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcDistributionApi.fetchDelegatorRewardsNoThrow(
                params.injectiveAddress
            );

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDelegatorRewardsNoThrowError", err);
    }
}

/**
 * Broadcasts a message to withdraw delegator rewards.
 *
 * @this InjectiveGrpcBase
 * @param {DistributionTypes.MsgWithdrawDelegatorRewardParams} params - Parameters including delegator and validator addresses.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgWithdrawDelegatorReward(
    this: InjectiveGrpcBase,
    params: DistributionTypes.MsgWithdrawDelegatorRewardParams
): Promise<StandardResponse> {
    try {
        const msg = MsgWithdrawDelegatorReward.fromJSON({
            delegatorAddress: params.delegatorAddress,
            validatorAddress: params.validatorAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgWithdrawDelegatorRewardError", err);
    }
}

/**
 * Broadcasts a message to withdraw validator commission.
 *
 * @this InjectiveGrpcBase
 * @param {DistributionTypes.MsgWithdrawValidatorCommissionParams} params - Parameters including the validator's address.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgWithdrawValidatorCommission(
    this: InjectiveGrpcBase,
    params: DistributionTypes.MsgWithdrawValidatorCommissionParams
): Promise<StandardResponse> {
    try {
        const msg = MsgWithdrawValidatorCommission.fromJSON({
            validatorAddress: params.validatorAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgWithdrawValidatorCommissionError", err);
    }
}
