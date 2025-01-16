import { TronWeb } from "tronweb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WalletProvider } from "../providers/wallet";

// Mock NodeCache
vi.mock("node-cache", () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            set: vi.fn(),
            get: vi.fn().mockReturnValue(null),
        })),
    };
});

// Mock path module
vi.mock("path", async () => {
    const actual = await vi.importActual("path");
    return {
        ...actual,
        join: vi.fn().mockImplementation((...args) => args.join("/")),
    };
});

// Mock the ICacheManager
const mockCacheManager = {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn(),
    delete: vi.fn(),
};

describe("Wallet provider", () => {
    let walletProvider: WalletProvider;

    const account = TronWeb.createRandom();
    const privateKey = account.privateKey.replace(/^0x/, "");
    const tokenAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT
    const customRpcUrl = "https://api.trongrid.io";

    beforeEach(() => {
        vi.clearAllMocks();
        mockCacheManager.get.mockResolvedValue(null);
        walletProvider = new WalletProvider(
            privateKey,
            mockCacheManager,
            customRpcUrl
        );
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe("Constructor", () => {
        it("sets address", () => {
            const expectedAddress = new TronWeb({
                fullHost: customRpcUrl,
                privateKey,
            }).defaultAddress.base58;
            expect(walletProvider.getAddress()).toEqual(expectedAddress);
        });
        it("sets default chain to tron", () => {
            expect(walletProvider.getCurrentChain()).toEqual("tron");
        });
    });

    describe("Balance", () => {
        it("should fetch balance", async () => {
            const balance = await walletProvider.getWalletBalance();
            expect(balance).toEqual("0");
        });
    });

    describe("Token", () => {
        it("should fetch onchain token details", async () => {
            const tokenDetails =
                await walletProvider.fetchOnchainToken(tokenAddress);
            expect(tokenDetails).toHaveProperty("name");
            expect(tokenDetails).toHaveProperty("symbol");
            expect(tokenDetails).toHaveProperty("decimals");
        });
    });

    describe("Allowance", () => {
        it("should get token allowance", async () => {
            const owner = account.address;
            const spender = account.address;
            const allowance = await walletProvider.allowance(
                tokenAddress,
                owner,
                spender
            );
            expect(allowance).toBeDefined();
        });
    });
});
