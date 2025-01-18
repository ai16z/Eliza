import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RedisClient } from '../src';
import { type UUID, elizaLogger } from '@elizaos/core';
import Redis from 'ioredis';

// Mock ioredis
vi.mock('ioredis', () => {
    const MockRedis = vi.fn(() => ({
        on: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
        del: vi.fn(),
        quit: vi.fn()
    }));
    return { default: MockRedis };
});

// Mock elizaLogger
vi.mock('@elizaos/core', async () => {
    const actual = await vi.importActual('@elizaos/core');
    return {
        ...actual as any,
        elizaLogger: {
            success: vi.fn(),
            error: vi.fn()
        }
    };
});

describe('RedisClient', () => {
    let client: RedisClient;
    let mockRedis: any;

    beforeEach(() => {
        vi.clearAllMocks();
        client = new RedisClient('redis://localhost:6379');
        // Get the instance created by the constructor
        mockRedis = (Redis as unknown as ReturnType<typeof vi.fn>).mock.results[0].value;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('constructor', () => {
        it('should set up event handlers', () => {
            expect(mockRedis.on).toHaveBeenCalledWith('connect', expect.any(Function));
            expect(mockRedis.on).toHaveBeenCalledWith('error', expect.any(Function));
        });

        it('should log success on connect', () => {
            const connectHandler = mockRedis.on.mock.calls.find(call => call[0] === 'connect')[1];
            connectHandler();
            expect(elizaLogger.success).toHaveBeenCalledWith('Connected to Redis');
        });

        it('should log error on error event', () => {
            const error = new Error('Redis connection error');
            const errorHandler = mockRedis.on.mock.calls.find(call => call[0] === 'error')[1];
            errorHandler(error);
            expect(elizaLogger.error).toHaveBeenCalledWith('Redis error:', error);
        });
    });

    describe('getCache', () => {
        const agentId = 'test-agent' as UUID;
        const key = 'test-key';
        const expectedRedisKey = `${agentId}:${key}`;

        it('should return cached value when it exists', async () => {
            const cachedValue = 'cached-data';
            mockRedis.get.mockResolvedValueOnce(cachedValue);

            const result = await client.getCache({ agentId, key });

            expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
            expect(result).toBe(cachedValue);
        });

        it('should return undefined when key does not exist', async () => {
            mockRedis.get.mockResolvedValueOnce(null);

            const result = await client.getCache({ agentId, key });

            expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
            expect(result).toBeUndefined();
        });

        it('should handle errors and return undefined', async () => {
            const error = new Error('Redis error');
            mockRedis.get.mockRejectedValueOnce(error);

            const result = await client.getCache({ agentId, key });

            expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
            expect(elizaLogger.error).toHaveBeenCalledWith('Error getting cache:', error);
            expect(result).toBeUndefined();
        });
    });

    describe('setCache', () => {
        const agentId = 'test-agent' as UUID;
        const key = 'test-key';
        const value = 'test-value';
        const expectedRedisKey = `${agentId}:${key}`;

        it('should successfully set cache value', async () => {
            mockRedis.set.mockResolvedValueOnce('OK');

            const result = await client.setCache({ agentId, key, value });

            expect(mockRedis.set).toHaveBeenCalledWith(expectedRedisKey, value);
            expect(result).toBe(true);
        });

        it('should handle errors and return false', async () => {
            const error = new Error('Redis error');
            mockRedis.set.mockRejectedValueOnce(error);

            const result = await client.setCache({ agentId, key, value });

            expect(mockRedis.set).toHaveBeenCalledWith(expectedRedisKey, value);
            expect(elizaLogger.error).toHaveBeenCalledWith('Error setting cache:', error);
            expect(result).toBe(false);
        });
    });

    describe('deleteCache', () => {
        const agentId = 'test-agent' as UUID;
        const key = 'test-key';
        const expectedRedisKey = `${agentId}:${key}`;

        it('should successfully delete cache when key exists', async () => {
            mockRedis.del.mockResolvedValueOnce(1);

            const result = await client.deleteCache({ agentId, key });

            expect(mockRedis.del).toHaveBeenCalledWith(expectedRedisKey);
            expect(result).toBe(true);
        });

        it('should return false when key does not exist', async () => {
            mockRedis.del.mockResolvedValueOnce(0);

            const result = await client.deleteCache({ agentId, key });

            expect(mockRedis.del).toHaveBeenCalledWith(expectedRedisKey);
            expect(result).toBe(false);
        });

        it('should handle errors and return false', async () => {
            const error = new Error('Redis error');
            mockRedis.del.mockRejectedValueOnce(error);

            const result = await client.deleteCache({ agentId, key });

            expect(mockRedis.del).toHaveBeenCalledWith(expectedRedisKey);
            expect(elizaLogger.error).toHaveBeenCalledWith('Error deleting cache:', error);
            expect(result).toBe(false);
        });
    });

    describe('disconnect', () => {
        it('should successfully disconnect from Redis', async () => {
            mockRedis.quit.mockResolvedValueOnce('OK');

            await client.disconnect();

            expect(mockRedis.quit).toHaveBeenCalled();
            expect(elizaLogger.success).toHaveBeenCalledWith('Disconnected from Redis');
        });

        it('should handle disconnect errors', async () => {
            const error = new Error('Redis disconnect error');
            mockRedis.quit.mockRejectedValueOnce(error);

            await client.disconnect();

            expect(mockRedis.quit).toHaveBeenCalled();
            expect(elizaLogger.error).toHaveBeenCalledWith('Error disconnecting from Redis:', error);
        });
    });
});
