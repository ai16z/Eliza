import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { postAction } from '../src/actions/post';
import { ModelClass, type IAgentRuntime, type Memory, type State, generateObject } from '@elizaos/core';
import { TweetContent, TweetSchema } from '../src/types';
import { tweetTemplate } from '../src/templates';
import type { UUID } from '../../core/src/types';

// Mock @elizaos/core
vi.mock('@elizaos/core', async () => {
    const actual = await vi.importActual('@elizaos/core');
    return {
        ...actual,
        generateObject: vi.fn().mockImplementation(async ({ schema }) => {
            if (schema === TweetSchema) {
                return {
                    object: {
                        text: 'Test tweet content'
                    },
                    raw: 'Test tweet content'
                };
            }
            return null;
        }),
        composeContext: vi.fn().mockImplementation(({ state, template }) => {
            // Return a properly formatted context that matches the template format
            return {
                state: {
                    ...state,
                    recentMessages: state?.recentMessages || [],
                    topics: state?.topics || [],
                    postDirections: state?.postDirections || '',
                    agentName: state?.agentName || 'TestAgent',
                },
                template,
                result: template.replace(/{{(\w+)}}/g, (_, key) => state?.[key] || key)
            };
        }),
        formatMessages: vi.fn().mockImplementation((messages) => messages),
        elizaLogger: {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn(),
            info: vi.fn(),
        },
        ModelClass: actual.ModelClass
    };
});

// Create mock Scraper class
const mockScraper = {
    login: vi.fn().mockResolvedValue(true),
    isLoggedIn: vi.fn().mockResolvedValue(true),
    sendTweet: vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
            data: {
                create_tweet: {
                    tweet_results: {
                        result: {
                            id: '123',
                            text: 'Test tweet content'
                        }
                    }
                }
            }
        })
    }),
};

// Mock the agent-twitter-client
vi.mock('agent-twitter-client', () => ({
    Scraper: vi.fn().mockImplementation(() => mockScraper)
}));

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
    vi.resetModules();
    process.env = {
        ...originalEnv,
        TWITTER_USERNAME: 'test_user',
        TWITTER_PASSWORD: 'test_pass',
        TWITTER_EMAIL: 'test@example.com',
        TWITTER_DRY_RUN: 'true'
    };

    // Reset mock implementations
    mockScraper.login.mockResolvedValue(true);
    mockScraper.isLoggedIn.mockResolvedValue(true);
    mockScraper.sendTweet.mockResolvedValue({
        json: () => Promise.resolve({
            data: {
                create_tweet: {
                    tweet_results: {
                        result: {
                            id: '123',
                            text: 'Test tweet content'
                        }
                    }
                }
            }
        })
    });
});

afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
});

describe('Twitter Post Action', () => {
    const mockRuntime: IAgentRuntime = {
        generateObject: vi.fn().mockImplementation(async ({ schema }) => {
            if (schema === TweetSchema) {
                return {
                    object: {
                        text: 'Test tweet content'
                    },
                    raw: 'Test tweet content'
                };
            }
            return null;
        }),
        getMemory: vi.fn(),
        getState: vi.fn(),
        setState: vi.fn(),
        getPlugin: vi.fn(),
        getPlugins: vi.fn(),
        getAction: vi.fn(),
        getActions: vi.fn(),
        getModel: vi.fn(),
        getModels: vi.fn(),
        getEmbedding: vi.fn(),
        getEmbeddings: vi.fn(),
        getTemplate: vi.fn(),
        getTemplates: vi.fn(),
        getCharacter: vi.fn(),
        getCharacters: vi.fn(),
        getPrompt: vi.fn(),
        getPrompts: vi.fn(),
        getPromptTemplate: vi.fn(),
        getPromptTemplates: vi.fn(),
        getPromptModel: vi.fn(),
        getPromptModels: vi.fn(),
    };

    const mockMessage: Memory = {
        id: '123' as UUID,
        content: { text: 'Please tweet something' },
        userId: '123' as UUID,
        agentId: '123' as UUID,
        roomId: '123' as UUID
    };

    const mockState: State = {
        topics: ['test topic'],
        recentMessages: "test",
        recentPostInteractions: [],
        postDirections: 'Be friendly',
        agentName: 'TestAgent',
        bio: '',
        lore: '',
        messageDirections: '',
        roomId: 'ads' as UUID,
        actors: '',
        recentMessagesData: []
    };

    describe('validate', () => {
        it('should validate valid message content', async () => {
            const result = await postAction.validate(
                mockRuntime,
                mockMessage,
                mockState
            );
            expect(result).toBe(true);
        });

        it('should fail validation without credentials', async () => {
            delete process.env.TWITTER_USERNAME;
            delete process.env.TWITTER_PASSWORD;

            const result = await postAction.validate(
                mockRuntime,
                mockMessage,
                mockState
            );
            expect(result).toBe(false);
        });
    });

    describe('handler', () => {
        it('should handle API errors', async () => {
            process.env.TWITTER_DRY_RUN = 'false';
            mockScraper.login.mockRejectedValueOnce(new Error('API Error'));
            mockScraper.isLoggedIn.mockResolvedValueOnce(false);

            const result = await postAction.handler(
                mockRuntime,
                mockMessage,
                mockState
            );
            expect(result).toBe(false);
        });
    });
});
