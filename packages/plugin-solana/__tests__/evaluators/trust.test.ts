import { describe, it, expect, vi } from 'vitest';
import { trustEvaluator } from '../../src/evaluators/trust';

// Mock the core module
vi.mock('@elizaos/core', () => ({
    generateTrueOrFalse: vi.fn().mockResolvedValue(false),
    ModelClass: {
        SMALL: 'small'
    },
    settings: {
        MAIN_WALLET_ADDRESS: 'test-wallet-address'
    },
    booleanFooter: 'Answer with Yes or No.',
    elizaLogger: {
        log: vi.fn(),
        debug: vi.fn(),
        info: vi.fn(),
        error: vi.fn()
    },
    composeContext: vi.fn().mockReturnValue({
        state: {},
        template: ''
    })
}));

describe('Trust Evaluator', () => {
    it('should handle non-trust messages', async () => {
        const mockRuntime = {
            getSetting: vi.fn(),
            composeState: vi.fn().mockResolvedValue({
                agentId: 'test-agent',
                roomId: 'test-room'
            }),
            getLogger: vi.fn().mockReturnValue({
                debug: vi.fn(),
                info: vi.fn(),
                log: vi.fn(),
                error: vi.fn()
            })
        };

        const mockMessage = {
            content: 'Hello world',
            metadata: {}
        };

        const mockState = {
            agentId: 'test-agent',
            roomId: 'test-room'
        };

        const result = await trustEvaluator.handler(mockRuntime, mockMessage, mockState);
        expect(result).toBeDefined();
    });
});
