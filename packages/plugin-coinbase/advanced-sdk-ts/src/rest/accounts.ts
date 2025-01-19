import { API_PREFIX } from '../constants';
import type { RESTBase } from './rest-base';
import type {
    GetAccountRequest,
    GetAccountResponse,
    ListAccountsRequest,
    ListAccountsResponse,
} from './types/accounts-types';
import { method } from './types/request-types';

// [GET] Get Account
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccount
export function getAccount(
    this: RESTBase,
    { accountUuid }: GetAccountRequest
): Promise<GetAccountResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/accounts/${accountUuid}`,
        isPublic: false,
    });
}

// [GET] List Accounts
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccounts
export function listAccounts(
    this: RESTBase,
    requestParams: ListAccountsRequest
): Promise<ListAccountsResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/accounts`,
        queryParams: requestParams,
        isPublic: false,
    });
}
