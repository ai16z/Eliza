import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    MsgBurn,
    MsgChangeAdmin,
    MsgCreateDenom,
    MsgMint,
    MsgSetDenomMetadata,
} from "@injectivelabs/sdk-ts";
import type * as TokenFactoryTypes from "../types/token-factory";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

// Token Factory Module Async Functions with Error Handling

/**
 * Fetches all denominations created by a specific creator.
 *
 * @this InjectiveGrpcBase
 * @param {TokenFactoryTypes.GetDenomsFromCreatorParams} params - Parameters including the creator's address.
 * @returns {Promise<StandardResponse>} The standard response containing denominations or an error.
 */
export async function getDenomsFromCreator(
    this: InjectiveGrpcBase,
    params: TokenFactoryTypes.GetDenomsFromCreatorParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcTokenFactoryApi.fetchDenomsFromCreator(
                params.creator
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDenomsFromCreatorError", err);
    }
}

/**
 * Fetches the authority metadata for a specific denomination.
 *
 * @this InjectiveGrpcBase
 * @param {TokenFactoryTypes.GetDenomAuthorityMetadataParams} params - Parameters including creator and sub-denomination.
 * @returns {Promise<StandardResponse>} The standard response containing authority metadata or an error.
 */
export async function getDenomAuthorityMetadata(
    this: InjectiveGrpcBase,
    params: TokenFactoryTypes.GetDenomAuthorityMetadataParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcTokenFactoryApi.fetchDenomAuthorityMetadata(
                params.creator,
                params.subDenom
            );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getDenomAuthorityMetadataError", err);
    }
}

/**
 * Fetches the parameters of the Token Factory module.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing module parameters or an error.
 */
export async function getTokenFactoryModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcTokenFactoryApi.fetchModuleParams();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getTokenFactoryModuleParamsError", err);
    }
}

/**
 * Fetches the current state of the Token Factory module.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing module state or an error.
 */
export async function getTokenFactoryModuleState(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcTokenFactoryApi.fetchModuleState();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getTokenFactoryModuleStateError", err);
    }
}

/**
 * Broadcasts a message to burn tokens.
 *
 * @this InjectiveGrpcBase
 * @param {TokenFactoryTypes.MsgBurnParams} params - Parameters including sender and amount.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgBurn(
    this: InjectiveGrpcBase,
    params: TokenFactoryTypes.MsgBurnParams
): Promise<StandardResponse> {
    try {
        const msg = MsgBurn.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgBurnError", err);
    }
}

/**
 * Broadcasts a message to change the admin of a denomination.
 *
 * @this InjectiveGrpcBase
 * @param {TokenFactoryTypes.MsgChangeAdminParams} params - Parameters including sender, denom, and new admin address.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgChangeAdmin(
    this: InjectiveGrpcBase,
    params: TokenFactoryTypes.MsgChangeAdminParams
): Promise<StandardResponse> {
    try {
        const msg = MsgChangeAdmin.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgChangeAdminError", err);
    }
}

/**
 * Broadcasts a message to create a new denomination.
 *
 * @this InjectiveGrpcBase
 * @param {TokenFactoryTypes.MsgCreateDenomParams} params - Parameters including sender and sub-denomination.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgCreateDenom(
    this: InjectiveGrpcBase,
    params: TokenFactoryTypes.MsgCreateDenomParams
): Promise<StandardResponse> {
    try {
        const msg = MsgCreateDenom.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgCreateDenomError", err);
    }
}

/**
 * Broadcasts a message to mint new tokens.
 *
 * @this InjectiveGrpcBase
 * @param {TokenFactoryTypes.MsgMintParams} params - Parameters including sender and total amount to mint.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgMint(
    this: InjectiveGrpcBase,
    params: TokenFactoryTypes.MsgMintParams
): Promise<StandardResponse> {
    try {
        const msg = MsgMint.fromJSON({
            amount: params.totalAmount,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgMintError", err);
    }
}

/**
 * Broadcasts a message to set metadata for a denomination.
 *
 * @this InjectiveGrpcBase
 * @param {TokenFactoryTypes.MsgSetDenomMetadataParams} params - Parameters including sender and metadata details.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgSetDenomMetadata(
    this: InjectiveGrpcBase,
    params: TokenFactoryTypes.MsgSetDenomMetadataParams
): Promise<StandardResponse> {
    try {
        const msg = MsgSetDenomMetadata.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgSetDenomMetadataError", err);
    }
}
