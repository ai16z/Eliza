import { describe, expect, it } from "vitest";
import {
    listingTemplates,
    floorSweepTemplates,
    marketStatsTemplates,
    socialAnalyticsTemplates,
    listNftTemplate,
    floorSweepTemplate,
    marketStatsTemplate,
    socialAnalyticsTemplate,
} from "../templates";

describe("NFT Collection Templates", () => {
    describe("Listing Templates", () => {
        it("should generate successful listing message", () => {
            const result = listingTemplates.successfulListing({
                collection: "0x1234567890abcdef",
                tokenId: "123",
                purchasePrice: 1.5,
                listingPrice: 3.0,
                isPriceAutomatic: true,
                status: "active",
                marketplaceUrl: "https://ikigailabs.xyz/listing/123",
                transactionHash: "0xabcdef",
            });

            expect(result).toContain("Successfully created listing");
            expect(result).toContain("0x1234567890abcdef");
            expect(result).toContain("1.5 ETH");
            expect(result).toContain("3.0 ETH");
            expect(result).toContain("0xabcdef");
        });

        it("should generate listing failed message", () => {
            const result = listingTemplates.listingFailed(
                "Insufficient balance"
            );
            expect(result).toBe("Failed to list NFT: Insufficient balance");
        });
    });

    describe("Floor Sweep Templates", () => {
        it("should generate successful sweep message", () => {
            const result = floorSweepTemplates.successfulSweep({
                collection: "0x1234567890abcdef",
                quantity: 5,
                totalPrice: 10,
                averagePrice: 2,
                path: "direct",
                steps: [
                    { action: "approve", status: "completed" },
                    { action: "buy", status: "completed" },
                ],
            });

            expect(result).toContain("Successfully swept 5 NFTs");
            expect(result).toContain("10 ETH");
            expect(result).toContain("2.0000 ETH");
            expect(result).toContain("approve - completed");
        });

        it("should generate insufficient listings message", () => {
            const result = floorSweepTemplates.insufficientListings(3, 5);
            expect(result).toBe(
                "Only 3 NFTs available at floor price (requested 5)"
            );
        });
    });

    describe("Market Stats Templates", () => {
        it("should generate collection overview", () => {
            const result = marketStatsTemplates.collectionOverview({
                collection: {
                    name: "Test Collection",
                    address: "0x1234",
                    floorPrice: 1.5,
                    volume24h: 100,
                    marketCap: 1000,
                    holders: 500,
                    symbol: "TEST",
                    description: "Test NFT Collection",
                    imageUrl: "https://example.com/image.png",
                },
                marketIntelligence: {
                    washTradingMetrics: {
                        washTradingScore: 0.1,
                        suspiciousVolume24h: 10,
                        suspiciousTransactions24h: 5,
                    },
                    liquidityMetrics: {
                        bestBid: 1.4,
                        bestAsk: 1.6,
                        depth: [
                            { price: 1.4, quantity: 2 },
                            { price: 1.5, quantity: 3 },
                        ],
                        bidAskSpread: 0.2,
                    },
                    priceHistory: [
                        { timestamp: 1234567890, price: 1.2, volume: 50 },
                        { timestamp: 1234567891, price: 1.3, volume: 60 },
                    ],
                    marketplaceActivity: {
                        listings: {
                            volume24h: 100,
                            trades24h: 50,
                            marketShare: 0.3,
                        },
                        sales: {
                            volume24h: 80,
                            trades24h: 40,
                            marketShare: 0.25,
                        },
                        volume: {
                            volume24h: 180,
                            trades24h: 90,
                            marketShare: 0.55,
                        },
                        averagePrice: {
                            volume24h: 2,
                            trades24h: 1,
                            marketShare: 0.1,
                        },
                    },
                    whaleActivity: [
                        {
                            address: "0xabc",
                            type: "buy",
                            amount: 10,
                            timestamp: 1234567890,
                        },
                        {
                            address: "0xdef",
                            type: "sell",
                            amount: 5,
                            timestamp: 1234567891,
                        },
                    ],
                },
            });

            expect(result).toContain("Test Collection");
            expect(result).toContain("1.5 ETH");
            expect(result).toContain("100 ETH");
            expect(result).toContain("500");
            expect(result).toContain("0.1");
        });
    });

    describe("Social Analytics Templates", () => {
        it("should generate social overview", () => {
            const result = socialAnalyticsTemplates.socialOverview({
                collection: "Test Collection",
                socialMetrics: {
                    twitter: {
                        followers: 10000,
                        engagement: {
                            likes: 500,
                            retweets: 200,
                            replies: 300,
                            mentions: 150,
                        },
                        sentiment: {
                            positive: 0.7,
                            neutral: 0.2,
                            negative: 0.1,
                        },
                    },
                    trending: true,
                    mentions: [
                        {
                            platform: "twitter",
                            content: "Great collection!",
                            author: "user123",
                            timestamp: 1234567890,
                            reach: 5000,
                        },
                    ],
                    influencers: [
                        {
                            address: "0xabc",
                            platform: "twitter",
                            followers: 50000,
                            engagement: 0.05,
                            sentiment: 0.8,
                        },
                    ],
                },
                communityMetrics: {
                    totalMembers: 5000,
                    growthRate: 10,
                    engagement: {
                        activeUsers: 1000,
                        messagesPerDay: 500,
                        topChannels: [
                            {
                                platform: "discord",
                                name: "general",
                                activity: 100,
                            },
                        ],
                    },
                    discord: {
                        members: 3000,
                        activity: {
                            messagesPerDay: 1000,
                            activeUsers: 500,
                            growthRate: 0.1,
                        },
                        channels: [
                            {
                                name: "general",
                                members: 2000,
                                activity: 100,
                            },
                        ],
                    },
                    telegram: {
                        members: 2000,
                        activity: {
                            messagesPerDay: 800,
                            activeUsers: 300,
                            growthRate: 0.05,
                        },
                    },
                },
            });

            expect(result).toContain("Test Collection");
            expect(result).toContain("10000");
            expect(result).toContain("1000 interactions");
            expect(result).toContain("70.0% positive");
            expect(result).toContain("5000");
        });
    });

    describe("Template Strings", () => {
        it("should contain required placeholders in listNftTemplate", () => {
            expect(listNftTemplate).toContain("{{recentMessages}}");
            expect(listNftTemplate).toContain("{{nftInfo}}");
            expect(listNftTemplate).toContain("collectionAddress");
            expect(listNftTemplate).toContain("tokenId");
            expect(listNftTemplate).toContain("price");
        });

        it("should contain required placeholders in floorSweepTemplate", () => {
            expect(floorSweepTemplate).toContain("{{recentMessages}}");
            expect(floorSweepTemplate).toContain("{{nftInfo}}");
            expect(floorSweepTemplate).toContain("collectionAddress");
            expect(floorSweepTemplate).toContain("quantity");
            expect(floorSweepTemplate).toContain("maxPricePerNft");
        });

        it("should contain required placeholders in marketStatsTemplate", () => {
            expect(marketStatsTemplate).toContain("{{recentMessages}}");
            expect(marketStatsTemplate).toContain("{{nftInfo}}");
            expect(marketStatsTemplate).toContain("collectionAddress");
            expect(marketStatsTemplate).toContain("timePeriod");
            expect(marketStatsTemplate).toContain("statType");
        });

        it("should contain required placeholders in socialAnalyticsTemplate", () => {
            expect(socialAnalyticsTemplate).toContain("{{recentMessages}}");
            expect(socialAnalyticsTemplate).toContain("{{nftInfo}}");
            expect(socialAnalyticsTemplate).toContain("collectionAddress");
            expect(socialAnalyticsTemplate).toContain("platform");
            expect(socialAnalyticsTemplate).toContain("metricType");
        });
    });
});
