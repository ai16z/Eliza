import { API_PREFIX } from '../constants';
import type { RESTBase } from './rest-base';
import type {
    CancelOrdersRequest,
    CancelOrdersResponse,
    ClosePositionRequest,
    ClosePositionResponse,
    CreateOrderRequest,
    CreateOrderResponse,
    EditOrderPreviewRequest,
    EditOrderPreviewResponse,
    EditOrderRequest,
    EditOrderResponse,
    GetOrderRequest,
    GetOrderResponse,
    ListFillsRequest,
    ListFillsResponse,
    ListOrdersRequest,
    ListOrdersResponse,
    PreviewOrderRequest,
    PreviewOrderResponse,
} from './types/orders-types';
import { method } from './types/request-types';

// [POST] Create Order
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_postorder
export function createOrder(
    this: RESTBase,
    requestParams: CreateOrderRequest
): Promise<CreateOrderResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/orders`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [POST] Cancel Orders
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_cancelorders
export function cancelOrders(
    this: RESTBase,
    requestParams: CancelOrdersRequest
): Promise<CancelOrdersResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/orders/batch_cancel`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [POST] Edit Order
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_editorder
export function editOrder(
    this: RESTBase,
    requestParams: EditOrderRequest
): Promise<EditOrderResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/orders/edit`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [POST] Edit Order Preview
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_previeweditorder
export function editOrderPreview(
    this: RESTBase,
    requestParams: EditOrderPreviewRequest
): Promise<EditOrderPreviewResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/orders/edit_preview`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [GET] List Orders
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gethistoricalorders
export function listOrders(
    this: RESTBase,
    requestParams: ListOrdersRequest
): Promise<ListOrdersResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/orders/historical/batch`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [GET] List Fills
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfills
export function listFills(
    this: RESTBase,
    requestParams: ListFillsRequest
): Promise<ListFillsResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/orders/historical/fills`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [GET] Get Order
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gethistoricalorder
export function getOrder(
    this: RESTBase,
    { orderId }: GetOrderRequest
): Promise<GetOrderResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/orders/historical/${orderId}`,
        isPublic: false,
    });
}

// [POST] Preview Order
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_previeworder
export function previewOrder(
    this: RESTBase,
    requestParams: PreviewOrderRequest
): Promise<PreviewOrderResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/orders/preview`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [POST] Close Position
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_closeposition
export function closePosition(
    this: RESTBase,
    requestParams: ClosePositionRequest
): Promise<ClosePositionResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/orders/close_position`,
        queryParams: undefined,
        bodyParams: requestParams,
        isPublic: false,
    });
}
