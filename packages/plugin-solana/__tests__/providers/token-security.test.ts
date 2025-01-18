import { describe, it, expect, vi } from 'vitest';
import { TokenProvider } from '../../src/providers/token';
import { WalletProvider } from '../../src/providers/wallet';
import { ICacheManager } from '@elizaos/core';

describe('Token Security', () => {
    it('should handle empty security data gracefully', async () => {
        const mockCacheManager = {
            get: vi.fn().mockResolvedValue(null),
            set: vi.fn(),
            delete: vi.fn(),
            clear: vi.fn(),
            has: vi.fn(),
        };

        const mockWalletProvider = new WalletProvider(mockCacheManager);
        const tokenProvider = new TokenProvider(
            'So11111111111111111111111111111111111111112',
            mockWalletProvider,
            mockCacheManager
        );

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                success: true,
                data: {}
            })
        });

        const result = await tokenProvider.fetchTokenSecurity();
        expect(result).toBeDefined();
        expect(result.ownerBalance).toBe(undefined);
        expect(result.creatorBalance).toBe(undefined);
    });
});
