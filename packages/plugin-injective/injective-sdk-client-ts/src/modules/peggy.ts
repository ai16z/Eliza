import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    PeggyModuleParams,
    MsgSendToEth,
    type TxResponse,
} from "@injectivelabs/sdk-ts";
import type { MsgSendToEthParams } from "../types/peggy";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

/**
 * Fetches the parameters of the Peggy module.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>}
 *          - On success: A standard response containing Peggy module parameters.
 *          - On failure: A standard response containing an error message.
 */
export async function getPeggyModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcPeggyApi.fetchModuleParams();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPeggyModuleParamsError", err);
    }
}

/**
 * Broadcasts a message to send tokens to an Ethereum address via IBC transfer.
 *
 * @this InjectiveGrpcBase
 * @param {MsgSendToEthParams} params - Parameters including the recipient address and transfer details.
 * @returns {Promise<StandardResponse>}
 *          - On success: A standard response containing the transaction result.
 *          - On failure: A standard response containing an error message.
 */
export async function msgSendToEth(
    this: InjectiveGrpcBase,
    params: MsgSendToEthParams
): Promise<StandardResponse> {
    try {
        const msg = MsgSendToEth.fromJSON({
            ...params,
            injectiveAddress: this.injAddress,
            address: this.ethAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgSendToEthError", err);
    }
}
