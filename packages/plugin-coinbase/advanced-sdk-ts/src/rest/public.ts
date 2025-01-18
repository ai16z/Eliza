import { API_PREFIX } from '../constants';
import type { RESTBase } from './rest-base';
import type {
    GetPublicMarketTradesRequest,
    GetPublicMarketTradesResponse,
    GetPublicProductBookRequest,
    GetPublicProductBookResponse,
    GetPublicProductCandlesRequest,
    GetPublicProductCandlesResponse,
    GetPublicProductRequest,
    GetPublicProductResponse,
    GetServerTimeResponse,
    ListPublicProductsRequest,
    ListPublicProductsResponse,
} from './types/public-types';
import { method } from './types/request-types';

// [GET] Get Server Time
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getservertime
export function getServerTime(this: RESTBase): Promise<GetServerTimeResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/time`,
        isPublic: true,
    });
}

// [GET] Get Public Product Book
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicproductbook
export function getPublicProductBook(
    this: RESTBase,
    requestParams: GetPublicProductBookRequest
): Promise<GetPublicProductBookResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/market/product_book`,
        queryParams: requestParams,
        isPublic: true,
    });
}

// [GET] List Public Products
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicproducts
export function listPublicProducts(
    this: RESTBase,
    requestParams: ListPublicProductsRequest
): Promise<ListPublicProductsResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/market/products`,
        queryParams: requestParams,
        isPublic: true,
    });
}

// [GET] Get Public Product
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicproduct
export function getPublicProduct(
    this: RESTBase,
    { productId }: GetPublicProductRequest
): Promise<GetPublicProductResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/market/products/${productId}`,
        isPublic: true,
    });
}

// [GET] Get Public Product Candles
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpubliccandles
export function getPublicProductCandles(
    this: RESTBase,
    { productId, ...requestParams }: GetPublicProductCandlesRequest
): Promise<GetPublicProductCandlesResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/market/products/${productId}/candles`,
        queryParams: requestParams,
        isPublic: true,
    });
}

// [GET] Get Public Market Trades
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicmarkettrades
export function getPublicMarketTrades(
    this: RESTBase,
    { productId, ...requestParams }: GetPublicMarketTradesRequest
): Promise<GetPublicMarketTradesResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/products/${productId}/ticker`,
        queryParams: requestParams,
        isPublic: true,
    });
}
