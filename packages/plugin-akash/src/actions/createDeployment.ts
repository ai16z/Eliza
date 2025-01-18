import { type Action, elizaLogger } from "@elizaos/core";
import type { IAgentRuntime, Memory, State, HandlerCallback, Content, ActionExample } from "@elizaos/core";
import { MsgCreateDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { QueryClientImpl as QueryProviderClient, QueryProviderRequest } from "@akashnetwork/akash-api/akash/provider/v1beta3";
import { QueryBidsRequest, QueryClientImpl as QueryMarketClient, MsgCreateLease, BidID } from "@akashnetwork/akash-api/akash/market/v1beta4";
import * as cert from "@akashnetwork/akashjs/build/certificates";
import { getRpc } from "@akashnetwork/akashjs/build/rpc";
import { SDL } from "@akashnetwork/akashjs/build/sdl";
import { getAkashTypeRegistry } from "@akashnetwork/akashjs/build/stargate";
import type { CertificatePem } from "@akashnetwork/akashjs/build/certificates/certificate-manager/CertificateManager";
import { certificateManager } from "@akashnetwork/akashjs/build/certificates/certificate-manager";
import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { validateAkashConfig } from "../environment";
import { AkashError, AkashErrorCode, withRetry } from "../error/error";
import * as fs from 'fs';
import * as path from 'path';
import { getCertificatePath, getDefaultSDLPath } from "../utils/paths";
// import { fileURLToPath } from 'url';
import { inspectRuntime, isPluginLoaded } from "../runtime_inspect";
import https from 'node:https';
import axios from 'axios';

interface CreateDeploymentContent extends Content {
    sdl?: string;
    sdlFile?: string;
    deposit?: string;
}

// Certificate file path
const CERTIFICATE_PATH = getCertificatePath(import.meta.url);

// Save certificate to file
function saveCertificate(certificate: CertificatePem) {
    elizaLogger.debug("Saving certificate to file", { path: CERTIFICATE_PATH });
    try {
        // Ensure directory exists
        const dir = path.dirname(CERTIFICATE_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const json = JSON.stringify(certificate);
        fs.writeFileSync(CERTIFICATE_PATH, json);
        elizaLogger.debug("Certificate saved successfully");
    } catch (error) {
        elizaLogger.error("Failed to save certificate", {
            error: error instanceof Error ? error.message : String(error),
            path: CERTIFICATE_PATH
        });
        throw error;
    }
}

// Load certificate from file
function loadCertificate(path: string): CertificatePem {
    elizaLogger.debug("Loading certificate from file", { path });
    try {
        const json = fs.readFileSync(path, "utf8");
        const certificate = JSON.parse(json);
        elizaLogger.debug("Certificate loaded successfully", {
            hasCert: !!certificate.cert,
            hasPrivateKey: !!certificate.privateKey,
            hasPublicKey: !!certificate.publicKey
        });
        return certificate;
    } catch (error) {
        elizaLogger.error("Failed to load certificate", {
            error: error instanceof Error ? error.message : String(error),
            path
        });
        throw error;
    }
}

const DEFAULT_SDL_PATH = (() => {
    const currentFileUrl = import.meta.url;
    // elizaLogger.info("=== Starting SDL Path Resolution in createDeployment ===", {
    //     currentFileUrl,
    //     cwd: process.cwd(),
    //     importMetaUrl: import.meta.url
    // });

    // Use the utility function from paths.ts instead of manual resolution
    const sdlPath = getDefaultSDLPath(currentFileUrl);

    // Only log if file doesn't exist
    if (!fs.existsSync(sdlPath)) {
        elizaLogger.warn("Default SDL path not found", {
            sdlPath,
            exists: false
        });
    }

    return sdlPath;
})();

const validateDeposit = (deposit: string): boolean => {
    const pattern = /^\d+uakt$/;
    return pattern.test(deposit);
};

const loadSDLFromFile = (filePath: string): string => {
    // elizaLogger.info("=== Loading SDL File ===", {
    //     requestedPath: filePath,
    //     resolvedPath: path.resolve(filePath),
    //     defaultSdlPath: DEFAULT_SDL_PATH,
    //     cwd: process.cwd(),
    //     exists: fs.existsSync(filePath),
    //     defaultExists: fs.existsSync(DEFAULT_SDL_PATH)
    // });

    try {
        // If path doesn't contain plugin-akash and it's not the default path, adjust it
        if (!filePath.includes('plugin-akash') && filePath !== DEFAULT_SDL_PATH) {
            const adjustedPath = path.join(path.dirname(DEFAULT_SDL_PATH), path.basename(filePath));
            // elizaLogger.info("Adjusting SDL path", {
            //     originalPath: filePath,
            //     adjustedPath,
            //     exists: fs.existsSync(adjustedPath),
            //     dirExists: fs.existsSync(path.dirname(adjustedPath)),
            //     dirContents: fs.existsSync(path.dirname(adjustedPath)) ? fs.readdirSync(path.dirname(adjustedPath)) : []
            // });
            filePath = adjustedPath;
        }

        // Try multiple possible locations
        const possiblePaths = [
            filePath,
            path.join(process.cwd(), filePath),
            path.join(process.cwd(), 'packages', 'plugin-akash', filePath),
            path.join(process.cwd(), 'packages', 'plugin-akash', 'src', filePath),
            path.join(path.dirname(DEFAULT_SDL_PATH), filePath)
        ];

        // elizaLogger.info("Attempting to load SDL from possible paths", {
        //     possiblePaths,
        //     existsMap: possiblePaths.map(p => ({ path: p, exists: fs.existsSync(p) }))
        // });

        for (const tryPath of possiblePaths) {
            if (fs.existsSync(tryPath)) {
                const content = fs.readFileSync(tryPath, "utf8");
                elizaLogger.info("SDL file loaded successfully from", {
                    path: tryPath
                });
                return content;
            }
        }

        // If we get here, none of the paths worked
        throw new Error(`SDL file not found in any of the possible locations`);
    } catch (error) {
        elizaLogger.error("Failed to read SDL file", {
            filePath,
            error: error instanceof Error ? error.message : String(error)
        });
        throw new AkashError(
            `Failed to read SDL file: ${error instanceof Error ? error.message : String(error)}`,
            AkashErrorCode.VALIDATION_SDL_FAILED,
            { filePath }
        );
    }
};

// Preserved for future use
/* const formatErrorMessage = (error: unknown): string => {
    if (error instanceof AkashError) {
        if (error.code === AkashErrorCode.WALLET_NOT_INITIALIZED) {
            return "Akash wallet not initialized";
        }
        if (error.code === AkashErrorCode.DEPLOYMENT_CREATION_FAILED) {
            return `Transaction failed: ${error.details?.rawLog || 'Unknown error'}`;
        }
        if (error.code === AkashErrorCode.MANIFEST_PARSING_FAILED) {
            return "Failed to parse SDL";
        }
        if (error.code === AkashErrorCode.VALIDATION_PARAMETER_MISSING) {
            return `${error.message}`;
        }
        if (error.code === AkashErrorCode.VALIDATION_SDL_FAILED) {
            return `Failed to parse SDL: ${error.details?.error || error.message}`;
        }
        if (error.code === AkashErrorCode.VALIDATION_PARAMETER_INVALID) {
            return `Invalid deposit format. Must be in format: <amount>uakt`;
        }
        return error.message;
    }

    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("insufficient funds")) {
        return "Insufficient funds";
    }
    if (message.toLowerCase().includes("invalid deposit")) {
        return "Invalid deposit amount";
    }
    if (message.toLowerCase().includes("cannot read properties")) {
        return "Failed to parse SDL: Invalid format";
    }
    return message;
}; */

async function initializeWallet(mnemonic: string) {
    elizaLogger.debug("=== Initializing Wallet ===", {
        mnemonicLength: mnemonic.split(' ').length,
        hasMnemonic: !!mnemonic,
        mnemonicFirstWord: mnemonic.split(' ')[0]
    });

    // Validate mnemonic format
    const words = mnemonic.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
        const error = `Invalid mnemonic length: got ${words.length} words, expected 12 or 24 words`;
        elizaLogger.error("Mnemonic validation failed", {
            error,
            wordCount: words.length,
            expectedCounts: [12, 24],
            mnemonicPreview: words.slice(0, 3).join(' ') + '...'
        });
        throw new AkashError(
            error,
            AkashErrorCode.WALLET_INITIALIZATION_FAILED,
            {
                wordCount: words.length,
                expectedCounts: [12, 24]
            }
        );
    }

    try {
        elizaLogger.debug("Creating wallet with mnemonic", {
            wordCount: words.length,
            mnemonicPreview: words.slice(0, 3).join(' ') + '...'
        });

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
            prefix: "akash"
        });
        const accounts = await wallet.getAccounts();

        elizaLogger.debug("Wallet initialized successfully", {
            accountCount: accounts.length,
            firstAccountAddress: accounts[0]?.address,
            addressPrefix: accounts[0]?.address?.substring(0, 6)
        });

        if (!accounts.length) {
            throw new AkashError(
                "No accounts found in wallet",
                AkashErrorCode.WALLET_INITIALIZATION_FAILED
            );
        }

        return wallet;
    } catch (error) {
        elizaLogger.error("Wallet initialization failed", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            mnemonicLength: words.length,
            mnemonicPreview: words.slice(0, 3).join(' ') + '...'
        });

        // Provide more specific error messages
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("Invalid mnemonic")) {
            throw new AkashError(
                "Invalid mnemonic format: The mnemonic phrase contains invalid words or is malformed",
                AkashErrorCode.WALLET_INITIALIZATION_FAILED,
                {
                    mnemonicLength: words.length,
                    error: errorMessage
                }
            );
        }

        throw new AkashError(
            `Failed to initialize wallet: ${errorMessage}`,
            AkashErrorCode.WALLET_INITIALIZATION_FAILED,
            {
                mnemonicLength: words.length,
                error: errorMessage
            }
        );
    }
}

