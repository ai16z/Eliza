import type { DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import type { SigningStargateClient } from "@cosmjs/stargate";
// import { Provider } from "@elizaos/core";
import type { IAgentRuntime, Memory } from "@elizaos/core";
import type { SDL } from "@akashnetwork/akashjs/build/sdl";
import type { MsgCreateDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import type { MsgCreateLease} from "@akashnetwork/akash-api/akash/market/v1beta4";

// Core wallet state type
export interface AkashWalletState {
    wallet: DirectSecp256k1HdWallet;
    client: SigningStargateClient;
    address: string;
    certificate?: {
        cert: string;
        privateKey: string;
        publicKey: string;
    };
}

// Provider type extending core Provider
export interface AkashProvider {
    type: string;
    version: string;
    name: string;
    description: string;
    initialize: (runtime: IAgentRuntime) => Promise<void>;
    get: (runtime: IAgentRuntime, message?: Memory) => Promise<AkashWalletState>;
    validate: (runtime: IAgentRuntime, message?: Memory) => Promise<boolean>;
    process: (runtime: IAgentRuntime, message?: Memory) => Promise<void>;
}

// Registry type for Akash
export type AkashRegistryTypes = [string, any][];

// Deployment related types
export interface AkashDeploymentId {
    owner: string;
    dseq: string;
}

export interface AkashDeployment {
    id: AkashDeploymentId;
    sdl: SDL;
    deposit: string;
    msg?: MsgCreateDeployment;
}

// Lease related types
export interface AkashLeaseId {
    owner: string;
    dseq: string;
    provider: string;
    gseq: number;
    oseq: number;
}

export interface AkashLease {
    id: AkashLeaseId;
    state?: string;
    manifestData?: any;
    msg?: MsgCreateLease;
}

// Provider types
export interface AkashProviderInfo {
    owner: string;
    hostUri: string;
    attributes: Array<{
        key: string;
        value: string;
    }>;
}

// Bid types
export interface AkashBidId {
    owner: string;
    dseq: string;
    gseq: number;
    oseq: number;
    provider: string;
}

export interface AkashBid {
    id: AkashBidId;
    state: string;
    price: {
        denom: string;
        amount: string;
    };
}

// Error handling types
export enum AKASH_ERROR_CODES {
    WALLET_NOT_INITIALIZED = "WALLET_NOT_INITIALIZED",
    INVALID_MNEMONIC = "INVALID_MNEMONIC",
    INVALID_ADDRESS = "INVALID_ADDRESS",
    INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
    DEPLOYMENT_FAILED = "DEPLOYMENT_FAILED",
    LEASE_FAILED = "LEASE_FAILED",
    PROVIDER_NOT_FOUND = "PROVIDER_NOT_FOUND",
    NETWORK_ERROR = "NETWORK_ERROR",
    CERTIFICATE_ERROR = "CERTIFICATE_ERROR",
    MANIFEST_ERROR = "MANIFEST_ERROR",
    BID_ERROR = "BID_ERROR",
    MANIFEST_FAILED = "MANIFEST_FAILED",
    PROVIDER_ERROR = "PROVIDER_ERROR"
}

export class AkashError extends Error {
    constructor(
        message: string,
        public code: AKASH_ERROR_CODES,
        public originalError?: Error
    ) {
        super(message);
        this.name = "AkashError";
    }
}

// Provider configuration
export interface AkashConfig {
    AKASH_MNEMONIC: string;
    RPC_ENDPOINT: string;
    CHAIN_ID?: string;
    GAS_PRICE?: string;
    GAS_ADJUSTMENT?: number;
    CERTIFICATE_PATH?: string;
}

// Message types
export interface AkashMessage {
    type: string;
    value: any;
}

// Response types
export interface AkashTxResponse {
    code: number;
    height: number;
    txhash: string;
    rawLog: string;
    data?: string;
    gasUsed: number;
    gasWanted: number;
}

// Provider state types
export interface AkashProviderState {
    isInitialized: boolean;
    lastSync: number;
    balance?: string;
    address?: string;
    certificate?: {
        cert: string;
        privateKey: string;
        publicKey: string;
    };
}

// Memory room constants
export const AKASH_MEMORY_ROOMS = {
    WALLET: "00000000-0000-0000-0000-000000000001",
    DEPLOYMENT: "00000000-0000-0000-0000-000000000002",
    LEASE: "00000000-0000-0000-0000-000000000003",
    CERTIFICATE: "00000000-0000-0000-0000-000000000004"
} as const;
