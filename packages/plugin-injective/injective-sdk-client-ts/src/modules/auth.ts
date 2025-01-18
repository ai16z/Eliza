import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types";

/**
 * Fetches the authentication module parameters.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing module parameters or an error.
 */
export async function getAuthModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcAuthApi.fetchModuleParams();

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAuthModuleParamsError", err);
    }
}

/**
 * Fetches the details of the current account.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing account details or an error.
 */
export async function getAccountDetails(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcAuthApi.fetchAccount(
            this.injAddress
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAccountDetailsError", err);
    }
}

/**
 * Fetches all accounts associated with the current address.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing all accounts or an error.
 */
export async function getAccounts(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcAuthApi.fetchAccounts();

        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getAccountsError", err);
    }
}
