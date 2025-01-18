import type { Portfolio, PortfolioBreakdown, PortfolioType } from './common-types';

// List Portfolios
export type ListPortfoliosRequest = {
    // Query Params
    portfolioType?: PortfolioType;
};

export type ListPortfoliosResponse = {
    portfolios?: Portfolio[];
};

// Create Portfolio
export type CreatePortfolioRequest = {
    // Body Params
    name: string;
};

export type CreatePortfolioResponse = {
    portfolio?: Portfolio;
};

// Move Portfolio Funds
export type MovePortfolioFundsRequest = {
    // Body Params
    funds: Record<string, any>;
    sourcePortfolioUuid: string;
    targetPortfolioUuid: string;
};

export type MovePortfolioFundsResponse = {
    source_portfolio_uuid?: string;
    target_portfolio_uuid?: string;
};

// Get Portfolio Breakdown
export type GetPortfolioBreakdownRequest = {
    // Path Params
    portfolioUuid: string;

    // Query Params
    currency?: string;
};

export type GetPortfolioBreakdownResponse = {
    breakdown?: PortfolioBreakdown;
};

// Delete Portfolio
export type DeletePortfolioRequest = {
    // Path Params
    portfolioUuid: string;
};

export type DeletePortfolioResponse = Record<string, never>;

// Edit Portfolio
export type EditPortfolioRequest = {
    // Path Params
    portfolioUuid: string;

    // Body Params
    name: string;
};

export type EditPortfolioResponse = {
    portfolio?: Portfolio;
};
