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
import { getTxReceipt, depositBTC } from "../utils";
import type { Hash } from "viem";
import { validateB2NetworkConfig } from "../environment";
import { stakeTemplate } from "../templates";
import type { WalletProvider } from "../providers";
import type { StakeParams } from "../types";
import { initWalletProvider } from "../providers";
import { FARM_ADDRESS } from "../utils/constants";

// Exported for tests
export class StakeAction {

    constructor(private walletProvider: WalletProvider) {}

    async stake(params: StakeParams): Promise<Hash> {
        try {
            const balance = await this.walletProvider.getNativeBalance(this.walletProvider.getAddress());
            if ( balance == BigInt(0) ) {
                throw new Error(`The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.`);
            }
            const txHash = await depositBTC(
                this.walletProvider,
                FARM_ADDRESS,
                params.amount,
            );
            return txHash;
        } catch(error) {
            elizaLogger.error(`Stake failed: ${error.message}`);
            throw new Error(`Stake failed: ${error.message}`);
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

    async buildStakeDetails(
        state: State,
        runtime: IAgentRuntime,
    ): Promise<StakeParams> {
        const context = composeContext({
            state,
            template: stakeTemplate,
        });

        const stakeDetails = (await generateObjectDeprecated({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
        })) as StakeParams;

        return stakeDetails;
    }
}

export const stakeAction: Action = {
    name: "STAKE",
    similes: [
        "STAKE_BTC_ON_B2",
        "STAKE_NATIVE_BTC_ON_B2",
        "DEPOSIT_BTC_ON_B2",
        "DEPOSIT_NATIVE_BTC_ON_B2",
    ],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validateB2NetworkConfig(runtime);
        return true;
    },
    description:
        "stake B2-BTC.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.debug("Starting STAKE handler...");

        // Initialize or update state
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        elizaLogger.debug("stake action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const action = new StakeAction(walletProvider);

        // Compose stake context
        const paramOptions = await action.buildStakeDetails(
            state,
            runtime,
        );

        elizaLogger.debug("Stake paramOptions:", paramOptions);

        const txHash = await action.stake(paramOptions);
        if (txHash) {
            const result = await action.txReceipt(txHash);
            if (result) {
                callback?.({
                    text: "stake successful",
                    content: { success: true, txHash: txHash },
                });
            } else {
                callback?.({
                    text: "stake failed",
                    content: { error: "Stake failed" },
                });
            }
        } else {
            callback?.({
                text: "stake failed",
                content: { error: "Stake failed" },
            });
        }
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Stake 1 B2-BTC",
                },
            },
        ],
    ] as ActionExample[][],
};
