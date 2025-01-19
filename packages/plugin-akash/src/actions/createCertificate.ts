import { type Action, elizaLogger } from "@elizaos/core";
import type { IAgentRuntime, Memory, State, HandlerCallback, Content, ActionExample } from "@elizaos/core";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import * as cert from "@akashnetwork/akashjs/build/certificates";
import { certificateManager } from "@akashnetwork/akashjs/build/certificates/certificate-manager";
import type { CertificatePem } from "@akashnetwork/akashjs/build/certificates/certificate-manager/CertificateManager";
import { getAkashTypeRegistry } from "@akashnetwork/akashjs/build/stargate";
import { validateAkashConfig } from "../environment";
import { AkashError, AkashErrorCode, withRetry } from "../error/error";
import * as fs from 'fs';
import * as path from 'path';
import { Registry } from "@cosmjs/proto-signing";
import type { SigningStargateClient as AkashSigningStargateClient } from "@akashnetwork/akashjs/node_modules/@cosmjs/stargate";
import { getCertificatePath } from "../utils/paths";

interface CreateCertificateContent extends Content {
    overwrite?: boolean;
}

// Certificate file path
const CERTIFICATE_PATH = getCertificatePath(import.meta.url);

// Save certificate to file
async function saveCertificate(certificate: CertificatePem): Promise<void> {
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
        throw new AkashError(
            "Failed to save certificate",
            AkashErrorCode.FILE_WRITE_ERROR,
            { path: CERTIFICATE_PATH, error }
        );
    }
}

// Load certificate from file
function loadCertificate(): CertificatePem {
    elizaLogger.debug("Loading certificate from file", { path: CERTIFICATE_PATH });
    try {
        if (!fs.existsSync(CERTIFICATE_PATH)) {
            throw new AkashError(
                "Certificate file not found",
                AkashErrorCode.CERTIFICATE_NOT_FOUND,
                { path: CERTIFICATE_PATH }
            );
        }
        const json = fs.readFileSync(CERTIFICATE_PATH, "utf8");
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
            path: CERTIFICATE_PATH
        });
        if (error instanceof AkashError) {
            throw error;
        }
        throw new AkashError(
            "Failed to load certificate",
            AkashErrorCode.FILE_READ_ERROR,
            { path: CERTIFICATE_PATH, error }
        );
    }
}

// Initialize wallet with proper error handling
async function initializeWallet(mnemonic: string): Promise<DirectSecp256k1HdWallet> {
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

        if (error instanceof AkashError) {
            throw error;
        }

        throw new AkashError(
            `Failed to initialize wallet: ${error instanceof Error ? error.message : String(error)}`,
            AkashErrorCode.WALLET_INITIALIZATION_FAILED,
            {
                mnemonicLength: words.length,
                error: error instanceof Error ? error.message : String(error)
            }
        );
    }
}

// Setup client with proper error handling and fallback RPC endpoints
async function setupClient(wallet: DirectSecp256k1HdWallet, rpcEndpoint: string): Promise<SigningStargateClient> {
    // Try alternative RPC endpoints if the main one fails
    const rpcEndpoints = [
        rpcEndpoint,
        "https://rpc.akashnet.net:443",
        "https://akash-rpc.polkachu.com:443",
        "https://akash-rpc.europlots.com:443"
    ];

    elizaLogger.info("=== Setting up Stargate Client ===", {
        primaryRpcEndpoint: rpcEndpoint,
        allEndpoints: rpcEndpoints,
        walletType: wallet.constructor.name
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

            elizaLogger.debug("Client setup completed successfully", {
                endpoint,
                clientType: client.constructor.name
            });

            return client;
        } catch (error) {
            lastError = error as Error;
            elizaLogger.warn("Failed to connect to RPC endpoint", {
                endpoint,
                error: error instanceof Error ? error.message : String(error),
                remainingEndpoints: rpcEndpoints.slice(rpcEndpoints.indexOf(endpoint) + 1).length
            });
        }
    }

    throw new AkashError(
        `Failed to connect to any RPC endpoint: ${lastError?.message}`,
        AkashErrorCode.CLIENT_SETUP_FAILED,
        { lastError }
    );
}

