export * from "./base";
export * from "./auction";
export * from "./auth";
export * from "./bank";
export * from "./distribution";
export * from "./exchange";
export * from "./explorer";
export * from "./gov";
export * from "./ibc";
export * from "./insurance";
export * from "./mint";
export * from "./mito";
export * from "./peggy";
export * from "./permissions";
export * from "./staking";
export * from "./token-factory";
export * from "./wasm";

// Generic Standard Response
export interface StandardResponse<T = any> {
    success: boolean;
    result: T;
}

// Helper functions with generic success type parameter
export function createSuccessResponse<T>(data: T): StandardResponse<T> {
    return {
        success: true,
        result: data,
    };
}
// Helper functions with generic error type parameter
export function createErrorResponse(
    code: string,
    details?: unknown
): StandardResponse {
    return {
        success: false,
        result: {
            code,
            details,
        },
    };
}
