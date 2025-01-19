import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountService } from '../src/services/account';
import { AuthenticationError } from '../src/types/internal/error';

// Mock the Binance client
const mockAccount = vi.fn();
vi.mock('@binance/connector', () => ({
    Spot: vi.fn().mockImplementation(() => ({
        account: mockAccount
    }))
}));

describe('AccountService', () => {
    let accountService: AccountService;
    const mockApiKey = 'test-api-key';
    const mockSecretKey = 'test-secret-key';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('initialization', () => {
        it('should initialize with API credentials', () => {
            accountService = new AccountService({
                apiKey: mockApiKey,
                secretKey: mockSecretKey
            });
            expect(accountService).toBeInstanceOf(AccountService);
        });
    });

    describe('getBalance', () => {
        it('should throw AuthenticationError when credentials are missing', async () => {
            accountService = new AccountService();
            await expect(accountService.getBalance({}))
                .rejects
                .toThrow(AuthenticationError);
        });

        it('should filter non-zero balances', async () => {
            accountService = new AccountService({
                apiKey: mockApiKey,
                secretKey: mockSecretKey
            });

            const mockAccountInfo = {
                balances: [
                    { asset: 'BTC', free: '1.0', locked: '0.0' },
                    { asset: 'ETH', free: '0.0', locked: '0.0' },
                    { asset: 'USDT', free: '100.0', locked: '50.0' }
                ]
            };

            mockAccount.mockResolvedValueOnce({ data: mockAccountInfo });

            const result = await accountService.getBalance({});
            expect(result.balances).toHaveLength(2); // Only BTC and USDT have non-zero balances
            expect(result.balances).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ asset: 'BTC' }),
                    expect.objectContaining({ asset: 'USDT' })
                ])
            );
        });

        it('should filter by asset when specified', async () => {
            accountService = new AccountService({
                apiKey: mockApiKey,
                secretKey: mockSecretKey
            });

            const mockAccountInfo = {
                balances: [
                    { asset: 'BTC', free: '1.0', locked: '0.0' },
                    { asset: 'ETH', free: '2.0', locked: '0.0' },
                ]
            };

            mockAccount.mockResolvedValueOnce({ data: mockAccountInfo });

            const result = await accountService.getBalance({ asset: 'BTC' });
            expect(result.balances).toHaveLength(1);
            expect(result.balances[0]).toEqual(
                expect.objectContaining({ 
                    asset: 'BTC',
                    free: '1.0',
                    locked: '0.0'
                })
            );
        });
    });

    describe('checkBalance', () => {
        it('should return true when balance is sufficient', async () => {
            accountService = new AccountService({
                apiKey: mockApiKey,
                secretKey: mockSecretKey
            });

            const mockAccountInfo = {
                balances: [
                    { asset: 'BTC', free: '1.0', locked: '0.0' }
                ]
            };

            mockAccount.mockResolvedValueOnce({ data: mockAccountInfo });

            const result = await accountService.checkBalance('BTC', 0.5);
            expect(result).toBe(true);
        });

        it('should return false when balance is insufficient', async () => {
            accountService = new AccountService({
                apiKey: mockApiKey,
                secretKey: mockSecretKey
            });

            const mockAccountInfo = {
                balances: [
                    { asset: 'BTC', free: '0.1', locked: '0.0' }
                ]
            };

            mockAccount.mockResolvedValueOnce({ data: mockAccountInfo });

            const result = await accountService.checkBalance('BTC', 1.0);
            expect(result).toBe(false);
        });
    });
});
