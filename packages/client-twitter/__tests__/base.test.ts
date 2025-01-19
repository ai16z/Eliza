import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClientBase } from '../src/base';
import type { IAgentRuntime } from '@elizaos/core';
import type { TwitterConfig } from '../src/environment';

describe('Twitter Client Base', () => {
    let mockRuntime: IAgentRuntime;
    let mockConfig: TwitterConfig;

    beforeEach(() => {
        mockRuntime = {
            env: {
                TWITTER_USERNAME: 'testuser',
                TWITTER_DRY_RUN: 'true',
                TWITTER_POST_INTERVAL_MIN: '5',
                TWITTER_POST_INTERVAL_MAX: '10',
                TWITTER_ACTION_INTERVAL: '5',
                TWITTER_ENABLE_ACTION_PROCESSING: 'true',
                TWITTER_POST_IMMEDIATELY: 'false',
                TWITTER_SEARCH_ENABLE: 'false'
            },
            getEnv: function (key: string) {
                return this.env[key] || null;
            },
            getSetting: function (key: string) {
                return this.env[key] || null;
            },
            character: {
                style: {
                    all: ['Test style 1', 'Test style 2'],
                    post: ['Post style 1', 'Post style 2']
                }
            }
        } as unknown as IAgentRuntime;

        mockConfig = {
            TWITTER_USERNAME: 'testuser',
            TWITTER_DRY_RUN: true,
            TWITTER_SEARCH_ENABLE: false,
            TWITTER_SPACES_ENABLE: false,
            TWITTER_TARGET_USERS: [],
            TWITTER_MAX_TWEETS_PER_DAY: 10,
            TWITTER_MAX_TWEET_LENGTH: 280,
            POST_INTERVAL_MIN: 5,
            POST_INTERVAL_MAX: 10,
            ACTION_INTERVAL: 5,
            ENABLE_ACTION_PROCESSING: true,
            POST_IMMEDIATELY: false
        };
    });

    it('should create instance with correct configuration', () => {
        const client = new ClientBase(mockRuntime, mockConfig);
        expect(client).toBeDefined();
        expect(client.twitterConfig).toBeDefined();
        expect(client.twitterConfig.TWITTER_USERNAME).toBe('testuser');
        expect(client.twitterConfig.TWITTER_DRY_RUN).toBe(true);
    });

    it('should initialize with correct tweet length limit', () => {
        const client = new ClientBase(mockRuntime, mockConfig);
        expect(client.twitterConfig.TWITTER_MAX_TWEET_LENGTH).toBe(280);
    });

    it('should initialize with correct post intervals', () => {
        const client = new ClientBase(mockRuntime, mockConfig);
        expect(client.twitterConfig.POST_INTERVAL_MIN).toBe(5);
        expect(client.twitterConfig.POST_INTERVAL_MAX).toBe(10);
    });

    it('should initialize with correct action settings', () => {
        const client = new ClientBase(mockRuntime, mockConfig);
        expect(client.twitterConfig.ACTION_INTERVAL).toBe(5);
        expect(client.twitterConfig.ENABLE_ACTION_PROCESSING).toBe(true);
    });
});
