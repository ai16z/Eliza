import type { State } from "@elizaos/core";
import type { NFTKnowledge } from "../types";

export function enhanceResponse(response: string, state: State): string {
    const nftKnowledge = state.nftKnowledge as NFTKnowledge;

    if (nftKnowledge?.mentionsCollection) {
        response +=
            " Would you like to know more about specific NFT collections?";
    }

    if (nftKnowledge?.mentionsFloorPrice) {
        response +=
            " I can provide information on floor prices for popular collections.";
    }

    if (nftKnowledge?.mentionsVolume) {
        response +=
            " I can share recent trading volume data for NFT collections.";
    }

    if (nftKnowledge?.mentionsRarity) {
        response +=
            " I can explain rarity factors in NFT collections if you're interested.";
    }

    if (nftKnowledge?.mentionsMarketTrends) {
        response +=
            " I can show you the latest market trends and price movements.";
    }

    if (nftKnowledge?.mentionsTraders) {
        response +=
            " Would you like to see recent whale activity and notable trades?";
    }

    if (nftKnowledge?.mentionsSentiment) {
        response +=
            " I can provide current market sentiment analysis and trader mood indicators.";
    }

    if (nftKnowledge?.mentionsMarketCap) {
        response +=
            " I can show you market cap rankings and valuation metrics.";
    }

    if (nftKnowledge?.mentionsArtist) {
        response +=
            " I can provide detailed information about the artist, their background, and previous collections.";
    }

    if (nftKnowledge?.mentionsOnChainData) {
        response +=
            " I can show you detailed on-chain analytics including holder distribution and trading patterns.";
    }

    if (nftKnowledge?.mentionsNews) {
        response +=
            " I can share the latest news and announcements about this collection.";
    }

    if (nftKnowledge?.mentionsSocial) {
        response +=
            " I can provide social media metrics and community engagement data.";
    }

    if (nftKnowledge?.mentionsContract) {
        response +=
            " I can show you contract details including standards, royalties, and verification status.";
    }

    return response;
}
