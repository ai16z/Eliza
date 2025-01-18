import type { Plugin } from "@elizaos/core";
import { createNftCollectionProvider } from "./providers/nft-collections";
import { getCollectionsAction } from "./actions/get-collections";
import { listNFTAction } from "./actions/list-nft";
import { sweepFloorAction } from "./actions/sweep-floor";

import { ReservoirService } from "./services/reservoir";
import { MemoryCacheManager } from "./services/cache-manager";
import { RateLimiter } from "./services/rate-limiter";
import { MarketIntelligenceService } from "./services/market-intelligence";
import { SocialAnalyticsService } from "./services/social-analytics";

// Consider exposing these settings as environment variables to allow users to provide custom configuration values.
const config = {
    caching: {
        enabled: true,
        ttl: 3600000, // 1 hour
        maxSize: 1000,
    },
    security: {
        rateLimit: {
            enabled: true,
            maxRequests: 100,
            windowMs: 60000,
        },
    },
    maxConcurrent: 5, // Maximum concurrent requests
    maxRetries: 3, // Maximum retry attempts
    batchSize: 20, // Batch size for collection requests
};

function createNFTCollectionsPlugin(): Plugin {
    // Initialize reusable CacheManager if caching is enabled
    const cacheManager = config.caching?.enabled
        ? new MemoryCacheManager({
              ttl: config.caching.ttl,
              maxSize: config.caching.maxSize,
          })
        : null;

    // Initialize reusable RateLimiter if rate limiting is enabled
    const rateLimiter = config.security?.rateLimit?.enabled
        ? new RateLimiter({
              maxRequests: config.security.rateLimit.maxRequests,
              windowMs: config.security.rateLimit.windowMs,
          })
        : null;
    const reservoirService = new ReservoirService({
        cacheManager,
        rateLimiter,
        maxConcurrent: config.maxConcurrent,
        maxRetries: config.maxRetries,
        batchSize: config.batchSize,
    });

    const marketIntelligenceService = new MarketIntelligenceService({
        cacheManager,
        rateLimiter,
    });

    const socialAnalyticsService = new SocialAnalyticsService({
        cacheManager,
        rateLimiter,
    });

    const nftCollectionProvider = createNftCollectionProvider(
        reservoirService,
        marketIntelligenceService,
        socialAnalyticsService
    );

    return {
        name: "nft-collections",
        description:
            "Provides NFT collection information and market intelligence",
        providers: [nftCollectionProvider],
        actions: [
            getCollectionsAction(nftCollectionProvider),
            listNFTAction(reservoirService),
            sweepFloorAction(reservoirService),
        ],
        evaluators: [],
    };
}

export default createNFTCollectionsPlugin;
