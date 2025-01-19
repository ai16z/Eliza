import { defaultCharacter } from "@elizaos/core";

import {
    describe,
    it,
    vi,
    expect,
    beforeAll,
    beforeEach,
    afterEach,
} from "vitest";
import BigNumber from "bignumber.js";
import { WalletProvider } from "../providers/wallet";

import { mnemonicNew, mnemonicToPrivateKey, type KeyPair } from "@ton/crypto";

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

const testnet = "https://testnet.toncenter.com/api/v2/jsonRPC";

describe("Wallet provider", () => {
    let walletProvider: WalletProvider;
    let keypair: KeyPair;
    let mockedRuntime;

    beforeAll(async () => {
        const password = "";
        const mnemonics: string[] = await mnemonicNew(12, password);
        keypair = await mnemonicToPrivateKey(mnemonics, password);
        walletProvider = new WalletProvider(keypair, testnet, mockCacheManager);
        mockedRuntime = {
            character: defaultCharacter,
        };
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockCacheManager.get.mockResolvedValue(null);
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe("Wallet Integration", () => {
        it("should check wallet address", async () => {
            const result =
                await walletProvider.getFormattedPortfolio(mockedRuntime);

            const prices = await walletProvider.fetchPrices().catch((error) => {
                console.error(`Error fetching TON price:`, error);
                throw error;
            });
            const nativeTokenBalance = await walletProvider
                .getWalletBalance()
                .catch((error) => {
                    console.error(`Error fetching TON amount:`, error);
                    throw error;
                });

            const amount =
                Number(nativeTokenBalance) / Number(BigInt(1000000000));
            const totalUsd = new BigNumber(amount.toString()).times(
                prices.nativeToken.usd
            );

            expect(result).toEqual(
                `Eliza\nWallet Address: ${walletProvider.getAddress()}\n` +
                    `Total Value: $${totalUsd.toFixed(2)} (${amount.toFixed(4)} TON)\n`
            );
        });
    });
});
