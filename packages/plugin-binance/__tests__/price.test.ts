import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PriceService } from '../src/services/price';
import { BinanceError } from '../src/types/internal/error';
import { ERROR_MESSAGES } from '../src/constants/errors';

// Mock elizaLogger
vi.mock('@elizaos/core', () => ({
    elizaLogger: {
        error: vi.fn()
    }
}));

describe('PriceService', () => {
    let service: PriceService;
    let mockClient: any;

    beforeEach(() => {
        mockClient = {
            tickerPrice: vi.fn()
        };
        service = new PriceService();
        // @ts-ignore - we're mocking the client
        service.client = mockClient;
    });

    describe('getPrice', () => {
        const validRequest = {
            symbol: 'BTC',
            quoteCurrency: 'USDT'
        };

        it('should return price data for valid symbol', async () => {
            const mockPrice = '42150.25';
            mockClient.tickerPrice.mockResolvedValueOnce({
                data: { price: mockPrice }
            });

            const result = await service.getPrice(validRequest);

            expect(mockClient.tickerPrice).toHaveBeenCalledWith('BTCUSDT');
            expect(result).toEqual({
                symbol: 'BTCUSDT',
                price: mockPrice,
                timestamp: expect.any(Number)
            });
        });

        it('should throw error for invalid symbol length', async () => {
            const invalidRequest = {
                symbol: 'B',  // Too short
                quoteCurrency: 'USDT'
            };

            await expect(service.getPrice(invalidRequest))
                .rejects
                .toThrow(ERROR_MESSAGES.INVALID_SYMBOL);
        });

        it('should handle API errors', async () => {
            const apiError = new Error('API Error');
            mockClient.tickerPrice.mockRejectedValueOnce(apiError);

            await expect(service.getPrice(validRequest))
                .rejects
                .toBeInstanceOf(BinanceError);
        });
    });

    describe('formatPrice', () => {
        it('should format string price correctly', () => {
            expect(PriceService.formatPrice('42150.25')).toBe('42,150.25');
            expect(PriceService.formatPrice('0.00012345')).toBe('0.00012345');
        });

        it('should format number price correctly', () => {
            expect(PriceService.formatPrice(42150.25)).toBe('42,150.25');
            expect(PriceService.formatPrice(0.00012345)).toBe('0.00012345');
        });

        it('should handle large numbers', () => {
            expect(PriceService.formatPrice('1234567.89')).toBe('1,234,567.89');
        });

        it('should handle small decimal numbers', () => {
            expect(PriceService.formatPrice('0.00000001')).toBe('0.00000001');
        });
    });
});
