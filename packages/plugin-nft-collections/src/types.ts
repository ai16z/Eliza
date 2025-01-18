import type { Service } from "@elizaos/core";

declare module "@elizaos/core" {
    interface ServiceTypeMap {
        nft: Service & NFTService;
        nft_market_intelligence: Service & MarketIntelligenceService;
        nft_social_analytics: Service & SocialAnalyticsService;
    }
}

export interface NFTService {
    getTopCollections(): Promise<NFTCollection[]>;
    getMarketStats(): Promise<MarketStats>;
    getCollectionActivity(collectionAddress: string): Promise<any>;
    getCollectionTokens(collectionAddress: string): Promise<any>;
    getCollectionAttributes(collectionAddress: string): Promise<any>;
    getFloorListings(options: {
        collection: string;
        limit: number;
        sortBy: "price" | "rarity";
    }): Promise<
        Array<{
            tokenId: string;
            price: number;
            seller: string;
            marketplace: string;
        }>
    >;
    executeBuy(options: {
        listings: Array<{
            tokenId: string;
            price: number;
            seller: string;
            marketplace: string;
        }>;
        taker: string;
    }): Promise<{
        path: string;
        steps: Array<{
            action: string;
            status: string;
        }>;
    }>;
    createListing(options: {
        tokenId: string;
        collectionAddress: string;
        price: number;
        expirationTime?: number; // Unix timestamp
        marketplace: "ikigailabs";
        currency?: string; // Default to ETH
        quantity?: number; // Default to 1 for ERC721
    }): Promise<{
        listingId: string;
        status: string;
        transactionHash?: string;
        marketplaceUrl: string;
    }>;
    cancelListing(options: {
        listingId: string;
        marketplace: "ikigailabs";
    }): Promise<{
        status: string;
        transactionHash?: string;
    }>;
    getOwnedNFTs(owner: string): Promise<
        Array<{
            tokenId: string;
            collectionAddress: string;
            name: string;
            imageUrl?: string;
            attributes?: Record<string, string>;
        }>
    >;
}

export interface NFTKnowledge {
    mentionsCollection: boolean;
    mentionsFloorPrice: boolean;
    mentionsVolume: boolean;
    mentionsRarity: boolean;
    mentionsMarketTrends: boolean;
    mentionsTraders: boolean;
    mentionsSentiment: boolean;
    mentionsMarketCap: boolean;
    mentionsArtist: boolean;
    mentionsOnChainData: boolean;
    mentionsNews: boolean;
    mentionsSocial: boolean;
    mentionsContract: boolean;
}

export interface MarketIntelligenceService {
    getMarketIntelligence(
        collectionAddress: string
    ): Promise<MarketIntelligence>;
    getTraitAnalytics(collectionAddress: string): Promise<TraitAnalytics>;
    detectWashTrading(collectionAddress: string): Promise<{
        suspiciousAddresses: string[];
        suspiciousTransactions: Array<{
            hash: string;
            from: string;
            to: string;
            price: number;
            confidence: number;
        }>;
    }>;
    getWhaleActivity(collectionAddress: string): Promise<{
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
    }>;
    getLiquidityAnalysis(collectionAddress: string): Promise<{
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
    }>;
}

export interface SocialAnalyticsService {
    getSocialMetrics(collectionAddress: string): Promise<SocialMetrics>;
    getNews(collectionAddress: string): Promise<NewsItem[]>;
    getCommunityMetrics(
        collectionAddress: string,
        discordId?: string,
        telegramId?: string
    ): Promise<CommunityMetrics>;
    analyzeSentiment(collectionAddress: string): Promise<{
        overall: number;
        breakdown: {
            positive: number;
            neutral: number;
            negative: number;
        };
        trends: Array<{
            topic: string;
            sentiment: number;
            volume: number;
        }>;
    }>;
    trackSocialPerformance(collectionAddress: string): Promise<{
        metrics: {
            reach: number;
            engagement: number;
            influence: number;
        };
        trends: Array<{
            platform: string;
            metric: string;
            values: number[];
        }>;
    }>;
}

export interface NFTCollection {
    address: string;
    name: string;
    symbol: string;
    description?: string;
    imageUrl?: string;
    floorPrice: number;
    volume24h: number;
    marketCap: number;
    holders: number;
}

export interface MarketStats {
    totalVolume24h: number;
    totalMarketCap: number;
    totalCollections: number;
    totalHolders: number;
    averageFloorPrice: number;
}

export interface MarketIntelligence {
    priceHistory: Array<{
        timestamp: number;
        price: number;
        volume: number;
    }>;
    washTradingMetrics: {
        suspiciousVolume24h: number;
        suspiciousTransactions24h: number;
        washTradingScore: number;
    };
    marketplaceActivity: {
        [marketplace: string]: {
            volume24h: number;
            trades24h: number;
            marketShare: number;
        };
    };
    whaleActivity: Array<{
        address: string;
        type: "buy" | "sell";
        amount: number;
        timestamp: number;
    }>;
    liquidityMetrics: {
        depth: Array<{
            price: number;
            quantity: number;
        }>;
        bidAskSpread: number;
        bestBid: number;
        bestAsk: number;
    };
}

export interface TraitAnalytics {
    distribution: {
        [trait: string]: {
            [value: string]: number;
        };
    };
    rarityScores: {
        [tokenId: string]: number;
    };
    combinations: {
        total: number;
        unique: number;
        rarest: Array<{
            traits: { [key: string]: string };
            count: number;
        }>;
    };
    priceByRarity: Array<{
        rarityRange: [number, number];
        avgPrice: number;
        volume: number;
    }>;
}

export interface SocialMetrics {
    twitter: {
        followers: number;
        engagement: {
            likes: number;
            retweets: number;
            replies: number;
            mentions: number;
        };
        sentiment: {
            positive: number;
            neutral: number;
            negative: number;
        };
    };
    mentions: Array<{
        platform: string;
        content: string;
        author: string;
        timestamp: number;
        reach: number;
    }>;
    influencers: Array<{
        address: string;
        platform: string;
        followers: number;
        engagement: number;
        sentiment: number;
    }>;
    trending: boolean;
}

export interface NewsItem {
    title: string;
    source: string;
    url: string;
    timestamp: Date;
    sentiment: "positive" | "negative" | "neutral";
    relevance: number;
}

export interface CommunityMetrics {
    discord: {
        members: number;
        activity: {
            messagesPerDay: number;
            activeUsers: number;
            growthRate: number;
        };
        channels: Array<{
            name: string;
            members: number;
            activity: number;
        }>;
    } | null;
    telegram: {
        members: number;
        activity: {
            messagesPerDay: number;
            activeUsers: number;
            growthRate: number;
        };
    } | null;
    totalMembers: number;
    growthRate: number;
    engagement: {
        activeUsers: number;
        messagesPerDay: number;
        topChannels: Array<{
            platform: string;
            name: string;
            activity: number;
        }>;
    };
}
