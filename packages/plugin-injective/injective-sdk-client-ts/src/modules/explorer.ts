import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import type * as ExplorerTypes from "../types/explorer";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

/**
 * Explorer Module Chain GRPC Async Functions with Error Handling
 */

/**
 * Fetches a transaction by its hash.
 *
 * @this InjectiveGrpcBase
 * @param {ExplorerTypes.GetTxByHashParams} params - Parameters including the transaction hash.
 * @returns {Promise<StandardResponse>} The standard response containing transaction details or an error.
 */
export async function getTxByHash(
    this: InjectiveGrpcBase,
    params: ExplorerTypes.GetTxByHashParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcExplorerApi.fetchTxByHash(
            params.hash
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getTxByHashError", err);
    }
}

/**
 * Fetches transactions for a specific account.
 *
 * @this InjectiveGrpcBase
 * @param {ExplorerTypes.GetAccountTxParams} params - Parameters including account details.
 * @returns {Promise<StandardResponse>} The standard response containing account transactions or an error.
 */
export async function getAccountTx(
    this: InjectiveGrpcBase,
    params: ExplorerTypes.GetAccountTxParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcExplorerApi.fetchAccountTx(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAccountTxError", err);
    }
}

/**
 * Fetches details of a specific validator.
 *
 * @this InjectiveGrpcBase
 * @param {ExplorerTypes.GetExplorerValidatorParams} params - Parameters including the validator's address.
 * @returns {Promise<StandardResponse>} The standard response containing validator details or an error.
 */
export async function getValidator(
    this: InjectiveGrpcBase,
    params: ExplorerTypes.GetExplorerValidatorParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcExplorerApi.fetchValidator(
            params.address
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getValidatorError", err);
    }
}

/**
 * Fetches the uptime of a specific validator.
 *
 * @this InjectiveGrpcBase
 * @param {ExplorerTypes.GetValidatorUptimeParams} params - Parameters including the validator's address.
 * @returns {Promise<StandardResponse>} The standard response indicating validator uptime or an error.
 */
export async function getValidatorUptime(
    this: InjectiveGrpcBase,
    params: ExplorerTypes.GetValidatorUptimeParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcExplorerApi.fetchValidatorUptime(
            params.validatorAddress
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getValidatorUptimeError", err);
    }
}

/**
 * Fetches Peggy deposit transactions.
 *
 * @this InjectiveGrpcBase
 * @param {ExplorerTypes.GetPeggyDepositTxsParams} params - Parameters to filter Peggy deposit transactions.
 * @returns {Promise<StandardResponse>} The standard response containing Peggy deposit transactions or an error.
 */
export async function getPeggyDepositTxs(
    this: InjectiveGrpcBase,
    params: ExplorerTypes.GetPeggyDepositTxsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcExplorerApi.fetchPeggyDepositTxs(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPeggyDepositTxsError", err);
    }
}

/**
 * Fetches Peggy withdrawal transactions.
 *
 * @this InjectiveGrpcBase
 * @param {ExplorerTypes.GetPeggyWithdrawalTxsParams} params - Parameters to filter Peggy withdrawal transactions.
 * @returns {Promise<StandardResponse>} The standard response containing Peggy withdrawal transactions or an error.
 */
export async function getPeggyWithdrawalTxs(
    this: InjectiveGrpcBase,
    params: ExplorerTypes.GetPeggyWithdrawalTxsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcExplorerApi.fetchPeggyWithdrawalTxs(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getPeggyWithdrawalTxsError", err);
    }
}

/**
 * Fetches a list of blocks based on provided parameters.
 *
 * @this InjectiveGrpcBase
 * @param {ExplorerTypes.GetBlocksParams} params - Parameters to filter blocks.
 * @returns {Promise<StandardResponse>} The standard response containing blocks or an error.
 */
export async function getBlocks(
    this: InjectiveGrpcBase,
    params: ExplorerTypes.GetBlocksParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcExplorerApi.fetchBlocks(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getBlocksError", err);
    }
}

/**
 * Fetches details of a specific block by its ID.
 *
 * @this InjectiveGrpcBase
 * @param {ExplorerTypes.GetBlockParams} params - Parameters including the block ID.
 * @returns {Promise<StandardResponse>} The standard response containing block details or an error.
 */
export async function getBlock(
    this: InjectiveGrpcBase,
    params: ExplorerTypes.GetBlockParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcExplorerApi.fetchBlock(params.id);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getBlockError", err);
    }
}

/**
 * Fetches a list of transactions based on provided parameters.
 *
 * @this InjectiveGrpcBase
 * @param {ExplorerTypes.GetTxsParams} params - Parameters to filter transactions.
 * @returns {Promise<StandardResponse>} The standard response containing transactions or an error.
 */
export async function getTxs(
    this: InjectiveGrpcBase,
    params: ExplorerTypes.GetTxsParams
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcExplorerApi.fetchTxs(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getTxsError", err);
    }
}

/**
 * Fetches IBC transfer transactions based on provided parameters.
 *
 * @this InjectiveGrpcBase
 * @param {ExplorerTypes.GetIBCTransferTxsParams} params - Parameters to filter IBC transfer transactions.
 * @returns {Promise<StandardResponse>} The standard response containing IBC transfer transactions or an error.
 */
export async function getIBCTransferTxs(
    this: InjectiveGrpcBase,
    params: ExplorerTypes.GetIBCTransferTxsParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.indexerGrpcExplorerApi.fetchIBCTransferTxs(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getIBCTransferTxsError", err);
    }
}

/**
 * Fetches explorer statistics.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing explorer statistics or an error.
 */
export async function getExplorerStats(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.indexerGrpcExplorerApi.fetchExplorerStats();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getStatsError", err);
    }
}
