import type { NFTCollection, MarketIntelligence, MarketStats } from "../types";

export const marketStatsTemplates = {
    collectionOverview: ({
        collection,
        marketIntelligence,
    }: {
        collection: NFTCollection;
        marketIntelligence?: MarketIntelligence;
    }) => `${collection.name} Collection Overview:
• Floor Price: ${collection.floorPrice} ETH
• 24h Volume: ${collection.volume24h} ETH
• Market Cap: ${collection.marketCap} ETH
• Holders: ${collection.holders}${
        marketIntelligence
            ? `\n\nMarket Intelligence:
• Wash Trading Score: ${marketIntelligence.washTradingMetrics.washTradingScore}
• Suspicious Volume (24h): ${marketIntelligence.washTradingMetrics.suspiciousVolume24h} ETH
• Best Bid: ${marketIntelligence.liquidityMetrics.bestBid} ETH
• Best Ask: ${marketIntelligence.liquidityMetrics.bestAsk} ETH`
            : ""
    }`,

    globalMarketStats: (stats: MarketStats) => `NFT Market Overview:
• Total Volume (24h): ${stats.totalVolume24h} ETH
• Total Market Cap: ${stats.totalMarketCap} ETH
• Total Collections: ${stats.totalCollections}
• Total Holders: ${stats.totalHolders}
• Average Floor Price: ${stats.averageFloorPrice} ETH`,

    whaleActivity: ({
        collection,
        whales,
        impact,
    }: {
        collection: NFTCollection | string;
        whales: Array<{
            address: string;
            holdings: number;
            avgHoldingTime: number;
            tradingVolume: number;
            lastTrade: number;
        }>;
        impact: {
            priceImpact: number;
            volumeShare: number;
            holdingsShare: number;
        };
    }) => `Whale Activity for ${typeof collection === "string" ? collection : collection.name}:

Top Whales:
${whales
    .slice(0, 5)
    .map(
        (whale) => `• ${whale.address.slice(0, 6)}...${whale.address.slice(-4)}
  Holdings: ${whale.holdings} NFTs
  Avg Holding Time: ${(whale.avgHoldingTime / (24 * 60 * 60)).toFixed(1)} days
  Trading Volume: ${whale.tradingVolume} ETH`
    )
    .join("\n\n")}

Market Impact:
• Price Impact: ${impact.priceImpact >= 0 ? "+" : ""}${impact.priceImpact.toFixed(2)}%
• Volume Share: ${(impact.volumeShare * 100).toFixed(1)}%
• Holdings Share: ${(impact.holdingsShare * 100).toFixed(1)}%`,

    priceHistory: ({
        collection,
        history,
    }: {
        collection: NFTCollection | string;
        history: Array<{
            timestamp: number;
            price: number;
            volume: number;
        }>;
    }) => {
        const timeframes = [
            { label: "1h", duration: 60 * 60 },
            { label: "24h", duration: 24 * 60 * 60 },
            { label: "7d", duration: 7 * 24 * 60 * 60 },
        ];

        const now = Date.now() / 1000;
        const changes = timeframes.map((tf) => {
            const pastPrice = history.find(
                (h) => h.timestamp >= now - tf.duration
            )?.price;
            const currentPrice = history[history.length - 1]?.price || 0;
            const change = pastPrice
                ? ((currentPrice - pastPrice) / pastPrice) * 100
                : 0;
            return `${tf.label}: ${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
        });

        return `Price History for ${typeof collection === "string" ? collection : collection.name}:

Price Changes:
${changes.map((change) => `• ${change}`).join("\n")}

Recent Trades:
${history
    .slice(-5)
    .reverse()
    .map(
        (h) =>
            `• ${new Date(h.timestamp * 1000).toLocaleString()}: ${
                h.price
            } ETH (Volume: ${h.volume} ETH)`
    )
    .join("\n")}`;
    },

    liquidityAnalysis: ({
        collection,
        depth,
        metrics,
    }: {
        collection: NFTCollection | string;
        depth: Array<{
            price: number;
            quantity: number;
            totalValue: number;
        }>;
        metrics: {
            totalLiquidity: number;
            averageSpread: number;
            volatility24h: number;
        };
    }) => `Liquidity Analysis for ${typeof collection === "string" ? collection : collection.name}:

Market Metrics:
• Total Liquidity: ${metrics.totalLiquidity} ETH
• Average Spread: ${(metrics.averageSpread * 100).toFixed(2)}%
• 24h Volatility: ${(metrics.volatility24h * 100).toFixed(2)}%

Order Book Depth:
${depth
    .slice(0, 5)
    .map(
        (level) =>
            `• ${level.price} ETH: ${level.quantity} NFTs (${level.totalValue} ETH)`
    )
    .join("\n")}`,
};
