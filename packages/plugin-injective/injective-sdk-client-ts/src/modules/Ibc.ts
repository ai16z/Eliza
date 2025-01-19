import type { InjectiveGrpcBase } from "../grpc/grpc-base.js";
import { PaginationOption } from "@injectivelabs/ts-types";
import { MsgTransfer, type TxResponse } from "@injectivelabs/sdk-ts";
import type * as IBCTypes from "../types/ibc"; // Assuming IBC types are in ibc.ts
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

/**
 * IBC Module Chain GRPC Async Functions with Error Handling
 */

/**
 * Fetches the denomination trace for a specific hash.
 *
 * @this InjectiveGrpcBase
 * @param {IBCTypes.GetDenomTraceParams} params - Parameters including the denomination hash.
 * @returns {Promise<StandardResponse>} The standard response containing the denomination trace or an error.
 */
export async function getDenomTrace(
    this: InjectiveGrpcBase,
    params: IBCTypes.GetDenomTraceParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcIbcApi.fetchDenomTrace(params.hash);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDenomTraceError", err);
    }
}

/**
 * Fetches a list of denomination traces with optional pagination.
 *
 * @this InjectiveGrpcBase
 * @param {IBCTypes.GetDenomsTraceParams} [params] - Optional parameters including pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing a list of denomination traces or an error.
 */
export async function getDenomsTrace(
    this: InjectiveGrpcBase,
    params: IBCTypes.GetDenomsTraceParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcIbcApi.fetchDenomsTrace(
            params.pagination
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDenomsTraceError", err);
    }
}

/**
 * Broadcasts an IBC transfer message.
 *
 * @this InjectiveGrpcBase
 * @param {IBCTypes.MsgIBCTransferParams} params - Parameters to perform the IBC transfer.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgIBCTransfer(
    this: InjectiveGrpcBase,
    params: IBCTypes.MsgIBCTransferParams
): Promise<StandardResponse> {
    try {
        const msg = MsgTransfer.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgIBCTransferError", err);
    }
}
