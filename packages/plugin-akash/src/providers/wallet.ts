import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { elizaLogger, type IAgentRuntime, type Memory } from "@elizaos/core";
// import { IAgentRuntime, Memory } from "@elizaos/core/src/types";
import { validateAkashConfig } from "../environment";
import { getAkashTypeRegistry } from "@akashnetwork/akashjs/build/stargate";
import {
    type AkashProvider,
    type AkashWalletState,
    AkashError,
    AKASH_ERROR_CODES,
} from "../types";

// Use a proper UUID for the wallet room
const WALLET_ROOM_ID = "00000000-0000-0000-0000-000000000001";

export const walletProvider: AkashProvider = {
    type: "AKASH_WALLET",
    version: "1.0.0",
    name: "wallet",
    description: "Akash wallet provider",

    initialize: async (runtime: IAgentRuntime): Promise<void> => {
        elizaLogger.info("Initializing Akash wallet provider");
        try {
            const mnemonic = runtime.getSetting("AKASH_MNEMONIC");
            if (!mnemonic) {
                throw new Error("AKASH_MNEMONIC not found in environment variables");
            }

            const config = await validateAkashConfig(runtime);

            // Create wallet from mnemonic
            const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.AKASH_MNEMONIC, {
                prefix: "akash",
            });

            // Get the wallet address
            const [account] = await wallet.getAccounts();
            const address = account.address;

            // Create signing client with registry
            const client = await SigningStargateClient.connectWithSigner(
                config.RPC_ENDPOINT,
                wallet,
                { registry: getAkashTypeRegistry() as any }
            );

            // Store wallet info in memory manager
            const state: AkashWalletState = {
                wallet,
                client,
                address,
            };

            // Create memory object
            const memory: Memory = {
                id: WALLET_ROOM_ID,
                userId: runtime.agentId,
                agentId: runtime.agentId,
                roomId: WALLET_ROOM_ID,
                content: {
                    type: "wallet_state",
                    text: `Akash wallet initialized with address: ${address}`,
                    data: state,
                },
                createdAt: Date.now(),
            };

            await runtime.messageManager.createMemory(memory);

            elizaLogger.info("Akash wallet provider initialized successfully", {
                address,
            });
        } catch (error) {
            elizaLogger.error("Failed to initialize Akash wallet provider", {
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    },

    get: async (runtime: IAgentRuntime, _message?: Memory): Promise<AkashWalletState> => {
        const memories = await runtime.messageManager.getMemories({
            roomId: WALLET_ROOM_ID,
            count: 1,
        });

        const state = memories[0]?.content?.data;
        if (!state) {
            throw new AkashError(
                "Akash wallet not initialized",
                AKASH_ERROR_CODES.WALLET_NOT_INITIALIZED
            );
        }
        return state as AkashWalletState;
    },

    validate: async (_runtime: IAgentRuntime, _message?: Memory): Promise<boolean> => {
        return true;
    },

    process: async (_runtime: IAgentRuntime, _message?: Memory): Promise<void> => {
        // No processing needed for wallet provider
    }
};

export default walletProvider;
