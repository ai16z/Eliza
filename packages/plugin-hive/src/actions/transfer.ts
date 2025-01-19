import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
} from "@elizaos/core";
import { Client, PrivateKey } from "@hiveio/dhive";
import { TransferContentSchema, TRANSFER_ACTIONS } from "./defs";
import { validateHiveConfig } from "../environment";

const VALID_CURRENCIES = ["HIVE", "HBD"];
const MIN_TRANSFER_AMOUNT = 0.001;

export const transferToken: Action = {
    name: TRANSFER_ACTIONS[0],
    description: "Transfer HIVE or HBD tokens to another account",
    similes: [
        "Send HIVE to another user",
        "Transfer HBD to an account",
        "Send cryptocurrency on Hive",
        "Make a payment in HIVE or HBD",
    ],
    examples: [
        [
            {
                user: "alice",
                content: {
                    text: "send 10 HIVE to @bob",
                    action: "SEND_TOKEN",
                    to: "bob",
                    amount: "10.000 HIVE",
                    memo: "Payment for services",
                },
            },
        ],
        [
            {
                user: "charlie",
                content: {
                    text: "transfer 5 HBD to @dave",
                    action: "TRANSFER_TOKEN",
                    to: "dave",
                    amount: "5.000 HBD",
                    memo: "Monthly subscription",
                },
            },
        ],
    ],
    validate: async (
        runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> => {
        try {
            const content = message.content;
            await TransferContentSchema.parseAsync(content);

            // Additional validation for amount and currency
            const [amountStr, currency] = (content.amount as string).split(" ");
            const amount = parseFloat(amountStr);

            if (!VALID_CURRENCIES.includes(currency)) {
                throw new Error(
                    `Invalid currency. Must be one of: ${VALID_CURRENCIES.join(", ")}`
                );
            }

            if (isNaN(amount) || amount < MIN_TRANSFER_AMOUNT) {
                throw new Error(
                    `Invalid amount. Must be at least ${MIN_TRANSFER_AMOUNT}`
                );
            }

            return true;
        } catch {
            return false;
        }
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<unknown> => {
        try {
            const config = await validateHiveConfig(runtime);
            const validatedContent = TransferContentSchema.parse(
                message.content
            );

            const client = new Client([config.HIVE_API_NODE]);

            // Parse and validate the amount and currency
            const [amountStr, currency] = validatedContent.amount.split(" ");
            const amount = parseFloat(amountStr);

            // Additional validation checks
            if (!VALID_CURRENCIES.includes(currency)) {
                throw new Error(
                    `Invalid currency. Must be one of: ${VALID_CURRENCIES.join(", ")}`
                );
            }

            if (isNaN(amount) || amount < MIN_TRANSFER_AMOUNT) {
                throw new Error(
                    `Invalid amount. Must be at least ${MIN_TRANSFER_AMOUNT}`
                );
            }

            // Check account balance before transfer
            const [account] = await client.database.getAccounts([
                config.HIVE_ACCOUNT,
            ]);
            const accountBalance = parseFloat(
                currency === "HIVE"
                    ? (account.balance as string).split(" ")[0]
                    : (account.hbd_balance as string).split(" ")[0]
            );

            if (accountBalance < amount) {
                throw new Error(
                    `Insufficient balance. Available: ${accountBalance} ${currency}`
                );
            }

            // Ensure we're using the active key for transfers
            if (!config.HIVE_ACTIVE_KEY) {
                throw new Error("Active key required for token transfers");
            }

            const transfer = await client.broadcast.transfer(
                {
                    from: config.HIVE_ACCOUNT,
                    to: validatedContent.to,
                    amount: validatedContent.amount,
                    memo: validatedContent.memo || "",
                },
                PrivateKey.fromString(config.HIVE_ACTIVE_KEY)
            );

            const response = {
                success: true,
                data: {
                    transactionId: transfer.id,
                    from: config.HIVE_ACCOUNT,
                    to: validatedContent.to,
                    amount: validatedContent.amount,
                    memo: validatedContent.memo,
                    remainingBalance: `${(accountBalance - amount).toFixed(3)} ${currency}`,
                },
            };

            // If there's a callback, use it
            if (callback) {
                await callback(
                    {
                        text: `Successfully transferred ${validatedContent.amount} to @${validatedContent.to}${
                            validatedContent.memo
                                ? ` with memo: ${validatedContent.memo}`
                                : ""
                        }. Remaining balance: ${response.data.remainingBalance}`,
                        action: message.content.action,
                    },
                    undefined
                );
            }

            return response;
        } catch (error) {
            throw new Error(`Transfer failed: ${error.message}`);
        }
    },
};
