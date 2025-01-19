import { describe, expect, it, vi } from "vitest";
import { nftCollectionProvider } from "../providers/nft-collections";
import type { IAgentRuntime, Memory } from "@elizaos/core";
import type { NFTService } from "../types";

describe("NFT Collections Provider", () => {
    const mockRuntime = {
        services: {
            get: vi.fn(),
        },
        messageManager: {
            createMemory: vi.fn(),
        },
        agentId: "00000000-0000-0000-0000-000000000000",
    } as unknown as IAgentRuntime;

    const mockNftService = {
        getTopCollections: vi.fn(),
        getMarketStats: vi.fn(),
    } as unknown as NFTService & {
        getTopCollections: ReturnType<typeof vi.fn>;
        getMarketStats: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (mockRuntime.services.get as any).mockReturnValue(mockNftService);
    });

    it("should get top collections", async () => {
        const message: Memory = {
            id: "00000000-0000-0000-0000-000000000001",
            content: {
                text: "Show me top NFT collections",
            },
            roomId: "00000000-0000-0000-0000-000000000002",
            userId: "00000000-0000-0000-0000-000000000003",
            agentId: "00000000-0000-0000-0000-000000000000",
        };

        mockNftService.getTopCollections.mockResolvedValueOnce([
            {
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
        ]);

        const result = await nftCollectionProvider.get(mockRuntime, message);
        expect(result).toContain("Test Collection");
        expect(result).toContain("1.5 ETH");
        expect(result).toContain("100 ETH");
    });

    it("should get market stats", async () => {
        const message: Memory = {
            id: "00000000-0000-0000-0000-000000000004",
            content: {
                text: "Show me NFT market stats",
            },
            roomId: "00000000-0000-0000-0000-000000000002",
            userId: "00000000-0000-0000-0000-000000000003",
            agentId: "00000000-0000-0000-0000-000000000000",
        };

        mockNftService.getTopCollections.mockResolvedValueOnce([
            {
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
        ]);

        const result = await nftCollectionProvider.get(mockRuntime, message);
        expect(result).toContain("Test Collection");
        expect(result).toContain("1.5 ETH");
    });

    it("should handle missing NFT service", async () => {
        const message: Memory = {
            id: "00000000-0000-0000-0000-000000000005",
            content: {
                text: "Show me top NFT collections",
            },
            roomId: "00000000-0000-0000-0000-000000000002",
            userId: "00000000-0000-0000-0000-000000000003",
            agentId: "00000000-0000-0000-0000-000000000000",
        };

        (mockRuntime.services.get as any).mockReturnValue(null);

        await expect(
            nftCollectionProvider.get(mockRuntime, message)
        ).rejects.toThrow("NFT service not found");
    });

    it("should handle service errors", async () => {
        const message: Memory = {
            id: "00000000-0000-0000-0000-000000000006",
            content: {
                text: "Show me top NFT collections",
            },
            roomId: "00000000-0000-0000-0000-000000000002",
            userId: "00000000-0000-0000-0000-000000000003",
            agentId: "00000000-0000-0000-0000-000000000000",
        };

        mockNftService.getTopCollections.mockRejectedValueOnce(
            new Error("API error")
        );

        await expect(
            nftCollectionProvider.get(mockRuntime, message)
        ).rejects.toThrow("API error");
    });
});
