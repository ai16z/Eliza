import { API_PREFIX } from '../constants';
import type { RESTBase } from './rest-base';

import { method } from './types/request-types';
import type { GetAPIKeyPermissionsResponse } from './types/dataAPI-types';

// [GET] Get API Key Permissions
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getapikeypermissions
export function getAPIKeyPermissions(
    this: RESTBase
): Promise<GetAPIKeyPermissionsResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/key_permissions`,
        isPublic: false,
    });
}
