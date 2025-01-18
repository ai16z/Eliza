import { createGenericAction } from "./base";
import * as WasmTemplates from "@injective/template/wasm";
import * as WasmExamples from "@injective/examples/wasm";
import * as WasmSimiles from "@injective/similes/wasm";
// Contract Query Actions
export const GetContractAccountsBalanceAction = createGenericAction({
    name: "GET_CONTRACT_ACCOUNTS_BALANCE",
    description: "Fetches the balance of contract accounts",
    template: WasmTemplates.getContractAccountsBalanceTemplate,
    examples: WasmExamples.getContractAccountsBalanceExample,
    similes: WasmSimiles.getContractAccountsBalanceSimiles,
    functionName: "getContractAccountsBalance",
    validateContent: () => true,
});

export const GetContractStateAction = createGenericAction({
    name: "GET_CONTRACT_STATE",
    description: "Fetches the state of a specific contract",
    template: WasmTemplates.getContractStateTemplate,
    examples: WasmExamples.getContractStateExample,
    similes: WasmSimiles.getContractStateSimiles,
    functionName: "getContractState",
    validateContent: () => true,
});

export const GetContractInfoAction = createGenericAction({
    name: "GET_CONTRACT_INFO",
    description: "Fetches information about a specific contract",
    template: WasmTemplates.getContractInfoTemplate,
    examples: WasmExamples.getContractInfoExample,
    similes: WasmSimiles.getContractInfoSimiles,
    functionName: "getContractInfo",
    validateContent: () => true,
});

export const GetContractHistoryAction = createGenericAction({
    name: "GET_CONTRACT_HISTORY",
    description: "Fetches the history of a specific contract",
    template: WasmTemplates.getContractHistoryTemplate,
    examples: WasmExamples.getContractHistoryExample,
    similes: WasmSimiles.getContractHistorySimiles,
    functionName: "getContractHistory",
    validateContent: () => true,
});

export const GetSmartContractStateAction = createGenericAction({
    name: "GET_SMART_CONTRACT_STATE",
    description: "Fetches the smart contract state based on a query",
    template: WasmTemplates.getSmartContractStateTemplate,
    examples: WasmExamples.getSmartContractStateExample,
    similes: WasmSimiles.getSmartContractStateSimiles,
    functionName: "getSmartContractState",
    validateContent: () => true,
});

export const GetRawContractStateAction = createGenericAction({
    name: "GET_RAW_CONTRACT_STATE",
    description:
        "Fetches the raw state of a specific contract based on a query",
    template: WasmTemplates.getRawContractStateTemplate,
    examples: WasmExamples.getRawContractStateExample,
    similes: WasmSimiles.getRawContractStateSimiles,
    functionName: "getRawContractState",
    validateContent: () => true,
});

// Code Query Actions
export const GetContractCodesAction = createGenericAction({
    name: "GET_CONTRACT_CODES",
    description: "Fetches all contract codes with optional pagination",
    template: WasmTemplates.getContractCodesTemplate,
    examples: WasmExamples.getContractCodesExample,
    similes: WasmSimiles.getContractCodesSimiles,
    functionName: "getContractCodes",
    validateContent: () => true,
});

export const GetContractCodeAction = createGenericAction({
    name: "GET_CONTRACT_CODE",
    description: "Fetches a specific contract code by its ID",
    template: WasmTemplates.getContractCodeTemplate,
    examples: WasmExamples.getContractCodeExample,
    similes: WasmSimiles.getContractCodeSimiles,
    functionName: "getContractCode",
    validateContent: () => true,
});

export const GetContractCodeContractsAction = createGenericAction({
    name: "GET_CONTRACT_CODE_CONTRACTS",
    description: "Fetches contracts associated with a specific contract code",
    template: WasmTemplates.getContractCodeContractsTemplate,
    examples: WasmExamples.getContractCodeContractsExample,
    similes: WasmSimiles.getContractCodeContractsSimiles,
    functionName: "getContractCodeContracts",
    validateContent: () => true,
});

// Message Actions
export const MsgStoreCodeAction = createGenericAction({
    name: "MSG_STORE_CODE",
    description: "Broadcasts a message to store new contract code",
    template: WasmTemplates.msgStoreCodeTemplate,
    examples: WasmExamples.msgStoreCodeExample,
    similes: WasmSimiles.msgStoreCodeSimiles,
    functionName: "msgStoreCode",
    validateContent: () => true,
});

