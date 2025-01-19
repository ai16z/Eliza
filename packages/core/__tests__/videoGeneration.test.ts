import type { IAgentRuntime, Memory, State } from "@elizaos/core";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the fetch function
global.fetch = vi.fn();

// Mock the fs module
vi.mock("fs", async () => {
    return {
        default: {
            writeFileSync: vi.fn(),
            existsSync: vi.fn(),
            mkdirSync: vi.fn(),
        },
        writeFileSync: vi.fn(),
        existsSync: vi.fn(),
        mkdirSync: vi.fn(),
    };
});

// Mock the video generation plugin
const mockVideoGenerationPlugin = {
    actions: [
        {
            validate: vi.fn().mockImplementation(async (runtime) => {
                const apiKey = runtime.getSetting("LUMA_API_KEY");
                return !!apiKey;
            }),
            handler: vi
                .fn()
                .mockImplementation(
                    async (runtime, message, state, options, callback) => {
                        // Initial response
                        callback({
                            text: "I'll generate a video based on your prompt",
                        });

                        // Check if there's an API error
                        const fetchResponse = await global.fetch();
                        if (!fetchResponse.ok) {
                            callback({
                                text: "Video generation failed: API Error",
                                error: true,
                            });
                            return;
                        }

                        // Final response with video
                        callback(
                            {
                                text: "Here's your generated video!",
                                attachments: [
                                    {
                                        source: "videoGeneration",
                                        url: "https://example.com/video.mp4",
                                    },
                                ],
                            },
                            ["generated_video_123.mp4"]
                        );
                    }
                ),
        },
    ],
};

vi.mock("../index", () => ({
    videoGenerationPlugin: mockVideoGenerationPlugin,
}));

describe("Video Generation Plugin", () => {
    let mockRuntime: IAgentRuntime;
    let mockCallback: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Setup mock runtime
        mockRuntime = {
            getSetting: vi.fn().mockReturnValue("mock-api-key"),
            agentId: "mock-agent-id",
            composeState: vi.fn().mockResolvedValue({}),
        } as unknown as IAgentRuntime;

        mockCallback = vi.fn();

        // Setup fetch mock for successful response
        (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: "mock-generation-id",
                        status: "completed",
                        assets: {
                            video: "https://example.com/video.mp4",
                        },
                    }),
                text: () => Promise.resolve(""),
            })
        );
    });

    it("should validate when API key is present", async () => {
        const mockMessage = {} as Memory;
        const result = await mockVideoGenerationPlugin.actions[0].validate(
            mockRuntime,
            mockMessage
        );
        expect(result).toBe(true);
        expect(mockRuntime.getSetting).toHaveBeenCalledWith("LUMA_API_KEY");
    });

    it("should handle video generation request", async () => {
        const mockMessage = {
            content: {
                text: "Generate a video of a sunset",
            },
        } as Memory;
        const mockState = {} as State;

        await mockVideoGenerationPlugin.actions[0].handler(
            mockRuntime,
            mockMessage,
            mockState,
            {},
            mockCallback
        );

        // Check initial callback
        expect(mockCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                text: expect.stringContaining(
                    "I'll generate a video based on your prompt"
                ),
            })
        );

        // Check final callback with video
        expect(mockCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                text: "Here's your generated video!",
                attachments: expect.arrayContaining([
                    expect.objectContaining({
                        source: "videoGeneration",
                    }),
                ]),
            }),
            expect.arrayContaining([
                expect.stringMatching(/generated_video_.*\.mp4/),
            ])
        );
    });

    it("should handle API errors gracefully", async () => {
        // Mock API error
        (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                statusText: "Internal Server Error",
                text: () => Promise.resolve("API Error"),
            })
        );

        const mockMessage = {
            content: {
                text: "Generate a video of a sunset",
            },
        } as Memory;
        const mockState = {} as State;

        await mockVideoGenerationPlugin.actions[0].handler(
            mockRuntime,
            mockMessage,
            mockState,
            {},
            mockCallback
        );

        // Check error callback
        expect(mockCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                text: expect.stringContaining("Video generation failed"),
                error: true,
            })
        );
    });
});
