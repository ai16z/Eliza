import type { Content } from "@elizaos/core";

export interface SpheronComputeConfig {
    name: string;
    image: string;
    replicas?: number;
    ports?: Array<{
        containerPort: number;
        servicePort: number;
    }>;
    env?: Array<{
        name: string;
        value: string;
    }>;
    computeResources?: {
        cpu: number;
        memory: string;
        storage: string;
        gpu?: {
            count: number;
            model: string;
        };
    };
    duration?: string;
    mode?: string;
    token?: string;
}

export interface EscrowContent extends Content {
    token: string;
    amount: number;
    operation: "deposit" | "withdraw" | "check";
}

export interface DeploymentContent extends Content {
    operation: "create" | "update" | "close";
    template?: string;
    customizations?: Customizations;
    leaseId?: string;
}

export interface Customizations {
    cpu: boolean;
    resources: {
        cpu: number;
        memory: string;
        storage: string;
        gpu: number;
        gpu_model: string;
    };
    duration: string;
    token: string;
    template?: {
        heuristMinerAddress: string;
    };
}
export interface TokenInfo {
    name: string;
    symbol: string;
    decimal: number;
}

export interface BalanceInfo {
    lockedBalance: string;
    unlockedBalance: string;
    token: TokenInfo;
}

export interface DeploymentDetails {
    services: {
        [key: string]: {
            name: string;
            available: number;
            total: number;
            observed_generation: number;
            replicas: number;
            updated_replicas: number;
            ready_replicas: number;
            available_replicas: number;
            container_statuses: any[];
            creationTimestamp: string;
        };
    };
    forwarded_ports: {
        [key: string]: Array<{
            host: string;
            port: number;
            externalPort: number;
            proto: string;
            name: string;
        }>;
    };
    ips: null | object;
}