import { Spot } from "@binance/connector";
import { elizaLogger } from "@elizaos/core";
import { API_DEFAULTS } from "../constants/api";
import { ERROR_MESSAGES } from "../constants/errors";
import type { BinanceConfig, ServiceOptions } from "../types/internal/config";
import {
    ApiError,
    AuthenticationError,
    BinanceError,
    InvalidSymbolError,
    MinNotionalError,
} from "../types/internal/error";

/**
 * Base service class with common functionality
 */
export abstract class BaseService {
    protected client: Spot;
    protected config: BinanceConfig;

    constructor(config?: BinanceConfig) {
        this.config = {
            baseURL: API_DEFAULTS.BASE_URL,
            timeout: API_DEFAULTS.TIMEOUT,
            ...config,
        };

        this.client = new Spot(this.config.apiKey, this.config.secretKey, {
            baseURL: this.config.baseURL,
            timeout: this.config.timeout,
        });
    }

    /**
     * Handles common error scenarios and transforms them into appropriate error types
     */
    protected handleError(error: unknown, context?: string): never {
        if (error instanceof BinanceError) {
            throw error;
        }

        const apiError = error as any;
        const errorResponse = apiError.response?.data;
        const errorCode = errorResponse?.code || apiError.code;
        const errorMessage = errorResponse?.msg || apiError.message;

        // Handle authentication errors
        if (apiError.response?.status === 401) {
            throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        // Handle minimum notional errors
        if (errorCode === -1013 && errorMessage?.includes("NOTIONAL")) {
            throw new MinNotionalError();
        }

        // Handle invalid symbol errors
        if (errorMessage?.includes("Invalid symbol")) {
            throw new InvalidSymbolError(context || "Unknown");
        }

        // Log unexpected errors for debugging
        elizaLogger.error("Unexpected API error:", {
            context,
            code: errorCode,
            message: errorMessage,
            response: errorResponse,
        });

        throw new ApiError(
            errorMessage || "An unexpected error occurred",
            errorCode || 500,
            errorResponse
        );
    }

    /**
     * Validates required API credentials
     */
    protected validateCredentials(): void {
        if (!this.config.apiKey || !this.config.secretKey) {
            throw new AuthenticationError("API credentials are required");
        }
    }

    /**
     * Merges default options with provided options
     */
    protected mergeOptions(options?: ServiceOptions): ServiceOptions {
        return {
            timeout: this.config.timeout,
            ...options,
        };
    }
}
