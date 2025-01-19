import { type Action, elizaLogger } from "@elizaos/core";
import type { IAgentRuntime, Memory, State, HandlerCallback, Content, ActionExample } from "@elizaos/core";
import { DirectSecp256k1HdWallet, Registry, type EncodeObject } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { MsgCloseDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { getAkashTypeRegistry, getTypeUrl } from "@akashnetwork/akashjs/build/stargate";
import { validateAkashConfig } from "../environment";
import { AkashError, AkashErrorCode } from "../error/error";
import { encodingForModel } from "js-tiktoken";

/*
interface AkashMessage {
    typeUrl: string;
    value: {
        id?: {
            owner: string;
            dseq: string;
        };
        [key: string]: unknown;
    };
}
*/

interface EstimateGasContent extends Content {
    text: string;
    dseq?: string;
    operation: "close" | "create" | "update";
    message?: EncodeObject;
}

function getTotalTokensFromString(str: string): number {
    try {
        const encoding = encodingForModel("gpt-3.5-turbo");
        return encoding.encode(str).length;
    } catch (error) {
        elizaLogger.warn("Failed to count tokens", { error });
        return 0;
    }
}

export const estimateGas: Action = {
  name: "ESTIMATE_GAS",
  similes: ["CALCULATE_GAS", "GET_GAS_ESTIMATE", "CHECK_GAS"],
  description: "Estimate gas for a transaction on Akash Network",
  examples: [[
    {
      user: "user",
      content: {
        text: "Can you estimate gas for closing deployment with DSEQ 123456?",
        operation: "close"
      } as EstimateGasContent
    } as ActionExample
  ]],

  validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
    elizaLogger.debug("Validating gas estimation request", { message });
    try {
      const params = message.content as Partial<EstimateGasContent>;
      const config = await validateAkashConfig(runtime);

      // Extract DSEQ from text if present
      if (params.text && !params.dseq) {
        const dseqMatch = params.text.match(/dseq\s*(?::|=|\s)\s*(\d+)/i) ||
                        params.text.match(/deployment\s+(?:number|sequence|#)?\s*(\d+)/i) ||
                        params.text.match(/(\d{6,})/); // Matches standalone numbers of 6+ digits
        if (dseqMatch) {
          params.dseq = dseqMatch[1];
          elizaLogger.debug("Extracted DSEQ from text", {
            text: params.text,
            extractedDseq: params.dseq
          });
        }
      }

      // If no operation provided, check environment configuration
      if (!params.operation) {
        if (config.AKASH_GAS_OPERATION) {
          params.operation = config.AKASH_GAS_OPERATION as "close" | "create" | "update";
          elizaLogger.info("Using operation from environment", { operation: params.operation });
        } else {
          throw new AkashError(
            "Operation type is required (close, create, or update)",
            AkashErrorCode.VALIDATION_PARAMETER_MISSING,
            { parameter: "operation" }
          );
        }
      }

      // For close operations, check DSEQ from various sources
      if (params.operation === "close") {
        if (!params.dseq) {
          if (config.AKASH_GAS_DSEQ) {
            params.dseq = config.AKASH_GAS_DSEQ;
            elizaLogger.info("Using DSEQ from environment", { dseq: params.dseq });
          } else {
            throw new AkashError(
              "Deployment sequence (dseq) is required for close operation",
              AkashErrorCode.VALIDATION_PARAMETER_MISSING,
              { parameter: "dseq" }
            );
          }
        }
      }

      // For create/update operations, check message
      if ((params.operation === "create" || params.operation === "update") && !params.message) {
        throw new AkashError(
          "Message is required for create/update operations",
          AkashErrorCode.VALIDATION_PARAMETER_MISSING,
          { parameter: "message" }
        );
      }

      return true;
    } catch (error) {
      elizaLogger.error("Gas estimation validation failed", {
        error: error instanceof AkashError ? {
          code: error.code,
          message: error.message,
          details: error.details
        } : String(error)
      });
      return false;
    }
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State | undefined,
    options: { [key: string]: unknown } = {},
    callback?: HandlerCallback
  ): Promise<boolean> => {
    const actionId = Date.now().toString();
    elizaLogger.info("Starting gas estimation", { actionId });

    elizaLogger.debug("=== Handler Parameters ===", {
        hasRuntime: !!runtime,
        hasMessage: !!message,
        hasState: !!state,
        hasOptions: !!options,
        hasCallback: !!callback,
        actionId
    });

    try {
        const config = await validateAkashConfig(runtime);
        const params = message.content as Partial<EstimateGasContent>;

        // Initialize wallet and get address
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.AKASH_MNEMONIC, { prefix: "akash" });
        const [account] = await wallet.getAccounts();

        // Initialize client with Akash registry
        const myRegistry = new Registry(getAkashTypeRegistry());
        const client = await SigningStargateClient.connectWithSigner(
            config.RPC_ENDPOINT,
            wallet,
            { registry: myRegistry }
        );

        let msg: EncodeObject;
        switch (params.operation) {
            case "close":
                msg = {
                    typeUrl: getTypeUrl(MsgCloseDeployment),
                    value: MsgCloseDeployment.fromPartial({
                        id: {
                            owner: account.address,
                            dseq: params.dseq
                        }
                    })
                };
                break;
            case "create":
            case "update":
                if (!params.message) {
                    if (callback) {
                        callback({
                            text: `Message is required for ${params.operation} operations.`,
                            content: {
                                success: false,
                                error: {
                                    code: AkashErrorCode.VALIDATION_PARAMETER_MISSING,
                                    message: "Missing message",
                                    help: `Please provide a message object for the ${params.operation} operation.`
                                }
                            }
                        });
                    }
                    return false;
                }
                msg = params.message;
                break;
            default:
                if (callback) {
                    callback({
                        text: `Invalid operation type: ${params.operation}. Must be one of: close, create, or update.`,
                        content: {
                            success: false,
                            error: {
                                code: AkashErrorCode.VALIDATION_PARAMETER_INVALID,
                                message: "Invalid operation",
                                help: "Specify a valid operation type: 'close', 'create', or 'update'."
                            }
                        }
                    });
                }
                return false;
        }

        // Estimate gas
        elizaLogger.info("Estimating gas for operation", {
            operation: params.operation,
            dseq: params.dseq,
            owner: account.address
        });

        const gasEstimate = await client.simulate(
            account.address,
            [msg],
            `Estimate gas for ${params.operation} operation`
        );

        elizaLogger.info("Gas estimation completed", {
            gasEstimate,
            operation: params.operation,
            dseq: params.dseq,
            owner: account.address,
            actionId
        });

        if (callback) {
            elizaLogger.info("=== Preparing callback response for gas estimation ===", {
                hasCallback: true,
                actionId,
                operation: params.operation,
                dseq: params.dseq
            });

            const operationText = params.operation === "close" ? `closing deployment ${params.dseq}` : params.operation;
            const estimateData = {
                gasEstimate,
                operation: params.operation,
                dseq: params.dseq,
                owner: account.address,
                message: msg
            };

            let responseText = `I've estimated the gas for ${operationText}:\n`;
            responseText += `• Gas Required: ${gasEstimate} units\n`;
            responseText += `• Operation: ${params.operation}\n`;
            if (params.dseq) {
                responseText += `• DSEQ: ${params.dseq}\n`;
            }
            responseText += `• Owner: ${account.address}`;

            const response = {
                text: responseText,
                content: {
                    success: true,
                    data: estimateData,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: 'akash-plugin',
                        action: 'estimateGas',
                        version: '1.0.0',
                        actionId,
                        tokenCount: getTotalTokensFromString(responseText)
                    }
                }
            };

            elizaLogger.info("=== Executing callback with response ===", {
                actionId,
                responseText: response.text,
                hasContent: !!response.content,
                contentKeys: Object.keys(response.content),
                metadata: response.content.metadata
            });

            callback(response);

            elizaLogger.info("=== Callback executed successfully ===", {
                actionId,
                timestamp: new Date().toISOString()
            });
        } else {
            elizaLogger.warn("=== No callback provided for gas estimation ===", {
                actionId,
                operation: params.operation,
                dseq: params.dseq
            });
        }

        return true;
    } catch (error) {
        elizaLogger.error("Gas estimation failed", {
            error: error instanceof Error ? error.message : String(error),
            actionId
        });

        if (callback) {
            elizaLogger.info("=== Preparing error callback response ===", {
                actionId,
                hasCallback: true,
                errorType: error instanceof AkashError ? 'AkashError' : 'Error'
            });

            const errorResponse = {
                code: error instanceof AkashError ? error.code : AkashErrorCode.API_ERROR,
                message: error instanceof Error ? error.message : String(error),
                details: error instanceof AkashError ? error.details : undefined
            };

            const response = {
                text: `Failed to estimate gas: ${errorResponse.message}`,
                content: {
                    success: false,
                    error: errorResponse,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: 'akash-plugin',
                        action: 'estimateGas',
                        version: '1.0.0',
                        actionId
                    }
                }
            };

            elizaLogger.info("=== Executing error callback ===", {
                actionId,
                errorResponse,
                hasContent: !!response.content,
                contentKeys: Object.keys(response.content)
            });

            callback(response);

            elizaLogger.info("=== Error callback executed ===", {
                actionId,
                timestamp: new Date().toISOString()
            });
        } else {
            elizaLogger.warn("=== No callback provided for error handling ===", {
                actionId,
                errorMessage: error instanceof Error ? error.message : String(error)
            });
        }

        return false;
    }
  }
};

export default estimateGas;