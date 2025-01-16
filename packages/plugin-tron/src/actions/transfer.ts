import {
    Action,
    composeContext,
    generateObjectDeprecated,
    HandlerCallback,
    ModelClass,
    type IAgentRuntime,
    type Memory,
    type State,
} from "@elizaos/core";
import { BigNumber } from "tronweb";

import { initWalletProvider, WalletProvider } from "../providers/wallet";
import { transferTemplate } from "../templates";
import type { Transaction, TransferParams } from "../types";

// Exported for tests
export class TransferAction {
    constructor(private walletProvider: WalletProvider) {}

    async transfer(params: TransferParams): Promise<Transaction> {
        console.log(
            `Transferring: ${params.amount} ${
                params.token ? "TRC20 token" : "TRX"
            } to (${params.toAddress})`
        );

        const tronWeb = this.walletProvider.tronWeb;

        try {
            if (params.token) {
                // Transfer TRC20 token
                const { abi } = await tronWeb.trx.getContract(params.token);
                const tokenContract = tronWeb.contract(
                    abi.entrys,
                    params.token
                );
                const amount = BigNumber(
                    tronWeb.toSun(+params.amount)
                ).toNumber();
                const transaction = await tokenContract.methods
                    .transfer(params.toAddress, amount)
                    .send();
                return {
                    hash: transaction,
                    from: tronWeb.defaultAddress.base58 || "",
                    to: params.toAddress,
                    value: BigInt(params.amount),
                    data: params.token,
                };
            } else {
                // Transfer TRX
                const amount = BigNumber(
                    tronWeb.toSun(+params.amount)
                ).toNumber();
                const transaction = await tronWeb.transactionBuilder.sendTrx(
                    params.toAddress,
                    amount
                );
                const signedTransaction = await tronWeb.trx.sign(transaction);
                const result = await tronWeb.trx.sendRawTransaction(
                    signedTransaction
                );
                return {
                    hash: result.transaction.txID,
                    from: tronWeb.defaultAddress.base58 || "",
                    to: params.toAddress,
                    value: BigInt(params.amount),
                    data: params.token,
                };
            }
        } catch (error) {
            throw new Error(`Transfer failed: ${error.message}`);
        }
    }
}

const buildTransferDetails = async (
    state: State,
    runtime: IAgentRuntime
): Promise<TransferParams> => {
    state.supportedChains = "tron";

    const context = composeContext({
        state,
        template: transferTemplate,
    });

    const transferDetails: TransferParams = await generateObjectDeprecated({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
    });

    return transferDetails;
};

export const transferAction: Action = {
    name: "transfer",
    description: "Transfer tokens between addresses on the same chain",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options,
        callback?: HandlerCallback
    ) => {
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        console.log("Transfer action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const action = new TransferAction(walletProvider);

        // Compose transfer context
        const paramOptions = await buildTransferDetails(state, runtime);

        try {
            const transferResp = await action.transfer(paramOptions);
            if (callback) {
                callback({
                    text: `Successfully transferred ${paramOptions.amount} TRX to ${paramOptions.toAddress}\nTransaction Hash: ${transferResp.hash}`,
                    content: {
                        success: true,
                        hash: transferResp.hash,
                        amount: paramOptions.amount,
                        recipient: transferResp.to,
                        chain: "tron",
                    },
                });
            }
            return true;
        } catch (error) {
            console.error("Error during token transfer:", error);
            if (callback) {
                callback({
                    text: `Error transferring tokens: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("TRON_PRIVATE_KEY");
        return typeof privateKey === "string" && privateKey.length > 0;
    },
    examples: [
        [
            {
                user: "assistant",
                content: {
                    text: "I'll help you transfer 100 TRX to TJ5qaZYzC7YQwZTSjtYsS7ZxE7DRohU5s3",
                    action: "SEND_TOKENS",
                },
            },
            {
                user: "user",
                content: {
                    text: "Transfer 100 TRX to TJ5qaZYzC7YQwZTSjtYsS7ZxE7DRohU5s3",
                    action: "SEND_TOKENS",
                },
            },
        ],
    ],
    similes: ["SEND_TOKENS", "TOKEN_TRANSFER", "MOVE_TOKENS"],
};
