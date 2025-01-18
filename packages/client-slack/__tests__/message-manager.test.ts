import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MessageManager } from '../src/messages';
import type { WebClient } from '@slack/web-api';
import type { IAgentRuntime } from '@elizaos/core';

// Mock dependencies
vi.mock('@slack/web-api');
vi.mock('@elizaos/core');

describe('MessageManager', () => {
  let mockWebClient: WebClient;
  let mockRuntime: IAgentRuntime;
  let messageManager: MessageManager;
  const mockBotUserId = 'U123456';

  beforeEach(() => {
    // Setup mock WebClient
    mockWebClient = {
      chat: {
        postMessage: vi.fn()
      }
    } as unknown as WebClient;

    // Setup mock runtime
    mockRuntime = {
      getSetting: vi.fn(),
      character: {
        name: 'TestBot'
      }
    } as unknown as IAgentRuntime;

    messageManager = new MessageManager(mockWebClient, mockRuntime, mockBotUserId);
  });

  it('should initialize with correct parameters', () => {
    expect(messageManager).toBeDefined();
  });

  it('should not process duplicate events', () => {
    const eventId = 'evt_123';
    const result1 = messageManager['processedEvents'].has(eventId);
    expect(result1).toBe(false);

    // Add event to processed set
    messageManager['processedEvents'].add(eventId);
    const result2 = messageManager['processedEvents'].has(eventId);
    expect(result2).toBe(true);
  });

  it('should handle message processing lock correctly', () => {
    const messageId = 'msg_123';
    const isLocked1 = messageManager['messageProcessingLock'].has(messageId);
    expect(isLocked1).toBe(false);

    // Lock message
    messageManager['messageProcessingLock'].add(messageId);
    const isLocked2 = messageManager['messageProcessingLock'].has(messageId);
    expect(isLocked2).toBe(true);
  });

  it('should clean up old processed messages', () => {
    vi.useFakeTimers();
    const oldMessageId = 'old_msg';
    const newMessageId = 'new_msg';
    
    // Add messages with different timestamps
    messageManager['processedMessages'].set(oldMessageId, Date.now() - 3700000); // older than 1 hour
    messageManager['processedMessages'].set(newMessageId, Date.now()); // current

    // Trigger cleanup by advancing time and running interval callback
    const cleanupInterval = setInterval(() => {
      const oneHourAgo = Date.now() - 3600000;
      for (const [key, timestamp] of messageManager['processedMessages'].entries()) {
        if (timestamp < oneHourAgo) {
          messageManager['processedMessages'].delete(key);
        }
      }
    }, 3600000);

    vi.advanceTimersByTime(3600000);

    // Check if old message was cleaned up
    expect(messageManager['processedMessages'].has(oldMessageId)).toBe(false);
    expect(messageManager['processedMessages'].has(newMessageId)).toBe(true);

    clearInterval(cleanupInterval);
    vi.useRealTimers();
  });
});
