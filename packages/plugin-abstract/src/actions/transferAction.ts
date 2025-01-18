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
import { validateAbstractConfig } from "../environment";

import {
    type Address,
    erc20Abi,
    http,
    parseEther,
    isAddress,
    parseUnits,
    createPublicClient,
} from "viem";
import { abstractTestnet, mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { createAbstractClient } from "@abstract-foundation/agw-client";
import { z } from "zod";
import { ValidateContext } from "../utils";
import { ETH_ADDRESS, ERC20_OVERRIDE_INFO } from "../constants";
import { useGetAccount, useGetWalletClient } from "../hooks";

const ethereumClient = createPublicClient({
    chain: mainnet,
    transport: http(),
});

const TransferSchema = z.object({
    tokenAddress: z.string(),
    recipient: z.string(),
    amount: z.string(),
    useAGW: z.boolean(),
});

export interface TransferContent extends Content {
    tokenAddress: string;
    recipient: string;
    amount: string | number;
    useAGW: boolean;
}

const transferTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Here are several frequently used addresses. Use these for the corresponding tokens:
- ETH/eth: 0x000000000000000000000000000000000000800A
- USDC/usdc: 0xe4c7fbb0a626ed208021ccaba6be1566905e2dfc

Example response:
\`\`\`json
{
    "tokenAddress": "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E",
    "recipient": "0xCCa8009f5e09F8C5dB63cb0031052F9CB635Af62",
    "amount": "1000",
    "useAGW": true
}
\`\`\`

User message:
"{{currentMessage}}"

Given the message, extract the following information about the requested token transfer:
- Token contract address
- Recipient wallet address
- Amount to transfer
- Whether to use Abstract Global Wallet aka AGW

If the user did not specify "global wallet", "AGW", "agw", or "abstract global wallet" in their message, set useAGW to false, otherwise set it to true.

Respond with a JSON markdown block containing only the extracted values.`;

export const transferAction: Action = {
    name: "SEND_TOKEN",
    similes: [
        "TRANSFER_TOKEN_ON_ABSTRACT",
        "TRANSFER_TOKENS_ON_ABSTRACT",
        "SEND_TOKENS_ON_ABSTRACT",
        "SEND_ETH_ON_ABSTRACT",
        "PAY_ON_ABSTRACT",
        "MOVE_TOKENS_ON_ABSTRACT",
        "MOVE_ETH_ON_ABSTRACT",
    ],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        await validateAbstractConfig(runtime);
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
        elizaLogger.log("Starting Abstract SEND_TOKEN handler...");

        // Initialize or update state
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        // Compose transfer context
        state.currentMessage = `${state.recentMessagesData[1].content.text}`;
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
            elizaLogger.error("Invalid content for TRANSFER_TOKEN action.");
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
            let hash;
            if (content.useAGW) {
                const abstractClient = await createAbstractClient({
                    chain: abstractTestnet,
                    signer: account,
                });

                // Handle AGW transfer based on token type
                if (
                    content.tokenAddress.toLowerCase() !==
                    ETH_ADDRESS.toLowerCase()
                ) {
                    const tokenInfo =
                        ERC20_OVERRIDE_INFO[content.tokenAddress.toLowerCase()];
                    const decimals = tokenInfo?.decimals ?? 18;
                    const tokenAmount = parseUnits(
                        content.amount.toString(),
                        decimals
                    );

                    // @ts-ignore - will fix later
                    hash = await abstractClient.writeContract({
                        chain: abstractTestnet,
                        address: content.tokenAddress as Address,
                        abi: erc20Abi,
                        functionName: "transfer",
                        args: [content.recipient as Address, tokenAmount],
                    });
                } else {
                    // @ts-ignore
                    hash = await abstractClient.sendTransaction({
                        chain: abstractTestnet,
                        to: content.recipient as Address,
                        value: parseEther(content.amount.toString()),
                        kzg: undefined,
                    });
                }
            } else {
                const walletClient = useGetWalletClient();

                // Handle regular wallet transfer based on token type
                if (
                    content.tokenAddress.toLowerCase() !==
                    ETH_ADDRESS.toLowerCase()
                ) {
                    const tokenInfo =
                        ERC20_OVERRIDE_INFO[content.tokenAddress.toLowerCase()];
                    const decimals = tokenInfo?.decimals ?? 18;
                    const tokenAmount = parseUnits(
                        content.amount.toString(),
                        decimals
                    );

                    hash = await walletClient.writeContract({
                        account,
                        chain: abstractTestnet,
                        address: content.tokenAddress as Address,
                        abi: erc20Abi,
                        functionName: "transfer",
                        args: [content.recipient as Address, tokenAmount],
                    });
                } else {
                    hash = await walletClient.sendTransaction({
                        account,
                        chain: abstractTestnet,
                        to: content.recipient as Address,
                        value: parseEther(content.amount.toString()),
                        kzg: undefined,
                    });
                }
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
                    text: "Send 0.01 ETH to 0x114B242D931B47D5cDcEe7AF065856f70ee278C4 using your abstract global wallet",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Sure, I'll send 0.01 ETH to that address now using my AGW.",
                    action: "SEND_TOKEN",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully sent 0.01 ETH to 0x114B242D931B47D5cDcEe7AF065856f70ee278C4\nTransaction: 0xdde850f9257365fffffc11324726ebdcf5b90b01c6eec9b3e7ab3e81fde6f14b using my AGW",
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
                    text: "Please send 0.1 ETH to 0xbD8679cf79137042214fA4239b02F4022208EE82",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Of course. Sending 0.1 ETH to that address now.",
                    action: "SEND_TOKEN",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully sent 0.1 ETH to 0xbD8679cf79137042214fA4239b02F4022208EE82\nTransaction: 0x0b9f23e69ea91ba98926744472717960cc7018d35bc3165bdba6ae41670da0f0",
                },
            },
        ],
    ] as ActionExample[][],
};
