import type { Provider, IAgentRuntime, Memory } from "@elizaos/core";
import type { ReservoirService } from "../services/reservoir";
import type { MarketIntelligenceService } from "../services/market-intelligence";
import type { SocialAnalyticsService } from "../services/social-analytics";

export const createNftCollectionProvider = (
    nftService: ReservoirService,
    marketIntelligenceService: MarketIntelligenceService,
    socialAnalyticsService: SocialAnalyticsService
): Provider => {
    return {
        get: async (
            runtime: IAgentRuntime,
            message: Memory
        ): Promise<string> => {
            if (!nftService) {
                throw new Error("NFT service not found");
            }

            const collections = await nftService.getTopCollections(runtime, 10);
            let response = "Here are the top NFT collections:\n\n";

            for (const collection of collections) {
                response += `${collection.name}:\n`;
                response += `• Floor Price: ${collection.floorPrice} ETH\n`;
                response += `• 24h Volume: ${collection.volume24h} ETH\n`;
                response += `• Market Cap: ${collection.marketCap} ETH\n`;
                response += `• Holders: ${collection.holders}\n\n`;
            }

            // If a specific collection is mentioned in the message, get detailed information
            const collection = collections.find(
                (c) =>
                    message.content.text
                        .toLowerCase()
                        .includes(c.name.toLowerCase()) ||
                    message.content.text
                        .toLowerCase()
                        .includes(c.address.toLowerCase())
            );

            if (collection) {
                response += `\nDetailed information for ${collection.name}:\n\n`;

                // Market intelligence data (optional)
                if (marketIntelligenceService) {
                    try {
                        const marketIntelligence =
                            await marketIntelligenceService.getMarketIntelligence(
                                collection.address
                            );
                        response += "Market Intelligence:\n";
                        response += `• Wash Trading Score: ${marketIntelligence.washTradingMetrics.washTradingScore}\n`;
                        response += `• Suspicious Volume (24h): ${marketIntelligence.washTradingMetrics.suspiciousVolume24h} ETH\n`;
                        response += `• Best Bid: ${marketIntelligence.liquidityMetrics.bestBid} ETH\n`;
                        response += `• Best Ask: ${marketIntelligence.liquidityMetrics.bestAsk} ETH\n\n`;
                    } catch (error) {
                        console.error(
                            "Failed to fetch market intelligence:",
                            error
                        );
                    }
                }

                // Social analytics data (optional)
                if (socialAnalyticsService) {
                    try {
                        const [socialMetrics, communityMetrics] =
                            await Promise.all([
                                socialAnalyticsService.getSocialMetrics(
                                    collection.address
                                ),
                                socialAnalyticsService.getCommunityMetrics(
                                    collection.address
                                ),
                            ]);

                        response += "Social Metrics:\n";
                        response += `• Twitter Followers: ${socialMetrics.twitter.followers}\n`;
                        response += `• Twitter Engagement: ${socialMetrics.twitter.engagement.likes + socialMetrics.twitter.engagement.retweets + socialMetrics.twitter.engagement.replies} interactions\n`;
                        response += `• Trending: ${socialMetrics.trending ? "Yes" : "No"}\n\n`;

                        response += "Community Metrics:\n";
                        response += `• Total Members: ${communityMetrics.totalMembers}\n`;
                        response += `• Growth Rate: ${communityMetrics.growthRate}%\n`;
                        response += `• Active Users: ${communityMetrics.engagement.activeUsers}\n`;
                        response += `• Messages per Day: ${communityMetrics.engagement.messagesPerDay}\n`;
                    } catch (error) {
                        console.error(
                            "Failed to fetch social analytics:",
                            error
                        );
                    }
                }
            }

            return response;
        },
    };
};
