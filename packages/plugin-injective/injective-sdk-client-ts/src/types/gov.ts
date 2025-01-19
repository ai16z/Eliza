import type {
    PaginationOption,
    Pagination,
    Msgs,
    GovModuleStateParams,
    Proposal,
    ProposalDeposit,
    Vote,
    TallyResult,
} from "@injectivelabs/sdk-ts";
import type { PaginationParams } from "./base";
import type {
    CosmosGovV1Gov,
    InjectiveExchangeV1Beta1Exchange,
    InjectiveOracleV1Beta1Oracle,
} from "@injectivelabs/core-proto-ts";
// Governance Module Params
export interface GetProposalsParams {
    status: CosmosGovV1Gov.ProposalStatus;
    pagination?: PaginationOption;
}

export interface GetProposalParams {
    proposalId: number;
}

export interface GetProposalDepositsParams {
    proposalId: number;
    pagination?: PaginationOption;
}

export interface GetProposalVotesParams {
    proposalId: number;
    pagination?: PaginationOption;
}

export interface GetProposalTallyParams {
    proposalId: number;
}

// Response interfaces
export interface GovernanceModuleParamsResponse {
    params: GovModuleStateParams;
}

export interface GetProposalsResponse {
    proposals: Proposal[];
    pagination: Pagination;
}

export interface GetProposalResponse {
    proposal: Proposal;
}

export interface GetProposalDepositsResponse {
    deposits: ProposalDeposit[];
    pagination: Pagination;
}

export interface GetProposalVotesResponse {
    votes: Vote[];
    pagination: Pagination;
}

export interface GetProposalTallyResponse {
    tally: TallyResult;
}

export interface ProposalParams extends PaginationParams {
    status: CosmosGovV1Gov.ProposalStatus;
}

export interface ProposalQueryParams {
    proposalId: number;
}

export interface MsgSubmitProposalExpiryFuturesMarketLaunchParams {
    market: {
        title: string;
        description: string;
        ticker: string;
        quoteDenom: string;
        oracleBase: string;
        oracleQuote: string;
        expiry: number;
        oracleScaleFactor: number;
        oracleType: InjectiveOracleV1Beta1Oracle.OracleType;
        initialMarginRatio: string;
        maintenanceMarginRatio: string;
        makerFeeRate: string;
        takerFeeRate: string;
        minPriceTickSize: string;
        minQuantityTickSize: string;
    };
    deposit: {
        amount: string;
        denom: string;
    };
}

export interface MsgSubmitProposalSpotMarketLaunchParams {
    market: {
        title: string;
        description: string;
        ticker: string;
        baseDenom: string;
        quoteDenom: string;
        minPriceTickSize: string;
        minQuantityTickSize: string;
        makerFeeRate: string;
        takerFeeRate: string;
        minNotional: string;
    };
    deposit: {
        amount: string;
        denom: string;
    };
}

export interface MsgSubmitProposalPerpetualMarketLaunchParams {
    market: {
        title: string;
        description: string;
        ticker: string;
        quoteDenom: string;
        oracleBase: string;
        oracleQuote: string;
        oracleScaleFactor: number;
        oracleType: InjectiveOracleV1Beta1Oracle.OracleType;
        initialMarginRatio: string;
        maintenanceMarginRatio: string;
        makerFeeRate: string;
        takerFeeRate: string;
        minPriceTickSize: string;
        minQuantityTickSize: string;
        minNotional: string;
    };
    deposit: {
        amount: string;
        denom: string;
    };
}

export interface MsgVoteParams {
    proposalId: number;
    metadata: string;
    vote: CosmosGovV1Gov.VoteOption;
}

export interface MsgSubmitTextProposalParams {
    title: string;
    description: string;
    deposit: {
        amount: string;
        denom: string;
    };
}

export interface MsgSubmitProposalSpotMarketParamUpdateParams {
    market: {
        title: string;
        description: string;
        marketId: string;
        makerFeeRate: string;
        takerFeeRate: string;
        relayerFeeShareRate: string;
        minPriceTickSize: string;
        minQuantityTickSize: string;
        ticker: string;
        status: InjectiveExchangeV1Beta1Exchange.MarketStatus;
    };
    deposit: {
        amount: string;
        denom: string;
    };
}

export interface MsgSubmitGenericProposalParams {
    title: string;
    summary: string;
    expedited?: boolean;
    metadata?: string;
    messages: Msgs[];
    deposit: {
        amount: string;
        denom: string;
    };
}

export interface MsgGovDepositParams {
    proposalId: number;
    amount: {
        denom: string;
        amount: string;
    };
}