export const MsgUpdateAdminAction = createGenericAction({
    name: "MSG_UPDATE_ADMIN",
    description: "Broadcasts a message to update the admin of a contract",
    template: WasmTemplates.msgUpdateAdminTemplate,
    examples: WasmExamples.msgUpdateAdminExample,
    similes: WasmSimiles.msgUpdateAdminSimiles,
    functionName: "msgUpdateAdmin",
    validateContent: () => true,
});

export const MsgExecuteContractAction = createGenericAction({
    name: "MSG_EXECUTE_CONTRACT",
    description: "Broadcasts a message to execute a contract",
    template: WasmTemplates.msgExecuteContractTemplate,
    examples: WasmExamples.msgExecuteContractExample,
    similes: WasmSimiles.msgExecuteContractSimiles,
    functionName: "msgExecuteContract",
    validateContent: () => true,
});

export const MsgMigrateContractAction = createGenericAction({
    name: "MSG_MIGRATE_CONTRACT",
    description:
        "Broadcasts a message to migrate a contract to a new code version",
    template: WasmTemplates.msgMigrateContractTemplate,
    examples: WasmExamples.msgMigrateContractExample,
    similes: WasmSimiles.msgMigrateContractSimiles,
    functionName: "msgMigrateContract",
    validateContent: () => true,
});

export const MsgInstantiateContractAction = createGenericAction({
    name: "MSG_INSTANTIATE_CONTRACT",
    description: "Broadcasts a message to instantiate a new contract",
    template: WasmTemplates.msgInstantiateContractTemplate,
    examples: WasmExamples.msgInstantiateContractExample,
    similes: WasmSimiles.msgInstantiateContractSimiles,
    functionName: "msgInstantiateContract",
    validateContent: () => true,
});

export const MsgExecuteContractCompatAction = createGenericAction({
    name: "MSG_EXECUTE_CONTRACT_COMPAT",
    description:
        "Broadcasts a message to execute a contract using compatibility mode",
    template: WasmTemplates.msgExecuteContractCompatTemplate,
    examples: WasmExamples.msgExecuteContractCompatExample,
    similes: WasmSimiles.msgExecuteContractCompatSimiles,
    functionName: "msgExecuteContractCompat",
    validateContent: () => true,
});

export const MsgPrivilegedExecuteContractAction = createGenericAction({
    name: "MSG_PRIVILEGED_EXECUTE_CONTRACT",
    description: "Broadcasts a privileged message to execute a contract",
    template: WasmTemplates.msgPrivilegedExecuteContractTemplate,
    examples: WasmExamples.msgPrivilegedExecuteContractExample,
    similes: WasmSimiles.msgPrivilegedExecuteContractSimiles,
    functionName: "msgPrivilegedExecuteContract",
    validateContent: () => true,
});

// WasmX Query Actions
export const GetWasmxModuleParamsAction = createGenericAction({
    name: "GET_WASMX_MODULE_PARAMS",
    description: "Fetches the parameters of the WasmX module",
    template: WasmTemplates.getWasmxModuleParamsTemplate,
    examples: WasmExamples.getWasmxModuleParamsExample,
    similes: WasmSimiles.getWasmxModuleParamsSimiles,
    functionName: "getWasmxModuleParams",
    validateContent: () => true,
});

export const GetWasmxModuleStateAction = createGenericAction({
    name: "GET_WASMX_MODULE_STATE",
    description: "Fetches the current state of the WasmX module",
    template: WasmTemplates.getWasmxModuleStateTemplate,
    examples: WasmExamples.getWasmxModuleStateExample,
    similes: WasmSimiles.getWasmxModuleStateSimiles,
    functionName: "getWasmxModuleState",
    validateContent: () => true,
});

// Export all actions as a group
export const WasmActions = [
    // Contract Query Actions
    GetContractAccountsBalanceAction,
    GetContractStateAction,
    GetContractInfoAction,
    GetContractHistoryAction,
    GetSmartContractStateAction,
    GetRawContractStateAction,

    // Code Query Actions
    GetContractCodesAction,
    GetContractCodeAction,
    GetContractCodeContractsAction,

    // Message Actions
    MsgStoreCodeAction,
    MsgUpdateAdminAction,
    MsgExecuteContractAction,
    MsgMigrateContractAction,
    MsgInstantiateContractAction,
    MsgExecuteContractCompatAction,
    MsgPrivilegedExecuteContractAction,

    // WasmX Query Actions
    GetWasmxModuleParamsAction,
    GetWasmxModuleStateAction,
];
