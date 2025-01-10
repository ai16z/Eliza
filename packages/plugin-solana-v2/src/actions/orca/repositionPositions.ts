import { Action, composeContext, elizaLogger, generateObjectArray, HandlerCallback, IAgentRuntime, Memory, ModelClass, settings, State } from "@elizaos/core";
import { fetchPosition, fetchWhirlpool, getPositionAddress } from "@orca-so/whirlpools-client";
import { address, createSolanaRpc, IInstruction } from "@solana/web3.js";
import { loadWallet } from "../../utils/loadWallet";
import { sqrtPriceToPrice } from "@orca-so/whirlpools-core";
import { fetchMint } from "@solana-program/token-2022";
import { closePositionInstructions, IncreaseLiquidityQuoteParam, openPositionInstructions } from "@orca-so/whirlpools";
import { sendTransaction } from "../../utils/sendTransaction";

interface RepositionPositionParams {
    positionMint: string;
    positionWidthBps: number;
}

function isRepositionPositionParams(
    content: any
) : content is RepositionPositionParams {
    return (
        typeof content.positionMint === "string" &&
        typeof content.positionWidthBps === "number"
    );
}

export const repositionPosition: Action = {
    name: 'reposition_position',
    similes: ["REPOSITION_POSTION", "REPOSITION", "REPOSITION_LIQUIDITY_POSITION"],
    description: "Reposition a liquidity position when it drifts too far from the pool price",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
      return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Start repositioning position");

        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const repositionLiquidityPositionsContext = composeContext({
            state,
            template: `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

            Example response:
            \`\`\`json
            {
                "positionMint": "BieefG47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8pump",
                "positionWidthBps": 500
            }
            \`\`\`
            `,
        });

        const content = await generateObjectArray({
            runtime,
            context: repositionLiquidityPositionsContext,
            modelClass: ModelClass.LARGE,
        });

        if(!isRepositionPositionParams(content)) {
            if (callback) {
                callback({
                    text: "Unable to reposition liquidity position. Invalid content provided.",
                    content: { error: "Invalid reposition position content" },
                });
            }
            return false;
        }

        try {
            const { signer: wallet } = await loadWallet(
                runtime,
                true
            );
            const rpc = createSolanaRpc(settings.RPC_URL!);
            const slippage = 250;

            const positionMintAddress = address(content.positionMint);
            const positionAddress = (await getPositionAddress(positionMintAddress))[0];
            const position = await fetchPosition(rpc, positionAddress);
            const whirlpoolAddress = position.data.whirlpool;
            const whirlpool = await fetchWhirlpool(rpc, whirlpoolAddress);
            const mintA = await fetchMint(rpc, whirlpool.data.tokenMintA);
            const mintB = await fetchMint(rpc, whirlpool.data.tokenMintB);
            const currentPrice = sqrtPriceToPrice(whirlpool.data.sqrtPrice, mintA.data.decimals, mintB.data.decimals);
            const newLowerPrice = currentPrice * (1 - content.positionWidthBps / 10000);
            const newUpperPrice = currentPrice * (1 + content.positionWidthBps / 10000);

            let instructions: IInstruction[] = [];
            const { instructions: closeInstructions, quote } = await closePositionInstructions(
                rpc,
                positionMintAddress,
                slippage,
                wallet,
            )
            instructions = instructions.concat(closeInstructions);

            const increaseLiquidityQuoteParam: IncreaseLiquidityQuoteParam = {
                liquidity: quote.liquidityDelta
            }

            const { instructions: openInstructions, positionMint: newPositionMintAddress } = await openPositionInstructions(
                rpc,
                whirlpoolAddress,
                increaseLiquidityQuoteParam,
                newLowerPrice,
                newUpperPrice,
                slippage,
                wallet,
            )
            instructions = instructions.concat(openInstructions);

            const txId = await sendTransaction(rpc, instructions, wallet);

            const memoryContent = {
                txId,
                success: true,
                closedPosition: positionMintAddress,
                newPosition: newPositionMintAddress,
                timestamp: Date.now()
            }

            if (callback) {
                callback({
                    text: `Closed position ${content.positionMint} and opened new position ${newPositionMintAddress}`,
                    content: memoryContent,
                    action: "REBALANCE_POSITION"
                });
            }
        } catch {
            if (callback) {
                callback({
                    text: "Unable to reposition liquidity position. Invalid content provided.",
                    content: { error: "Invalid reposition content" },
                });
            }
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Reposition position with positionMint: BieefG47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8pump and positionWidthBps: 500",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll set up automated repositioning for your liquidity pool position...",
                    action: "reposition_position",
                },
            },
        ],
    ]
  };