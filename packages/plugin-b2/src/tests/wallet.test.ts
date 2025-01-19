import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initWalletProvider, WalletProvider } from "../providers";
import { generatePrivateKey } from "viem/accounts";

describe("B2 Network Wallet Provider", () => {
    //let walletProvider: WalletProvider;
    let mockRuntime;

    beforeEach(() => {
        vi.clearAllMocks();
        const pk = generatePrivateKey();
        //walletProvider = new WalletProvider(pk);
        mockRuntime = {
            getSetting: vi.fn(),
        };
        mockRuntime.getSetting.mockImplementation((key: string) => {
            const settings = {
                B2_PRIVATE_KEY: pk,
            };
            return settings[key];
        });
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe("Constructor", () => {
        it("new wallet provider", () => {
            const pk = generatePrivateKey();
            const ta = new WalletProvider(pk);
            expect(ta).toBeDefined();
        });
        it("init wallet provider",async () => {
            const ta = await initWalletProvider(mockRuntime);
            expect(ta).toBeDefined();
        });
    });
});
