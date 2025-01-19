import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    MsgCreateInsuranceFund,
    MsgRequestRedemption,
    MsgUnderwrite,
    type TxResponse,
} from "@injectivelabs/sdk-ts";
import type {
    MsgCreateInsuranceFundParams,
    MsgRequestRedemptionParams,
    MsgUnderwriteParams,
    GetInsuranceFundParams,
    GetEstimatedRedemptionsParams,
    GetPendingRedemptionsParams,
} from "../types/insurance";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

/**
 * Fetches the insurance module parameters.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing insurance module parameters or an error.
 */
export async function getInsuranceModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcInsuranceFundApi.fetchModuleParams();

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getInsuranceModuleParamsError", err);
    }
}

/**
 * Fetches a list of all insurance funds.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing a list of insurance funds or an error.
 */
export async function getInsuranceFunds(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcInsuranceFundApi.fetchInsuranceFunds();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getInsuranceFundsError", err);
    }
}

/**
 * Fetches details of a specific insurance fund by its market ID.
 *
 * @this InjectiveGrpcBase
 * @param {InsuranceTypes.GetInsuranceFundParams} params - Parameters including the market ID.
 * @returns {Promise<StandardResponse>} The standard response containing insurance fund details or an error.
 */
export async function getInsuranceFund(
    this: InjectiveGrpcBase,
    params: GetInsuranceFundParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcInsuranceFundApi.fetchInsuranceFund(
            params.marketId
        );

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getInsuranceFundError", err);
    }
}

/**
 * Fetches estimated redemptions based on provided parameters.
 *
 * @this InjectiveGrpcBase
 * @param {InsuranceTypes.GetEstimatedRedemptionsParams} params - Parameters to filter estimated redemptions.
 * @returns {Promise<StandardResponse>} The standard response containing estimated redemptions or an error.
 */
export async function getEstimatedRedemptions(
    this: InjectiveGrpcBase,
    params: GetEstimatedRedemptionsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcInsuranceFundApi.fetchEstimatedRedemptions(
                params
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getEstimatedRedemptionsError", err);
    }
}

/**
 * Fetches pending redemptions based on provided parameters.
 *
 * @this InjectiveGrpcBase
 * @param {InsuranceTypes.GetPendingRedemptionsParams} params - Parameters to filter pending redemptions.
 * @returns {Promise<StandardResponse>} The standard response containing pending redemptions or an error.
 */
export async function getPendingRedemptions(
    this: InjectiveGrpcBase,
    params: GetPendingRedemptionsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcInsuranceFundApi.fetchPendingRedemptions(
                params
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPendingRedemptionsError", err);
    }
}

/**
 * Broadcasts a message to create a new insurance fund.
 *
 * @this InjectiveGrpcBase
 * @param {InsuranceTypes.MsgCreateInsuranceFundParams} params - Parameters to create the insurance fund.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgCreateInsuranceFund(
    this: InjectiveGrpcBase,
    params: MsgCreateInsuranceFundParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCreateInsuranceFund.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCreateInsuranceFundError", err);
    }
}

/**
 * Broadcasts a message to request a redemption from an insurance fund.
 *
 * @this InjectiveGrpcBase
 * @param {InsuranceTypes.MsgRequestRedemptionParams} params - Parameters to request the redemption.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgRequestRedemption(
    this: InjectiveGrpcBase,
    params: MsgRequestRedemptionParams
): Promise<StandardResponse> {
    try {
        const msg = MsgRequestRedemption.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgRequestRedemptionError", err);
    }
}

/**
 * Broadcasts a message to underwrite an insurance fund.
 *
 * @this InjectiveGrpcBase
 * @param {InsuranceTypes.MsgUnderwriteParams} params - Parameters to underwrite the insurance fund.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgUnderwrite(
    this: InjectiveGrpcBase,
    params: MsgUnderwriteParams
): Promise<StandardResponse> {
    try {
        const msg = MsgUnderwrite.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgUnderwriteError", err);
    }
}
