import { createGenericAction } from "./base";
import * as TokenFactoryTemplates from "@injective/template/token-factory";
import * as TokenFactoryExamples from "@injective/examples/token-factory";
import * as TokenFactorySimiles from "@injective/similes/token-factory";
// Query Actions
export const GetDenomsFromCreatorAction = createGenericAction({
    name: "GET_DENOMS_FROM_CREATOR",
    description: "Fetches all denominations created by a specific creator",
    template: TokenFactoryTemplates.getDenomsFromCreatorTemplate,
    examples: TokenFactoryExamples.getDenomsFromCreatorExample,
    similes: TokenFactorySimiles.getDenomsFromCreatorSimiles,
    functionName: "getDenomsFromCreator",
    validateContent: () => true,
});

export const GetDenomAuthorityMetadataAction = createGenericAction({
    name: "GET_DENOM_AUTHORITY_METADATA",
    description: "Fetches the authority metadata for a specific denomination",
    template: TokenFactoryTemplates.getDenomAuthorityMetadataTemplate,
    examples: TokenFactoryExamples.getDenomAuthorityMetadataExample,
    similes: TokenFactorySimiles.getDenomAuthorityMetadataSimiles,
    functionName: "getDenomAuthorityMetadata",
    validateContent: () => true,
});

export const GetTokenFactoryModuleParamsAction = createGenericAction({
    name: "GET_TOKEN_FACTORY_MODULE_PARAMS",
    description: "Fetches the parameters of the Token Factory module",
    template: TokenFactoryTemplates.getTokenFactoryModuleParamsTemplate,
    examples: TokenFactoryExamples.getTokenFactoryModuleParamsExample,
    similes: TokenFactorySimiles.getTokenFactoryModuleParamsSimiles,
    functionName: "getTokenFactoryModuleParams",
    validateContent: () => true,
});

export const GetTokenFactoryModuleStateAction = createGenericAction({
    name: "GET_TOKEN_FACTORY_MODULE_STATE",
    description: "Fetches the current state of the Token Factory module",
    template: TokenFactoryTemplates.getTokenFactoryModuleStateTemplate,
    examples: TokenFactoryExamples.getTokenFactoryModuleStateExample,
    similes: TokenFactorySimiles.getTokenFactoryModuleStateSimiles,
    functionName: "getTokenFactoryModuleState",
    validateContent: () => true,
});

// Message Actions
export const MsgBurnAction = createGenericAction({
    name: "MSG_BURN",
    description: "Broadcasts a message to burn tokens",
    template: TokenFactoryTemplates.msgBurnTemplate,
    examples: TokenFactoryExamples.msgBurnExample,
    similes: TokenFactorySimiles.msgBurnSimiles,
    functionName: "msgBurn",
    validateContent: () => true,
});

export const MsgChangeAdminAction = createGenericAction({
    name: "MSG_CHANGE_ADMIN",
    description: "Broadcasts a message to change the admin of a denomination",
    template: TokenFactoryTemplates.msgChangeAdminTemplate,
    examples: TokenFactoryExamples.msgChangeAdminExample,
    similes: TokenFactorySimiles.msgChangeAdminSimiles,
    functionName: "msgChangeAdmin",
    validateContent: () => true,
});

export const MsgCreateDenomAction = createGenericAction({
    name: "MSG_CREATE_DENOM",
    description: "Broadcasts a message to create a new denomination",
    template: TokenFactoryTemplates.msgCreateDenomTemplate,
    examples: TokenFactoryExamples.msgCreateDenomExample,
    similes: TokenFactorySimiles.msgCreateDenomSimiles,
    functionName: "msgCreateDenom",
    validateContent: () => true,
});

export const MsgMintAction = createGenericAction({
    name: "MSG_MINT",
    description: "Broadcasts a message to mint new tokens",
    template: TokenFactoryTemplates.msgMintTemplate,
    examples: TokenFactoryExamples.msgMintExample,
    similes: TokenFactorySimiles.msgMintSimiles,
    functionName: "msgMint",
    validateContent: () => true,
});

export const MsgSetDenomMetadataAction = createGenericAction({
    name: "MSG_SET_DENOM_METADATA",
    description: "Broadcasts a message to set metadata for a denomination",
    template: TokenFactoryTemplates.msgSetDenomMetadataTemplate,
    examples: TokenFactoryExamples.msgSetDenomMetadataExample,
    similes: TokenFactorySimiles.msgSetDenomMetadataSimiles,
    functionName: "msgSetDenomMetadata",
    validateContent: () => true,
});

// Export all actions as a group
export const TokenFactoryActions = [
    // Query Actions
    GetDenomsFromCreatorAction,
    GetDenomAuthorityMetadataAction,
    GetTokenFactoryModuleParamsAction,
    GetTokenFactoryModuleStateAction,

    // Message Actions
    MsgBurnAction,
    MsgChangeAdminAction,
    MsgCreateDenomAction,
    MsgMintAction,
    MsgSetDenomMetadataAction,
];