export const createCertificateAction: Action = {
    name: "CREATE_CERTIFICATE",
    similes: ["GENERATE_CERTIFICATE", "SETUP_CERTIFICATE", "INIT_CERTIFICATE"],
    description: "Create or load Akash certificate for provider interactions",
    examples: [[
        {
            user: "user",
            content: {
                text: "Create a new certificate",
                overwrite: true
            } as CreateCertificateContent
        } as ActionExample,
        {
            user: "assistant",
            content: {
                text: "Creating new certificate..."
            } as CreateCertificateContent
        } as ActionExample
    ]],

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        elizaLogger.debug("=== Starting Certificate Validation ===");
        try {
            const params = message.content as Partial<CreateCertificateContent>;

            // Validate Akash configuration
            await validateAkashConfig(runtime);

            // If overwrite is specified, it must be a boolean
            if (params.overwrite !== undefined && typeof params.overwrite !== 'boolean') {
                throw new AkashError(
                    "Overwrite parameter must be a boolean",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                    { parameter: "overwrite", value: params.overwrite }
                );
            }

            elizaLogger.debug("Certificate validation completed successfully");
            return true;
        } catch (error) {
            elizaLogger.error("Certificate validation failed", {
                error: error instanceof AkashError ? {
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
        options: { callback?: HandlerCallback } = {}
    ): Promise<boolean> => {
        const actionId = Date.now().toString();
        elizaLogger.info("=== Starting Certificate Creation/Loading ===", { actionId });

        try {
            // First validate the parameters
            if (!await createCertificateAction.validate(runtime, message)) {
                const error = new AkashError(
                    "Invalid parameters provided",
                    AkashErrorCode.VALIDATION_PARAMETER_INVALID
                );
                if (options.callback) {
                    options.callback({
                        text: `Failed to validate parameters: ${error.message}`,
                        error: error.message,
                        content: {
                            success: false,
                            error: {
                                code: error.code,
                                message: error.message
                            }
                        }
                    });
                }
                return false;
            }

            const params = message.content as Partial<CreateCertificateContent>;
            const config = await validateAkashConfig(runtime);

            try {
                // Check if certificate exists and overwrite is not true
                if (fs.existsSync(CERTIFICATE_PATH) && !params.overwrite) {
                    elizaLogger.info("Loading existing certificate");
                    const certificate = loadCertificate();

                    if (options.callback) {
                        options.callback({
                            text: "Loaded existing certificate",
                            content: {
                                success: true,
                                certificate: {
                                    hasCert: !!certificate.cert,
                                    hasPrivateKey: !!certificate.privateKey,
                                    hasPublicKey: !!certificate.publicKey
                                }
                            }
                        });
                    }
                    return true;
                }

                // Initialize wallet
                elizaLogger.info("Initializing wallet for certificate creation");
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
                elizaLogger.debug("Client setup completed");

                // Generate new certificate
                elizaLogger.info("Generating new certificate");
                const certificate = certificateManager.generatePEM(address);
                elizaLogger.debug("Certificate generated", {
                    hasCert: !!certificate.cert,
                    hasPrivateKey: !!certificate.privateKey,
                    hasPublicKey: !!certificate.publicKey
                });

                // Broadcast certificate
                elizaLogger.info("Broadcasting certificate to network");
                const result = await withRetry(async () => {
                    return await cert.broadcastCertificate(
                        certificate,
                        address,
                        client as unknown as AkashSigningStargateClient
                    );
                });

                if (result.code !== 0) {
                    throw new AkashError(
                        `Could not create certificate: ${result.rawLog}`,
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
                await saveCertificate(certificate);
                elizaLogger.info("Certificate saved to file", { path: CERTIFICATE_PATH });

                if (options.callback) {
                    options.callback({
                        text: "Certificate created and saved successfully",
                        content: {
                            success: true,
                            certificate: {
                                hasCert: !!certificate.cert,
                                hasPrivateKey: !!certificate.privateKey,
                                hasPublicKey: !!certificate.publicKey
                            },
                            transaction: {
                                hash: result.transactionHash,
                                height: result.height,
                                gasUsed: result.gasUsed
                            }
                        }
                    });
                }

                return true;
            } catch (error) {
                elizaLogger.error("Failed to create/load certificate", {
                    error: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined
                });

                if (options.callback) {
                    options.callback({
                        text: `Failed to create/load certificate: ${error instanceof Error ? error.message : String(error)}`,
                        error: error instanceof Error ? error.message : String(error),
                        content: {
                            success: false,
                            error: error instanceof AkashError ? {
                                code: error.code,
                                message: error.message,
                                details: error.details
                            } : {
                                code: AkashErrorCode.CERTIFICATE_CREATION_FAILED,
                                message: String(error)
                            }
                        }
                    });
                }
                return false;
            }
        } catch (error) {
            elizaLogger.error("Certificate operation failed", {
                error: error instanceof Error ? error.message : String(error),
                code: error instanceof AkashError ? error.code : AkashErrorCode.CERTIFICATE_CREATION_FAILED,
                actionId
            });

            if (options.callback) {
                options.callback({
                    text: `Certificate operation failed: ${error instanceof Error ? error.message : String(error)}`,
                    error: error instanceof Error ? error.message : String(error),
                    content: {
                        success: false,
                        error: error instanceof AkashError ? {
                            code: error.code,
                            message: error.message,
                            details: error.details
                        } : {
                            code: AkashErrorCode.CERTIFICATE_CREATION_FAILED,
                            message: String(error)
                        }
                    }
                });
            }

            return false;
        }
    }
};

export default createCertificateAction;
