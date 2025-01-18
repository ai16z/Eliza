import type {
    PaginationOption,
    Pagination,
    ExecArgs,
    ExecPrivilegedArgs,
    ContractAccountsBalanceWithPagination,
    ContractStateWithPagination,
    ContractInfo,
    ContractCodeHistoryEntry,
    CodeInfoResponse,
} from "@injectivelabs/sdk-ts";
import type { CosmwasmWasmV1Query } from "@injectivelabs/core-proto-ts";
import type { AccessConfig } from "@injectivelabs/core-proto-ts/cjs/cosmwasm/wasm/v1/types";
import type { PaginationParams } from "./base";
// Wasm Module Params
// Param interfaces
export interface GetContractAccountsBalanceParams {
    contractAddress: string;
    pagination?: PaginationOption;
}

export interface GetContractStateParams {
    contractAddress: string;
    pagination?: PaginationOption;
}

export interface GetContractInfoParams {
    contractAddress: string;
}

export interface GetContractHistoryParams {
    contractAddress: string;
}

export interface GetSmartContractStateParams {
    contractAddress: string;
    query?: string | Record<string, any>;
}

export interface GetRawContractStateParams {
    contractAddress: string;
    query?: string;
}

export interface GetContractCodesParams {
    pagination?: PaginationOption;
}

export interface GetContractCodeParams {
    codeId: number;
}

export interface GetContractCodeContractsParams {
    codeId: number;
    pagination?: PaginationOption;
}

// Response interfaces
export interface GetContractAccountsBalanceResponse {
    balance: ContractAccountsBalanceWithPagination;
}

export interface GetContractStateResponse {
    state: ContractStateWithPagination;
}

export interface GetContractInfoResponse {
    contractInfo?: ContractInfo;
}

export interface GetContractHistoryResponse {
    entriesList: ContractCodeHistoryEntry[];
    pagination: Pagination;
}

export interface GetSmartContractStateResponse
    extends CosmwasmWasmV1Query.QuerySmartContractStateResponse {}

export interface GetRawContractStateResponse
    extends CosmwasmWasmV1Query.QueryRawContractStateResponse {}

export interface GetContractCodesResponse {
    codeInfosList: CodeInfoResponse[];
    pagination: Pagination;
}

export interface GetContractCodeResponse {
    codeInfo: CodeInfoResponse;
    data: Uint8Array;
}

export interface GetContractCodeContractsResponse {
    contractsList: string[];
    pagination: Pagination;
}

export interface ContractBalanceParams extends PaginationParams {
    contractAddress: string;
}

export interface ContractStateParams extends PaginationParams {
    contractAddress: string;
}

export interface SmartContractParams {
    contractAddress: string;
    query?: string | Record<string, any>;
}

export interface RawContractParams {
    contractAddress: string;
    query?: string;
}

export interface ContractCodeParams {
    codeId: number;
    pagination?: PaginationOption;
}

export interface MsgStoreCodeParams {
    wasmBytes: Uint8Array | string;
    instantiatePermission?: AccessConfig;
}
export interface MsgUpdateAdminParams {
    newAdmin: string;
    contract: string;
}
export interface MsgExecuteContractParams {
    funds?:
        | {
              denom: string;
              amount: string;
          }
        | {
              denom: string;
              amount: string;
          }[];
    sender: string;
    contractAddress: string;
    execArgs?: ExecArgs;
    exec?: {
        msg: object;
        action: string;
    };
    msg?: object;
}
export interface MsgMigrateContractParams {
    contract: string;
    codeId: number;
    msg: object;
}
export interface MsgInstantiateContractParams {
    admin: string;
    codeId: number;
    label: string;
    msg: Object;
    amount?: {
        denom: string;
        amount: string;
    };
}
export interface MsgExecuteContractCompatParams {
    funds?:
        | {
              denom: string;
              amount: string;
          }
        | {
              denom: string;
              amount: string;
          }[];
    contractAddress: string;
    execArgs?: ExecArgs;
    exec?: {
        msg: Record<string, any>;
        action: string;
    };
    msg?: Record<string, any>;
}
export interface MsgPrivilegedExecuteContractParams {
    funds: string;
    contractAddress: string;
    data: ExecPrivilegedArgs;
}
