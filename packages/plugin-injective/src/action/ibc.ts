import { createGenericAction } from "./base";
import * as IBCTemplates from "@injective/template/ibc";
import * as IBCExamples from "@injective/examples/ibc";
import * as IBCSimiles from "@injective/similes/ibc";
export const GetDenomTraceAction = createGenericAction({
    name: "GET_DENOM_TRACE",
    description: "Fetches the denomination trace for a specific hash",
    template: IBCTemplates.getDenomTraceTemplate,
    examples: IBCExamples.getDenomTraceExample,
    similes: IBCSimiles.getDenomTraceSimiles,
    functionName: "getDenomTrace",
    validateContent: () => true,
});

export const GetDenomsTraceAction = createGenericAction({
    name: "GET_DENOMS_TRACE",
    description:
        "Fetches a list of denomination traces with optional pagination",
    template: IBCTemplates.getDenomsTraceTemplate,
    examples: IBCExamples.getDenomsTraceExample,
    similes: IBCSimiles.getDenomsTraceSimiles,
    functionName: "getDenomsTrace",
    validateContent: () => true,
});

export const MsgIBCTransferAction = createGenericAction({
    name: "MSG_IBC_TRANSFER",
    description: "Broadcasts an IBC transfer message",
    template: IBCTemplates.msgIBCTransferTemplate,
    examples: IBCExamples.msgIBCTransferExample,
    similes: IBCSimiles.msgIBCTransferSimiles,
    functionName: "msgIBCTransfer",
    validateContent: () => true,
});

// Export all actions as a group
export const IbcActions = [
    GetDenomTraceAction,
    GetDenomsTraceAction,
    MsgIBCTransferAction,
];
