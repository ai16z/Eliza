export enum TEEMode {
    OFF = "OFF",
    LOCAL = "LOCAL", // For local development with simulator
    DOCKER = "DOCKER", // For docker development with simulator
    PRODUCTION = "PRODUCTION", // For production without simulator
}

export interface RemoteAttestationQuote {
    quote: string;
    timestamp: number;
}

export interface DeriveKeyAttestationData {
    agentId: string;
    publicKey: string;
    subject?: string;
}

export interface RemoteAttestationMessage {
    agentId: string;
    timestamp: number;
    message: {
        userId: string;
        roomId: string;
        content: string;
    }
}