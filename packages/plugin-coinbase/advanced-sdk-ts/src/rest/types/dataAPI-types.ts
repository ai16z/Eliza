import type { PortfolioType } from './common-types';

// Get API Key Permissions
export type GetAPIKeyPermissionsResponse = {
    can_view?: boolean;
    can_trade?: boolean;
    can_transfer?: boolean;
    portfolio_uuid?: string;
    portfolio_type?: PortfolioType;
};