async function setupClient(wallet: DirectSecp256k1HdWallet, rpcEndpoint: string) {
    // Try alternative RPC endpoints if the main one fails
    const rpcEndpoints = [
        "https://akash-rpc.europlots.com:443",  // New endpoint first
        rpcEndpoint,
        "https://rpc.akashnet.net:443",
        "https://rpc.akash.forbole.com:443",
        "https://rpc-akash.ecostake.com:443",
        "https://akash-rpc.polkachu.com:443",
        "https://akash.c29r3.xyz:443/rpc"
    ];

    elizaLogger.info("=== Setting up Stargate Client ===", {
        primaryRpcEndpoint: rpcEndpoint,
        allEndpoints: rpcEndpoints,
        walletType: wallet.constructor.name,
        preferredEndpoint: rpcEndpoints[0]
    });

    let lastError: Error | undefined;
    for (const endpoint of rpcEndpoints) {
        try {
            elizaLogger.debug("Attempting to connect to RPC endpoint", {
                endpoint,
                attempt: rpcEndpoints.indexOf(endpoint) + 1,
                totalEndpoints: rpcEndpoints.length
            });

            const registry = new Registry(getAkashTypeRegistry());
            elizaLogger.debug("Registry created for endpoint", {
                endpoint,
                registryType: registry.constructor.name
            });

            const client = await SigningStargateClient.connectWithSigner(
                endpoint,
                wallet,
                { registry }
            );

            // Check if client is connected by attempting to get the height
            try {
                const height = await client.getHeight();
                elizaLogger.info("Stargate client setup successful", {
                    endpoint,
                    height,
                    clientType: client.constructor.name,
                    attempt: rpcEndpoints.indexOf(endpoint) + 1
                });
                return client;
            } catch (heightError) {
                elizaLogger.error("Failed to get chain height", {
                    endpoint,
                    attempt: rpcEndpoints.indexOf(endpoint) + 1,
                    error: heightError instanceof Error ? heightError.message : String(heightError)
                });
                lastError = heightError instanceof Error ? heightError : new Error(String(heightError));
                continue;
            }
        } catch (error) {
            elizaLogger.error("Failed to connect to RPC endpoint", {
                endpoint,
                attempt: rpcEndpoints.indexOf(endpoint) + 1,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            lastError = error instanceof Error ? error : new Error(String(error));
            continue;
        }
    }

    // If we get here, all endpoints failed
    elizaLogger.error("All RPC endpoints failed", {
        endpoints: rpcEndpoints,
        lastError: lastError?.message,
        totalAttempts: rpcEndpoints.length
    });
    throw new AkashError(
        `Failed to setup client: ${lastError?.message}`,
        AkashErrorCode.CLIENT_SETUP_FAILED,
        { rpcEndpoint: rpcEndpoints.join(", ") }
    );
}

async function fetchBid(dseq: number, owner: string, rpcEndpoint: string) {
    elizaLogger.info("=== Starting Bid Fetch Process ===", {
        dseq,
        owner,
        ownerPrefix: owner.substring(0, 6)
    });

    const maxRetries = 3;
    let lastError: Error | undefined;

    for (let retry = 0; retry < maxRetries; retry++) {
        try {
            elizaLogger.debug("Connecting to RPC for bid fetch", {
                rpcEndpoint,
                attempt: retry + 1,
                maxRetries
            });

            const rpc = await getRpc(rpcEndpoint);
            elizaLogger.debug("RPC connection established", {
                rpcType: rpc.constructor.name,
                attempt: retry + 1
            });

            const client = new QueryMarketClient(rpc);
            const request = QueryBidsRequest.fromPartial({
                filters: {
                    owner: owner,
                    dseq: dseq
                }
            });

            const startTime = Date.now();
            const timeout = 1000 * 60 * 5; // 5 minutes timeout
            elizaLogger.debug("Starting bid polling loop", {
                timeout: "5 minutes",
                pollInterval: "5 seconds",
                attempt: retry + 1
            });

            while (Date.now() - startTime < timeout) {
                const elapsedTime = Math.round((Date.now() - startTime) / 1000);
                elizaLogger.debug("Polling for bids", {
                    dseq,
                    owner: owner.substring(0, 6),
                    elapsedSeconds: elapsedTime,
                    remainingSeconds: Math.round(timeout/1000 - elapsedTime),
                    attempt: retry + 1
                });

                try {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    const bids = await client.Bids(request);

                    if (bids.bids.length > 0 && bids.bids[0].bid !== undefined) {
                        elizaLogger.info("Bid found successfully", {
                            dseq,
                            owner: owner.substring(0, 6),
                            bidCount: bids.bids.length,
                            elapsedSeconds: elapsedTime,
                            attempt: retry + 1
                        });
                        elizaLogger.debug("Bid details", {
                            bid: bids.bids[0].bid,
                            provider: bids.bids[0].bid?.bidId?.provider
                        });
                        return bids.bids[0].bid;
                    }
                } catch (pollError) {
                    // Log but continue polling if it's a temporary error
                    elizaLogger.warn("Temporary error during bid polling", {
                        error: pollError instanceof Error ? pollError.message : String(pollError),
                        dseq,
                        attempt: retry + 1,
                        willRetry: true
                    });
                    continue;
                }
            }

            elizaLogger.error("Bid fetch timeout", {
                dseq,
                owner: owner.substring(0, 6),
                timeout: "5 minutes",
                attempt: retry + 1
            });
            throw new AkashError(
                `Could not fetch bid for deployment ${dseq}. Timeout reached.`,
                AkashErrorCode.BID_FETCH_TIMEOUT,
                { dseq, owner }
            );
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            elizaLogger.error("Error during bid fetch", {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                dseq,
                owner: owner.substring(0, 6),
                attempt: retry + 1,
                hasMoreRetries: retry < maxRetries - 1
            });

            if (retry < maxRetries - 1) {
                // Wait before retrying (exponential backoff)
                const delay = Math.pow(2, retry) * 1000;
                elizaLogger.info("Retrying bid fetch after delay", {
                    delay,
                    nextAttempt: retry + 2,
                    maxRetries
                });
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
        }
    }

    // If we get here, all retries failed
    elizaLogger.error("All bid fetch attempts failed", {
        dseq,
        owner: owner.substring(0, 6),
        attempts: maxRetries,
        finalError: lastError?.message
    });
    throw lastError || new Error("Failed to fetch bid after all retries");
}

async function createLease(deployment: any, wallet: DirectSecp256k1HdWallet, client: SigningStargateClient, rpcEndpoint: string): Promise<any> {
    const { dseq, owner } = deployment.id;
    elizaLogger.info("Starting lease creation", { dseq, owner });

    try {
        elizaLogger.debug("Fetching bid for lease creation");
        const bid = await fetchBid(dseq, owner, rpcEndpoint);
        const accounts = await wallet.getAccounts();

        if (bid.bidId === undefined) {
            elizaLogger.error("Invalid bid - missing bidId", { dseq, owner });
            throw new AkashError("Bid ID is undefined", AkashErrorCode.INVALID_BID);
        }

        elizaLogger.debug("Creating lease message", {
            dseq,
            owner,
            bidId: bid.bidId
        });

        const lease = {
            bidId: bid.bidId
        };

        const fee = {
            amount: [{ denom: "uakt", amount: "50000" }],
            gas: "2000000"
        };

        const msg = {
            typeUrl: `/${MsgCreateLease.$type}`,
            value: MsgCreateLease.fromPartial(lease)
        };

        elizaLogger.info("Broadcasting lease creation transaction");
        const tx = await client.signAndBroadcast(accounts[0].address, [msg], fee, "create lease");

        if (tx.code !== 0) {
            elizaLogger.error("Lease creation failed", {
                dseq,
                owner,
                code: tx.code,
                rawLog: tx.rawLog
            });
            throw new AkashError(
                `Could not create lease: ${tx.rawLog}`,
                AkashErrorCode.LEASE_CREATION_FAILED,
                { rawLog: tx.rawLog }
            );
        }

        elizaLogger.info("Lease created successfully", {
            dseq,
            owner,
            txHash: tx.transactionHash
        });

        return {
            id: BidID.toJSON(bid.bidId)
        };
    } catch (error) {
        elizaLogger.error("Error during lease creation", {
            error,
            dseq,
            owner
        });
        throw error;
    }
}

interface LeaseStatus {
    services: Record<string, { uris: string[] }>;
}

async function queryLeaseStatus(lease: any, providerUri: string, certificate: CertificatePem): Promise<LeaseStatus | undefined> {
    const id = lease.id;
    elizaLogger.info("Querying lease status", {
        dseq: id?.dseq,
        gseq: id?.gseq,
        oseq: id?.oseq,
        providerUri
    });

    if (id === undefined) {
        elizaLogger.error("Invalid lease - missing ID");
        throw new AkashError("Lease ID is undefined", AkashErrorCode.INVALID_LEASE);
    }

    const leasePath = `/lease/${id.dseq}/${id.gseq}/${id.oseq}/status`;
    elizaLogger.debug("Setting up request", {
        providerUri,
        leasePath,
        hasCert: !!certificate.cert,
        hasKey: !!certificate.privateKey
    });

    const MAX_RETRIES = 3;
    const INITIAL_RETRY_DELAY = 3000;
    let retryCount = 0;

    while (retryCount < MAX_RETRIES) {
        try {
            const url = new URL(providerUri);
            const fullUrl = `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}${leasePath}`;

            elizaLogger.debug("Making request", {
                url: fullUrl,
                method: 'GET',
                hasCertificate: !!certificate,
                retryCount
            });

            const agent = new https.Agent({
                cert: certificate.cert,
                key: certificate.privateKey,
                rejectUnauthorized: false,
                keepAlive: false,
                timeout: 10000
            });

            try {
                const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    // @ts-expect-error - TypeScript's fetch types don't include Node's agent support, but it exists at runtime
                    agent,
                    signal: AbortSignal.timeout(10000)
                });

                if (response.status !== 200) {
                    elizaLogger.warn("Non-OK response from lease status query", {
                        statusCode: response.status,
                        statusText: response.statusText,
                        dseq: id.dseq,
                        url: fullUrl,
                        retryCount
                    });

                    if (response.status === 404) {
                        elizaLogger.debug("Deployment not ready yet (404)", {
                            dseq: id.dseq,
                            retryCount
                        });
                        return undefined;
                    }
                    throw new Error(`Could not query lease status: ${response.status}`);
                }

                const data = await response.json() as LeaseStatus;
                elizaLogger.debug("Lease status received", {
                    dseq: id.dseq,
                    dataLength: JSON.stringify(data).length,
                    hasServices: !!data.services,
                    serviceCount: Object.keys(data.services || {}).length
                });
                return data;
            } finally {
                agent.destroy();
            }
        } catch (error) {
            elizaLogger.warn("Error during lease status query", {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                dseq: id.dseq,
                providerUri,
                retryCount
            });

            if (retryCount < MAX_RETRIES - 1) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
                elizaLogger.debug("Retrying after error", {
                    delay,
                    nextRetry: retryCount + 1,
                    maxRetries: MAX_RETRIES
                });
                await new Promise(r => setTimeout(r, delay));
                retryCount++;
                continue;
            }

            // On final retry, if it's a network error or 404, return undefined
            if (error instanceof Error &&
                ((error as any).code === 'ECONNABORTED' ||
                 (error as any).code === 'ETIMEDOUT' ||
                 ((error as any).response && (error as any).response.status === 404))) {
                elizaLogger.info("Returning undefined after max retries", {
                    dseq: id.dseq,
                    error: error.message
                });
                return undefined;
            }

            throw error;
        }
    }

    elizaLogger.info("Max retries reached, returning undefined", {
        dseq: id.dseq,
        maxRetries: MAX_RETRIES
    });
    return undefined;
}

