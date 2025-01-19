import type { PaginationOption } from "@injectivelabs/sdk-ts";
import type { DenomTrace } from "@injectivelabs/core-proto-ts/cjs/ibc/applications/transfer/v1/transfer.js";
import type { PaginationParams } from "./base";
//IBC params
export interface GetDenomTraceParams {
    hash: string;
}

export interface GetDenomsTraceParams {
    pagination?: PaginationOption;
}

// Response interfaces
export interface GetDenomTraceResponse {
    denomTrace: DenomTrace;
}

export interface GetDenomsTraceResponse {
    denomsTrace: DenomTrace[];
}

export interface IBCTransferParams extends PaginationParams {
    sender?: string;
    receiver?: string;
    srcChannel?: string;
    srcPort?: string;
    destChannel?: string;
    destPort?: string;
    limit?: number;
    skip?: number;
}

export interface MsgIBCTransferParams {
    amount: {
        denom: string;
        amount: string;
    };
    memo?: string;
    sender: string;
    port: string;
    receiver: string;
    channelId: string;
    timeout?: number;
    height?: {
        revisionHeight: number;
        revisionNumber: number;
    };
}
