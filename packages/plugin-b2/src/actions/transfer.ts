import {
    type Action,
    type ActionExample,
    type IAgentRuntime,
    generateObjectDeprecated,
    type Memory,
    type State,
    type HandlerCallback,
    elizaLogger,
    composeContext,
    ModelClass,
} from "@elizaos/core";
import { getTxReceipt, sendNativeAsset, sendToken } from "../utils";
import type { Address, Hash } from "viem";
import { validateB2NetworkConfig } from "../environment";
import { transferTemplate } from "../templates";
import type { WalletProvider } from "../providers";
import type { Transaction, TransferParams } from "../types";
import { initWalletProvider } from "../providers";
import { TOKEN_ADDRESSES } from "../utils/constants"
// Exported for tests
export class TransferAction {

    constructor(private walletProvider: WalletProvider) {}

    async transfer(params: TransferParams): Promise<Transaction> {
        try {
            let txHash: Hash;
            if (params.tokenAddress === TOKEN_ADDRESSES["B2-BTC"]) {
                txHash = await sendNativeAsset(
                    this.walletProvider,
                    params.recipient as Address,
                    params.amount as number
                );
            } else {
                txHash = await sendToken(
                    this.walletProvider,
                    params.tokenAddress as Address,
                    params.recipient as Address,
                    params.amount as number
                );
            }
            return {
                hash: txHash,
                from: this.walletProvider.getAddress(),
                tokenAddress: params.tokenAddress,
                recipient: params.recipient,
                amount: params.amount,
            };
        } catch(error) {
            elizaLogger.error(`Transfer failed: ${error.message}`);
            throw new Error(`Transfer failed: ${error.message}`);
        }
    }

    async txReceipt(tx: Hash) {
        const receipt = await getTxReceipt(this.walletProvider, tx);
        if (receipt.status === "success") {
            return true;
        } else {
            return false;
        }
    }

    async buildTransferDetails(
        state: State,
        runtime: IAgentRuntime,
    ): Promise<TransferParams> {
        const context = composeContext({
            state,
            template: transferTemplate,
        });

        const transferDetails = (await generateObjectDeprecated({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
        })) as TransferParams;

        return transferDetails;
    }
}

export const transferAction: Action = {
    name: "SEND_TOKEN",
    similes: [
        "TRANSFER_TOKEN_ON_B2",
        "TRANSFER_TOKENS_ON_B2",
        "SEND_TOKENS_ON_B2",
        "SEND_B2BTC_ON_B2",
        "PAY_ON_B2",
    ],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validateB2NetworkConfig(runtime);
        return true;
    },
    description:
        "MUST use this action if the user requests send a token or transfer a token, the request might be varied, but it will always be a token transfer.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.debug("Starting SEND_TOKEN handler...");

        // Initialize or update state
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        elizaLogger.debug("Transfer action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const action = new TransferAction(walletProvider);

        // Compose transfer context
        const paramOptions = await action.buildTransferDetails(
            state,
            runtime,
        );

        elizaLogger.debug("Transfer paramOptions:", paramOptions);

        const tx = await action.transfer(paramOptions);
        if (tx) {
            const result = await action.txReceipt(tx.hash);
            if (result) {
                callback?.({
                    text: "transfer successful",
                    content: { success: true, txHash: tx.hash },
                });
            } else {
                callback?.({
                    text: "transfer failed",
                    content: { error: "Transfer failed" },
                });
            }
        } else {
            callback?.({
                text: "transfer failed",
                content: { error: "Transfer failed" },
            });
        }
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send 1 B2-BTC to 0x4f9e2dc50B4Cd632CC2D24edaBa3Da2a9338832a",
                },
            },
        ],
    ] as ActionExample[][],
};
