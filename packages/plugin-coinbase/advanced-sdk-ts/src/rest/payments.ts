import { API_PREFIX } from '../constants';
import type { RESTBase } from './rest-base';
import type {
    GetPaymentMethodRequest,
    GetPaymentMethodResponse,
    ListPaymentMethodsResponse,
} from './types/payments-types';
import { method } from './types/request-types';

// [GET] List Payment Methods
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpaymentmethods
export function listPaymentMethods(
    this: RESTBase
): Promise<ListPaymentMethodsResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/payment_methods`,
        isPublic: false,
    });
}

// [GET] Get Payment Method
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpaymentmethod
export function getPaymentMethod(
    this: RESTBase,
    { paymentMethodId }: GetPaymentMethodRequest
): Promise<GetPaymentMethodResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/payment_methods/${paymentMethodId}`,
        isPublic: false,
    });
}
