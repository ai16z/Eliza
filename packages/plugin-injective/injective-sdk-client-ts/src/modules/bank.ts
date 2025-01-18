import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import { MsgSend, MsgMultiSend } from "@injectivelabs/sdk-ts";
import type * as BankTypes from "../types/bank";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

// Bank Module Chain GRPC Async Functions with Error Handling

/**
 * Fetches the bank module parameters.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing module parameters or an error.
 */
export async function getBankModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcBankApi.fetchModuleParams();

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getBankModuleParamsError", err);
    }
}

/**
 * Fetches the balance of a specific account.
 *
 * @this InjectiveGrpcBase
 * @param {BankTypes.GetBankBalanceParams} params - Parameters including account address.
 * @returns {Promise<StandardResponse>} The standard response containing the balance or an error.
 */
export async function getBankBalance(
    this: InjectiveGrpcBase,
    params: BankTypes.GetBankBalanceParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcBankApi.fetchBalance({
            ...params,
            accountAddress: this.injAddress,
        });

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getBankBalanceError", err);
    }
}

/**
 * Fetches all balances for the current account.
 *
 * @this InjectiveGrpcBase
 * @param {BankTypes.GetBankBalancesParams} params - Parameters including account identifier.
 * @returns {Promise<StandardResponse>} The standard response containing all balances or an error.
 */
export async function getBankBalances(
    this: InjectiveGrpcBase,
    params: BankTypes.GetBankBalancesParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcBankApi.fetchBalances(
            this.injAddress
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getBankBalancesError", err);
    }
}

/**
 * Fetches the total supply of all denominations.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing total supply or an error.
 */
export async function getTotalSupply(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcBankApi.fetchTotalSupply();

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getTotalSupplyError", err);
    }
}

/**
 * Fetches the total supply for all denominations.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing all total supplies or an error.
 */
export async function getAllTotalSupply(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcBankApi.fetchAllTotalSupply();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAllTotalSupplyError", err);
    }
}

/**
 * Fetches the supply of a specific denomination.
 *
 * @this InjectiveGrpcBase
 * @param {BankTypes.GetSupplyOfParams} params - Parameters including denomination.
 * @returns {Promise<StandardResponse>} The standard response containing the supply or an error.
 */
export async function getSupplyOf(
    this: InjectiveGrpcBase,
    params: BankTypes.GetSupplyOfParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcBankApi.fetchSupplyOf(params.denom);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSupplyOfError", err);
    }
}

/**
 * Fetches metadata for all denominations.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing denomination metadata or an error.
 */
export async function getDenomsMetadata(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcBankApi.fetchDenomsMetadata();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDenomsMetadataError", err);
    }
}

/**
 * Fetches metadata for a specific denomination.
 *
 * @this InjectiveGrpcBase
 * @param {BankTypes.GetDenomMetadataParams} params - Parameters including denomination.
 * @returns {Promise<StandardResponse>} The standard response containing denomination metadata or an error.
 */
export async function getDenomMetadata(
    this: InjectiveGrpcBase,
    params: BankTypes.GetDenomMetadataParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcBankApi.fetchDenomMetadata(
            params.denom
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDenomMetadataError", err);
    }
}

/**
 * Fetches the owners of a specific denomination.
 *
 * @this InjectiveGrpcBase
 * @param {BankTypes.GetDenomOwnersParams} params - Parameters including denomination.
 * @returns {Promise<StandardResponse>} The standard response containing denomination owners or an error.
 */
export async function getDenomOwners(
    this: InjectiveGrpcBase,
    params: BankTypes.GetDenomOwnersParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcBankApi.fetchDenomOwners(
            params.denom
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDenomOwnersError", err);
    }
}

/**
 * Sends tokens from one account to another.
 *
 * @this InjectiveGrpcBase
 * @param {BankTypes.MsgSendParams} params - Parameters including sender, receiver, and amount.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgSend(
    this: InjectiveGrpcBase,
    params: BankTypes.MsgSendParams
): Promise<StandardResponse> {
    try {
        const msg = MsgSend.fromJSON({
            amount: params.amount,
            srcInjectiveAddress: params.srcInjectiveAddress,
            dstInjectiveAddress: params.dstInjectiveAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgSendError", err);
    }
}

/**
 * Sends tokens from multiple senders to multiple receivers.
 *
 * @this InjectiveGrpcBase
 * @param {BankTypes.MsgMultiSendParams} params - Parameters including inputs and outputs.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgMultiSend(
    this: InjectiveGrpcBase,
    params: BankTypes.MsgMultiSendParams
): Promise<StandardResponse> {
    try {
        const msg = MsgMultiSend.fromJSON({
            inputs: params.inputs,
            outputs: params.outputs,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgMultiSendError", err);
    }
}
