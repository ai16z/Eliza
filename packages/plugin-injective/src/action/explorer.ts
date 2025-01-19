// src/actions/explorer/explorer-actions.ts
import { createGenericAction } from "./base";
import * as ExplorerTemplates from "@injective/template/explorer";
import * as ExplorerExamples from "@injective/examples/explorer";
import * as ExplorerSimiles from "@injective/similes/explorer";
export const GetTxByHashAction = createGenericAction({
    name: "GET_TX_BY_HASH",
    description: "Fetches a transaction by its hash",
    template: ExplorerTemplates.getTxByHashTemplate,
    examples: ExplorerExamples.getTxByHashExample,
    similes: ExplorerSimiles.getTxByHashSimiles,
    functionName: "getTxByHash",
    validateContent: () => true,
});

export const GetAccountTxAction = createGenericAction({
    name: "GET_ACCOUNT_TX",
    description: "Fetches transactions for a specific account",
    template: ExplorerTemplates.getAccountTxTemplate,
    examples: ExplorerExamples.getAccountTxExample,
    similes: ExplorerSimiles.getAccountTxSimiles,
    functionName: "getAccountTx",
    validateContent: () => true,
});

export const GetExplorerValidatorAction = createGenericAction({
    name: "GET_EXPLORER_VALIDATOR",
    description: "Fetches details of a specific validator",
    template: ExplorerTemplates.getValidatorTemplate,
    examples: ExplorerExamples.getValidatorExample,
    similes: ExplorerSimiles.getExplorerValidatorSimiles,
    functionName: "getValidator",
    validateContent: () => true,
});

export const GetValidatorUptimeAction = createGenericAction({
    name: "GET_VALIDATOR_UPTIME",
    description: "Fetches the uptime of a specific validator",
    template: ExplorerTemplates.getValidatorUptimeTemplate,
    examples: ExplorerExamples.getValidatorUptimeExample,
    similes: ExplorerSimiles.getExplorerValidatorUptimeSimiles,
    functionName: "getValidatorUptime",
    validateContent: () => true,
});

export const GetPeggyDepositTxsAction = createGenericAction({
    name: "GET_PEGGY_DEPOSIT_TXS",
    description: "Fetches Peggy deposit transactions",
    template: ExplorerTemplates.getPeggyDepositTxsTemplate,
    examples: ExplorerExamples.getPeggyDepositTxsExample,
    similes: ExplorerSimiles.getPeggyDepositTxsSimiles,
    functionName: "getPeggyDepositTxs",
    validateContent: () => true,
});

export const GetPeggyWithdrawalTxsAction = createGenericAction({
    name: "GET_PEGGY_WITHDRAWAL_TXS",
    description: "Fetches Peggy withdrawal transactions",
    template: ExplorerTemplates.getPeggyWithdrawalTxsTemplate,
    examples: ExplorerExamples.getPeggyWithdrawalTxsExample,
    similes: ExplorerSimiles.getPeggyWithdrawalTxsSimiles,
    functionName: "getPeggyWithdrawalTxs",
    validateContent: () => true,
});

export const GetBlocksAction = createGenericAction({
    name: "GET_BLOCKS",
    description: "Fetches a list of blocks based on provided parameters",
    template: ExplorerTemplates.getBlocksTemplate,
    examples: ExplorerExamples.getBlocksExample,
    similes: ExplorerSimiles.getBlocksSimiles,
    functionName: "getBlocks",
    validateContent: () => true,
});

export const GetBlockAction = createGenericAction({
    name: "GET_BLOCK",
    description: "Fetches details of a specific block by its ID",
    template: ExplorerTemplates.getBlockTemplate,
    examples: ExplorerExamples.getBlockExample,
    similes: ExplorerSimiles.getBlockSimiles,
    functionName: "getBlock",
    validateContent: () => true,
});

export const GetTxsAction = createGenericAction({
    name: "GET_TXS",
    description: "Fetches a list of transactions based on provided parameters",
    template: ExplorerTemplates.getTxsTemplate,
    examples: ExplorerExamples.getTxsExample,
    similes: ExplorerSimiles.getTxsSimiles,
    functionName: "getTxs",
    validateContent: () => true,
});

export const GetIBCTransferTxsAction = createGenericAction({
    name: "GET_IBC_TRANSFER_TXS",
    description: "Fetches IBC transfer transactions",
    template: ExplorerTemplates.getIBCTransferTxsTemplate,
    examples: ExplorerExamples.getIBCTransferTxsExample,
    similes: ExplorerSimiles.getIBCTransferTxsSimiles,
    functionName: "getIBCTransferTxs",
    validateContent: () => true,
});

export const GetExplorerStatsAction = createGenericAction({
    name: "GET_EXPLORER_STATS",
    description: "Fetches explorer statistics",
    template: ExplorerTemplates.getExplorerStatsTemplate,
    examples: ExplorerExamples.getExplorerStatsExample,
    similes: ExplorerSimiles.getExplorerStatsSimiles,
    functionName: "getExplorerStats",
    validateContent: () => true,
});

// Export all actions as a group
export const ExplorerActions = [
    GetTxByHashAction,
    GetAccountTxAction,
    GetExplorerValidatorAction,
    GetValidatorUptimeAction,
    GetPeggyDepositTxsAction,
    GetPeggyWithdrawalTxsAction,
    GetBlocksAction,
    GetBlockAction,
    GetTxsAction,
    GetIBCTransferTxsAction,
    GetExplorerStatsAction,
];
