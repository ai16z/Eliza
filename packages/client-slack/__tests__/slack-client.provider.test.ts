import { describe, expect, test, beforeEach, vi } from "vitest";
import { SlackClientProvider } from "../src/providers/slack-client.provider";
import type { SlackConfig } from "../src/types/slack-types";
import type { WebClient } from "@slack/web-api";
import type {
    AuthTestResponse,
    ChatPostMessageResponse,
} from "@slack/web-api";

vi.mock("@slack/web-api");

// Mock setup functions
const createMockSlackResponse = (ok: boolean, additionalData = {}) => ({
    ok,
    ...additionalData,
});

const getMockWebClient = () => {
    return {
        auth: {
            test: vi.fn(),
        },
        chat: {
            postMessage: vi.fn(),
        },
    } as unknown as WebClient;
};

describe("SlackClientProvider", () => {
    let provider: SlackClientProvider;
    let mockWebClient: WebClient;
    let mockConfig: SlackConfig;

    beforeEach(() => {
        vi.clearAllMocks();
        mockConfig = {
            appId: "test-app-id",
            clientId: "test-client-id",
            clientSecret: "test-client-secret",
            signingSecret: "test-signing-secret",
            verificationToken: "test-verification-token",
            botToken: "test-bot-token",
            botId: "test-bot-id",
        };
        mockWebClient = getMockWebClient();
        provider = new SlackClientProvider(mockConfig);
        // @ts-ignore - setting mock client for testing
        provider['client'] = mockWebClient;
    });

    describe("Initialization", () => {
        test("should create a provider instance with default retry options", () => {
            expect(provider).toBeInstanceOf(SlackClientProvider);
            const context = provider.getContext();
            expect(context).toHaveProperty("client");
            expect(context).toHaveProperty("config");
            expect(context.config).toEqual(mockConfig);
        });

        test("should create a provider instance with custom retry options", () => {
            const retryOptions = {
                maxRetries: 5,
                initialDelay: 2000,
                maxDelay: 10000,
            };
            const providerWithOptions = new SlackClientProvider(mockConfig, retryOptions);
            // @ts-ignore - setting mock client for testing
            providerWithOptions['client'] = mockWebClient;

            expect(providerWithOptions).toBeInstanceOf(SlackClientProvider);
            const context = providerWithOptions.getContext();
            expect(context).toHaveProperty("client");
            expect(context).toHaveProperty("config");
            expect(context.config).toEqual(mockConfig);
        });
    });

    describe("Connection Validation", () => {
        test("should validate connection successfully", async () => {
            const mockResponse = createMockSlackResponse(true, {
                user_id: "test-bot-id",
            }) as AuthTestResponse;
            const mockTest = mockWebClient.auth.test as vi.Mock;
            mockTest.mockResolvedValue(mockResponse);

            const result = await provider.validateConnection();
            expect(result).toBe(true);
        });

        test("should handle failed validation", async () => {
            const mockResponse = createMockSlackResponse(false) as AuthTestResponse;
            const mockTest = mockWebClient.auth.test as vi.Mock;
            mockTest.mockResolvedValue(mockResponse);

            const result = await provider.validateConnection();
            expect(result).toBe(false);
        });

        test("should handle connection errors", async () => {
            const mockTest = mockWebClient.auth.test as vi.Mock;
            mockTest.mockRejectedValue(new Error("Connection failed"));

            const result = await provider.validateConnection();
            expect(result).toBe(false);
        });
    });

    describe("Message Sending", () => {
        const channelId = "test-channel";
        const text = "Hello, world!";

        test("should successfully send a message", async () => {
            const expectedResponse = createMockSlackResponse(true, {
                ts: "1234567890.123456",
            }) as ChatPostMessageResponse;
            const mockPostMessage = mockWebClient.chat.postMessage as vi.Mock;
            mockPostMessage.mockResolvedValue(expectedResponse);

            const result = await provider.sendMessage(channelId, text);
            expect(result.ok).toBe(true);
            expect(mockPostMessage).toHaveBeenCalledWith({
                channel: channelId,
                text: text,
            });
        });

        test("should handle rate limiting", async () => {
            const mockResponse = createMockSlackResponse(true) as ChatPostMessageResponse;
            const mockPostMessage = mockWebClient.chat.postMessage as vi.Mock;

            mockPostMessage
                .mockRejectedValueOnce(new Error("rate_limited"))
                .mockResolvedValueOnce(mockResponse);

            const result = await provider.sendMessage(channelId, text);
            expect(result.ok).toBe(true);
        });

        test("should handle network errors with retry", async () => {
            const mockResponse = createMockSlackResponse(true) as ChatPostMessageResponse;
            const mockPostMessage = mockWebClient.chat.postMessage as vi.Mock;

            mockPostMessage
                .mockRejectedValueOnce(new Error("network_error"))
                .mockResolvedValueOnce(mockResponse);

            const result = await provider.sendMessage(channelId, text);
            expect(result.ok).toBe(true);
        });
    });
});
