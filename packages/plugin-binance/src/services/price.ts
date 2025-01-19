import { VALIDATION } from "../constants/defaults";
import { ERROR_MESSAGES } from "../constants/errors";
import type { BinanceTickerResponse } from "../types/api/price";
import type { PriceCheckRequest, PriceResponse } from "../types/internal/config";
import { BinanceError } from "../types/internal/error";
import { BaseService } from "./base";

/**
 * Service for handling price-related operations
 */
export class PriceService extends BaseService {
    /**
     * Get current price for a symbol
     */
    async getPrice(request: PriceCheckRequest): Promise<PriceResponse> {
        try {
            this.validateSymbol(request.symbol);

            const symbol = `${request.symbol}${request.quoteCurrency}`;
            const response = await this.client.tickerPrice(symbol);
            const data = response.data as BinanceTickerResponse;

            return {
                symbol,
                price: data.price,
                timestamp: Date.now(),
            };
        } catch (error) {
            throw this.handleError(error, request.symbol);
        }
    }

    /**
     * Validates symbol format
     */
    private validateSymbol(symbol: string): void {
        const trimmedSymbol = symbol.trim();
        if (
            trimmedSymbol.length < VALIDATION.SYMBOL.MIN_LENGTH ||
            trimmedSymbol.length > VALIDATION.SYMBOL.MAX_LENGTH
        ) {
            throw new BinanceError(ERROR_MESSAGES.INVALID_SYMBOL);
        }
    }

    /**
     * Format price for display
     */
    static formatPrice(price: number | string): string {
        const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
        return new Intl.NumberFormat("en-US", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
        }).format(numPrice);
    }
}
