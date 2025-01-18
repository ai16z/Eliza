import { describe, expect, it, vi } from "vitest";
import { listNFTAction } from "../actions/list-nft";
import type { IAgentRuntime, Memory } from "@elizaos/core";
import type { NFTService } from "../types";

describe("NFT Actions", () => {
    describe("List NFT Action", () => {
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
            getOwnedNFTs: vi.fn(),
            createListing: vi.fn(),
        } as unknown as NFTService & {
            getOwnedNFTs: ReturnType<typeof vi.fn>;
            createListing: ReturnType<typeof vi.fn>;
        };

        beforeEach(() => {
            vi.clearAllMocks();
            (mockRuntime.services.get as any).mockReturnValue(mockNftService);
        });

        it("should validate list NFT message", async () => {
            const message: Memory = {
                id: "00000000-0000-0000-0000-000000000001",
                content: {
                    text: "List NFT #123 from collection 0x1234 for 1.5 ETH",
                },
                roomId: "00000000-0000-0000-0000-000000000002",
                userId: "00000000-0000-0000-0000-000000000003",
                agentId: "00000000-0000-0000-0000-000000000000",
            };

            const isValid = await listNFTAction.validate(mockRuntime, message);
            expect(isValid).toBe(true);
        });

        it("should not validate invalid message", async () => {
            const message: Memory = {
                id: "00000000-0000-0000-0000-000000000004",
                content: {
                    text: "Show me floor price",
                },
                roomId: "00000000-0000-0000-0000-000000000002",
                userId: "00000000-0000-0000-0000-000000000003",
                agentId: "00000000-0000-0000-0000-000000000000",
            };

            const isValid = await listNFTAction.validate(mockRuntime, message);
            expect(isValid).toBe(false);
        });

        it("should handle list NFT request successfully", async () => {
            const message: Memory = {
                id: "00000000-0000-0000-0000-000000000005",
                content: {
                    text: "List NFT #123 from collection 0x1234 for 1.5 ETH",
                },
                roomId: "00000000-0000-0000-0000-000000000002",
                userId: "00000000-0000-0000-0000-000000000003",
                agentId: "00000000-0000-0000-0000-000000000000",
            };

            mockNftService.getOwnedNFTs.mockResolvedValueOnce([
                {
                    collectionAddress: "0x1234",
                    tokenId: "123",
                    name: "Test NFT",
                    imageUrl: "https://example.com/nft.png",
                },
            ]);

            mockNftService.createListing.mockResolvedValueOnce({
                listingId: "test-listing",
                status: "active",
                marketplaceUrl: "https://ikigailabs.xyz/listing/test",
            });

            const result = await listNFTAction.handler(mockRuntime, message);
            expect(result).toBe(true);
            expect(mockNftService.createListing).toHaveBeenCalledWith(
                expect.objectContaining({
                    tokenId: "123",
                    collectionAddress: "0x1234",
                    price: 1.5,
                    marketplace: "ikigailabs",
                })
            );
        });

        it("should handle NFT not owned error", async () => {
            const message: Memory = {
                id: "00000000-0000-0000-0000-000000000006",
                content: {
                    text: "List NFT #123 from collection 0x1234 for 1.5 ETH",
                },
                roomId: "00000000-0000-0000-0000-000000000002",
                userId: "00000000-0000-0000-0000-000000000003",
                agentId: "00000000-0000-0000-0000-000000000000",
            };

            mockNftService.getOwnedNFTs.mockResolvedValueOnce([]);

            const result = await listNFTAction.handler(mockRuntime, message);
            expect(result).toBe(false);
            expect(
                mockRuntime.messageManager.createMemory
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    content: {
                        text: expect.stringContaining("You don't own this NFT"),
                    },
                })
            );
        });

        it("should handle missing NFT service error", async () => {
            const message: Memory = {
                id: "00000000-0000-0000-0000-000000000007",
                content: {
                    text: "List NFT #123 from collection 0x1234 for 1.5 ETH",
                },
                roomId: "00000000-0000-0000-0000-000000000002",
                userId: "00000000-0000-0000-0000-000000000003",
                agentId: "00000000-0000-0000-0000-000000000000",
            };

            (mockRuntime.services.get as any).mockReturnValue(null);

            const result = await listNFTAction.handler(mockRuntime, message);
            expect(result).toBe(false);
            expect(
                mockRuntime.messageManager.createMemory
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    content: {
                        text: expect.stringContaining("NFT service not found"),
                    },
                })
            );
        });
    });
});
