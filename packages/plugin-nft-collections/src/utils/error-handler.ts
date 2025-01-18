import { z } from "zod";

// Error Types
export enum ErrorType {
    VALIDATION = "VALIDATION",
    NETWORK = "NETWORK",
    RATE_LIMIT = "RATE_LIMIT",
    API = "API",
    INTERNAL = "INTERNAL",
}

// Error Codes
export enum ErrorCode {
    // Validation Errors
    INVALID_ADDRESS = "INVALID_ADDRESS",
    INVALID_TOKEN_ID = "INVALID_TOKEN_ID",
    INVALID_PRICE = "INVALID_PRICE",
    INVALID_DATA = "INVALID_DATA",

    // Network Errors
    REQUEST_TIMEOUT = "REQUEST_TIMEOUT",
    NETWORK_ERROR = "NETWORK_ERROR",

    // Rate Limit Errors
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

    // API Errors
    API_ERROR = "API_ERROR",
    API_KEY_INVALID = "API_KEY_INVALID",
    API_RESPONSE_INVALID = "API_RESPONSE_INVALID",

    // Internal Errors
    INTERNAL_ERROR = "INTERNAL_ERROR",
    CACHE_ERROR = "CACHE_ERROR",
}

// Error Schema
const ErrorSchema = z.object({
    type: z.nativeEnum(ErrorType),
    code: z.nativeEnum(ErrorCode),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
    timestamp: z.date(),
    retryable: z.boolean(),
});

export type NFTError = z.infer<typeof ErrorSchema>;

// Error Factory
export class NFTErrorFactory {
    static create(
        type: ErrorType,
        code: ErrorCode,
        message: string,
        details?: Record<string, unknown>,
        retryable = false
    ): NFTError {
        return ErrorSchema.parse({
            type,
            code,
            message,
            details,
            timestamp: new Date(),
            retryable,
        });
    }

    static fromError(error: unknown): NFTError {
        if (error instanceof Error) {
            return this.create(
                ErrorType.INTERNAL,
                ErrorCode.INTERNAL_ERROR,
                error.message,
                { stack: error.stack },
                false
            );
        }
        return this.create(
            ErrorType.INTERNAL,
            ErrorCode.INTERNAL_ERROR,
            "Unknown error occurred",
            { error },
            false
        );
    }
}

// Error Handler
export class ErrorHandler {
    private static instance: ErrorHandler;
    private errorCallbacks: Array<(error: NFTError) => void> = [];

    private constructor() {}

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    registerErrorCallback(callback: (error: NFTError) => void): void {
        this.errorCallbacks.push(callback);
    }

    handleError(error: NFTError): void {
        // Log the error
        console.error(JSON.stringify(error, null, 2));

        // Execute registered callbacks
        this.errorCallbacks.forEach((callback) => {
            try {
                callback(error);
            } catch (callbackError) {
                console.error("Error in error callback:", callbackError);
            }
        });

        // Handle specific error types
        switch (error.type) {
            case ErrorType.RATE_LIMIT:
                this.handleRateLimitError(error);
                break;
            case ErrorType.NETWORK:
                this.handleNetworkError(error);
                break;
            case ErrorType.API:
                this.handleAPIError(error);
                break;
            default:
                break;
        }
    }

    private handleRateLimitError(error: NFTError): void {
        if (error.retryable) {
            // Implement retry logic with exponential backoff
            console.log("Rate limit error will be retried");
        }
    }

    private handleNetworkError(error: NFTError): void {
        if (error.retryable) {
            // Implement network retry logic
            console.log("Network error will be retried");
        }
    }

    private handleAPIError(error: NFTError): void {
        if (error.code === ErrorCode.API_KEY_INVALID) {
            // Handle invalid API key
            console.error("Invalid API key detected");
        }
    }
}

// Error Utilities
export function isRetryableError(error: NFTError): boolean {
    return error.retryable;
}

export function shouldRetry(
    error: NFTError,
    attempt: number,
    maxRetries: number
): boolean {
    return isRetryableError(error) && attempt < maxRetries;
}

export function getRetryDelay(
    attempt: number,
    baseDelay = 1000
): number {
    return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
}

// Usage Example:
/*
try {
    // Your code here
} catch (error) {
    const nftError = NFTErrorFactory.create(
        ErrorType.API,
        ErrorCode.API_ERROR,
        'API request failed',
        { originalError: error },
        true
    );
    ErrorHandler.getInstance().handleError(nftError);
}
*/
