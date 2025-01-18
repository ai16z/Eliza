import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import { MsgGrant, MsgRevoke, MsgAuthzExec } from "@injectivelabs/sdk-ts";
import type * as AuthzTypes from "../types/auth";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

/**
 * Fetches all grants based on provided parameters.
 *
 * @this InjectiveGrpcBase
 * @param {AuthzTypes.GetGrantsParams} params - Parameters to filter grants.
 * @returns {Promise<StandardResponse>} The standard response containing grants or an error.
 */
export async function getGrants(
    this: InjectiveGrpcBase,
    params: AuthzTypes.GetGrantsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcAuthZApi.fetchGrants(params);

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getGrantsError", err);
    }
}

/**
 * Fetches all grants granted by a specific granter.
 *
 * @this InjectiveGrpcBase
 * @param {AuthzTypes.GetGranterGrantsParams} params - Parameters including the granter's address.
 * @returns {Promise<StandardResponse>} The standard response containing grants or an error.
 */
export async function getGranterGrants(
    this: InjectiveGrpcBase,
    params: AuthzTypes.GetGranterGrantsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcAuthZApi.fetchGranterGrants(
            params.granter
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getGranterGrantsError", err);
    }
}

/**
 * Fetches all grants received by a specific grantee.
 *
 * @this InjectiveGrpcBase
 * @param {AuthzTypes.GetGranteeGrantsParams} params - Parameters including the grantee's address.
 * @returns {Promise<StandardResponse>} The standard response containing grants or an error.
 */
export async function getGranteeGrants(
    this: InjectiveGrpcBase,
    params: AuthzTypes.GetGranteeGrantsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcAuthZApi.fetchGranteeGrants(
            params.grantee
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getGranteeGrantsError", err);
    }
}

/**
 * Grants authorization to a grantee to perform specific actions on behalf of the granter.
 *
 * @this InjectiveGrpcBase
 * @param {AuthzTypes.MsgGrantParams} params - Parameters including message type, grantee, and granter.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgGrant(
    this: InjectiveGrpcBase,
    params: AuthzTypes.MsgGrantParams
): Promise<StandardResponse> {
    try {
        const msg = MsgGrant.fromJSON({
            messageType: params.messageType,
            grantee: params.grantee,
            granter: params.granter,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgGrantError", err);
    }
}

/**
 * Executes authorized messages on behalf of the grantee.
 *
 * @this InjectiveGrpcBase
 * @param {AuthzTypes.MsgAuthzExecParams} params - Parameters including grantee and messages to execute.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgExec(
    this: InjectiveGrpcBase,
    params: AuthzTypes.MsgAuthzExecParams
): Promise<StandardResponse> {
    try {
        const msg = MsgAuthzExec.fromJSON({
            grantee: params.grantee,
            msgs: params.msgs,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgExecError", err);
    }
}

/**
 * Revokes previously granted authorizations from a grantee.
 *
 * @this InjectiveGrpcBase
 * @param {AuthzTypes.MsgRevokeParams} params - Parameters including message type, grantee, and granter.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgRevoke(
    this: InjectiveGrpcBase,
    params: AuthzTypes.MsgRevokeParams
): Promise<StandardResponse> {
    try {
        const msg = MsgRevoke.fromJSON({
            messageType: params.messageType,
            grantee: params.grantee,
            granter: params.granter,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgRevokeError", err);
    }
}
