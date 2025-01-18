import type {
    PerpetualPortfolio,
    PortfolioBalance,
    PortfolioSummary,
    Position,
    PositionSummary,
} from './common-types';

// Allocate Portfolio
export type AllocatePortfolioRequest = {
    // Body Params
    portfolioUuid: string;
    symbol: string;
    amount: string;
    currency: string;
};

export type AllocatePortfolioResponse = Record<string, never>;

// Get Perpetuals Portfolio Summary
export type GetPerpetualsPortfolioSummaryRequest = {
    // Path Params
    portfolioUuid: string;
};

export type GetPerpetualsPortfolioSummaryResponse = {
    portfolios?: PerpetualPortfolio[];
    summary?: PortfolioSummary;
};

// List Perpetuals Positions
export type ListPerpetualsPositionsRequest = {
    // Path Params
    portfolioUuid: string;
};

export type ListPerpetualsPositionsResponse = {
    positions?: Position[];
    summary?: PositionSummary;
};

// Get Perpetuals Position
export type GetPerpetualsPositionRequest = {
    // Path Params
    portfolioUuid: string;
    symbol: string;
};

export type GetPerpetualsPositionResponse = {
    position?: Position;
};

// Get Portfolio Balances
export type GetPortfolioBalancesRequest = {
    // Path Params
    portfolioUuid: string;
};

export type GetPortfolioBalancesResponse = {
    portfolio_balancces?: PortfolioBalance[];
};

// Opt In or Out of Multi Asset Collateral
export type OptInOutMultiAssetCollateralRequest = {
    // Body Params
    portfolioUuid?: string;
    multiAssetCollateralEnabled?: boolean;
};

export type OptInOutMultiAssetCollateralResponse = {
    cross_collateral_enabled?: boolean;
};
