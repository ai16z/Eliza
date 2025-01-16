import {
    composeContext,
    elizaLogger,
    generateObjectDeprecated,
    ModelClass,
    type IAgentRuntime,
    type Memory,
    type State,
} from "@elizaos/core";
import { BigNumber } from "tronweb";
import factoryAbi from "../abis/sunswap_v2_factory";
import pairAbi from "../abis/sunswap_v2_pair";
import routerAbi from "../abis/sunswap_v2_router";

import {
    SUNSWAPV2_FACTORY,
    SUNSWAPV2_ROUTER,
    SWAP_FEE_LIMIT,
    WRAPPED_TRX_ADDRESS,
} from "../constants";
import { initWalletProvider, WalletProvider } from "../providers/wallet";
import { swapTemplate } from "../templates";
import type { SwapParams, Transaction } from "../types";

export { swapTemplate };

export class SwapAction {
    constructor(private walletProvider: WalletProvider) {}

    async swap(params: SwapParams): Promise<Transaction> {
        const tronWeb = this.walletProvider.tronWeb;
        const fromAddress = tronWeb.defaultAddress.base58;

        const fromAmount = new BigNumber(
            tronWeb.toSun(parseFloat(params.amount))
        ).toNumber();

        const router = tronWeb.contract(routerAbi, SUNSWAPV2_ROUTER);
        const deadline = Date.now() + 60000;

        elizaLogger.log(
            `Performing swap on TRON\nFrom: ${params.fromToken}\nTo: ${params.toToken}\nAmount: ${params.amount} (${fromAmount})`
        );
        if (!fromAddress) {
            throw new Error("No address found");
        }

        if (!params.fromToken) {
            params.fromToken = WRAPPED_TRX_ADDRESS;
        }

        const minAmountOut = await this.getAmountOut(
            fromAmount,
            params.fromToken,
            params.toToken,
            params.slippage
        );

        let hash;
        if (params.fromToken === WRAPPED_TRX_ADDRESS) {
            hash = await router.methods
                .swapExactETHForTokens(
                    minAmountOut,
                    [params.fromToken, params.toToken],
                    fromAddress,
                    deadline
                )
                .send({
                    feeLimit: SWAP_FEE_LIMIT,
                    callValue: fromAmount,
                });
        } else {
            const tokenAllowance = await this.walletProvider.allowance(
                params.fromToken,
                fromAddress,
                SUNSWAPV2_ROUTER
            );
            if (tokenAllowance < fromAmount) {
                await this.walletProvider.approve(
                    params.fromToken,
                    SUNSWAPV2_ROUTER,
                    BigInt(fromAmount)
                );
            }
            if (params.toToken === WRAPPED_TRX_ADDRESS) {
                hash = await router.methods
                    .swapExactTokensForETH(
                        fromAmount,
                        minAmountOut,
                        [params.fromToken, params.toToken],
                        fromAddress,
                        deadline
                    )
                    .send({
                        feeLimit: SWAP_FEE_LIMIT,
                        callValue: 0,
                    });
            } else {
                hash = await router.methods
                    .swapExactTokensForTokens(
                        fromAmount,
                        minAmountOut,
                        [params.fromToken, params.toToken],
                        fromAddress,
                        deadline
                    )
                    .send({
                        feeLimit: SWAP_FEE_LIMIT,
                        callValue: 0,
                    });
            }
        }

        return {
            hash,
            from: fromAddress,
            to: params.toToken,
            value: BigInt(fromAmount.toString()),
        };
    }

    private async findSwapPair(fromToken: string, toToken: string) {
        const factory = this.walletProvider.tronWeb.contract(
            factoryAbi,
            SUNSWAPV2_FACTORY
        );

        const pair = await factory.methods.getPair(fromToken, toToken).call();

        return pair.toString();
    }

    private async getPairReserves(pair: string) {
        const pairContract = this.walletProvider.tronWeb.contract(
            pairAbi,
            pair
        );

        const reserves = await pairContract.methods.getReserves().call();

        if (!reserves) {
            throw new Error("No reserves found");
        }
        const [reserve0, reserve1] = reserves;

        return {
            reserve0: reserve0,
            reserve1: reserve1,
        };
    }

    private async getAmountOut(
        fromAmount: number,
        fromToken: string,
        toToken: string,
        slippage = 0.05
    ) {
        const pair = await this.findSwapPair(fromToken, toToken);

        const { reserve0, reserve1 } = await this.getPairReserves(pair);

        const router = this.walletProvider.tronWeb.contract(
            routerAbi,
            SUNSWAPV2_ROUTER
        );
        const [amountOut] = await router.methods
            .getAmountOut(fromAmount, reserve0, reserve1)
            .call();

        return new BigNumber(amountOut).multipliedBy(1 - slippage).toFixed(0);
    }
}

export const swapAction = {
    name: "swap",
    description: "Swap tokens on the same chain",
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options,
        callback?
    ) => {
        elizaLogger.log("Swap action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const action = new SwapAction(walletProvider);

        // Compose swap context
        const swapContext = composeContext({
            state,
            template: swapTemplate,
        });
        const content = await generateObjectDeprecated({
            runtime,
            context: swapContext,
            modelClass: ModelClass.LARGE,
        });

        const swapOptions: SwapParams = {
            fromToken: content.inputToken,
            toToken: content.outputToken,
            amount: content.amount,
            slippage: content.slippage,
        };

        try {
            const swapResp = await action.swap(swapOptions);
            if (callback) {
                callback({
                    text: `Successfully swapped ${swapOptions.amount} ${swapOptions.fromToken} for ${swapOptions.toToken}\nTransaction Hash: ${swapResp.hash}`,
                    content: {
                        success: true,
                        hash: swapResp.hash,
                        recipient: swapResp.to,
                    },
                });
            }
            return true;
        } catch (error) {
            console.error("Error in swap handler:", error);
            if (callback) {
                callback({ text: `Error: ${error.message}` });
            }
            return false;
        }
    },
    template: swapTemplate,
    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("TRON_PRIVATE_KEY");
        return typeof privateKey === "string" && privateKey.length > 0;
    },
    examples: [
        [
            {
                user: "user",
                content: {
                    text: "Swap 10 TRX to MOON (TJWbDxjh6WeWAFVUGrNx4vMa6YgJnTFNEf)",
                    action: "TOKEN_SWAP",
                },
            },
        ],
    ],
    similes: ["TOKEN_SWAP", "EXCHANGE_TOKENS", "TRADE_TOKENS"],
};
