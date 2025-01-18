import { describe, it, expect, beforeEach, vi } from "vitest";
import { TopicsProvider } from "../../src/providers/topics";
import type { Memory, State } from "@elizaos/core";

describe("TopicsProvider", () => {
    let topicsProvider: TopicsProvider;
    let mockRuntime;

    beforeEach(() => {
        topicsProvider = new TopicsProvider();
        mockRuntime = {
            getSetting: vi.fn(),
        };

        mockRuntime.getSetting.mockImplementation((key: string) => {
            const settings = {
                ALLORA_API_KEY: "test-api-key",
                ALLORA_CHAIN_SLUG: "testnet",
            };
            return settings[key];
        });
    });

    describe("Topics data integration", () => {
        it("should format topics into expected string format", async () => {
            const mockTopics = [
                {
                    topic_id: 1,
                    topic_name: "Test Topic",
                    description: "Test Description",
                    is_active: true,
                    updated_at: "2024-03-20T00:00:00Z",
                },
            ];
            vi.spyOn(
                topicsProvider as any,
                "getAlloraTopics"
            ).mockResolvedValue(mockTopics);

            const result = await topicsProvider.get(
                mockRuntime,
                {} as Memory,
                {} as State
            );

            expect(result).toContain("Allora Network Topics:");
            expect(result).toContain(`Topic Name: ${mockTopics[0].topic_name}`);
            expect(result).toContain(
                `Topic Description: ${mockTopics[0].description}`
            );
            expect(result).toContain(`Topic ID: ${mockTopics[0].topic_id}`);
            expect(result).toContain(
                `Topic is Active: ${mockTopics[0].is_active}`
            );
        });
    });
});
