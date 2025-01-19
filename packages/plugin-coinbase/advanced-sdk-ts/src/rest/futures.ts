import { API_PREFIX } from '../constants';
import type { RESTBase } from './rest-base';
import type {
    CancelPendingFuturesSweep,
    GetCurrentMarginWindowRequest,
    GetCurrentMarginWindowResponse,
    GetFuturesBalanceSummaryResponse,
    GetFuturesPositionRequest,
    GetFuturesPositionResponse,
    GetIntradayMarginSettingResponse,
    ListFuturesPositionsResponse,
    ListFuturesSweepsResponse,
    ScheduleFuturesSweepRequest,
    ScheduleFuturesSweepResponse,
    SetIntradayMarginSettingRequest,
    SetIntradayMarginSettingResponse,
} from './types/futures-types';
import { method } from './types/request-types';

// [GET] Get Futures Balance Summary
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmbalancesummary
export function getFuturesBalanceSummary(
    this: RESTBase
): Promise<GetFuturesBalanceSummaryResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/cfm/balance_summary`,
        isPublic: false,
    });
}

// [GET] Get Intraday Margin Setting
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintradaymarginsetting
export function getIntradayMarginSetting(
    this: RESTBase
): Promise<GetIntradayMarginSettingResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/cfm/intraday/margin_setting`,
        isPublic: false,
    });
}

// [POST] Set Intraday Margin Setting
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_setintradaymarginsetting
export function setIntradayMarginSetting(
    this: RESTBase,
    requestParams: SetIntradayMarginSettingRequest
): Promise<SetIntradayMarginSettingResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/cfm/intraday/margin_setting`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [GET] Get Current Margin Window
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getcurrentmarginwindow
export function getCurrentMarginWindow(
    this: RESTBase,
    requestParams: GetCurrentMarginWindowRequest
): Promise<GetCurrentMarginWindowResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/cfm/intraday/current_margin_window`,
        queryParams: requestParams,
        isPublic: false,
    });
}

// [GET] List Futures Positions
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmpositions
export function listFuturesPositions(
    this: RESTBase
): Promise<ListFuturesPositionsResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/cfm/positions`,
        isPublic: false,
    });
}

// [GET] Get Futures Position
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmposition
export function getFuturesPosition(
    this: RESTBase,
    { productId }: GetFuturesPositionRequest
): Promise<GetFuturesPositionResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/cfm/positions/${productId}`,
        isPublic: false,
    });
}

// [POST] Schedule Futures Sweep
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_schedulefcmsweep
export function scheduleFuturesSweep(
    this: RESTBase,
    requestParams: ScheduleFuturesSweepRequest
): Promise<ScheduleFuturesSweepResponse> {
    return this.request({
        method: method.POST,
        endpoint: `${API_PREFIX}/cfm/sweeps/schedule`,
        bodyParams: requestParams,
        isPublic: false,
    });
}

// [GET] List Futures Sweeps
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmsweeps
export function listFuturesSweeps(
    this: RESTBase
): Promise<ListFuturesSweepsResponse> {
    return this.request({
        method: method.GET,
        endpoint: `${API_PREFIX}/cfm/sweeps`,
        isPublic: false,
    });
}

// [DELETE] Cancel Pending Futures Sweep
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_cancelfcmsweep
export function cancelPendingFuturesSweep(
    this: RESTBase
): Promise<CancelPendingFuturesSweep> {
    return this.request({
        method: method.DELETE,
        endpoint: `${API_PREFIX}/cfm/sweeps`,
        isPublic: false,
    });
}
