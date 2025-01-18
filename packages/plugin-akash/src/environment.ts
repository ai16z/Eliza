import { type IAgentRuntime, elizaLogger } from "@elizaos/core";
import { z } from "zod";

// Add ENV variable at the top
let ENV = "mainnet";

// Log environment information
elizaLogger.info("Environment sources", {
    shellVars: Object.keys(process.env).filter(key => key.startsWith('AKASH_')),
});

export const akashEnvSchema = z.object({
    AKASH_MNEMONIC: z.string()
        .min(1, "Wallet mnemonic is required")
        .refine(
            (mnemonic) => {
                const words = mnemonic.trim().split(/\s+/);
                return words.length === 12 || words.length === 24;
            },
            {
                message: "Mnemonic must be 12 or 24 words",
                path: ["AKASH_MNEMONIC"]
            }
        ),
    AKASH_WALLET_ADDRESS: z.string()
        .min(1, "Wallet address is required")
        .regex(/^akash[a-zA-Z0-9]{39}$/, "Invalid Akash wallet address format")
        .optional(),
    AKASH_NET: z.string().min(1, "Network configuration URL is required"),
    AKASH_VERSION: z.string().min(1, "Akash version is required"),
    AKASH_CHAIN_ID: z.string().min(1, "Chain ID is required"),
    AKASH_NODE: z.string().min(1, "Node URL is required"),
    RPC_ENDPOINT: z.string().min(1, "RPC endpoint is required"),
    AKASH_GAS_PRICES: z.string().min(1, "Gas prices are required"),
    AKASH_GAS_ADJUSTMENT: z.string().min(1, "Gas adjustment is required"),
    AKASH_KEYRING_BACKEND: z.string().min(1, "Keyring backend is required"),
    AKASH_FROM: z.string().min(1, "Key name is required"),
    AKASH_FEES: z.string().min(1, "Transaction fees are required"),
    AKASH_DEPOSIT: z.string().min(1, "Deposit is required be careful with the value not too low generally around 500000uakt"),
    AKASH_PRICING_API_URL: z.string().optional(),
    AKASH_DEFAULT_CPU: z.string().optional(),
    AKASH_DEFAULT_MEMORY: z.string().optional(),
    AKASH_DEFAULT_STORAGE: z.string().optional(),
    AKASH_SDL: z.string().optional(),
    AKASH_CLOSE_DEP: z.string().optional(),
    AKASH_CLOSE_DSEQ: z.string().optional(),
    AKASH_PROVIDER_INFO: z.string().optional(),
    AKASH_DEP_STATUS: z.string().optional(),
    AKASH_DEP_DSEQ: z.string().optional(),
    AKASH_GAS_OPERATION: z.string().optional(),
    AKASH_GAS_DSEQ: z.string().optional(),
    // Manifest Configuration
    AKASH_MANIFEST_MODE: z.string()
        .optional()
        .refine(
            (mode) => !mode || ["auto", "manual", "validate_only"].includes(mode),
            {
                message: "AKASH_MANIFEST_MODE must be one of: auto, manual, validate_only"
            }
        ),
    AKASH_MANIFEST_PATH: z.string()
        .optional(),
    AKASH_MANIFEST_VALIDATION_LEVEL: z.string()
        .optional()
        .refine(
            (level) => !level || ["strict", "lenient", "none"].includes(level),
            {
                message: "AKASH_MANIFEST_VALIDATION_LEVEL must be one of: strict, lenient, none"
            }
        ),
});

export type AkashConfig = z.infer<typeof akashEnvSchema>;