async function sendManifest(sdl: SDL, lease: any, certificate: CertificatePem, rpcEndpoint: string) {
    elizaLogger.info("Starting manifest send process");
    if (lease.id === undefined) {
        elizaLogger.error("Invalid lease - missing ID");
        throw new AkashError("Lease ID is undefined", AkashErrorCode.INVALID_LEASE);
    }

    try {
        const { dseq, provider } = lease.id;
        elizaLogger.debug("Getting provider info", { provider });

        const rpc = await getRpc(rpcEndpoint);
        const client = new QueryProviderClient(rpc);
        const request = QueryProviderRequest.fromPartial({
            owner: provider
        });

        const tx = await client.Provider(request);

        if (tx.provider === undefined) {
            elizaLogger.error("Provider not found", { provider });
            throw new AkashError(
                `Could not find provider ${provider}`,
                AkashErrorCode.PROVIDER_NOT_FOUND
            );
        }

        const providerInfo = tx.provider;
        elizaLogger.debug("Provider info retrieved", {
            provider,
            hostUri: providerInfo.hostUri
        });

        const manifest = sdl.manifestSortedJSON();
        const path = `/deployment/${dseq}/manifest`;

        elizaLogger.info("Sending manifest to provider", {
            dseq,
            provider,
            manifestLength: manifest.length
        });

        const uri = new URL(providerInfo.hostUri);

        const httpsAgent = new https.Agent({
            cert: certificate.cert,
            key: certificate.privateKey,
            rejectUnauthorized: false,
            keepAlive: false,
            timeout: 10000
        });

        try {
            const fullUrl = `${uri.protocol}//${uri.hostname}${uri.port ? ':' + uri.port : ''}${path}`;
            elizaLogger.debug("Making manifest request", {
                url: fullUrl,
                method: 'PUT',
                manifestLength: manifest.length
            });

            const response = await axios.put(fullUrl, manifest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                httpsAgent,
                timeout: 10000,
                validateStatus: null // Don't throw on any status code
            });

            if (response.status !== 200) {
                elizaLogger.error("Failed to send manifest", {
                    statusCode: response.status,
                    statusText: response.statusText,
                    dseq
                });
                throw new Error(`Failed to send manifest: ${response.status} ${response.statusText}`);
            }

            elizaLogger.info("Manifest sent successfully", { dseq });
        } finally {
            httpsAgent.destroy();
        }

        // Wait for deployment to start
        elizaLogger.info("Waiting for deployment to start", { dseq });
        const startTime = Date.now();
        const timeout = 1000 * 60 * 10; // 10 minutes timeout
        let consecutiveErrors = 0;
        const MAX_CONSECUTIVE_ERRORS = 5;

        while (Date.now() - startTime < timeout) {
            const elapsedTime = Math.round((Date.now() - startTime) / 1000);
            elizaLogger.debug("Checking deployment status", {
                dseq,
                elapsedTime: `${elapsedTime}s`,
                remainingTime: `${Math.round(timeout/1000 - elapsedTime)}s`,
                consecutiveErrors
            });

            try {
                const status = await queryLeaseStatus(lease, providerInfo.hostUri, certificate);

                if (status === undefined) {
                    consecutiveErrors++;
                    elizaLogger.debug("Status check returned undefined", {
                        dseq,
                        consecutiveErrors,
                        maxConsecutiveErrors: MAX_CONSECUTIVE_ERRORS
                    });

                    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                        elizaLogger.warn("Too many consecutive undefined status responses", {
                            dseq,
                            consecutiveErrors
                        });
                        // Don't throw, just continue waiting
                        consecutiveErrors = 0;
                    }

                    await new Promise(resolve => setTimeout(resolve, 3000));
                    continue;
                }

                // Reset error counter on successful status check
                consecutiveErrors = 0;

                for (const [name, service] of Object.entries<{ uris?: string[] }>(status.services)) {
                    if (service.uris) {
                        const rawUrl = service.uris[0];
                        // Ensure URL has protocol
                        const serviceUrl = rawUrl.startsWith('http') ? rawUrl : `http://${rawUrl}`;
                        elizaLogger.info("Service is available", {
                            name,
                            rawUrl,
                            serviceUrl,
                            dseq
                        });
                        return serviceUrl;
                    }
                }
            } catch (error) {
                consecutiveErrors++;
                const errorMessage = error instanceof Error ? error.message : String(error);
                elizaLogger.warn("Error checking deployment status", {
                    error: errorMessage,
                    dseq,
                    consecutiveErrors,
                    maxConsecutiveErrors: MAX_CONSECUTIVE_ERRORS
                });

                if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                    elizaLogger.error("Too many consecutive errors checking deployment status", {
                        dseq,
                        consecutiveErrors,
                        error: errorMessage
                    });
                    throw new AkashError(
                        "Too many consecutive errors checking deployment status",
                        AkashErrorCode.DEPLOYMENT_START_TIMEOUT,
                        { dseq, error: errorMessage }
                    );
                }
            }

            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        elizaLogger.error("Deployment start timeout", {
            dseq,
            timeout: "10 minutes"
        });
        throw new AkashError(
            "Could not start deployment. Timeout reached.",
            AkashErrorCode.DEPLOYMENT_START_TIMEOUT
        );
    } catch (error) {
        elizaLogger.error("Error during manifest send process", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            dseq: lease.id.dseq
        });
        throw error;
    }
}

