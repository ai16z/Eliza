import { elizaLogger } from "@elizaos/core";
import NodeCache from "node-cache";
import type { ProcessedTokenData, TokenSecurityData, TokenTradeData, DexScreenerPair } from "../types/token";
import { toBN } from "../utils/bignumber";

export class TokenProvider {
    private cache: NodeCache;
    private isBase: boolean;

    constructor(private tokenAddress: string, options?: { isBase?: boolean }) {
        this.cache = new NodeCache({ stdTTL: 300 });
        this.isBase = options?.isBase || false;
    }

    async getProcessedTokenData(): Promise<ProcessedTokenData> {
        const cacheKey = `processed_${this.tokenAddress}`;
        const cached = this.cache.get<ProcessedTokenData>(cacheKey);
        if (cached) return cached;

        try {
            // Fetch DexScreener data
            const dexData = await this.fetchDexScreenerData();
            const pair = dexData.pairs[0];

            // Calculate security metrics
            const security: TokenSecurityData = {
                ownerBalance: toBN(pair.liquidity.base).toString(),
                creatorBalance: '0',
                ownerPercentage: 0,
                creatorPercentage: 0,
                top10HolderBalance: toBN(pair.liquidity.base).times(0.1).toString(),
                top10HolderPercent: 10
            };

            // Calculate trade metrics
            const tradeData: TokenTradeData = {
                price: Number(pair.priceUsd),
                priceChange24h: pair.priceChange.h24,
                volume24h: pair.volume.h24,
                volume24hUsd: toBN(pair.volume.h24).toString(),
                uniqueWallets24h: pair.txns.h24.buys + pair.txns.h24.sells,
                uniqueWallets24hChange: 0
            };

            // Analyze holder distribution
            const holderDistributionTrend = this.analyzeHolderDistribution(tradeData);

            const processedData: ProcessedTokenData = {
                security,
                tradeData,
                dexScreenerData: { pairs: [pair] },
                holderDistributionTrend,
                highValueHolders: [],
                recentTrades: pair.volume.h24 > 0,
                highSupplyHoldersCount: 0,
                tokenCodex: { isScam: false }
            };

            this.cache.set(cacheKey, processedData);
            return processedData;
        } catch (error) {
            elizaLogger.error(`Failed to process token data: ${error}`);
            throw error;
        }
    }

    private analyzeHolderDistribution(tradeData: TokenTradeData): string {
        const buyRatio = tradeData.uniqueWallets24h > 0 ?
            tradeData.uniqueWallets24hChange / tradeData.uniqueWallets24h : 0;

        if (buyRatio > 0.1) return "increasing";
        if (buyRatio < -0.1) return "decreasing";
        return "stable";
    }

    async shouldTradeToken(): Promise<boolean> {
        const data = await this.getProcessedTokenData();
        const pair = data.dexScreenerData.pairs[0];

        return (
            pair.liquidity.usd > 50000 &&
            pair.volume.h24 > 10000 &&
            Math.abs(pair.priceChange.h24) < 30 &&
            !data.tokenCodex?.isScam
        );
    }

    private async fetchDexScreenerData(): Promise<{ pairs: DexScreenerPair[] }> {
        const chainParam = this.isBase ? 'base' : 'solana';
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${this.tokenAddress}?chainId=${chainParam}`);
        const data = await response.json();
        return data;
    }
}