export function getConfig(
    env: string | undefined | null = ENV ||
        process.env.AKASH_ENV
) {
    ENV = env || "mainnet";
    switch (env) {
        case "mainnet":
            return {
                AKASH_NET: "https://raw.githubusercontent.com/ovrclk/net/master/mainnet",
                RPC_ENDPOINT: "https://rpc.akashnet.net:443",
                AKASH_GAS_PRICES: "0.025uakt",
                AKASH_GAS_ADJUSTMENT: "1.5",
                AKASH_KEYRING_BACKEND: "os",
                AKASH_FROM: "default",
                AKASH_FEES: "20000uakt",
                AKASH_WALLET_ADDRESS: process.env.AKASH_WALLET_ADDRESS || "",
                AKASH_PRICING_API_URL: process.env.AKASH_PRICING_API_URL || "https://console-api.akash.network/v1/pricing",
                AKASH_DEFAULT_CPU: process.env.AKASH_DEFAULT_CPU || "1000",
                AKASH_DEFAULT_MEMORY: process.env.AKASH_DEFAULT_MEMORY || "1000000000",
                AKASH_DEFAULT_STORAGE: process.env.AKASH_DEFAULT_STORAGE || "1000000000",
                AKASH_SDL: process.env.AKASH_SDL || "example.sdl.yml",
                AKASH_CLOSE_DEP: process.env.AKASH_CLOSE_DEP || "closeAll",
                AKASH_CLOSE_DSEQ: process.env.AKASH_CLOSE_DSEQ || "",
                AKASH_PROVIDER_INFO: process.env.AKASH_PROVIDER_INFO || "",
                AKASH_DEP_STATUS: process.env.AKASH_DEP_STATUS || "param_passed",
                AKASH_DEP_DSEQ: process.env.AKASH_DEP_DSEQ || "",
                AKASH_GAS_OPERATION: process.env.AKASH_GAS_OPERATION || "close",
                AKASH_GAS_DSEQ: process.env.AKASH_GAS_DSEQ || "",
                AKASH_MANIFEST_MODE: process.env.AKASH_MANIFEST_MODE || "auto",
                AKASH_MANIFEST_PATH: process.env.AKASH_MANIFEST_PATH || "",
                AKASH_MANIFEST_VALIDATION_LEVEL: process.env.AKASH_MANIFEST_VALIDATION_LEVEL || "strict",
                AKASH_DEPOSIT: process.env.AKASH_DEPOSIT || "500000uakt"
            };
        case "testnet":
            return {
                AKASH_NET: "https://raw.githubusercontent.com/ovrclk/net/master/testnet",
                RPC_ENDPOINT: "https://rpc.sandbox-01.aksh.pw",
                AKASH_GAS_PRICES: "0.025uakt",
                AKASH_GAS_ADJUSTMENT: "1.5",
                AKASH_KEYRING_BACKEND: "test",
                AKASH_FROM: "default",
                AKASH_FEES: "20000uakt",
                AKASH_WALLET_ADDRESS: process.env.AKASH_WALLET_ADDRESS || "",
                AKASH_PRICING_API_URL: process.env.AKASH_PRICING_API_URL || "https://console-api.akash.network/v1/pricing",
                AKASH_DEFAULT_CPU: process.env.AKASH_DEFAULT_CPU || "1000",
                AKASH_DEFAULT_MEMORY: process.env.AKASH_DEFAULT_MEMORY || "1000000000",
                AKASH_DEFAULT_STORAGE: process.env.AKASH_DEFAULT_STORAGE || "1000000000",
                AKASH_SDL: process.env.AKASH_SDL || "example.sdl.yml",
                AKASH_CLOSE_DEP: process.env.AKASH_CLOSE_DEP || "closeAll",
                AKASH_CLOSE_DSEQ: process.env.AKASH_CLOSE_DSEQ || "",
                AKASH_PROVIDER_INFO: process.env.AKASH_PROVIDER_INFO || "",
                AKASH_DEP_STATUS: process.env.AKASH_DEP_STATUS || "param_passed",
                AKASH_DEP_DSEQ: process.env.AKASH_DEP_DSEQ || "",
                AKASH_GAS_OPERATION: process.env.AKASH_GAS_OPERATION || "close",
                AKASH_GAS_DSEQ: process.env.AKASH_GAS_DSEQ || "",
                AKASH_MANIFEST_MODE: process.env.AKASH_MANIFEST_MODE || "auto",
                AKASH_MANIFEST_PATH: process.env.AKASH_MANIFEST_PATH || "",
                AKASH_MANIFEST_VALIDATION_LEVEL: process.env.AKASH_MANIFEST_VALIDATION_LEVEL || "strict",
                AKASH_DEPOSIT: process.env.AKASH_DEPOSIT || "500000uakt"
            };
        default:
            return {
                AKASH_NET: "https://raw.githubusercontent.com/ovrclk/net/master/mainnet",
                RPC_ENDPOINT: "https://rpc.akashnet.net:443",
                AKASH_GAS_PRICES: "0.025uakt",
                AKASH_GAS_ADJUSTMENT: "1.5",
                AKASH_KEYRING_BACKEND: "os",
                AKASH_FROM: "default",
                AKASH_FEES: "20000uakt",
                AKASH_WALLET_ADDRESS: process.env.AKASH_WALLET_ADDRESS || "",
                AKASH_PRICING_API_URL: process.env.AKASH_PRICING_API_URL || "https://console-api.akash.network/v1/pricing",
                AKASH_DEFAULT_CPU: process.env.AKASH_DEFAULT_CPU || "1000",
                AKASH_DEFAULT_MEMORY: process.env.AKASH_DEFAULT_MEMORY || "1000000000",
                AKASH_DEFAULT_STORAGE: process.env.AKASH_DEFAULT_STORAGE || "1000000000",
                AKASH_SDL: process.env.AKASH_SDL || "example.sdl.yml",
                AKASH_CLOSE_DEP: process.env.AKASH_CLOSE_DEP || "closeAll",
                AKASH_CLOSE_DSEQ: process.env.AKASH_CLOSE_DSEQ || "",
                AKASH_PROVIDER_INFO: process.env.AKASH_PROVIDER_INFO || "",
                AKASH_DEP_STATUS: process.env.AKASH_DEP_STATUS || "param_passed",
                AKASH_DEP_DSEQ: process.env.AKASH_DEP_DSEQ || "",
                AKASH_GAS_OPERATION: process.env.AKASH_GAS_OPERATION || "close",
                AKASH_GAS_DSEQ: process.env.AKASH_GAS_DSEQ || "",
                AKASH_MANIFEST_MODE: process.env.AKASH_MANIFEST_MODE || "auto",
                AKASH_MANIFEST_PATH: process.env.AKASH_MANIFEST_PATH || "",
                AKASH_MANIFEST_VALIDATION_LEVEL: process.env.AKASH_MANIFEST_VALIDATION_LEVEL || "strict",
                AKASH_DEPOSIT: process.env.AKASH_DEPOSIT || "500000uakt"
            };
    }
}

