import type { Action } from "@elizaos/core";
import {
    type ActionExample,
    type Content,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    elizaLogger,
    composeContext,
    generateObject,
} from "@elizaos/core";
import { validateCronosZkevmConfig } from "../enviroment";

import {
    type Address,
    createPublicClient,
    erc20Abi,
    http,
    parseEther,
    isAddress,
    parseUnits,
} from "viem";
import { mainnet, cronoszkEVM } from "viem/chains";
import { z } from "zod";
import { ZKCRO_ADDRESS, ERC20_OVERRIDE_INFO } from "../constants";
import { useGetAccount, useGetWalletClient } from "../hooks";
import { normalize } from "viem/ens";
import { ValidateContext } from "../utils";

const ethereumClient = createPublicClient({
    chain: mainnet,
    transport: http(),
});

const TransferSchema = z.object({
    tokenAddress: z.string(),
    recipient: z.string(),
    amount: z.string(),
});

export interface TransferContent extends Content {
    tokenAddress: string;
    recipient: string;
    amount: string | number;
}

const transferTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Here are several frequently used addresses. Use these for the corresponding tokens:
- ZKCRO/zkCRO: 0x000000000000000000000000000000000000800A
- USDC/usdc: 0xaa5b845f8c9c047779bedf64829601d8b264076c
- ETH/eth: 0x898b3560affd6d955b1574d87ee09e46669c60ea

Example response:
\`\`\`json
{
    "tokenAddress": "0xaa5b845f8c9c047779bedf64829601d8b264076c",
    "recipient": "0xCCa8009f5e09F8C5dB63cb0031052F9CB635Af62",
    "amount": "1000"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token transfer:
- Token contract address
- Recipient wallet address
- Amount to transfer

Respond with a JSON markdown block containing only the extracted values.`;

export const TransferAction: Action = {
    name: "SEND_TOKEN",
    similes: [
        "TRANSFER_TOKEN_ON_CRONOSZKEVM",
        "TRANSFER_TOKENS_ON_CRONOSZK",
        "SEND_TOKENS_ON_CRONOSZKEVM",
        "SEND_TOKENS_ON_CRONOSZK",
        "SEND_ETH_ON_CRONOSZKEVM",
        "SEND_ETH_ON_CRONOSZK",
        "PAY_ON_CRONOSZKEVM",
        "PAY_ON_CRONOSZK",
    ],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validateCronosZkevmConfig(runtime);
        return true;
    },
    description: "Transfer tokens from the agent's wallet to another address",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting Cronos zkEVM SEND_TOKEN handler...");

        // Initialize or update state
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        // Compose transfer context
        const transferContext = composeContext({
            state,
            template: transferTemplate,
        });

        // Generate transfer content
        const content = (
            await generateObject({
                runtime,
                context: transferContext,
                modelClass: ModelClass.SMALL,
                schema: TransferSchema,
            })
        ).object as unknown as TransferContent;

        if (!isAddress(content.recipient, { strict: false })) {
            elizaLogger.log("Resolving ENS name...");
            try {
                const name = normalize(content.recipient.trim());
                const resolvedAddress = await ethereumClient.getEnsAddress({
                    name,
                });

                if (isAddress(resolvedAddress, { strict: false })) {
                    elizaLogger.log(`${name} resolved to ${resolvedAddress}`);
                    content.recipient = resolvedAddress;
                }
            } catch (error) {
                elizaLogger.error("Error resolving ENS name:", error);
            }
        }

        // Validate transfer content
        if (!ValidateContext.transferAction(content)) {
            console.error("Invalid content for TRANSFER_TOKEN action.");
            if (callback) {
                callback({
                    text: "Unable to process transfer request. Invalid content provided.",
                    content: { error: "Invalid transfer content" },
                });
            }
            return false;
        }

        try {
            const account = useGetAccount(runtime);
            const walletClient = useGetWalletClient();

            let hash;

            // Check if the token is native
            if (
                content.tokenAddress.toLowerCase() !==
                ZKCRO_ADDRESS.toLowerCase()
            ) {
                // Convert amount to proper token decimals
                const tokenInfo =
                    ERC20_OVERRIDE_INFO[content.tokenAddress.toLowerCase()];
                const decimals = tokenInfo?.decimals ?? 18; // Default to 18 decimals if not specified
                const tokenAmount = parseUnits(
                    content.amount.toString(),
                    decimals
                );

                // Execute ERC20 transfer
                hash = await walletClient.writeContract({
                    account,
                    chain: cronoszkEVM,
                    address: content.tokenAddress as Address,
                    abi: erc20Abi,
                    functionName: "transfer",
                    args: [content.recipient as Address, tokenAmount],
                });
            } else {
                hash = await walletClient.sendTransaction({
                    account: account,
                    chain: cronoszkEVM,
                    to: content.recipient as Address,
                    value: parseEther(content.amount.toString()),
                    kzg: undefined,
                });
            }

            elizaLogger.success(
                "Transfer completed successfully! Transaction hash: " + hash
            );
            if (callback) {
                callback({
                    text:
                        "Transfer completed successfully! Transaction hash: " +
                        hash,
                    content: {},
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error during token transfer:", error);
            if (callback) {
                callback({
                    text: `Error transferring tokens: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send 0.01 ETH to 0x114B242D931B47D5cDcEe7AF065856f70ee278C4",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Sure, I'll send 0.01 ETH to that address now.",
                    action: "SEND_TOKEN",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully sent 0.01 ETH to 0x114B242D931B47D5cDcEe7AF065856f70ee278C4\nTransaction: 0xdde850f9257365fffffc11324726ebdcf5b90b01c6eec9b3e7ab3e81fde6f14b",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send 0.01 ETH to alim.getclave.eth",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Sure, I'll send 0.01 ETH to alim.getclave.eth now.",
                    action: "SEND_TOKEN",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully sent 0.01 ETH to alim.getclave.eth\nTransaction: 0xdde850f9257365fffffc11324726ebdcf5b90b01c6eec9b3e7ab3e81fde6f14b",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send 100 USDC to 0xCCa8009f5e09F8C5dB63cb0031052F9CB635Af62",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Sure, I'll send 100 USDC to that address now.",
                    action: "SEND_TOKEN",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully sent 100 USDC to 0xCCa8009f5e09F8C5dB63cb0031052F9CB635Af62\nTransaction: 0x4fed598033f0added272c3ddefd4d83a521634a738474400b27378db462a76ec",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Please send 100 ZKCRO tokens to 0xbD8679cf79137042214fA4239b02F4022208EE82",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Of course. Sending 100 ZKCRO to that address now.",
                    action: "SEND_TOKEN",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully sent 100 ZKCRO to 0xbD8679cf79137042214fA4239b02F4022208EE82\nTransaction: 0x0b9f23e69ea91ba98926744472717960cc7018d35bc3165bdba6ae41670da0f0",
                },
            },
        ],
    ] as ActionExample[][],
};
