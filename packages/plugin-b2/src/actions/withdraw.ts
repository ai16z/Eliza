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
import { getTxReceipt, withdraw } from "../utils";
import type { Hash } from "viem";
import { validateB2NetworkConfig } from "../environment";
import { withdrawTemplate } from "../templates";
import type { WalletProvider } from "../providers";
import type { WithdrawParams } from "../types";
import { initWalletProvider } from "../providers";
import { FARM_ADDRESS } from "../utils/constants";

// Exported for tests
export class WithdrawAction {

    constructor(private walletProvider: WalletProvider) {}

    async withdraw(_params: WithdrawParams): Promise<Hash> {
        try {
            const balance = await this.walletProvider.getNativeBalance(this.walletProvider.getAddress());
            if ( balance == BigInt(0) ) {
                throw new Error(`The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.`);
            }
            const txHash = await withdraw(
                this.walletProvider,
                FARM_ADDRESS,
            );
            return txHash;
        } catch(error) {
            elizaLogger.log(`Withdraw failed: ${error.message}`);
            throw new Error(`Withdraw failed: ${error.message}`);
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

    async buildWithdrawDetails(
        state: State,
        runtime: IAgentRuntime,
    ): Promise<WithdrawParams> {
        const context = composeContext({
            state,
            template: withdrawTemplate,
        });

        const withdrawDetails = (await generateObjectDeprecated({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
        })) as WithdrawParams;

        return withdrawDetails;
    }
}

export const withdrawAction: Action = {
    name: "WITHDRAW",
    similes: [
        "WITHDRAW_BTC_ON_B2",
        "WITHDRAW_NATIVE_BTC_ON_B2",
        "WITHDRAW_BTC_ON_B2",
        "WITHDRAW_NATIVE_BTC_ON_B2",
    ],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validateB2NetworkConfig(runtime);
        return true;
    },
    description:
        "withdraw B2-BTC.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.debug("Starting WITHDRAW handler...");

        // Initialize or update state
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        elizaLogger.debug("withdraw action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const action = new WithdrawAction(walletProvider);

        // Compose unstake context
        const paramOptions = await action.buildWithdrawDetails(
            state,
            runtime,
        );
        elizaLogger.debug("Unstake paramOptions:", paramOptions);

        const txHash = await action.withdraw(paramOptions);
        if (txHash) {
            const result = await action.txReceipt(txHash);
            if (result) {
                callback?.({
                    text: "withdraw successful",
                    content: { success: true, txHash: txHash },
                });
            } else {
                callback?.({
                    text: "withdraw failed",
                    content: { error: "Withdraw failed" },
                });
            }
        } else {
            callback?.({
                text: "withdraw failed",
                content: { error: "Withdraw failed" },
            });
        }
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Withdraw B2-BTC",
                },
            },
        ],
    ] as ActionExample[][],
};
