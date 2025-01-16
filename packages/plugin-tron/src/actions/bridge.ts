import {
    composeContext,
    elizaLogger,
    generateObjectDeprecated,
    ModelClass,
    type IAgentRuntime,
    type Memory,
    type State,
} from "@elizaos/core";
import { getToken } from "@lifi/sdk";
import axios, { AxiosError } from "axios";
import { parseUnits } from "viem";
import { tron } from "viem/chains";
import { SYMBIOSIS_API, WRAPPED_TRX_ADDRESS } from "../constants";
import {
    SymbiosisSwapRequest,
    SymbiosisSwapResponse,
    SymbiosisToken,
    SymbiosisTokenIn,
} from "../interfaces/symbiosis";
import { initWalletProvider, WalletProvider } from "../providers/wallet";
import { bridgeTemplate } from "../templates";
import type { BridgeParams, Transaction } from "../types";

export { bridgeTemplate };

export class BridgeAction {
    constructor(private walletProvider: WalletProvider) {}

    async bridge(params: BridgeParams): Promise<Transaction> {
        const toChainConfig = this.walletProvider.getChainConfigs(
            params.toChain
        );

        const fromTokenInfo = await this.walletProvider.fetchOnchainToken(
            params.fromToken
        );

        const toTokenInfo = await getToken(toChainConfig.id, params.toToken);
        fromTokenInfo.decimals = fromTokenInfo.decimals.toString();
        const fromAmount = parseUnits(
            params.amount,
            fromTokenInfo.decimals.toString()
        );

        const fromToken: SymbiosisTokenIn = {
            address: params.fromToken,
            chainId: tron.id,
            decimals: parseInt(fromTokenInfo.decimals),
            amount: fromAmount.toString(),
            symbol: fromTokenInfo.symbol,
        };

        const toToken: SymbiosisToken = {
            address: params.toToken,
            chainId: toChainConfig.id,
            decimals: toTokenInfo.decimals,
            symbol: toTokenInfo.symbol,
        };

        const senderAddress = this.walletProvider.getAddress();

        const result = await this.getSwapTransaction({
            tokenOut: toToken,
            tokenAmountIn: fromToken,
            to: params.toAddress,
            from: senderAddress,
            slippage: params.slippage || 300,
        });

        const { tx, approveTo, type } = result;

        if (type !== "tron") {
            throw new Error("This Action only supports TRON wallets.");
        }

        if (!params.fromToken) {
            params.fromToken = WRAPPED_TRX_ADDRESS;
        }

        // Approve the token
        await this.walletProvider.approve(
            params.fromToken,
            approveTo,
            fromAmount
        );

        const { data, feeLimit, from, functionSelector, to, value } = tx;

        const tronWeb = this.walletProvider.tronWeb;

        const triggerResult =
            await tronWeb.transactionBuilder.triggerSmartContract(
                to,
                functionSelector,
                {
                    rawParameter: data,
                    callValue: Number(value),
                    feeLimit: feeLimit,
                },
                [],
                from
            );

        const signedTx = await tronWeb.trx.sign(triggerResult.transaction);
        const sendResult = await tronWeb.trx.sendRawTransaction(signedTx);

        return {
            hash: sendResult.transaction.txID,
            from: senderAddress,
            to: params.toAddress,
            value: BigInt(params.amount),
        };
    }

    private async getSwapTransaction(request: SymbiosisSwapRequest) {
        try {
            const result = await axios.post<SymbiosisSwapResponse>(
                SYMBIOSIS_API,
                request
            );

            return result.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    console.error("error.response", error.response.data);

                    throw new Error(error.response.data);
                }
            }

            throw error;
        }
    }
}

export const bridgeAction = {
    name: "bridge",
    description: "Bridge tokens between different chains using Symbiosis",
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options,
        callback?
    ) => {
        elizaLogger.log("Bridge action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const action = new BridgeAction(walletProvider);

        // Compose bridge context
        const bridgeContext = composeContext({
            state,
            template: bridgeTemplate,
        });
        const content = await generateObjectDeprecated({
            runtime,
            context: bridgeContext,
            modelClass: ModelClass.LARGE,
        });

        const bridgeOptions: BridgeParams = {
            toChain: content.toChain,
            fromToken: content.token,
            toToken: content.token,
            toAddress: content.toAddress,
            amount: content.amount,
            slippage: content.slippage || 300,
        };

        try {
            const bridgeResp = await action.bridge(bridgeOptions);
            if (callback) {
                callback({
                    text: `Successfully bridged ${bridgeOptions.amount} ${bridgeOptions.fromToken} tokens from TRON to ${bridgeOptions.toChain}\nTransaction Hash: ${bridgeResp.hash}`,
                    content: {
                        success: true,
                        hash: bridgeResp.hash,
                        recipient: bridgeResp.to,
                    },
                });
            }
            return true;
        } catch (error) {
            console.error("Error in bridge handler:", error);
            if (callback) {
                callback({ text: `Error: ${error.message}` });
            }
            return false;
        }
    },
    template: bridgeTemplate,
    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("TRON_PRIVATE_KEY");
        return typeof privateKey === "string" && privateKey.length > 0;
    },
    examples: [
        [
            {
                user: "user",
                content: {
                    text: "Bridge 10 USDT (TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t) on TRON to USDC (0xdAC17F958D2ee523a2206206994597C13D831ec7) on Ethereum Mainnet to the address: 0xE11F5d4835B1EAe5E73Be3B516AC8a9A70Be5091",
                    action: "CROSS_CHAIN_TRANSFER",
                },
            },
        ],
    ],
    similes: ["CROSS_CHAIN_TRANSFER", "CHAIN_BRIDGE", "MOVE_CROSS_CHAIN"],
};
