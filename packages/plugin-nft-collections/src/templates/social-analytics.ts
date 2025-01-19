import type { NFTCollection, SocialMetrics, CommunityMetrics } from "../types";

export const socialAnalyticsTemplates = {
    socialOverview: ({
        collection,
        socialMetrics,
        communityMetrics,
    }: {
        collection: NFTCollection | string;
        socialMetrics: SocialMetrics;
        communityMetrics: CommunityMetrics;
    }) => `Social Analytics for ${typeof collection === "string" ? collection : collection.name}:

Twitter Metrics:
• Followers: ${socialMetrics.twitter.followers}
• Engagement: ${
        socialMetrics.twitter.engagement.likes +
        socialMetrics.twitter.engagement.retweets +
        socialMetrics.twitter.engagement.replies
    } interactions
• Sentiment: ${(
        (socialMetrics.twitter.sentiment.positive * 100) /
        (socialMetrics.twitter.sentiment.positive +
            socialMetrics.twitter.sentiment.neutral +
            socialMetrics.twitter.sentiment.negative)
    ).toFixed(1)}% positive
• Trending: ${socialMetrics.trending ? "Yes" : "No"}

Community Stats:
• Total Members: ${communityMetrics.totalMembers}
• Growth Rate: ${communityMetrics.growthRate}%
• Active Users: ${communityMetrics.engagement.activeUsers}
• Messages/Day: ${communityMetrics.engagement.messagesPerDay}

Platform Breakdown:${
        communityMetrics.discord
            ? `\n\nDiscord:
• Members: ${communityMetrics.discord.members}
• Active Users: ${communityMetrics.discord.activity.activeUsers}
• Growth Rate: ${communityMetrics.discord.activity.growthRate}%
• Messages/Day: ${communityMetrics.discord.activity.messagesPerDay}

Top Channels:
${communityMetrics.discord.channels
    .slice(0, 3)
    .map(
        (channel) =>
            `• ${channel.name}: ${channel.members} members (${channel.activity} msgs/day)`
    )
    .join("\n")}`
            : ""
    }${
        communityMetrics.telegram
            ? `\n\nTelegram:
• Members: ${communityMetrics.telegram.members}
• Active Users: ${communityMetrics.telegram.activity.activeUsers}
• Growth Rate: ${communityMetrics.telegram.activity.growthRate}%
• Messages/Day: ${communityMetrics.telegram.activity.messagesPerDay}`
            : ""
    }`,

    topInfluencers: ({
        collection,
        influencers,
    }: {
        collection: NFTCollection | string;
        influencers: SocialMetrics["influencers"];
    }) => `Top Influencers for ${typeof collection === "string" ? collection : collection.name}:

${influencers
    .slice(0, 5)
    .map(
        (inf, i) =>
            `${i + 1}. ${inf.address.slice(0, 6)}...${inf.address.slice(-4)} (${
                inf.platform
            })
• Followers: ${inf.followers}
• Engagement Rate: ${(inf.engagement * 100).toFixed(1)}%
• Sentiment Score: ${(inf.sentiment * 100).toFixed(1)}%`
    )
    .join("\n\n")}`,

    recentMentions: ({
        collection,
        mentions,
    }: {
        collection: NFTCollection | string;
        mentions: SocialMetrics["mentions"];
    }) => `Recent Mentions for ${typeof collection === "string" ? collection : collection.name}:

${mentions
    .slice(0, 5)
    .map(
        (mention) => `• ${mention.platform} | ${new Date(
            mention.timestamp * 1000
        ).toLocaleString()}
  ${mention.content.slice(0, 100)}${mention.content.length > 100 ? "..." : ""}
  By: ${mention.author} | Reach: ${mention.reach}`
    )
    .join("\n\n")}`,

    communityEngagement: ({
        collection,
        topChannels,
    }: {
        collection: NFTCollection | string;
        topChannels: CommunityMetrics["engagement"]["topChannels"];
    }) => `Community Engagement for ${typeof collection === "string" ? collection : collection.name}:

Most Active Channels:
${topChannels
    .map(
        (channel) =>
            `• ${channel.platform} | ${channel.name}: ${channel.activity} messages/day`
    )
    .join("\n")}`,

    sentimentAnalysis: ({
        collection,
        sentiment,
    }: {
        collection: NFTCollection | string;
        sentiment: {
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
        };
    }) => `Sentiment Analysis for ${typeof collection === "string" ? collection : collection.name}:

Overall Sentiment Score: ${(sentiment.overall * 100).toFixed(1)}%

Sentiment Breakdown:
• Positive: ${(sentiment.breakdown.positive * 100).toFixed(1)}%
• Neutral: ${(sentiment.breakdown.neutral * 100).toFixed(1)}%
• Negative: ${(sentiment.breakdown.negative * 100).toFixed(1)}%

Top Topics by Sentiment:
${sentiment.trends
    .slice(0, 5)
    .map(
        (trend) =>
            `• ${trend.topic}: ${(trend.sentiment * 100).toFixed(
                1
            )}% positive (${trend.volume} mentions)`
    )
    .join("\n")}`,
};
