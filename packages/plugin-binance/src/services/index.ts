import type { BinanceConfig } from "../types/internal/config";
import { AccountService } from "./account";
import { PriceService } from "./price";
import { TradeService } from "./trade";

/**
 * Main service facade that coordinates between specialized services
 */
export class BinanceService {
    private priceService: PriceService;
    private tradeService: TradeService;
    private accountService: AccountService;

    constructor(config?: BinanceConfig) {
        this.priceService = new PriceService(config);
        this.tradeService = new TradeService(config);
        this.accountService = new AccountService(config);
    }

    /**
     * Price-related operations
     */
    async getPrice(...args: Parameters<PriceService["getPrice"]>) {
        return this.priceService.getPrice(...args);
    }

    static formatPrice = PriceService.formatPrice;

    /**
     * Trading operations
     */
    async executeTrade(...args: Parameters<TradeService["executeTrade"]>) {
        return this.tradeService.executeTrade(...args);
    }

    /**
     * Account operations
     */
    async getBalance(...args: Parameters<AccountService["getBalance"]>) {
        return this.accountService.getBalance(...args);
    }

    async getTradingStatus() {
        return this.accountService.getTradingStatus();
    }

    async checkBalance(...args: Parameters<AccountService["checkBalance"]>) {
        return this.accountService.checkBalance(...args);
    }
}

export { AccountService, PriceService, TradeService };