async function loadOrCreateCertificate(wallet: DirectSecp256k1HdWallet, client: SigningStargateClient): Promise<CertificatePem> {
    elizaLogger.info("=== Starting Certificate Creation/Loading Process ===");
    try {
        const accounts = await wallet.getAccounts();
        const address = accounts[0].address;
        elizaLogger.debug("Got wallet address for certificate", {
            address,
            addressLength: address.length,
            addressPrefix: address.substring(0, 6)
        });

        // Check if certificate exists
        if (fs.existsSync(CERTIFICATE_PATH)) {
            elizaLogger.info("Found existing certificate file", { path: CERTIFICATE_PATH });
            const cert = loadCertificate(CERTIFICATE_PATH);
            elizaLogger.debug("Loaded existing certificate", {
                hasCert: !!cert.cert,
                hasPrivateKey: !!cert.privateKey,
                hasPublicKey: !!cert.publicKey,
                certLength: cert.cert?.length,
                privateKeyLength: cert.privateKey?.length,
                publicKeyLength: cert.publicKey?.length
            });
            return cert;
        }

        // Create new certificate exactly like the example
        elizaLogger.info("No existing certificate found, creating new one", { address });
        const certificate = certificateManager.generatePEM(address);
        elizaLogger.debug("Certificate generated", {
            hasCert: !!certificate.cert,
            hasPrivateKey: !!certificate.privateKey,
            hasPublicKey: !!certificate.publicKey,
            certLength: certificate.cert?.length,
            privateKeyLength: certificate.privateKey?.length,
            publicKeyLength: certificate.publicKey?.length
        });

        // Broadcast certificate
        elizaLogger.info("Broadcasting certificate to network", {
            address,
            certLength: certificate.cert?.length,
            publicKeyLength: certificate.publicKey?.length
        });

        const result = await cert.broadcastCertificate(
            certificate,
            address,
            client as any
        ).catch(error => {
            elizaLogger.error("Certificate broadcast failed", {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                address,
                certLength: certificate.cert?.length
            });
            throw error;
        });

        if (result.code !== 0) {
            const error = `Could not create certificate: ${result.rawLog}`;
            elizaLogger.error("Certificate broadcast returned error code", {
                code: result.code,
                rawLog: result.rawLog,
                address,
                txHash: result.transactionHash
            });
            throw new AkashError(
                error,
                AkashErrorCode.CERTIFICATE_CREATION_FAILED,
                { rawLog: result.rawLog }
            );
        }

        elizaLogger.info("Certificate broadcast successful", {
            code: result.code,
            txHash: result.transactionHash,
            height: result.height,
            gasUsed: result.gasUsed
        });

        // Save certificate
        saveCertificate(certificate);
        elizaLogger.info("Certificate saved to file", { path: CERTIFICATE_PATH });

        elizaLogger.info("Certificate process completed successfully", {
            hasCert: !!certificate.cert,
            hasPrivateKey: !!certificate.privateKey,
            hasPublicKey: !!certificate.publicKey,
            path: CERTIFICATE_PATH
        });

        return certificate;
    } catch (error) {
        elizaLogger.error("Certificate creation/broadcast process failed", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            path: CERTIFICATE_PATH
        });
        throw error;
    }
}

