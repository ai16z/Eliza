import { API_PREFIX } from '../constants';
import type { RESTBase } from './rest-base';
import type {
    AllocatePortfolioRequest,
    AllocatePortfolioResponse,
    GetPerpetualsPortfolioSummaryRequest,
    GetPerpetualsPortfolioSummaryResponse,
    GetPerpetualsPositionRequest,
    GetPerpetualsPositionResponse,
    GetPortfolioBalancesRequest,
    GetPortfolioBalancesResponse,
    ListPerpetualsPositionsRequest,
    ListPerpetualsPositionsResponse,
    OptInOutMultiAssetCollateralRequest,
    OptInOutMultiAssetCollateralResponse,
} from './types/perpetuals-types';
import { method } from './types/request-types';

// [POST] Allocate Portfolio
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_allocateportfolio
export function allocatePortfolio(
    this: RESTBase,
    requestParams: AllocatePortfolioRequest
): Promise<AllocatePortfolioResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/intx/allocate`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [GET] Get Perpetuals Portfolio Summary
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxportfoliosummary
export function getPerpetualsPortfolioSummary(
    this: RESTBase,
    { portfolioUuid }: GetPerpetualsPortfolioSummaryRequest
): Promise<GetPerpetualsPortfolioSummaryResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/intx/portfolio/${portfolioUuid}`,
        isPublic: false,
    });
}

// [GET] List Perpetuals Positions
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxpositions
export function listPerpetualsPositions(
    this: RESTBase,
    { portfolioUuid }: ListPerpetualsPositionsRequest
): Promise<ListPerpetualsPositionsResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/intx/positions/${portfolioUuid}`,
        isPublic: false,
    });
}

// [GET] Get Perpetuals Position
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxposition
export function getPerpertualsPosition(
    this: RESTBase,
    { portfolioUuid, symbol }: GetPerpetualsPositionRequest
): Promise<GetPerpetualsPositionResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/intx/positions/${portfolioUuid}/${symbol}`,
        isPublic: false,
    });
}

// [GET] Get Portfolio Balances
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxbalances
export function getPortfolioBalances(
    this: RESTBase,
    { portfolioUuid }: GetPortfolioBalancesRequest
): Promise<GetPortfolioBalancesResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/intx/balances/${portfolioUuid}`,
        isPublic: false,
    });
}

// [POST] Opt In or Out of Multi Asset Collateral
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_intxmultiassetcollateral
export function optInOutMultiAssetCollateral(
    this: RESTBase,
    requestParams: OptInOutMultiAssetCollateralRequest
): Promise<OptInOutMultiAssetCollateralResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/intx/multi_asset_collateral`,
        bodyParams: requestParams,
        isPublic: false,
    });
}
