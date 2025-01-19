import {
    elizaLogger,
    type ActionExample,
    type Content,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    generateObject,
    composeContext,
    type Action,
} from "@elizaos/core";
import { WalletProvider } from "../providers/wallet";
import { validateMultiversxConfig } from "../enviroment";
import { createTokenSchema } from "../utils/schemas";
export interface CreateTokenContent extends Content {
    tokenName: string;
    tokenTicker: string;
    decimals: string;
    amount: string;
}

function isCreateTokenContent(
    runtime: IAgentRuntime,
    content: CreateTokenContent
) {
    console.log("Content for create token", content);
    return content.tokenName && content.tokenName && content.tokenName;
}

const createTokenTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "tokenName": "TEST",
    "tokenTicker": "TST",
    "amount: 100,
    "decimals": 18
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token creation:
- Token name
- Token ticker
- Amount
- Decimals

Respond with a JSON markdown block containing only the extracted values.`;

export default {
    name: "CREATE_TOKEN",
    similes: ["DEPLOY_TOKEN"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        console.log("Validating config for user:", message.userId);
        await validateMultiversxConfig(runtime);
        return true;
    },
    description: "Create a new token.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting CREATE_TOKEN handler...");

        // Initialize or update state
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        // Compose transfer context
        const transferContext = composeContext({
            state,
            template: createTokenTemplate,
        });

        // Generate transfer content
        const content = await generateObject({
            runtime,
            context: transferContext,
            modelClass: ModelClass.SMALL,
            schema: createTokenSchema,
        });

        const payload = content.object as CreateTokenContent;

        // Validate transfer content
        if (!isCreateTokenContent(runtime, payload)) {
            console.error("Invalid content for CREATE_TOKEN action.");
            if (callback) {
                callback({
                    text: "Unable to process transfer request. Invalid content provided.",
                    content: { error: "Invalid transfer content" },
                });
            }
            return false;
        }

        try {
            const privateKey = runtime.getSetting("MVX_PRIVATE_KEY");
            const network = runtime.getSetting("MVX_NETWORK");

            const walletProvider = new WalletProvider(privateKey, network);

            await walletProvider.createESDT({
                tokenName: payload.tokenName,
                amount: payload.amount,
                decimals: Number(payload.decimals) || 18,
                tokenTicker: payload.tokenTicker,
            });
            return true;
        } catch (error) {
            console.error("Error during creating token:", error);
            if (callback) {
                callback({
                    text: `Error creating token: ${error.message}`,
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
                    text: "Create a token XTREME with ticker XTR and supply of 10000",
                    action: "CREATE_TOKEN",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Succesfully created token.",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a token TEST with ticker TST, 18 decimals and supply of 10000",
                    action: "CREATE_TOKEN",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Succesfully created token.",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
