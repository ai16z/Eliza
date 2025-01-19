import { elizaLogger } from "@elizaos/core";
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
import { generateObjectDeprecated } from "@elizaos/core";
import {
    Account,
    Aptos,
    AptosConfig,
    Ed25519PrivateKey,
    type Network,
    PrivateKey,
    PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { walletProvider } from "../providers/wallet";

export interface TransferContent extends Content {
    recipient: string;
    amount: string | number;
}

function isTransferContent(content: any): content is TransferContent {
    elizaLogger.log("Content for transfer", content);
    return (
        typeof content.recipient === "string" &&
        (typeof content.amount === "string" ||
            typeof content.amount === "number")
    );
}

const transferTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "recipient": "0x2badda48c062e861ef17a96a806c451fd296a49f45b272dee17f85b0e32663fd",
    "amount": "1000"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token transfer:
- Recipient wallet address
- Amount to transfer

Respond with a JSON markdown block containing only the extracted values.`;

export default {
    name: "SEND_TOKEN",
    similes: [
        "TRANSFER_TOKEN",
        "TRANSFER_TOKENS",
        "SEND_TOKENS",
        "SEND_APT",
        "PAY",
    ],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Validating apt transfer from user:", message.userId);
        //add custom validate logic here
        /*
            const adminIds = runtime.getSetting("ADMIN_USER_IDS")?.split(",") || [];
            //elizaLogger.log("Admin IDs from settings:", adminIds);

            const isAdmin = adminIds.includes(message.userId);

            if (isAdmin) {
                //elizaLogger.log(`Authorized transfer from user: ${message.userId}`);
                return true;
            }
            else
            {
                //elizaLogger.log(`Unauthorized transfer attempt from user: ${message.userId}`);
                return false;
            }
            */
        return false;
    },
    description: "Transfer tokens from the agent's wallet to another address",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting SEND_TOKEN handler...");

        const walletInfo = await walletProvider.get(runtime, message, state);
        state.walletInfo = walletInfo;

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
        const content = await generateObjectDeprecated({
            runtime,
            context: transferContext,
            modelClass: ModelClass.SMALL,
        });

        // Validate transfer content
        if (!isTransferContent(content)) {
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
            const privateKey = runtime.getSetting("APTOS_PRIVATE_KEY");
            const aptosAccount = Account.fromPrivateKey({
                privateKey: new Ed25519PrivateKey(
                    PrivateKey.formatPrivateKey(
                        privateKey,
                        PrivateKeyVariants.Ed25519
                    )
                ),
            });
            const network = runtime.getSetting("APTOS_NETWORK") as Network;
            const aptosClient = new Aptos(
                new AptosConfig({
                    network,
                })
            );

            const APT_DECIMALS = 8;
            const adjustedAmount = BigInt(
                Number(content.amount) * Math.pow(10, APT_DECIMALS)
            );
            elizaLogger.log(
                `Transferring: ${content.amount} tokens (${adjustedAmount} base units)`
            );

            const tx = await aptosClient.transaction.build.simple({
                sender: aptosAccount.accountAddress.toStringLong(),
                data: {
                    function: "0x1::aptos_account::transfer",
                    typeArguments: [],
                    functionArguments: [content.recipient, adjustedAmount],
                },
            });
            const committedTransaction =
                await aptosClient.signAndSubmitTransaction({
                    signer: aptosAccount,
                    transaction: tx,
                });
            const executedTransaction = await aptosClient.waitForTransaction({
                transactionHash: committedTransaction.hash,
            });

            elizaLogger.log("Transfer successful:", executedTransaction.hash);

            if (callback) {
                callback({
                    text: `Successfully transferred ${content.amount} APT to ${content.recipient}, Transaction: ${executedTransaction.hash}`,
                    content: {
                        success: true,
                        hash: executedTransaction.hash,
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
                    text: "Send 69 APT tokens to 0x4f2e63be8e7fe287836e29cde6f3d5cbc96eefd0c0e3f3747668faa2ae7324b0",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll send 69 APT tokens now...",
                    action: "SEND_TOKEN",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Successfully sent 69 APT tokens to 0x4f2e63be8e7fe287836e29cde6f3d5cbc96eefd0c0e3f3747668faa2ae7324b0, Transaction: 0x39a8c432d9bdad993a33cc1faf2e9b58fb7dd940c0425f1d6db3997e4b4b05c0",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
