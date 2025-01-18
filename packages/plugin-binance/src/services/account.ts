import type { BinanceAccountInfo, BinanceBalance } from "../types/api/account";
import type { BalanceCheckRequest, BalanceResponse } from "../types/internal/config";
import { BaseService } from "./base";

/**
 * Service for handling account-related operations
 */
export class AccountService extends BaseService {
    /**
     * Get account balance for all assets or a specific asset
     */
    async getBalance(request: BalanceCheckRequest): Promise<BalanceResponse> {
        try {
            this.validateCredentials();

            const response = await this.client.account();
            const accountInfo = response.data as BinanceAccountInfo;

            let balances = this.filterNonZeroBalances(accountInfo.balances);

            if (request.asset) {
                balances = this.filterByAsset(balances, request.asset);
            }

            return {
                balances,
                timestamp: Date.now(),
            };
        } catch (error) {
            throw this.handleError(
                error,
                request.asset ? `Asset: ${request.asset}` : "All assets"
            );
        }
    }

    /**
     * Filter out zero balances
     */
    private filterNonZeroBalances(
        balances: BinanceBalance[]
    ): BinanceBalance[] {
        return balances.filter(
            (balance) =>
                Number.parseFloat(balance.free) > 0 || Number.parseFloat(balance.locked) > 0
        );
    }

    /**
     * Filter balances by asset
     */
    private filterByAsset(
        balances: BinanceBalance[],
        asset: string
    ): BinanceBalance[] {
        return balances.filter(
            (b) => b.asset.toUpperCase() === asset.toUpperCase()
        );
    }

    /**
     * Get account trading status
     */
    async getTradingStatus(): Promise<boolean> {
        try {
            this.validateCredentials();
            const response = await this.client.account();
            const accountInfo = response.data as BinanceAccountInfo;
            return accountInfo.canTrade;
        } catch (error) {
            throw this.handleError(error, "Trading status check");
        }
    }

    /**
     * Check if account has sufficient balance for a trade
     */
    async checkBalance(asset: string, required: number): Promise<boolean> {
        try {
            const { balances } = await this.getBalance({ asset });
            const balance = balances[0];

            if (!balance) {
                return false;
            }

            const available = Number.parseFloat(balance.free);
            return available >= required;
        } catch (error) {
            throw this.handleError(error, `Balance check for ${asset}`);
        }
    }
}
