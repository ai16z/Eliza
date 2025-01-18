import { createGenericAction } from "./base";
import * as BankTemplates from "@injective/template/bank";
import * as BankExamples from "@injective/examples/bank";
import * as BankSimilies from "@injective/similes/bank";
// Query Actions
export const GetBankModuleParamsAction = createGenericAction({
    name: "GET_BANK_MODULE_PARAMS",
    description: "Fetches the bank module parameters",
    template: BankTemplates.getBankModuleParamsTemplate,
    examples: BankExamples.getBankModuleParamsExample,
    similes: BankSimilies.getBankModuleParamsSimiles,
    functionName: "getBankModuleParams",
    validateContent: () => true,
});

export const GetBankBalanceAction = createGenericAction({
    name: "GET_BANK_BALANCE",
    description: "Fetches the balance of a specific account",
    template: BankTemplates.getBankBalanceTemplate,
    examples: BankExamples.getBankBalanceExample,
    similes: BankSimilies.getBankBalanceSimiles,
    functionName: "getBankBalance",
    validateContent: () => true,
});

export const GetBankBalancesAction = createGenericAction({
    name: "GET_BANK_BALANCES",
    description: "Fetches all balances for the current account",
    template: BankTemplates.getBankBalancesTemplate,
    examples: BankExamples.getBankBalancesExample,
    similes: BankSimilies.getBankBalancesSimiles,
    functionName: "getBankBalances",
    validateContent: () => true,
});

export const GetTotalSupplyAction = createGenericAction({
    name: "GET_TOTAL_SUPPLY",
    description: "Fetches the total supply of all denominations",
    template: BankTemplates.getTotalSupplyTemplate,
    examples: BankExamples.getTotalSupplyExample,
    similes: BankSimilies.getTotalSupplySimiles,
    functionName: "getTotalSupply",
    validateContent: () => true,
});

export const GetAllTotalSupplyAction = createGenericAction({
    name: "GET_ALL_TOTAL_SUPPLY",
    description: "Fetches the total supply for all denominations",
    template: BankTemplates.getAllTotalSupplyTemplate,
    examples: BankExamples.getAllTotalSupplyExample,
    similes: BankSimilies.getAllTotalSupplySimiles,
    functionName: "getAllTotalSupply",
    validateContent: () => true,
});

export const GetSupplyOfAction = createGenericAction({
    name: "GET_SUPPLY_OF",
    description: "Fetches the supply of a specific denomination",
    template: BankTemplates.getSupplyOfTemplate,
    examples: BankExamples.getSupplyOfExample,
    similes: BankSimilies.getSupplyOfSimiles,
    functionName: "getSupplyOf",
    validateContent: () => true,
});

export const GetDenomsMetadataAction = createGenericAction({
    name: "GET_DENOMS_METADATA",
    description: "Fetches metadata for all denominations",
    template: BankTemplates.getDenomsMetadataTemplate,
    examples: BankExamples.getDenomsMetadataExample,
    similes: BankSimilies.getDenomMetadataSimiles,
    functionName: "getDenomsMetadata",
    validateContent: () => true,
});

export const GetDenomMetadataAction = createGenericAction({
    name: "GET_DENOM_METADATA",
    description: "Fetches metadata for a specific denomination",
    template: BankTemplates.getDenomMetadataTemplate,
    examples: BankExamples.getDenomMetadataExample,
    similes: BankSimilies.getDenomMetadataSimiles,
    functionName: "getDenomMetadata",
    validateContent: () => true,
});

export const GetDenomOwnersAction = createGenericAction({
    name: "GET_DENOM_OWNERS",
    description: "Fetches the owners of a specific denomination",
    template: BankTemplates.getDenomOwnersTemplate,
    examples: BankExamples.getDenomOwnersExample,
    similes: BankSimilies.getDenomOwnersSimiles,
    functionName: "getDenomOwners",
    validateContent: () => true,
});

// Transaction Actions
export const MsgSendAction = createGenericAction({
    name: "MSG_SEND",
    description: "Sends tokens from one account to another",
    template: BankTemplates.msgSendTemplate,
    examples: BankExamples.msgSendExample,
    similes: BankSimilies.msgSendSimiles,
    functionName: "msgSend",
    validateContent: () => true,
});

export const MsgMultiSendAction = createGenericAction({
    name: "MSG_MULTI_SEND",
    description: "Sends tokens from multiple senders to multiple receivers",
    template: BankTemplates.msgMultiSendTemplate,
    examples: BankExamples.msgMultiSendExample,
    similes: BankSimilies.msgMultiSendSimiles,
    functionName: "msgMultiSend",
    validateContent: () => true,
});

export const BankActions = [
    GetBankModuleParamsAction,
    GetBankBalanceAction,
    GetBankBalancesAction,
    GetTotalSupplyAction,
    GetAllTotalSupplyAction,
    GetSupplyOfAction,
    GetDenomsMetadataAction,
    GetDenomMetadataAction,
    GetDenomOwnersAction,
    MsgSendAction,
    MsgMultiSendAction,
];
