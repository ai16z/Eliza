import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { fuse, Chain } from "viem/chains";

import { WalletProvider } from "../providers/wallet";

const customRpcUrls = {
    fuse: "custom-rpc.fuse.io",
};

describe("Wallet provider", () => {
    let walletProvider: WalletProvider;
    let pk: `0x${string}`;
    const customChains: Record<string, Chain> = {};

    beforeAll(() => {
        pk = generatePrivateKey();

        const chainNames = ["fuse"];
        chainNames.forEach(
            (chain) =>
                (customChains[chain] = WalletProvider.genChainFromName(chain))
        );
    });

    describe("Constructor", () => {
        it("sets address", () => {
            const account = privateKeyToAccount(pk);
            const expectedAddress = account.address;

            walletProvider = new WalletProvider(pk);

            expect(walletProvider.getAddress()).toEqual(expectedAddress);
        });
        it("sets default chain to fuse", () => {
            walletProvider = new WalletProvider(pk);

            expect(walletProvider.chains.fuse.id).toEqual(fuse.id);
            expect(walletProvider.getCurrentChain().id).toEqual(fuse.id);
        });
        it("sets custom chains", () => {
            walletProvider = new WalletProvider(pk, customChains);

            expect(walletProvider.chains.fuse.id).toEqual(fuse.id);
        });
        it("sets the first provided custom chain as current chain", () => {
            walletProvider = new WalletProvider(pk, customChains);

            expect(walletProvider.getCurrentChain().id).toEqual(fuse.id);
        });
    });
    describe("Clients", () => {
        beforeEach(() => {
            walletProvider = new WalletProvider(pk);
        });
        it("generates public client", () => {
            const client = walletProvider.getPublicClient("fuse");
            expect(client.chain.id).toEqual(fuse.id);
            expect(client.transport.url).toEqual(
                fuse.rpcUrls.default.http[0]
            );
        });
        it("generates public client with custom rpcurl", () => {
            const chain = WalletProvider.genChainFromName(
                "fuse",
                customRpcUrls.fuse
            );
            const wp = new WalletProvider(pk, { ["fuse"]: chain });

            const client = wp.getPublicClient("fuse");
            expect(client.chain.id).toEqual(fuse.id);
            expect(client.chain.rpcUrls.default.http[0]).toEqual(
                fuse.rpcUrls.default.http[0]
            );
            expect(client.chain.rpcUrls.custom.http[0]).toEqual(
                customRpcUrls.fuse
            );
            expect(client.transport.url).toEqual(customRpcUrls.fuse);
        });
        it("generates wallet client", () => {
            const account = privateKeyToAccount(pk);
            const expectedAddress = account.address;

            const client = walletProvider.getWalletClient("fuse");

            expect(client.account.address).toEqual(expectedAddress);
            expect(client.transport.url).toEqual(
                fuse.rpcUrls.default.http[0]
            );
        });
        it("generates wallet client with custom rpcurl", () => {
            const account = privateKeyToAccount(pk);
            const expectedAddress = account.address;
            const chain = WalletProvider.genChainFromName(
                "fuse",
                customRpcUrls.fuse
            );
            const wp = new WalletProvider(pk, { ["fuse"]: chain });

            const client = wp.getWalletClient("fuse");

            expect(client.account.address).toEqual(expectedAddress);
            expect(client.chain.id).toEqual(fuse.id);
            expect(client.chain.rpcUrls.default.http[0]).toEqual(
                fuse.rpcUrls.default.http[0]
            );
            expect(client.chain.rpcUrls.custom.http[0]).toEqual(
                customRpcUrls.fuse
            );
            expect(client.transport.url).toEqual(customRpcUrls.fuse);
        });
    });
    describe("Balance", () => {
        beforeEach(() => {
            walletProvider = new WalletProvider(pk, customChains);
        });
        it("should fetch balance", async () => {
            const bal = await walletProvider.getWalletBalance();

            expect(bal).toEqual("0");
        });
        it("should fetch balance for a specific added chain", async () => {
            const bal = await walletProvider.getWalletBalanceForChain("fuse");

            expect(bal).toEqual("0");
        });
        it("should return null if chain is not added", async () => {
            const bal = await walletProvider.getWalletBalanceForChain("base");
            expect(bal).toBeNull();
        });
    });
    describe("Chain", () => {
        beforeEach(() => {
            walletProvider = new WalletProvider(pk, customChains);
        });
        it("generates chains from chain name", () => {
            const chainName = "fuse";
            const chain: Chain = WalletProvider.genChainFromName(chainName);

            expect(chain.rpcUrls.default.http[0]).toEqual(
                fuse.rpcUrls.default.http[0]
            );
        });
        it("generates chains from chain name with custom rpc url", () => {
            const chainName = "fuse";
            const customRpcUrl = customRpcUrls.fuse;
            const chain: Chain = WalletProvider.genChainFromName(
                chainName,
                customRpcUrl
            );

            expect(chain.rpcUrls.default.http[0]).toEqual(
                fuse.rpcUrls.default.http[0]
            );
            expect(chain.rpcUrls.custom.http[0]).toEqual(customRpcUrl);
        });
        it("gets chain configs", () => {
            const chain = walletProvider.getChainConfigs("fuse");

            expect(chain.id).toEqual(fuse.id);
        });
        it("throws if unsupported chain name", () => {
            // intentionally set unsupported chain, ts will complain
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(() => WalletProvider.genChainFromName("ethereum")).toThrow();
        });
        it("throws if invalid chain name", () => {
            // intentionally set incorrect chain, ts will complain
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(() => WalletProvider.genChainFromName("eth")).toThrow();
        });
    });
});
