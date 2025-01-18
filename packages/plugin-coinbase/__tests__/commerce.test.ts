import { describe, it, expect, vi, beforeEach } from 'vitest';
import { coinbaseCommercePlugin, createCharge } from '../src/plugins/commerce';
import { IAgentRuntime, type Memory, State } from '@elizaos/core';

// Mock fetch
global.fetch = vi.fn();

// Mock runtime
const mockRuntime = {
    getSetting: vi.fn().mockReturnValue('test-api-key'),
    getProvider: vi.fn().mockReturnValue({ apiKey: 'test-api-key' }),
    character: {
        name: 'test-character'
    }
};

describe('Coinbase Commerce Plugin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createCharge', () => {
        it('should create a charge successfully', async () => {
            const mockResponse = {
                data: {
                    id: 'test-charge-id',
                    name: 'Test Charge',
                    description: 'Test Description',
                    pricing_type: 'fixed_price',
                    local_price: {
                        amount: '100',
                        currency: 'USD'
                    }
                }
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            });

            const params = {
                name: 'Test Charge',
                description: 'Test Description',
                pricing_type: 'fixed_price',
                local_price: {
                    amount: '100',
                    currency: 'USD'
                }
            };

            const result = await createCharge('test-api-key', params);
            expect(result).toEqual(mockResponse.data);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.commerce.coinbase.com/charges',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CC-Api-Key': 'test-api-key'
                    },
                    body: JSON.stringify(params)
                }
            );
        });

        it('should handle errors when creating charge', async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                statusText: 'Bad Request'
            });

            const params = {
                name: 'Test Charge',
                description: 'Test Description',
                pricing_type: 'fixed_price',
                local_price: {
                    amount: '100',
                    currency: 'USD'
                }
            };

            await expect(createCharge('test-api-key', params))
                .rejects
                .toThrow('Failed to create charge: Bad Request');
        });
    });

    describe('coinbaseCommercePlugin', () => {
        it('should have correct plugin properties', () => {
            expect(coinbaseCommercePlugin.name).toBe('coinbaseCommerce');
            expect(coinbaseCommercePlugin.actions).toBeDefined();
            expect(Array.isArray(coinbaseCommercePlugin.actions)).toBe(true);
        });

        it('should validate plugin actions', async () => {
            const mockMessage: Memory = {
                id: '1',
                user: 'test-user',
                content: { text: 'test message' },
                timestamp: new Date(),
                type: 'text'
            };

            const createChargeAction = coinbaseCommercePlugin.actions.find(
                action => action.name === 'CREATE_CHARGE'
            );

            expect(createChargeAction).toBeDefined();
            if (createChargeAction) {
                const result = await createChargeAction.validate(mockRuntime as any, mockMessage);
                expect(result).toBe(true);
            }
        });
    });
});
