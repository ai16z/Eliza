import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import type * as PermissionsType from "../types/permissions";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

/**
 * Fetches addresses associated with a specific role.
 *
 * @this InjectiveGrpcBase
 * @param {GetAddressesByRoleParams} params - Parameters including the role identifier.
 * @returns {Promise<StandardResponse>}
 *          - On success: A standard response containing a list of addresses.
 *          - On failure: A standard response containing an error message.
 */
export async function getAddressesByRole(
    this: InjectiveGrpcBase,
    params: PermissionsType.GetAddressesByRoleParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcPermissionsApi.fetchAddressesByRole(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAddressesByRoleError", err);
    }
}

/**
 * Retrieves roles associated with a specific address.
 *
 * @this InjectiveGrpcBase
 * @param {GetAddressRolesParams} params - Parameters including the address identifier.
 * @returns {Promise<StandardResponse>}
 *          - On success: A standard response containing a list of roles.
 *          - On failure: A standard response containing an error message.
 */
export async function getAddressRoles(
    this: InjectiveGrpcBase,
    params: PermissionsType.GetAddressRolesParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcPermissionsApi.fetchAddressRoles(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAddressRolesError", err);
    }
}

/**
 * Retrieves all namespaces within the permissions module.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>}
 *          - On success: A standard response containing a list of namespaces.
 *          - On failure: A standard response containing an error message.
 */
export async function getAllNamespaces(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcPermissionsApi.fetchAllNamespaces();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAllNamespacesError", err);
    }
}

/**
 * Fetches the parameters of the Permissions module.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>}
 *          - On success: A standard response containing Permissions module parameters.
 *          - On failure: A standard response containing an error message.
 */
export async function getPermissionsModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcPermissionsApi.fetchModuleParams();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPermissionsModuleParamsError", err);
    }
}

/**
 * Retrieves the namespace associated with a specific denomination.
 *
 * @this InjectiveGrpcBase
 * @param {GetNamespaceByDenomParams} params - Parameters including the denomination identifier.
 * @returns {Promise<StandardResponse>}
 *          - On success: A standard response containing the namespace.
 *          - On failure: A standard response containing an error message.
 */
export async function getNamespaceByDenom(
    this: InjectiveGrpcBase,
    params: PermissionsType.GetNamespaceByDenomParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcPermissionsApi.fetchNamespaceByDenom(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getNamespaceByDenomError", err);
    }
}

/**
 * Retrieves vouchers associated with a specific address.
 *
 * @this InjectiveGrpcBase
 * @param {GetVouchersForAddressParams} params - Parameters including the address identifier.
 * @returns {Promise<StandardResponse>}
 *          - On success: A standard response containing a list of vouchers.
 *          - On failure: A standard response containing an error message.
 */
export async function getVouchersForAddress(
    this: InjectiveGrpcBase,
    params: PermissionsType.GetVouchersForAddressParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcPermissionsApi.fetchVouchersForAddress(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getVouchersForAddressError", err);
    }
}
