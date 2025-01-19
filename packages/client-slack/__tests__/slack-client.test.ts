import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SlackClient } from '../src/index';
import { WebClient } from '@slack/web-api';
import type { IAgentRuntime, Character } from '@elizaos/core';

// Mock dependencies
vi.mock('@slack/web-api');
vi.mock('@elizaos/core');

describe('SlackClient', () => {
  let mockRuntime: IAgentRuntime;
  let slackClient: SlackClient;

  beforeEach(() => {
    // Setup mock runtime
    mockRuntime = {
      getSetting: vi.fn((key: string) => {
        const settings: { [key: string]: string } = {
          'SLACK_BOT_TOKEN': 'test-token',
          'SLACK_SIGNING_SECRET': 'test-secret'
        };
        return settings[key];
      }),
      character: {} as Character
    } as unknown as IAgentRuntime;
  });

  it('should initialize with correct settings', () => {
    slackClient = new SlackClient(mockRuntime);
    expect(mockRuntime.getSetting).toHaveBeenCalledWith('SLACK_BOT_TOKEN');
    expect(mockRuntime.getSetting).toHaveBeenCalledWith('SLACK_SIGNING_SECRET');
  });

  it('should throw error if SLACK_BOT_TOKEN is missing', () => {
    mockRuntime.getSetting = vi.fn((key: string) => {
      const settings: { [key: string]: string } = {
        'SLACK_SIGNING_SECRET': 'test-secret'
      };
      return settings[key];
    });

    expect(() => new SlackClient(mockRuntime)).toThrow('SLACK_BOT_TOKEN is required');
  });

  it('should throw error if SLACK_SIGNING_SECRET is missing', () => {
    mockRuntime.getSetting = vi.fn((key: string) => {
      const settings: { [key: string]: string } = {
        'SLACK_BOT_TOKEN': 'test-token'
      };
      return settings[key];
    });

    expect(() => new SlackClient(mockRuntime)).toThrow('SLACK_SIGNING_SECRET is required');
  });
});
