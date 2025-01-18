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
import { getTxReceipt, unstake } from "../utils";
import type { Hash } from "viem";
import { validateB2NetworkConfig } from "../environment";
import { unstakeTemplate } from "../templates";
import type { WalletProvider } from "../providers";
import type { UnstakeParams } from "../types";
import { initWalletProvider } from "../providers";
import { FARM_ADDRESS } from "../utils/constants";

// Exported for tests
export class UnstakeAction {

    constructor(private walletProvider: WalletProvider) {}

    async unstake(params: UnstakeParams): Promise<Hash> {
        try {
            const balance = await this.walletProvider.getNativeBalance(this.walletProvider.getAddress());
            if ( balance == BigInt(0) ) {
                throw new Error(`The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.`);
            }
            const txHash = await unstake(
                this.walletProvider,
                FARM_ADDRESS,
                params.amount,
            );
            return txHash;
        } catch(error) {
            elizaLogger.error(`Unstake failed: ${error.message}`);
            throw new Error(`Unstake failed: ${error.message}`);
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

    async buildUnstakeDetails(
        state: State,
        runtime: IAgentRuntime,
    ): Promise<UnstakeParams> {
        const context = composeContext({
            state,
            template: unstakeTemplate,
        });

        const unstakeDetails = (await generateObjectDeprecated({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
        })) as UnstakeParams;

        return unstakeDetails;
    }
}

export const unstakeAction: Action = {
    name: "UNSTAKE",
    similes: [
        "UNSTAKE_BTC_ON_B2",
        "UNSTAKE_NATIVE_BTC_ON_B2",
        "UNSTAKE_BTC_ON_B2",
        "UNSTAKE_NATIVE_BTC_ON_B2",
    ],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validateB2NetworkConfig(runtime);
        return true;
    },
    description:
        "unstake B2-BTC.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.debug("Starting UNSTAKE handler...");

        // Initialize or update state
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        elizaLogger.debug("unstake action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const action = new UnstakeAction(walletProvider);

        // Compose unstake context
        const paramOptions = await action.buildUnstakeDetails(
            state,
            runtime,
        );

        elizaLogger.debug("Unstake paramOptions:", paramOptions);

        const txHash = await action.unstake(paramOptions);
        if (txHash) {
            const result = await action.txReceipt(txHash);
            if (result) {
                callback?.({
                    text: "unstake successful",
                    content: { success: true, txHash: txHash },
                });
            } else {
                callback?.({
                    text: "unstake failed",
                    content: { error: "Unstake failed" },
                });
            }
        } else {
            callback?.({
                text: "unstake failed",
                content: { error: "Unstake failed" },
            });
        }
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Unstake 1 B2-BTC",
                },
            },
        ],
    ] as ActionExample[][],
};
