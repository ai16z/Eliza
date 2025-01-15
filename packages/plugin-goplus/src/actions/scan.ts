import {
    Action,
    elizaLogger,
    generateObjectDeprecated,
    generateText,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
} from "@elizaos/core";
import { GoPlusManage, GoPlusParamType, GoPlusType } from "../lib/GoPlusManage";
import { requestPrompt, responsePrompt } from "../templates";

export const scanTokenAction: Action = {
    name: "TOKEN_SCAN",
    similes: ["SCAN_TOKEN", "GOPLUS_SCAN"],
    description: "Perform a token scan by given address.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const goplus = !!runtime.getSetting("GOPLUS_API_KEY");
        return goplus;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        try {
            elizaLogger.log("check input text", message.content.text);
            const obj = (await generateObjectDeprecated({
                runtime: runtime,
                context: requestPrompt(message.content.text),
                modelClass: ModelClass.LARGE, // gpt-4o-mini
            })) as GoPlusParamType;

            elizaLogger.log("check generateObjectDeprecated text", obj);
            const goPlusManage = new GoPlusManage(
                runtime.getSetting("GOPLUS_API_KEY")
            );

            let checkResult: any;
            switch (obj.type) {
                case GoPlusType.EVMTOKEN_SECURITY_CHECK:
                    checkResult = await goPlusManage.tokenSecurity(
                        obj.network,
                        obj.token
                    );
                    break;
                case GoPlusType.SOLTOKEN_SECURITY_CHECK:
                    checkResult =
                        await goPlusManage.solanaTokenSecurityUsingGET(
                            obj.token
                        );
                    break;
                case GoPlusType.SUITOKEN_SECURITY_CHECK:
                    checkResult = await goPlusManage.suiTokenSecurityUsingGET(
                        obj.token
                    );
                    break;
                case GoPlusType.RUGPULL_SECURITY_CHECK:
                    checkResult = await goPlusManage.rugpullDetection(
                        obj.network,
                        obj.contract
                    );
                    break;
                case GoPlusType.NFT_SECURITY_CHECK:
                    checkResult = await goPlusManage.nftSecurity(
                        obj.network,
                        obj.token
                    );
                    break;
                case GoPlusType.ADRESS_SECURITY_CHECK:
                    checkResult = await goPlusManage.addressSecurity(
                        obj.wallet
                    );
                    break;
                case GoPlusType.APPROVAL_SECURITY_CHECK:
                    checkResult = await goPlusManage.approvalSecurity(
                        obj.network,
                        obj.contract
                    );
                    break;
                case GoPlusType.ACCOUNT_ERC20_SECURITY_CHECK:
                    checkResult = await goPlusManage.erc20ApprovalSecurity(
                        obj.network,
                        obj.wallet
                    );
                    break;
                case GoPlusType.ACCOUNT_ERC721_SECURITY_CHECK:
                    checkResult = await goPlusManage.erc721ApprovalSecurity(
                        obj.network,
                        obj.wallet
                    );
                    break;
                case GoPlusType.ACCOUNT_ERC1155_SECURITY_CHECK:
                    checkResult = await goPlusManage.erc1155ApprovalSecurity(
                        obj.network,
                        obj.wallet
                    );
                    break;
                case GoPlusType.SIGNATURE_SECURITY_CHECK:
                    checkResult = await goPlusManage.inputDecode(
                        obj.network,
                        obj.data
                    );
                    break;
                case GoPlusType.URL_SECURITY_CHECK:
                    checkResult =
                        await goPlusManage.dappSecurityAndPhishingSite(obj.url);
                    break;
                default:
                    throw new Error("type is invaild");
            }
            elizaLogger.log("checkResult text", checkResult);
            const checkResponse = await generateText({
                runtime: runtime,
                context: responsePrompt(
                    JSON.stringify(checkResult),
                    message.content.text
                ),
                modelClass: ModelClass.LARGE,
            });
            elizaLogger.log("checkResponse text", checkResponse);
            callback({
                text: checkResponse,
            });
        } catch (e) {
            elizaLogger.error("Error in scanTokenAction handler", e);
            return "error";
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "what do you think about this token 0x",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here is what i found about 0x:",
                    action: "TOKEN_SCAN",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you find details about this token 0x",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here are the scan result I found about the 0x:",
                    action: "TOKEN_SCAN",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you scan this token 0x?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here is scan result about 0x:",
                    action: "TOKEN_SCAN",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Check the security result for this token 0x.",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here is security scan I found:",
                    action: "TOKEN_SCAN",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Scan this token 0x .",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here are the current scan result:",
                    action: "TOKEN_SCAN",
                },
            },
        ],
    ],
} as Action;
