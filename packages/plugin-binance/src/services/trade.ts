import { ORDER_TYPES, TIME_IN_FORCE } from "../constants/api";
import { ERROR_MESSAGES } from "../constants/errors";
import type {
    BinanceExchangeInfo,
    BinanceSymbolFilter,
    BinanceSymbolInfo,
} from "../types/api/price";
import type {
    BinanceNewOrderParams,
    BinanceOrderResponse,
} from "../types/api/trade";
import type { SpotTradeRequest, TradeResponse } from "../types/internal/config";
import { InvalidSymbolError, MinNotionalError } from "../types/internal/error";
import { BaseService } from "./base";

/**
 * Service for handling trading operations
 */
export class TradeService extends BaseService {
    /**
     * Execute a spot trade
     */
    async executeTrade(request: SpotTradeRequest): Promise<TradeResponse> {
        try {
            this.validateCredentials();
            await this.validateSymbol(request.symbol);

            const orderParams = this.buildOrderParams(request);
            const response = await this.client.newOrder(
                orderParams.symbol,
                orderParams.side,
                orderParams.type,
                orderParams
            );

            const data = response.data as BinanceOrderResponse;
            return {
                symbol: data.symbol,
                orderId: data.orderId,
                status: data.status,
                executedQty: data.executedQty,
                cummulativeQuoteQty: data.cummulativeQuoteQty,
                price: data.price,
                type: data.type,
                side: data.side,
            };
        } catch (error) {
            throw this.handleError(error, request.symbol);
        }
    }

    /**
     * Validate trading pair and get symbol information
     */
    private async validateSymbol(symbol: string): Promise<BinanceSymbolInfo> {
        const exchangeInfo = await this.client.exchangeInfo();
        const data = exchangeInfo.data as BinanceExchangeInfo;

        const symbolInfo = data.symbols.find((s) => s.symbol === symbol);
        if (!symbolInfo) {
            throw new InvalidSymbolError(symbol);
        }

        return symbolInfo;
    }

    /**
     * Build order parameters for the Binance API
     */
    private buildOrderParams(request: SpotTradeRequest): BinanceNewOrderParams {
        const params: BinanceNewOrderParams = {
            symbol: request.symbol.toUpperCase(),
            side: request.side,
            type: request.type,
            quantity: request.quantity.toString(),
        };

        if (request.type === ORDER_TYPES.LIMIT) {
            if (!request.price) {
                throw new Error(ERROR_MESSAGES.LIMIT_ORDER_PRICE_REQUIRED);
            }
            params.timeInForce = request.timeInForce || TIME_IN_FORCE.GTC;
            params.price = request.price.toString();
        }

        return params;
    }

    /**
     * Get minimum notional value from symbol filters
     */
    private getMinNotional(filters: BinanceSymbolFilter[]): string | undefined {
        const notionalFilter = filters.find((f) => f.filterType === "NOTIONAL");
        return notionalFilter?.minNotional;
    }

    /**
     * Check if order meets minimum notional value
     */
    private checkMinNotional(
        symbolInfo: BinanceSymbolInfo,
        quantity: number,
        price?: number
    ): void {
        const minNotional = this.getMinNotional(symbolInfo.filters);
        if (!minNotional) return;

        const notionalValue = price ? quantity * price : quantity; // For market orders, quantity is in quote currency

        if (Number.parseFloat(minNotional) > notionalValue) {
            throw new MinNotionalError(minNotional);
        }
    }
}