export async function validateAkashConfig(
    runtime: IAgentRuntime
): Promise<AkashConfig> {
    try {
        // Log environment information
        // elizaLogger.info("Environment configuration details", {
        //     shellMnemonic: process.env.AKASH_MNEMONIC,
        //     runtimeMnemonic: runtime.getSetting("AKASH_MNEMONIC"),
        //     envVars: {
        //         fromShell: Object.keys(process.env).filter(key => key.startsWith('AKASH_')),
        //         fromRuntime: Object.keys(runtime)
        //             .filter(key => typeof runtime.getSetting === 'function' && runtime.getSetting(key))
        //             .filter(key => key.startsWith('AKASH_'))
        //     }
        // });

        const envConfig = getConfig(
            runtime.getSetting("AKASH_ENV") ?? undefined
        );

        // Fetch dynamic values from the network configuration
        const akashNet = process.env.AKASH_NET || runtime.getSetting("AKASH_NET") || envConfig.AKASH_NET;
        const version = await fetch(`${akashNet}/version.txt`).then(res => res.text());
        const chainId = await fetch(`${akashNet}/chain-id.txt`).then(res => res.text());
        const node = await fetch(`${akashNet}/rpc-nodes.txt`).then(res => res.text().then(text => text.split('\n')[0]));

        // Prioritize shell environment variables over runtime settings
        const mnemonic = process.env.AKASH_MNEMONIC || runtime.getSetting("AKASH_MNEMONIC");

        // elizaLogger.debug("SDL configuration", {
        //     fromShell: process.env.AKASH_SDL,
        //     fromRuntime: runtime.getSetting("AKASH_SDL"),
        //     fromConfig: envConfig.AKASH_SDL
        // });

        if (!mnemonic) {
            throw new Error(
                "AKASH_MNEMONIC not found in environment variables or runtime settings.\n" +
                "Please ensure AKASH_MNEMONIC is set in your shell environment or runtime settings"
            );
        }

        // Clean the mnemonic string - handle quotes and whitespace
        const cleanMnemonic = mnemonic
            .trim()
            .replace(/^["']|["']$/g, '') // Remove surrounding quotes
            .replace(/\n/g, ' ')
            .replace(/\r/g, ' ')
            .replace(/\s+/g, ' ');

        const mnemonicWords = cleanMnemonic.split(' ').filter(word => word.length > 0);

        if (mnemonicWords.length !== 12 && mnemonicWords.length !== 24) {
            throw new Error(
                `Invalid AKASH_MNEMONIC length: got ${mnemonicWords.length} words, expected 12 or 24 words.\n` +
                `Words found: ${mnemonicWords.join(', ')}`
            );
        }

        const config = {
            AKASH_MNEMONIC: cleanMnemonic,
            AKASH_NET: akashNet,
            AKASH_VERSION: version,
            AKASH_CHAIN_ID: chainId,
            AKASH_NODE: node,
            RPC_ENDPOINT: process.env.RPC_ENDPOINT || runtime.getSetting("RPC_ENDPOINT") || envConfig.RPC_ENDPOINT,
            AKASH_GAS_PRICES: process.env.AKASH_GAS_PRICES || runtime.getSetting("AKASH_GAS_PRICES") || envConfig.AKASH_GAS_PRICES,
            AKASH_GAS_ADJUSTMENT: process.env.AKASH_GAS_ADJUSTMENT || runtime.getSetting("AKASH_GAS_ADJUSTMENT") || envConfig.AKASH_GAS_ADJUSTMENT,
            AKASH_KEYRING_BACKEND: process.env.AKASH_KEYRING_BACKEND || runtime.getSetting("AKASH_KEYRING_BACKEND") || envConfig.AKASH_KEYRING_BACKEND,
            AKASH_FROM: process.env.AKASH_FROM || runtime.getSetting("AKASH_FROM") || envConfig.AKASH_FROM,
            AKASH_FEES: process.env.AKASH_FEES || runtime.getSetting("AKASH_FEES") || envConfig.AKASH_FEES,
            AKASH_PRICING_API_URL: process.env.AKASH_PRICING_API_URL || runtime.getSetting("AKASH_PRICING_API_URL") || envConfig.AKASH_PRICING_API_URL,
            AKASH_DEFAULT_CPU: process.env.AKASH_DEFAULT_CPU || runtime.getSetting("AKASH_DEFAULT_CPU") || envConfig.AKASH_DEFAULT_CPU,
            AKASH_DEFAULT_MEMORY: process.env.AKASH_DEFAULT_MEMORY || runtime.getSetting("AKASH_DEFAULT_MEMORY") || envConfig.AKASH_DEFAULT_MEMORY,
            AKASH_DEFAULT_STORAGE: process.env.AKASH_DEFAULT_STORAGE || runtime.getSetting("AKASH_DEFAULT_STORAGE") || envConfig.AKASH_DEFAULT_STORAGE,
            AKASH_SDL: process.env.AKASH_SDL || runtime.getSetting("AKASH_SDL") || envConfig.AKASH_SDL,
            AKASH_CLOSE_DEP: process.env.AKASH_CLOSE_DEP || runtime.getSetting("AKASH_CLOSE_DEP") || envConfig.AKASH_CLOSE_DEP,
            AKASH_CLOSE_DSEQ: process.env.AKASH_CLOSE_DSEQ || runtime.getSetting("AKASH_CLOSE_DSEQ") || envConfig.AKASH_CLOSE_DSEQ,
            AKASH_PROVIDER_INFO: process.env.AKASH_PROVIDER_INFO || runtime.getSetting("AKASH_PROVIDER_INFO") || envConfig.AKASH_PROVIDER_INFO,
            AKASH_DEP_STATUS: process.env.AKASH_DEP_STATUS || runtime.getSetting("AKASH_DEP_STATUS") || envConfig.AKASH_DEP_STATUS,
            AKASH_DEP_DSEQ: process.env.AKASH_DEP_DSEQ || runtime.getSetting("AKASH_DEP_DSEQ") || envConfig.AKASH_DEP_DSEQ,
            AKASH_GAS_OPERATION: process.env.AKASH_GAS_OPERATION || runtime.getSetting("AKASH_GAS_OPERATION") || envConfig.AKASH_GAS_OPERATION,
            AKASH_GAS_DSEQ: process.env.AKASH_GAS_DSEQ || runtime.getSetting("AKASH_GAS_DSEQ") || envConfig.AKASH_GAS_DSEQ,
            AKASH_MANIFEST_MODE: process.env.AKASH_MANIFEST_MODE || runtime.getSetting("AKASH_MANIFEST_MODE") || envConfig.AKASH_MANIFEST_MODE,
            AKASH_MANIFEST_PATH: process.env.AKASH_MANIFEST_PATH || runtime.getSetting("AKASH_MANIFEST_PATH") || envConfig.AKASH_MANIFEST_PATH,
            AKASH_MANIFEST_VALIDATION_LEVEL: process.env.AKASH_MANIFEST_VALIDATION_LEVEL || runtime.getSetting("AKASH_MANIFEST_VALIDATION_LEVEL") || envConfig.AKASH_MANIFEST_VALIDATION_LEVEL,
            AKASH_DEPOSIT: process.env.AKASH_DEPOSIT || runtime.getSetting("AKASH_DEPOSIT") || envConfig.AKASH_DEPOSIT
        };

        return akashEnvSchema.parse(config);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to validate Akash configuration: ${errorMessage}`);
    }
}
