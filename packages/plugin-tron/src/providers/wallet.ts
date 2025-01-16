import {
    type IAgentRuntime,
    type ICacheManager,
    type Memory,
    type Provider,
    type State,
    elizaLogger,
} from "@elizaos/core";
import { TEEMode } from "@elizaos/plugin-tee";
import { createConfig, ExtendedChain, SDKBaseConfig } from "@lifi/sdk";
import NodeCache from "node-cache";
import * as path from "path";
import { BigNumber, TronWeb } from "tronweb";
import * as viemChains from "viem/chains";
import { Chain, tron } from "viem/chains";

import trc10Abi from "../abis/trc10";
import wtrxAbi from "../abis/wtrx";
import type { SupportedChain } from "../types";
import {
    SWAP_FEE_LIMIT as FEE_LIMIT,
    WRAP_FEE_LIMIT,
    WRAPPED_TRX_ADDRESS,
} from "../constants";

export class WalletProvider {
    private cache: NodeCache;
    private cacheKey: string = "tron/wallet";
    private currentChain: SupportedChain = "tron";
    private CACHE_EXPIRY_SEC = 5;
    tronWeb: TronWeb;

    constructor(
        accountOrPrivateKey: string,
        private cacheManager: ICacheManager,
        customRpcUrl?: string | null
    ) {
        this.tronWeb = new TronWeb({
            fullHost: customRpcUrl || "https://api.trongrid.io",
            privateKey: accountOrPrivateKey,
        });

        this.cache = new NodeCache({ stdTTL: this.CACHE_EXPIRY_SEC });
    }

    getAddress(): string {
        return this.tronWeb.defaultAddress.base58.toString();
    }

    getCurrentChain(): SupportedChain {
        return this.currentChain;
    }

    async getWalletBalance(): Promise<string | null> {
        const cacheKey = "walletBalance_" + this.currentChain;
        const cachedData = await this.getCachedData<string>(cacheKey);
        if (cachedData) {
            elizaLogger.log(
                "Returning cached wallet balance for chain: " +
                    this.currentChain
            );
            return cachedData;
        }

        try {
            const balanceInSun = await this.tronWeb.trx.getBalance();
            const balance = this.tronWeb.fromSun(balanceInSun).toString();
            this.setCachedData<string>(cacheKey, balance);
            elizaLogger.log(
                "Wallet balance cached for chain: ",
                this.currentChain
            );
            return balance;
        } catch (error) {
            console.error("Error getting wallet balance:", error);
            return null;
        }
    }

    async fetchOnchainToken(address: string) {
        const token = this.tronWeb.contract(trc10Abi, address);
        const name = await token["name"]().call();
        const symbol = await token["symbol"]().call();
        const decimals = await token["decimals"]().call();
        return { name, symbol, decimals };
    }

    async wrapTrx(amount: bigint) {
        const wtrx = this.tronWeb.contract(wtrxAbi, WRAPPED_TRX_ADDRESS);
        const result = await wtrx.deposit().send({
            feeLimit: WRAP_FEE_LIMIT,
            callValue: BigNumber(amount.toString()).toNumber(),
        });
        return result;
    }

    async approve(address: string, spender: string, allowance: bigint) {
        const token = this.tronWeb.contract(trc10Abi, address);
        return await token.methods.approve(spender, allowance).send({
            feeLimit: FEE_LIMIT,
            callValue: 0,
        });
    }

    async allowance(address: string, owner: string, spender: string) {
        const token = this.tronWeb.contract(trc10Abi, address);
        return await token["allowance"](owner, spender).call();
    }

    private async readFromCache<T>(key: string): Promise<T | null> {
        const cached = await this.cacheManager.get<T>(
            path.join(this.cacheKey, key)
        );
        return cached;
    }

    private async writeToCache<T>(key: string, data: T): Promise<void> {
        await this.cacheManager.set(path.join(this.cacheKey, key), data, {
            expires: Date.now() + this.CACHE_EXPIRY_SEC * 1000,
        });
    }

    private async getCachedData<T>(key: string): Promise<T | null> {
        const cachedData = this.cache.get<T>(key);
        if (cachedData) {
            return cachedData;
        }

        const fileCachedData = await this.readFromCache<T>(key);
        if (fileCachedData) {
            this.cache.set(key, fileCachedData);
            return fileCachedData;
        }

        return null;
    }

    private async setCachedData<T>(cacheKey: string, data: T): Promise<void> {
        this.cache.set(cacheKey, data);
        await this.writeToCache(cacheKey, data);
    }

    getChainConfigs(chainName: SupportedChain): Chain {
        const chain = viemChains[chainName];

        if (!chain?.id) {
            throw new Error("Invalid chain name");
        }

        return chain;
    }

    getSdkConfig(): SDKBaseConfig {
        const chain: Chain = tron;
        return createConfig({
            integrator: "eliza",
            chains: [
                {
                    id: chain.id,
                    name: chain.name,
                    key: chain.name.toLowerCase(),
                    chainType: "EVM",
                    nativeToken: {
                        ...chain.nativeCurrency,
                        chainId: chain.id,
                        address: "0",
                        coinKey: chain.nativeCurrency.symbol,
                        priceUSD: "0",
                    },
                    metamask: {
                        chainId: `0x${chain.id.toString(16)}`,
                        chainName: chain.name,
                        nativeCurrency: chain.nativeCurrency,
                        rpcUrls: [chain.rpcUrls.default.http[0]],
                        blockExplorerUrls: [chain.blockExplorers.default.url],
                    },
                    diamondAddress: "0",
                    coin: chain.nativeCurrency.symbol,
                    mainnet: true,
                },
            ] as ExtendedChain[],
        });
    }
}

// Initialize wallet provider based on TEE_MODE
export const initWalletProvider = async (runtime: IAgentRuntime) => {
    const teeMode = runtime.getSetting("TEE_MODE") || TEEMode.OFF;
    const customRpcUrl = runtime.getSetting("TRON_PROVIDER_URL");

    if (teeMode !== TEEMode.OFF) {
        throw new Error("TEE_MODE is not supported for TRON");
        // const walletSecretSalt = runtime.getSetting("WALLET_SECRET_SALT");
        // if (!walletSecretSalt) {
        //     throw new Error(
        //         "WALLET_SECRET_SALT required when TEE_MODE is enabled"
        //     );
        // }

        // const deriveKeyProvider = new DeriveKeyProvider(teeMode);
        // const deriveKeyResult = await deriveKeyProvider.deriveEcdsaKeypair(
        //     "/",
        //     walletSecretSalt,
        //     runtime.agentId
        // );
        // return new WalletProvider(
        //     deriveKeyResult.keypair.,
        //     runtime.cacheManager,
        //     customRpcUrl
        // );
    } else {
        const privateKey = runtime.getSetting("TRON_PRIVATE_KEY") as string;
        if (!privateKey) {
            throw new Error("TRON_PRIVATE_KEY is missing");
        }
        return new WalletProvider(
            privateKey,
            runtime.cacheManager,
            customRpcUrl
        );
    }
};

export const tronWalletProvider: Provider = {
    async get(
        runtime: IAgentRuntime,
        _message: Memory,
        state?: State
    ): Promise<string | null> {
        try {
            const walletProvider = await initWalletProvider(runtime);
            const address = walletProvider.getAddress();
            const balance = await walletProvider.getWalletBalance();
            const agentName = state?.agentName || "The agent";
            return `${agentName}'s TRON Wallet Address: ${address}
Balance: ${balance} TRX`;
        } catch (error) {
            console.error("Error in TRON wallet provider:", error);
            return null;
        }
    },
};
