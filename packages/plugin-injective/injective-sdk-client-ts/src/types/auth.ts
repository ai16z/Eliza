import type {
    PaginationOption,
    GrantWithDecodedAuthorization,
    GrantAuthorizationWithDecodedAuthorization,
    Pagination,
    Msgs,
} from "@injectivelabs/sdk-ts";
import type { AddressParams } from "./base";
// Auth Module Params
// Start of Get Auth Module Request Parameters
export interface AuthAccountParams extends AddressParams {
    accountAddress: string;
}
export interface GetGrantsParams {
    granter: string;
    grantee: string;
    pagination?: PaginationOption;
}

export interface GetGranterGrantsParams {
    granter: string;
    pagination?: PaginationOption;
}

export interface GetGranteeGrantsParams {
    grantee: string;
    pagination?: PaginationOption;
}
export interface MsgGrantParams {
    messageType: string;
    grantee: string;
    granter: string;
}

export interface MsgAuthzExecParams {
    grantee: string;
    msgs: Msgs | Msgs[];
}
export interface MsgRevokeParams {
    messageType: string;
    grantee: string;
    granter: string;
}
// End of Get Auth Module Request Parameters
// Start of Auth Response Parameters
export interface GrantsResponse {
    pagination: Pagination;
    grants: GrantWithDecodedAuthorization[];
}

export interface GranterGrantsResponse {
    pagination: Pagination;
    grants: GrantAuthorizationWithDecodedAuthorization[];
}

export interface GranteeGrantsResponse {
    pagination: Pagination;
    grants: GrantAuthorizationWithDecodedAuthorization[];
}
// End of Auth Response Parameters
