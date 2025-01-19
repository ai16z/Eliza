import { API_PREFIX } from '../constants';
import type { RESTBase } from './rest-base';
import type {
    CreatePortfolioRequest,
    CreatePortfolioResponse,
    DeletePortfolioRequest,
    DeletePortfolioResponse,
    EditPortfolioRequest,
    EditPortfolioResponse,
    GetPortfolioBreakdownRequest,
    GetPortfolioBreakdownResponse,
    ListPortfoliosRequest,
    ListPortfoliosResponse,
    MovePortfolioFundsRequest,
    MovePortfolioFundsResponse,
} from './types/portfolios-types';
import { method } from './types/request-types';

// [GET] List Portfolios
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getportfolios
export function listPortfolios(
    this: RESTBase,
    requestParams: ListPortfoliosRequest
): Promise<ListPortfoliosResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/portfolios`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [POST] Create Portfolio
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_createportfolio
export function createPortfolio(
    this: RESTBase,
    requestParams: CreatePortfolioRequest
): Promise<CreatePortfolioResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/portfolios`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [POST] Move Portfolio Funds
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_moveportfoliofunds
export function movePortfolioFunds(
    this: RESTBase,
    requestParams: MovePortfolioFundsRequest
): Promise<MovePortfolioFundsResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/portfolios/move_funds`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [GET] Get Portfolio Breakdown
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getportfoliobreakdown
export function getPortfolioBreakdown(
    this: RESTBase,
    { portfolioUuid, ...requestParams }: GetPortfolioBreakdownRequest
): Promise<GetPortfolioBreakdownResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/portfolios/${portfolioUuid}`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [DELETE] Delete Portfolio
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_deleteportfolio
export function deletePortfolio(
    this: RESTBase,
    { portfolioUuid }: DeletePortfolioRequest
): Promise<DeletePortfolioResponse> {
    return this.request({
        method: method.DELETE,
        endpoint: `${API_PREFIX}/portfolios/${portfolioUuid}`,
        isPublic: false,
    });
}

// [PUT] Edit Portfolio
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_editportfolio
export function editPortfolio(
    this: RESTBase,
    { portfolioUuid, ...requestParams }: EditPortfolioRequest
): Promise<EditPortfolioResponse> {
    return this.request({
        method: method.PUT,
        endpoint: `${API_PREFIX}/portfolios/${portfolioUuid}`,
        bodyParams: requestParams,
        isPublic: false,
    });
}
