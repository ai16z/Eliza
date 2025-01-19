import type {
    FCMBalanceSummary,
    FCMPosition,
    FCMSweep,
    IntradayMarginSetting,
} from './common-types';

// Get Futures Balance Summary
export type GetFuturesBalanceSummaryResponse = {
    balance_summary?: FCMBalanceSummary;
};

// Get Intraday Margin Setting
export type GetIntradayMarginSettingResponse = {
    setting?: IntradayMarginSetting;
};

// Set Intraday Margin Setting
export type SetIntradayMarginSettingRequest = {
    // Body Params
    setting?: IntradayMarginSetting;
};

export type SetIntradayMarginSettingResponse = Record<string, never>;

// Get Current Margin Window
export type GetCurrentMarginWindowRequest = {
    // Query Params
    marginProfileType?: string;
};

export type GetCurrentMarginWindowResponse = {
    margin_window?: Record<string, any>;
    is_intraday_margin_killswitch_enabled?: boolean;
    is_intraday_margin_enrollment_killswitch_enabled?: boolean;
};

// List Futures Positions
export type ListFuturesPositionsResponse = {
    positions?: FCMPosition[];
};

// Get Futures Position
export type GetFuturesPositionRequest = {
    // Path Params
    productId: string;
};

export type GetFuturesPositionResponse = {
    position?: FCMPosition;
};

// Schedule Futures Sweep
export type ScheduleFuturesSweepRequest = {
    // Body Params
    usdAmount?: string;
};

export type ScheduleFuturesSweepResponse = {
    success?: boolean;
};

// List Futures Sweeps
export type ListFuturesSweepsResponse = {
    sweeps: FCMSweep[];
};

// Cancel Pending Futures Sweep = {
export type CancelPendingFuturesSweep = {
    success?: boolean;
};
