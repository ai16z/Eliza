import { API_PREFIX } from '../constants';
import type { RESTBase } from './rest-base';
import type {
    CommitConvertTradeRequest,
    CommitConvertTradeResponse,
    CreateConvertQuoteRequest,
    CreateConvertQuoteResponse,
    GetConvertTradeRequest,
    GetConvertTradeResponse,
} from './types/converts-types';
import { method } from './types/request-types';

// [POST] Create Convert Quote
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_createconvertquote
export function createConvertQuote(
    this: RESTBase,
    requestParams: CreateConvertQuoteRequest
): Promise<CreateConvertQuoteResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/convert/quote`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [GET] Get Convert Trade
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getconverttrade
export function getConvertTrade(
    this: RESTBase,
    { tradeId, ...requestParams }: GetConvertTradeRequest
): Promise<GetConvertTradeResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/convert/trade/${tradeId}`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [POST] Commit Connvert Trade
// https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_commitconverttrade
export function commitConvertTrade(
    this: RESTBase,
    { tradeId, ...requestParams }: CommitConvertTradeRequest
): Promise<CommitConvertTradeResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/convert/trade/${tradeId}`,
        bodyParams: requestParams,
        isPublic: false,
    });
}
