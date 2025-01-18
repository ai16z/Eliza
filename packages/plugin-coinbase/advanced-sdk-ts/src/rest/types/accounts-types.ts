import type { Account } from './common-types';

// Get Account
export type GetAccountRequest = {
    // Path Params
    accountUuid: string;
};

export type GetAccountResponse = {
    account?: Account;
};

// List Accounts
export type ListAccountsRequest = {
    // Query Params
    limit?: number;
    cursor?: string;
    retailPortfolioId?: string;
};

export type ListAccountsResponse = {
    accounts?: Account[];
    has_next: boolean;
    cursor?: string;
    size?: number;
};
