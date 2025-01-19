import {
    composeContext,
    generateObjectDeprecated,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
} from "@elizaos/core";
import { initWalletChainsData } from "../../providers/wallet/utils";
import { cosmosTransferTemplate } from "../../templates";
import { CosmosTransferActionService } from "./services/cosmos-transfer-action-service";
import type { CosmosTransferParams } from "./types";
import type {
    ICosmosPluginOptions,
    ICosmosWalletChains,
} from "../../shared/interfaces";

export const createTransferAction = (pluginOptions: ICosmosPluginOptions) => ({
    name: "COSMOS_TRANSFER",
    description: "Transfer tokens between addresses on the same chain",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        _callback?: HandlerCallback
    ) => {
        const cosmosTransferContext = composeContext({
            state: state,
            template: cosmosTransferTemplate,
            templatingEngine: "handlebars",
        });

        const cosmosTransferContent = await generateObjectDeprecated({
            runtime: _runtime,
            context: cosmosTransferContext,
            modelClass: ModelClass.SMALL,
        });

        const paramOptions: CosmosTransferParams = {
            chainName: cosmosTransferContent.chainName,
            symbol: cosmosTransferContent.symbol,
            amount: cosmosTransferContent.amount,
            toAddress: cosmosTransferContent.toAddress,
        };

        try {
            const walletProvider: ICosmosWalletChains =
                await initWalletChainsData(_runtime);

            const action = new CosmosTransferActionService(walletProvider);

            const customAssets = (pluginOptions?.customChainData ?? []).map(
                (chainData) => chainData.assets
            );

            const transferResp = await action.execute(
                paramOptions,
                customAssets
            );

            if (_callback) {
                await _callback({
                    text: `Successfully transferred ${paramOptions.amount} tokens to ${paramOptions.toAddress}\nGas paid: ${transferResp.gasPaid}\nTransaction Hash: ${transferResp.txHash}`,
                    content: {
                        success: true,
                        hash: transferResp.txHash,
                        amount: paramOptions.amount,
                        recipient: transferResp.to,
                        chain: cosmosTransferContent.fromChain,
                    },
                });

                const newMemory: Memory = {
                    userId: _message.agentId,
                    agentId: _message.agentId,
                    roomId: _message.roomId,
                    content: {
                        text: `Transaction ${paramOptions.amount} ${paramOptions.symbol} to address ${paramOptions.toAddress} on chain ${paramOptions.toAddress} was successfully transfered.\n Gas paid: ${transferResp.gasPaid}. Tx hash: ${transferResp.txHash}`,
                    },
                };

                await _runtime.messageManager.createMemory(newMemory);
            }
            return true;
        } catch (error) {
            console.error("Error during token transfer:", error);

            if (_callback) {
                await _callback({
                    text: `Error transferring tokens: ${error.message}`,
                    content: { error: error.message },
                });
            }

            const newMemory: Memory = {
                userId: _message.agentId,
                agentId: _message.agentId,
                roomId: _message.roomId,
                content: {
                    text: `Transaction ${paramOptions.amount} ${paramOptions.symbol} to address ${paramOptions.toAddress} on chain ${paramOptions.toAddress} was unsuccessful.`,
                },
            };

            await _runtime.messageManager.createMemory(newMemory);

            return false;
        }
    },
    template: cosmosTransferTemplate,
    validate: async (runtime: IAgentRuntime) => {
        const mnemonic = runtime.getSetting("COSMOS_RECOVERY_PHRASE");
        const availableChains = runtime.getSetting("COSMOS_AVAILABLE_CHAINS");
        const availableChainsArray = availableChains?.split(",");

        return !(mnemonic && availableChains && availableChainsArray.length);
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Make transfer {{0.0001 OM}} to {{mantra1pcnw46km8m5amvf7jlk2ks5std75k73aralhcf}} on {{mantrachaintestnet2}}",
                    action: "COSMOS_TRANSFER",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Do you confirm the transfer action?",
                    action: "COSMOS_TRANSFER",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "Yes",
                    action: "COSMOS_TRANSFER",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "",
                    action: "COSMOS_TRANSFER",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send {{10 OSMO}} to {{osmo13248w8dtnn07sxc3gq4l3ts4rvfyat6f4qkdd6}} on {{osmosistestnet}}",
                    action: "COSMOS_TRANSFER",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Do you confirm the transfer action?",
                    action: "COSMOS_TRANSFER",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "Yes",
                    action: "COSMOS_TRANSFER",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "",
                    action: "COSMOS_TRANSFER",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send {{0.0001 OM}} on {{mantrachaintestnet2}} to {{mantra1pcnw46km8m5amvf7jlk2ks5std75k73aralhcf}}.",
                    action: "COSMOS_TRANSFER",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Do you confirm the transfer action?",
                    action: "COSMOS_TRANSFER",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "Yes",
                    action: "COSMOS_TRANSFER",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "",
                    action: "COSMOS_TRANSFER",
                },
            },
        ],
    ],
    similes: [
        "COSMOS_SEND_TOKENS",
        "COSMOS_TOKEN_TRANSFER",
        "COSMOS_MOVE_TOKENS",
    ],
});
