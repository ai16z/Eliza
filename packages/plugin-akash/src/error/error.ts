
export enum AkashErrorCategory {
    WALLET = 'WALLET',
    DEPLOYMENT = 'DEPLOYMENT',
    LEASE = 'LEASE',
    PROVIDER = 'PROVIDER',
    MANIFEST = 'MANIFEST',
    NETWORK = 'NETWORK',
    TRANSACTION = 'TRANSACTION',
    VALIDATION = 'VALIDATION',
    SDK = 'SDK',
    API = 'API',
    FILE = 'FILE'
}

export enum AkashErrorCode {
    // Wallet Errors (1000-1999)
    WALLET_NOT_INITIALIZED = 1000,
    WALLET_CONNECTION_FAILED = 1001,
    WALLET_INSUFFICIENT_FUNDS = 1002,
    WALLET_UNAUTHORIZED = 1003,
    WALLET_SIGNATURE_FAILED = 1004,
    WALLET_MESSAGE_INVALID = 1005,
    WALLET_INITIALIZATION_FAILED = "WALLET_INITIALIZATION_FAILED",
    CLIENT_SETUP_FAILED = "CLIENT_SETUP_FAILED",

    // Certificate Errors (1500-1599)
    CERTIFICATE_CREATION_FAILED = 1500,
    CERTIFICATE_BROADCAST_FAILED = 1501,
    CERTIFICATE_NOT_FOUND = 1502,

    // Deployment Errors (2000-2999)
    DEPLOYMENT_NOT_FOUND = 2000,
    DEPLOYMENT_CREATION_FAILED = 2001,
    DEPLOYMENT_UPDATE_FAILED = 2002,
    DEPLOYMENT_CLOSE_FAILED = 2003,
    DEPLOYMENT_START_TIMEOUT = 2004,

    // Lease Errors (3000-3999)
    LEASE_NOT_FOUND = 3000,
    LEASE_CREATION_FAILED = 3001,
    LEASE_CLOSE_FAILED = 3002,
    LEASE_INVALID_STATE = 3003,
    LEASE_BID_NOT_FOUND = 3004,
    LEASE_QUERY_FAILED = 3005,
    LEASE_STATUS_ERROR = 3006,
    LEASE_VALIDATION_FAILED = 3007,
    INVALID_LEASE = 3008,

    // Provider Errors (4000-4999)
    PROVIDER_NOT_FOUND = 4000,
    PROVIDER_UNREACHABLE = 4001,
    PROVIDER_RESPONSE_ERROR = 4002,
    PROVIDER_LIST_ERROR = 4003,
    PROVIDER_FILTER_ERROR = 4004,

    // Manifest Errors (5000-5999)
    MANIFEST_INVALID = 5000,
    MANIFEST_PARSING_FAILED = 5001,
    MANIFEST_DEPLOYMENT_FAILED = 5002,
    MANIFEST_VALIDATION_FAILED = 5003,

    // Bid Errors (6000-6999)
    BID_FETCH_TIMEOUT = 6000,
    INVALID_BID = 6001,

    // SDL Errors (7000-7999)
    SDL_PARSING_FAILED = 7000,

    // Validation Errors (8000-8999)
    VALIDATION_PARAMETER_MISSING = 8000,
    VALIDATION_PARAMETER_INVALID = 8001,
    VALIDATION_STATE_INVALID = 8002,
    VALIDATION_SDL_FAILED = 8003,
    VALIDATION_CONFIG_INVALID = 8004,

    // Generic Errors (9000-9999)
    INSUFFICIENT_FUNDS = 9000,

    // API Errors (10000-10999)
    API_ERROR = 10000,
    API_RESPONSE_INVALID = 10001,
    API_REQUEST_FAILED = 10002,
    API_TIMEOUT = 10003,

    // File System Errors (11000-11999)
    FILE_NOT_FOUND = 11000,
    FILE_READ_ERROR = 11001,
    FILE_WRITE_ERROR = 11002,
    FILE_PERMISSION_ERROR = 11003,

    // Network Errors (12000-12999)
    RPC_CONNECTION_FAILED = 12000
}

export class AkashError extends Error {
    constructor(
        message: string,
        public code: AkashErrorCode,
        public details?: Record<string, unknown>,
        public category = "akash"
    ) {
        super(message);
        this.name = "AkashError";
    }
}

export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
    }
    throw lastError;
}
