import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    MsgStoreCode,
    MsgUpdateAdmin,
    MsgExecuteContract,
    MsgMigrateContract,
    MsgInstantiateContract,
    MsgExecuteContractCompat,
    MsgPrivilegedExecuteContract,
} from "@injectivelabs/sdk-ts";
import type * as WasmTypes from "../types/wasm";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

// Wasm Module Async Functions with Error Handling

/**
 * Fetches the balance of contract accounts.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.GetContractAccountsBalanceParams} params - Parameters including contract addresses and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing contract accounts balance or an error.
 */
export async function getContractAccountsBalance(
    this: InjectiveGrpcBase,
    params: WasmTypes.GetContractAccountsBalanceParams
): Promise<StandardResponse> {
    try {
        const result =
            await this.chainGrpcWasmApi.fetchContractAccountsBalance(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getContractAccountsBalanceError", err);
    }
}

/**
 * Fetches the state of a specific contract.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.GetContractStateParams} params - Parameters including the contract address.
 * @returns {Promise<StandardResponse>} The standard response containing contract state or an error.
 */
export async function getContractState(
    this: InjectiveGrpcBase,
    params: WasmTypes.GetContractStateParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcWasmApi.fetchContractState(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getContractStateError", err);
    }
}

/**
 * Fetches information about a specific contract.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.GetContractInfoParams} params - Parameters including the contract address.
 * @returns {Promise<StandardResponse>} The standard response containing contract info or an error.
 */
export async function getContractInfo(
    this: InjectiveGrpcBase,
    params: WasmTypes.GetContractInfoParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcWasmApi.fetchContractInfo(
            params.contractAddress
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getContractInfoError", err);
    }
}

/**
 * Fetches the history of a specific contract.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.GetContractHistoryParams} params - Parameters including the contract address.
 * @returns {Promise<StandardResponse>} The standard response containing contract history or an error.
 */
export async function getContractHistory(
    this: InjectiveGrpcBase,
    params: WasmTypes.GetContractHistoryParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcWasmApi.fetchContractHistory(
            params.contractAddress
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getContractHistoryError", err);
    }
}

/**
 * Fetches the smart contract state based on a query.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.GetSmartContractStateParams} params - Parameters including contract address and query.
 * @returns {Promise<StandardResponse>} The standard response containing smart contract state or an error.
 */
export async function getSmartContractState(
    this: InjectiveGrpcBase,
    params: WasmTypes.GetSmartContractStateParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcWasmApi.fetchSmartContractState(
            params.contractAddress,
            params.query
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getSmartContractStateError", err);
    }
}

/**
 * Fetches the raw state of a specific contract based on a query.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.GetRawContractStateParams} params - Parameters including contract address and query.
 * @returns {Promise<StandardResponse>} The standard response containing raw contract state or an error.
 */
export async function getRawContractState(
    this: InjectiveGrpcBase,
    params: WasmTypes.GetRawContractStateParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcWasmApi.fetchRawContractState(
            params.contractAddress,
            params.query
        );

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getRawContractStateError", err);
    }
}

/**
 * Fetches all contract codes with optional pagination.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.GetContractCodesParams} params - Parameters including pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing contract codes or an error.
 */
export async function getContractCodes(
    this: InjectiveGrpcBase,
    params: WasmTypes.GetContractCodesParams = {}
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcWasmApi.fetchContractCodes(
            params.pagination
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getContractCodesError", err);
    }
}

/**
 * Fetches a specific contract code by its ID.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.GetContractCodeParams} params - Parameters including the code ID.
 * @returns {Promise<StandardResponse>} The standard response containing contract code or an error.
 */
export async function getContractCode(
    this: InjectiveGrpcBase,
    params: WasmTypes.GetContractCodeParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcWasmApi.fetchContractCode(
            params.codeId
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getContractCodeError", err);
    }
}

/**
 * Fetches contracts associated with a specific contract code with optional pagination.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.GetContractCodeContractsParams} params - Parameters including code ID and pagination options.
 * @returns {Promise<StandardResponse>} The standard response containing contracts or an error.
 */
export async function getContractCodeContracts(
    this: InjectiveGrpcBase,
    params: WasmTypes.GetContractCodeContractsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcWasmApi.fetchContractCodeContracts(
            params.codeId,
            params.pagination
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getContractCodeContractsError", err);
    }
}

/**
 * Broadcasts a message to store new contract code.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.MsgStoreCodeParams} params - Parameters including sender and wasm bytecode.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgStoreCode(
    this: InjectiveGrpcBase,
    params: WasmTypes.MsgStoreCodeParams
): Promise<StandardResponse> {
    try {
        const msg = MsgStoreCode.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgStoreCodeError", err);
    }
}

/**
 * Broadcasts a message to update the admin of a contract.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.MsgUpdateAdminParams} params - Parameters including sender, contract address, and new admin address.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgUpdateAdmin(
    this: InjectiveGrpcBase,
    params: WasmTypes.MsgUpdateAdminParams
): Promise<StandardResponse> {
    try {
        const msg = MsgUpdateAdmin.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgUpdateAdminError", err);
    }
}

/**
 * Broadcasts a message to execute a contract.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.MsgExecuteContractParams} params - Parameters including sender, contract address, and execute message.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgExecuteContract(
    this: InjectiveGrpcBase,
    params: WasmTypes.MsgExecuteContractParams
): Promise<StandardResponse> {
    try {
        const msg = MsgExecuteContract.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgExecuteContractError", err);
    }
}

/**
 * Broadcasts a message to migrate a contract to a new code version.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.MsgMigrateContractParams} params - Parameters including sender, contract address, new code ID, and migrate message.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgMigrateContract(
    this: InjectiveGrpcBase,
    params: WasmTypes.MsgMigrateContractParams
): Promise<StandardResponse> {
    try {
        const msg = MsgMigrateContract.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgMigrateContractError", err);
    }
}

/**
 * Broadcasts a message to instantiate a new contract.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.MsgInstantiateContractParams} params - Parameters including sender, code ID, instantiate message, and label.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgInstantiateContract(
    this: InjectiveGrpcBase,
    params: WasmTypes.MsgInstantiateContractParams
): Promise<StandardResponse> {
    try {
        const msg = MsgInstantiateContract.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgInstantiateContractError", err);
    }
}

/**
 * Broadcasts a message to execute a contract using compatibility mode.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.MsgExecuteContractCompatParams} params - Parameters including sender, contract address, and execute message.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgExecuteContractCompat(
    this: InjectiveGrpcBase,
    params: WasmTypes.MsgExecuteContractCompatParams
): Promise<StandardResponse> {
    try {
        const msg = MsgExecuteContractCompat.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgExecuteContractCompatError", err);
    }
}

/**
 * Broadcasts a privileged message to execute a contract.
 *
 * @this InjectiveGrpcBase
 * @param {WasmTypes.MsgPrivilegedExecuteContractParams} params - Parameters including sender, contract address, and execute message.
 * @returns {Promise<StandardResponse>} The standard response containing the broadcast result or an error.
 */
export async function msgPrivilegedExecuteContract(
    this: InjectiveGrpcBase,
    params: WasmTypes.MsgPrivilegedExecuteContractParams
): Promise<StandardResponse> {
    try {
        const msg = MsgPrivilegedExecuteContract.fromJSON({
            ...params,
            sender: this.injAddress,
        });
        const result = await this.msgBroadcaster.broadcast({ msgs: msg });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgPrivilegedExecuteContractError", err);
    }
}