async function parseSDL(sdlContent: string): Promise<SDL> {
    try {
        // Clean up SDL content by taking only the part after the YAML document separator
        const yamlSeparatorIndex = sdlContent.indexOf('---');
        if (yamlSeparatorIndex === -1) {
            throw new Error("No YAML document separator (---) found in SDL");
        }

        // Extract only the actual YAML content
        const cleanSDL = sdlContent.substring(yamlSeparatorIndex);

        elizaLogger.info("Starting SDL parsing process", {
            originalLength: sdlContent.length,
            cleanLength: cleanSDL.length,
            yamlSeparatorIndex,
            cleanContent: cleanSDL.substring(0, 200) + '...',
            firstLine: cleanSDL.split('\n')[0],
            lastLine: cleanSDL.split('\n').slice(-1)[0],
            lineCount: cleanSDL.split('\n').length,
            hasVersion: cleanSDL.includes('version: "2.0"'),
            hasServices: cleanSDL.includes('services:'),
            hasProfiles: cleanSDL.includes('profiles:'),
            hasDeployment: cleanSDL.includes('deployment:'),
            charCodes: cleanSDL.substring(0, 50).split('').map(c => c.charCodeAt(0))
        });

        // Try to parse SDL with clean content - exactly like the example
        const parsedSDL = SDL.fromString(cleanSDL, "beta3");
        elizaLogger.debug("Initial SDL parsing successful", {
            hasVersion: !!parsedSDL.version,
            hasServices: !!parsedSDL.services,
            hasProfiles: !!parsedSDL.profiles,
            hasDeployment: !!parsedSDL.deployments,
            serviceCount: Object.keys(parsedSDL.services || {}).length,
            profileCount: Object.keys(parsedSDL.profiles || {}).length
        });

        // Get groups and version like the example
        const groups = parsedSDL.groups();
        const version = await parsedSDL.manifestVersion();

        elizaLogger.info("SDL validation completed", {
            groupCount: groups.length,
            version,
            groups: JSON.stringify(groups)
        });

        return parsedSDL;
    } catch (error) {
        elizaLogger.error("Failed to parse SDL", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            sdlContent: sdlContent.substring(0, 200) + '...',
            sdlLength: sdlContent.length
        });
        throw error;
    }
}

