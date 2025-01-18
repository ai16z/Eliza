import { API_PREFIX } from '../constants';
import type { RESTBase } from './rest-base';
import type {
    GetBestBidAskRequest,
    GetBestBidAskResponse,
    GetMarketTradesRequest,
    GetMarketTradesResponse,
    GetProductBookRequest,
    GetProductBookResponse,
    GetProductCandlesRequest,
    GetProductCandlesResponse,
    GetProductRequest,
    GetProductResponse,
    ListProductsRequest,
    ListProductsResponse,
} from './types/products-types';
import { method } from './types/request-types';

// [GET] Get Best Bid Ask
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getbestbidask
export function getBestBidAsk(
    this: RESTBase,
    requestParams: GetBestBidAskRequest
): Promise<GetBestBidAskResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/best_bid_ask`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [GET] Get Product Book
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getproductbook
export function getProductBook(
    this: RESTBase,
    requestParams: GetProductBookRequest
): Promise<GetProductBookResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/product_book`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [GET] List Products
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getproducts
export function listProducts(
    this: RESTBase,
    requestParams: ListProductsRequest
): Promise<ListProductsResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/products`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [GET] Get Product
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getproduct
export function getProduct(
    this: RESTBase,
    { productId, ...requestParams }: GetProductRequest
): Promise<GetProductResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/products/${productId}`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [GET] Get Product Candles
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getcandles
export function getProductCandles(
    this: RESTBase,
    { productId, ...requestParams }: GetProductCandlesRequest
): Promise<GetProductCandlesResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/products/${productId}/candles`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [GET] Get Market Trades
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getmarkettrades
export function getMarketTrades(
    this: RESTBase,
    { productId, ...requestParams }: GetMarketTradesRequest
): Promise<GetMarketTradesResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/products/${productId}/ticker`,
        queryParams: requestParams,
        isPublic: false,
    });
}
