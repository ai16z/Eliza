import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAgentRuntime } from "@elizaos/core";
import { ReservoirService } from "../services/reservoir";
import { MemoryCacheManager } from "../services/cache-manager";
import { RateLimiter } from "../services/rate-limiter";

describe("ReservoirService", () => {
    const mockRuntime = {
        services: {
            get: vi.fn(),
        },
        messageManager: {
            createMemory: vi.fn(),
        },
        agentId: "00000000-0000-0000-0000-000000000000",
    } as unknown as IAgentRuntime;

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