export const createDeploymentAction: Action = {
    name: "CREATE_DEPLOYMENT",
    similes: ["DEPLOY", "START_DEPLOYMENT", "LAUNCH"],
    description: "Create a new deployment on Akash Network",
    examples: [[
        {
            user: "user",
            content: {
                text: "Deploy SDL on Akash Network",
                sdl: "version: \"2.0\"\n\nservices:\n  web:\n    image: nginx\n    expose:\n      - port: 80\n        as: 80\n        to:\n          - global: true"
            } as CreateDeploymentContent
        } as ActionExample
    ]],

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        elizaLogger.debug("=== Starting Deployment Validation ===");
        elizaLogger.debug("Validating deployment request", { message });

        // Check if plugin is properly loaded
        if (!isPluginLoaded(runtime, "akash")) {
            elizaLogger.error("Akash plugin not properly loaded during validation");
            return false;
        }

        try {
            const params = message.content as Partial<CreateDeploymentContent>;
            elizaLogger.debug("Checking SDL content", { params });

            // Get SDL content either from direct string, specified file, or default file
            let sdlContent: string;
            if (params.sdl) {
                sdlContent = params.sdl;
            } else if (params.sdlFile) {
                sdlContent = loadSDLFromFile(params.sdlFile);
            } else {
                sdlContent = loadSDLFromFile(DEFAULT_SDL_PATH);
            }

            if (params.deposit && !validateDeposit(params.deposit)) {
                throw new AkashError(
                    "Invalid deposit format",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                    { parameter: "deposit", value: params.deposit }
                );
            }

            elizaLogger.debug("Validating SDL format");
            try {
                // Clean up SDL content by taking only the part after the YAML document separator
                const yamlSeparatorIndex = sdlContent.indexOf('---');
                if (yamlSeparatorIndex === -1) {
                    throw new Error("No YAML document separator (---) found in SDL");
                }

                // Extract only the actual YAML content
                const cleanSDL = sdlContent.substring(yamlSeparatorIndex);

                // Use exact same approach as example for validation
                const sdl = SDL.fromString(cleanSDL, "beta3");
                await sdl.manifestVersion(); // Verify we can get the version
                elizaLogger.debug("SDL format validation successful", {
                    groups: sdl.groups(),
                    groupCount: sdl.groups().length
                });
            } catch (sdlError) {
                elizaLogger.error("SDL format validation failed", { error: sdlError });
                throw new AkashError(
                    `Invalid SDL format: ${sdlError instanceof Error ? sdlError.message : String(sdlError)}`,
                    AkashErrorCode.VALIDATION_SDL_FAILED,
                    { sdl: sdlContent }
                );
            }

            elizaLogger.debug("Validation completed successfully");
            return true;
        } catch (error) {
            elizaLogger.error("Deployment validation failed", {
                error: error instanceof AkashError ? {
                    category: error.category,
                    code: error.code,
                    message: error.message,
                    details: error.details
                } : String(error)
            });
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        _options: { [key: string]: unknown; } = {},
        callback?: HandlerCallback
    ): Promise<boolean> => {
        const actionId = Date.now().toString();
        elizaLogger.info("=== Starting Deployment Creation ===", {
            actionId,
            messageId: message.id,
            userId: message.userId
        });

        // Inspect runtime to verify plugin and action registration
        inspectRuntime(runtime);

        try {
            elizaLogger.debug("=== Validating Akash Configuration ===");
            const config = await validateAkashConfig(runtime);
            elizaLogger.debug("Configuration validated successfully", {
                rpcEndpoint: config.RPC_ENDPOINT,
                chainId: config.AKASH_CHAIN_ID,
                version: config.AKASH_VERSION,
                hasMnemonic: !!config.AKASH_MNEMONIC
            });

            const params = message.content as CreateDeploymentContent;
            elizaLogger.debug("=== Processing Deployment Parameters ===", {
                hasSDL: !!params.sdl,
                hasSDLFile: !!params.sdlFile,
                hasDeposit: !!params.deposit
            });

            // Get SDL content either from direct string, specified file, or default file
            let sdlContent: string;
            let sdlSource: string;
            if (params.sdl) {
                sdlContent = params.sdl;
                sdlSource = 'direct';
            } else if (params.sdlFile) {
                sdlContent = loadSDLFromFile(params.sdlFile);
                sdlSource = 'file';
            } else {
                sdlContent = loadSDLFromFile(DEFAULT_SDL_PATH);
                sdlSource = 'default';
            }
            elizaLogger.debug("SDL content loaded", {
                source: sdlSource,
                contentLength: sdlContent.length
            });

            if (params.deposit && !validateDeposit(params.deposit)) {
                elizaLogger.error("Invalid deposit format", {
                    deposit: params.deposit
                });
                throw new AkashError(
                    "Invalid deposit format",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                    { parameter: "deposit", value: params.deposit }
                );
            }

            // Initialize wallet from mnemonic
            elizaLogger.info("=== Initializing Wallet and Client ===");
            const wallet = await initializeWallet(config.AKASH_MNEMONIC);
            const accounts = await wallet.getAccounts();
            const address = accounts[0].address;
            elizaLogger.debug("Wallet initialized", {
                address,
                accountCount: accounts.length
            });

            // Setup client
            elizaLogger.debug("Setting up Stargate client");
            const client = await setupClient(wallet, config.RPC_ENDPOINT);
            elizaLogger.debug("Client setup completed", {
                rpcEndpoint: config.RPC_ENDPOINT
            });

            // Load or create certificate
            elizaLogger.info("=== Setting up Certificate ===");
            const certificate = await loadOrCreateCertificate(wallet, client);
            elizaLogger.debug("Certificate setup completed", {
                hasCert: !!certificate.cert,
                hasPrivateKey: !!certificate.privateKey,
                hasPublicKey: !!certificate.publicKey
            });

            // Parse SDL
            elizaLogger.info("=== Parsing SDL Configuration ===");
            let sdl: SDL;
            try {
                sdl = await parseSDL(sdlContent);
                elizaLogger.debug("SDL parsed successfully", {
                    groupCount: sdl.groups().length,
                    groups: sdl.groups(),
                    version: await sdl.manifestVersion()
                });
            } catch (sdlError) {
                elizaLogger.error("SDL parsing failed", {
                    error: sdlError instanceof Error ? sdlError.message : String(sdlError),
                    sdlContent
                });
                throw new AkashError(
                    `SDL parsing failed: ${sdlError instanceof Error ? sdlError.message : String(sdlError)}`,
                    AkashErrorCode.MANIFEST_PARSING_FAILED,
                    {
                        sdl: sdlContent,
                        actionId
                    }
                );
            }

            elizaLogger.info("=== Creating Deployment Message ===");
            const blockHeight = await client.getHeight();
            elizaLogger.debug("Current block height", { blockHeight });

            const deployment = {
                id: {
                    owner: address,
                    dseq: blockHeight
                },
                groups: sdl.groups(),
                deposit: {
                    denom: "uakt",
                    amount: params.deposit?.replace("uakt", "") || config.AKASH_DEPOSIT.replace("uakt", "")
                },
                version: await sdl.manifestVersion(),
                depositor: address
            };

            elizaLogger.debug("Deployment object created", {
                owner: deployment.id.owner,
                dseq: deployment.id.dseq,
                groupCount: deployment.groups.length,
                groups: deployment.groups,
                deposit: deployment.deposit,
                version: deployment.version
            });

            const msg = {
                typeUrl: "/akash.deployment.v1beta3.MsgCreateDeployment",
                value: MsgCreateDeployment.fromPartial(deployment)
            };

            // Broadcast transaction with retry for network issues
            elizaLogger.info("=== Broadcasting Deployment Transaction ===", {
                owner: address,
                dseq: blockHeight,
                deposit: params.deposit || config.AKASH_DEPOSIT,
                groups: deployment.groups
            });

            const result = await withRetry(async () => {
                elizaLogger.debug("Attempting to sign and broadcast transaction", {
                    attempt: 'current',
                    fees: config.AKASH_DEPOSIT,
                    gas: "800000",
                    groups: deployment.groups
                });

                const txResult = await client.signAndBroadcast(
                    address,
                    [msg],
                    {
                        amount: [{ denom: "uakt", amount: config.AKASH_DEPOSIT.replace("uakt", "") }],
                        gas: "800000",
                    }
                );

                elizaLogger.debug("Transaction broadcast result", {
                    code: txResult.code,
                    height: txResult.height,
                    transactionHash: txResult.transactionHash,
                    gasUsed: txResult.gasUsed,
                    gasWanted: txResult.gasWanted,
                    rawLog: txResult.rawLog
                });

                if (txResult.code !== 0) {
                    elizaLogger.error("Transaction failed", {
                        code: txResult.code,
                        rawLog: txResult.rawLog,
                        groups: deployment.groups
                    });
                    throw new AkashError(
                        `Transaction failed: ${txResult.rawLog}`,
                        AkashErrorCode.DEPLOYMENT_CREATION_FAILED,
                        {
                            rawLog: txResult.rawLog,
                            dseq: blockHeight,
                            owner: address,
                            actionId,
                            groups: deployment.groups
                        }
                    );
                }

                return txResult;
            });

            elizaLogger.info("=== Deployment Created Successfully ===", {
                txHash: result.transactionHash,
                owner: address,
                dseq: blockHeight,
                actionId,
                height: result.height,
                gasUsed: result.gasUsed
            });

            // Create lease
            elizaLogger.debug("=== Creating Lease ===");
            const lease = await createLease(deployment, wallet, client, config.RPC_ENDPOINT);
            elizaLogger.debug("Lease created", {
                leaseId: lease.id,
                dseq: deployment.id.dseq
            });

            // Send manifest
            elizaLogger.debug("=== Sending Manifest ===");
            const serviceUrl = await sendManifest(sdl, lease, certificate, config.RPC_ENDPOINT);
            elizaLogger.debug("Manifest sent successfully", {
                serviceUrl
            });

            if (callback) {
                elizaLogger.info("=== Preparing callback response for deployment creation ===", {
                    hasCallback: true,
                    actionId,
                    dseq: String(blockHeight)
                });

                const callbackResponse = {
                    text: `Deployment created and started successfully\nDSEQ: ${blockHeight}\nOwner: ${address}\nTx Hash: ${result.transactionHash}\nService URL: ${serviceUrl}`,
                    content: {
                        success: true,
                        data: {
                            txHash: result.transactionHash,
                            owner: address,
                            dseq: String(blockHeight),
                            serviceUrl
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'createDeployment',
                            version: '1.0.0',
                            actionId
                        }
                    }
                };

                elizaLogger.info("=== Executing callback with response ===", {
                    actionId,
                    responseText: callbackResponse.text,
                    hasContent: !!callbackResponse.content,
                    contentKeys: Object.keys(callbackResponse.content),
                    metadata: callbackResponse.content.metadata
                });

                callback(callbackResponse);

                elizaLogger.info("=== Callback executed successfully ===", {
                    actionId,
                    timestamp: new Date().toISOString()
                });
            }

            elizaLogger.info("=== Deployment Process Completed Successfully ===", {
                actionId,
                txHash: result.transactionHash,
                dseq: blockHeight
            });

            return true;
        } catch (error) {
            elizaLogger.error("=== Deployment Creation Failed ===", {
                error: error instanceof AkashError ? {
                    category: error.category,
                    code: error.code,
                    message: error.message,
                    details: error.details
                } : String(error),
                actionId,
                stack: error instanceof Error ? error.stack : undefined
            });

            if (callback) {
                elizaLogger.info("=== Preparing error callback response ===", {
                    actionId,
                    hasCallback: true,
                    errorType: error instanceof AkashError ? 'AkashError' : 'Error'
                });

                const errorResponse = {
                    text: "Failed to create deployment",
                    content: {
                        success: false,
                        error: {
                            code: error instanceof AkashError ? error.code : AkashErrorCode.DEPLOYMENT_CREATION_FAILED,
                            message: error instanceof Error ? error.message : String(error)
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'createDeployment',
                            version: '1.0.0',
                            actionId
                        }
                    }
                };

                elizaLogger.info("=== Executing error callback ===", {
                    actionId,
                    responseText: errorResponse.text,
                    hasContent: !!errorResponse.content,
                    contentKeys: Object.keys(errorResponse.content)
                });

                callback(errorResponse);

                elizaLogger.info("=== Error callback executed successfully ===", {
                    actionId,
                    timestamp: new Date().toISOString()
                });
            }

            return false;
        }
    },
};

export default createDeploymentAction;