import type { Token } from "@lifi/types";
import type {
    Account,
    Chain,
    Hash,
    HttpTransport,
    PublicClient,
    WalletClient,
} from "viem";
import * as viemChains from "viem/chains";

const _SupportedChainList = Object.keys(viemChains) as Array<
    keyof typeof viemChains
>;
export type SupportedChain = (typeof _SupportedChainList)[number];

// Transaction types
export interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: bigint;
    data?: string;
    chainId?: number;
}

// Token types
export interface TokenWithBalance {
    token: Token;
    balance: bigint;
    formattedBalance: string;
    priceUSD: string;
    valueUSD: string;
}

export interface WalletBalance {
    chain: SupportedChain;
    address: string;
    totalValueUSD: string;
    tokens: TokenWithBalance[];
}

// Chain configuration
export interface ChainMetadata {
    chainId: number;
    name: string;
    chain: Chain;
    rpcUrl: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    blockExplorerUrl: string;
}

export interface ChainConfig {
    chain: Chain;
    publicClient: PublicClient<HttpTransport, Chain, Account | undefined>;
    walletClient?: WalletClient;
}

// Action parameters
export interface TransferParams {
    toAddress: string;
    amount: string;
    token?: string;
}

export interface SwapParams {
    fromToken: string;
    toToken: string;
    amount: string;
    slippage?: number;
}

export interface BridgeParams {
    toChain: SupportedChain;
    fromToken: string;
    toToken: string;
    amount: string;
    toAddress?: string;
    slippage?: number;
}

// Plugin configuration
export interface TronPluginConfig {
    rpcUrl?: {
        ethereum?: string;
        abstract?: string;
        base?: string;
        sepolia?: string;
        bsc?: string;
        arbitrum?: string;
        avalanche?: string;
        polygon?: string;
        optimism?: string;
        cronos?: string;
        gnosis?: string;
        fantom?: string;
        klaytn?: string;
        celo?: string;
        moonbeam?: string;
        aurora?: string;
        harmonyOne?: string;
        moonriver?: string;
        arbitrumNova?: string;
        mantle?: string;
        linea?: string;
        scroll?: string;
        filecoin?: string;
        taiko?: string;
        zksync?: string;
        canto?: string;
        alienx?: string;
    };
    secrets?: {
        TRON_PRIVATE_KEY: string;
    };
    testMode?: boolean;
    multicall?: {
        batchSize?: number;
        wait?: number;
    };
}

// LiFi types
export type LiFiStatus = {
    status: "PENDING" | "DONE" | "FAILED";
    substatus?: string;
    error?: Error;
};

export type LiFiRoute = {
    transactionHash: Hash;
    transactionData: string;
    toAddress: string;
    status: LiFiStatus;
};

// Provider types
export interface TokenData extends Token {
    symbol: string;
    decimals: number;
    address: string;
    name: string;
    logoURI?: string;
    chainId: number;
}

export interface TokenPriceResponse {
    priceUSD: string;
    token: TokenData;
}

export interface TokenListResponse {
    tokens: TokenData[];
}

export interface ProviderError extends Error {
    code?: number;
    data?: unknown;
}
