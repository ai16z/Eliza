// createGenericAction.ts
import {
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    elizaLogger,
    composeContext,
    type Action,
    generateObjectDeprecated,
} from "@elizaos/core";
import { InjectiveGrpcClient } from "@injective/modules";

/**
 * Shape of the arguments to create our generic action.
 *
 * @property {string} name - The action name (e.g., "PLACE_BID", "CANCEL_BID").
 * @property {string} description - A brief summary of what the action does.
 * @property {unknown} template - A template object (e.g., from @injective/template/auction) used for context composition.
 * @property {any[]} examples - The example user/assistant interactions you want associated with this action.
 * @property {string} functionName - The name of the method you want to call on `InjectiveGrpcClient` (e.g. `"msgBid"`).
 * @property {(runtime: IAgentRuntime, content: any) => boolean} validateContent - Function to validate the AI-generated content.
 */
export interface CreateGenericActionArgs {
    name: string;
    similes: string[]; // (optional) synonyms or alternate names if you like
    description: string;
    template: string;
    examples: any[];
    functionName: string; // e.g. "msgBid"
    validateContent: (runtime: IAgentRuntime, content: any) => boolean;
}

/**
 * A factory function that returns an ElizaOS Action.
 */
export function createGenericAction({
    name,
    description,
    template,
    examples,
    functionName,
    similes,
    //validateContent,
}: CreateGenericActionArgs): Action {
    return {
        name, // e.g. "PLACE_BID"
        description, // e.g. "Place a bid using the InjectiveGrpcClient"
        examples, // your example user/assistant conversation
        similes, // (optional) synonyms or alternate names if you like
        // (Optional) global validation for the entire Action
        validate: async (_runtime, _message) => {
            return true;
        },

        handler: async (
            runtime: IAgentRuntime,
            message: Memory,
            state: State,
            _options: { [key: string]: unknown },
            callback?: HandlerCallback
        ): Promise<boolean> => {
            elizaLogger.log(`Starting ${name} handler...`);
            elizaLogger.debug(`create action: ${name}`);
            // 1. Compose or update the state
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }

            // 2. Compose a context from the given template
            const context = composeContext({
                state,
                template,
            });

            // 3. Use the AI model to generate content based on the context
            const content = await generateObjectDeprecated({
                runtime,
                context,
                modelClass: ModelClass.LARGE,
            });

            // 4. TODO: Validate the LLM context
            // if (!validateContent(runtime, content)) {
            //   elizaLogger.error(`Invalid content for ${name} action.`);
            //   if (callback) {
            //     callback({
            //       text: `Invalid content for ${name}`,
            //       content: {},
            //     });
            //   }
            //   return false;
            // }

            // 5. Initialize the Injective client
            try {
                const rawNetwork = runtime.getSetting("INJECTIVE_NETWORK");
                const injectivePrivateKey = runtime.getSetting(
                    "INJECTIVE_PRIVATE_KEY"
                );
                const ethPublicKey = runtime.getSetting("EVM_PUBLIC_KEY");
                const injPublicKey = runtime.getSetting("INJECTIVE_PUBLIC_KEY");
                const network = rawNetwork as
                    | "MainnetK8s"
                    | "MainnetLB"
                    | "Mainnet"
                    | "MainnetSentry"
                    | "MainnetOld"
                    | "Staging"
                    | "Internal"
                    | "TestnetK8s"
                    | "TestnetOld"
                    | "TestnetSentry"
                    | "Testnet"
                    | "Devnet1"
                    | "Devnet2"
                    | "Devnet"
                    | "Local";
                if (
                    !injectivePrivateKey ||
                    (!ethPublicKey && !injPublicKey) ||
                    !network
                ) {
                    throw new Error("Incorrect configuration");
                }

                const client = new InjectiveGrpcClient(
                    network,
                    injectivePrivateKey,
                    ethPublicKey,
                    injPublicKey
                );

                // 6. Dynamically call the specified functionName on the Injective client
                const method = (client as any)[functionName];
                if (typeof method !== "function") {
                    throw new Error(
                        `Method "${functionName}" does not exist on InjectiveGrpcClient`
                    );
                }
                //Function that the LLM extracted
                const params = content.function_args;
                //Need to standardize this context params
                const response = await method(params);

                // 7. Trigger any callback with success/failure info
                if (callback) {
                    if (response.success) {
                        callback({
                            text: `Operation ${name} succeeded.\nTxHash: ${response.result.txHash}`,
                            content: response.result,
                        });
                    } else {
                        callback({
                            text: `Operation ${name} failed.\n${response.result.rawLog}`,
                            content: response.result,
                        });
                    }
                }

                // Return true if code == 0 (success), else false
                return response.result.code === 0;
            } catch (error) {
                if (callback) {
                    callback({
                        text: `Error in ${name}: ${(error as Error).message}`,
                        content: { error: (error as Error).message },
                    });
                }
                return false;
            }
        },
    };
}
