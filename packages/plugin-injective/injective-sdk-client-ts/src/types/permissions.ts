import type {
    Coin,
    PermissionsModuleParams,
    Namespace,
} from "@injectivelabs/sdk-ts";
import type { AddressParams } from "./base";

// Base parameter interfaces
// Permissions Module Params
// Param interfaces
export interface GetAddressesByRoleParams {
    denom: string;
    role: string;
}

export interface GetAddressRolesParams {
    address: string;
    denom: string;
}

export interface GetNamespaceByDenomParams {
    denom: string;
    includeRoles: boolean;
}

export interface GetVouchersForAddressParams {
    address: string;
}

// Response interfaces
export interface GetAddressesByRoleResponse {
    addresses: string[];
}

export interface GetAddressRolesResponse {
    roles: string[];
}

export interface GetAllNamespacesResponse {
    namespaces: Namespace[];
}

export interface GetPermissionsModuleParamsResponse {
    params: PermissionsModuleParams;
}

export interface GetNamespaceByDenomResponse {
    namespace: Namespace;
}

export interface GetVouchersForAddressResponse {
    vouchers: Coin[];
}
export interface RoleParams {
    denom: string;
    role: string;
}

export interface AddressRoleParams {
    address: string;
    denom: string;
}

export interface NamespaceParams {
    denom: string;
    includeRoles: boolean;
}

export interface VoucherParams extends AddressParams {}
