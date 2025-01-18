import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

/**
 * Fetches the parameters of the Oracle module.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>}
 *          - On success: A standard response containing Oracle module parameters.
 *          - On failure: A standard response containing an error message.
 */
export async function getOracleModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcOracleApi.fetchModuleParams();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getOracleModuleParamsError", err);
    }
}
