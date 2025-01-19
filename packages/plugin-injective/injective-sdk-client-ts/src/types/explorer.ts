import type {
    Transaction,
    ExplorerValidator,
    ValidatorUptime,
    PeggyDepositTx,
    PeggyWithdrawalTx,
    IBCTransferTx,
    ExplorerStats,
    ExchangePagination,
} from "@injectivelabs/sdk-ts";
import type { InjectiveExplorerRpc } from "@injectivelabs/indexer-proto-ts";
import type { TimeRangeParams } from "./base";
/// Explorer Module Params
export interface GetTxByHashParams {
    hash: string;
}
export interface GetExplorerValidatorParams {
    address: string;
}
export interface GetAccountTxParams {
    address: string;
    limit?: number;
    type?: string;
    before?: number;
    after?: number;
    startTime?: number;
    endTime?: number;
}

export interface GetValidatorUptimeParams {
    validatorAddress: string;
}

export interface GetPeggyDepositTxsParams {
    receiver?: string;
    sender?: string;
    limit?: number;
    skip?: number;
}

export interface GetPeggyWithdrawalTxsParams {
    sender?: string;
    receiver?: string;
    limit?: number;
    skip?: number;
}

export interface GetBlocksParams {
    before?: number;
    after?: number;
    limit?: number;
    from?: number;
    to?: number;
}

export interface GetBlockParams {
    id: string;
}

export interface GetTxsParams {
    before?: number;
    after?: number;
    limit?: number;
    skip?: number;
    type?: string;
    startTime?: number;
    endTime?: number;
    chainModule?: string;
}

export interface GetIBCTransferTxsParams {
    sender?: string;
    receiver?: string;
    srcChannel?: string;
    srcPort?: string;
    destChannel?: string;
    destPort?: string;
    limit?: number;
    skip?: number;
}

// Response interfaces
export interface GetTxByHashResponse {
    tx: Transaction;
}

export interface GetAccountTxResponse {
    txs: Transaction[];
    pagination: ExchangePagination;
}

export interface GetExplorerValidatorResponse {
    validator: ExplorerValidator;
}

export interface GetValidatorUptimeResponse {
    uptime: ValidatorUptime[];
}

export interface GetPeggyDepositTxsResponse {
    txs: PeggyDepositTx[];
}

export interface GetPeggyWithdrawalTxsResponse {
    txs: PeggyWithdrawalTx[];
}

export interface GetBlocksResponse
    extends InjectiveExplorerRpc.GetBlocksResponse {}

export interface GetBlockResponse
    extends InjectiveExplorerRpc.GetBlockResponse {}

export interface GetTxsResponse extends InjectiveExplorerRpc.GetTxsResponse {}

export interface GetIBCTransferTxsResponse {
    txs: IBCTransferTx[];
}

export interface GetExplorerStatsResponse {
    stats: ExplorerStats;
}

export interface AccountTxParams extends TimeRangeParams {
    address: string;
    limit?: number;
    type?: string;
    before?: number;
    after?: number;
}

export interface BlocksParams extends TimeRangeParams {
    before?: number;
    after?: number;
    limit?: number;
}

export interface BlockParams {
    id: string;
}

export interface TxsParams extends TimeRangeParams {
    before?: number;
    after?: number;
    limit?: number;
    skip?: number;
    type?: string;
    chainModule?: string;
}
