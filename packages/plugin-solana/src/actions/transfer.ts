import {
    getAssociatedTokenAddressSync,
    createTransferInstruction,
} from "@solana/spl-token";
import { elizaLogger, settings } from "@elizaos/core";
import {
    Connection,
    PublicKey,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";
import {
    type ActionExample,
    type Content,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    type Action,
} from "@elizaos/core";
import { composeContext } from "@elizaos/core";
import { getWalletKey } from "../keypairUtils";
import { generateObjectDeprecated } from "@elizaos/core";

export interface TransferContent extends Content {
    tokenAddress: string;
    recipient: string;
    amount: string | number;
}

function isTransferContent(
    runtime: IAgentRuntime,
    content: any
): content is TransferContent {
    elizaLogger.log("Content for transfer", content);
    return (
        typeof content.tokenAddress === "string" &&
        typeof content.recipient === "string" &&
        (typeof content.amount === "string" ||
            typeof content.amount === "number")
    );
}

const transferTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "tokenAddress": "BieefG47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8pump",
    "recipient": "9jW8FPr6BSSsemWPV22UUCzSqkVdTp6HTyPqeqyuBbCa",
    "amount": "1000"
}
\`\`\`

{{recentMessages}}

Extract the following information about the requested token transfer:
- Token contract address
- Recipient wallet address
- Amount to transfer

If no token address is mentioned, respond with null.
`;

export default {
    name: "SEND_TOKEN",
    similes: ["TRANSFER_TOKEN", "TRANSFER_TOKENS", "SEND_TOKENS", "PAY_TOKEN", "PAY_TOKENS", "PAY"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Always return true for token transfers, letting the handler deal with specifics
        elizaLogger.log("Validating token transfer from user:", message.userId);
        return true;
    },
    description: "Transfer SPL tokens from agent's wallet to another address",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting SEND_TOKEN handler...");

        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const transferContext = composeContext({
            state,
            template: transferTemplate,
        });

        const content = await generateObjectDeprecated({
            runtime,
            context: transferContext,
            modelClass: ModelClass.LARGE,
        });

        if (!isTransferContent(runtime, content)) {
            if (callback) {
                callback({
                    text: "Token address needed to send the token.",
                    content: { error: "Invalid transfer content" },
                });
            }
            return false;
        }

        try {
            const { keypair: senderKeypair } = await getWalletKey(runtime, true);
            const connection = new Connection(settings.SOLANA_RPC_URL!);
            const mintPubkey = new PublicKey(content.tokenAddress);
            const recipientPubkey = new PublicKey(content.recipient);

            const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
            const decimals = (mintInfo.value?.data as any)?.parsed?.info?.decimals ?? 9;
            const adjustedAmount = BigInt(Number(content.amount) * Math.pow(10, decimals));

            const senderATA = getAssociatedTokenAddressSync(mintPubkey, senderKeypair.publicKey);
            const recipientATA = getAssociatedTokenAddressSync(mintPubkey, recipientPubkey);

            const instructions = [];

            const recipientATAInfo = await connection.getAccountInfo(recipientATA);
            if (!recipientATAInfo) {
                const { createAssociatedTokenAccountInstruction } = await import("@solana/spl-token");
                instructions.push(
                    createAssociatedTokenAccountInstruction(
                        senderKeypair.publicKey,
                        recipientATA,
                        recipientPubkey,
                        mintPubkey
                    )
                );
            }

            instructions.push(
                createTransferInstruction(
                    senderATA,
                    recipientATA,
                    senderKeypair.publicKey,
                    adjustedAmount
                )
            );

            const messageV0 = new TransactionMessage({
                payerKey: senderKeypair.publicKey,
                recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
                instructions,
            }).compileToV0Message();

            const transaction = new VersionedTransaction(messageV0);
            transaction.sign([senderKeypair]);

            const signature = await connection.sendTransaction(transaction);

            if (callback) {
                callback({
                    text: `Sent ${content.amount} tokens to ${content.recipient}\nTransaction hash: ${signature}`,
                    content: {
                        success: true,
                        signature,
                        amount: content.amount,
                        recipient: content.recipient,
                    },
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error during token transfer:", error);
            if (callback) {
                callback({
                    text: `Issue with the transfer: ${error.message}`,
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
                    text: "Send 69 EZSIS BieefG47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8pump to 9jW8FPr6BSSsemWPV22UUCzSqkVdTp6HTyPqeqyuBbCa",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sending the tokens now...",
                    action: "SEND_TOKEN",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;