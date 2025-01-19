import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

/**
 * WasmX Module Async Functions with Error Handling
 */

/**
 * Fetches the parameters of the WasmX module.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing module parameters or an error.
 */
export async function getWasmxModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcWasmXApi.fetchModuleParams();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getWasmxModuleParamsError", err);
    }
}

/**
 * Fetches the current state of the WasmX module.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing module state or an error.
 */
export async function getWasmxModuleState(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcWasmXApi.fetchModuleState();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getWasmxModuleStateError", err);
    }
}
