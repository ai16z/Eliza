import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAgentRuntime } from "@elizaos/core";
import { ReservoirService } from "../services/reservoir";
import { MarketIntelligenceService } from "../services/market-intelligence";
import { SocialAnalyticsService } from "../services/social-analytics";
import { MemoryCacheManager } from "../services/cache-manager";
import { RateLimiter } from "../services/rate-limiter";

describe("NFT Services", () => {
    const mockRuntime = {
        services: {
            get: vi.fn(),
        },
        messageManager: {
            createMemory: vi.fn(),
        },
        agentId: "00000000-0000-0000-0000-000000000000",
    } as unknown as IAgentRuntime;

    describe("ReservoirService", () => {
        let service: ReservoirService;
        let cacheManager: MemoryCacheManager;
        let rateLimiter: RateLimiter;

        beforeEach(() => {
            cacheManager = new MemoryCacheManager();
            rateLimiter = new RateLimiter();
            service = new ReservoirService({
                cacheManager,
                rateLimiter,
            });
        });

        it("should initialize correctly", async () => {
            await service.initialize(mockRuntime);
            expect(service).toBeDefined();
        });

        it("should handle API requests with caching", async () => {
            const mockData = { collections: [] };
            vi.spyOn(global, "fetch").mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockData),
            } as Response);

            const result = await service.getTopCollections(5);
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe("MarketIntelligenceService", () => {
        let service: MarketIntelligenceService;
        let cacheManager: MemoryCacheManager;
        let rateLimiter: RateLimiter;

        beforeEach(() => {
            cacheManager = new MemoryCacheManager();
            rateLimiter = new RateLimiter();
            service = new MarketIntelligenceService({
                cacheManager,
                rateLimiter,
            });
        });

        it("should initialize correctly", async () => {
            await service.initialize(mockRuntime);
            expect(service).toBeDefined();
        });

        it("should return market intelligence data", async () => {
            const result = await service.getMarketIntelligence("0x1234");
            expect(result).toBeDefined();
            expect(result.floorPrice).toBeDefined();
            expect(result.volume24h).toBeDefined();
        });
    });

    describe("SocialAnalyticsService", () => {
        let service: SocialAnalyticsService;
        let cacheManager: MemoryCacheManager;
        let rateLimiter: RateLimiter;

        beforeEach(() => {
            cacheManager = new MemoryCacheManager();
            rateLimiter = new RateLimiter();
            service = new SocialAnalyticsService({
                cacheManager,
                rateLimiter,
            });
        });

        it("should initialize correctly", async () => {
            await service.initialize(mockRuntime);
            expect(service).toBeDefined();
        });

        it("should return social metrics", async () => {
            const result = await service.getSocialMetrics("0x1234");
            expect(result).toBeDefined();
            expect(result.lastUpdate).toBeDefined();
        });

        it("should analyze sentiment", async () => {
            const result = await service.analyzeSentiment("0x1234");
            expect(result).toBeDefined();
            expect(result.overall).toBeDefined();
            expect(result.breakdown).toBeDefined();
        });
    });
});
