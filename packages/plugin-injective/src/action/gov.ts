// src/actions/governance/governance-actions.ts
import { createGenericAction } from "./base";
import * as GovTemplates from "@injective/template/gov";
import * as GovExamples from "@injective/examples/gov";
import * as GovSimiles from "@injective/similes/gov";
export const GetGovernanceModuleParamsAction = createGenericAction({
    name: "GET_GOVERNANCE_MODULE_PARAMS",
    description: "Fetches the governance module parameters",
    template: GovTemplates.getGovernanceModuleParamsTemplate,
    examples: GovExamples.getGovernanceModuleParamsExample,
    functionName: "getGovernanceModuleParams",
    similes: GovSimiles.getGovernanceModuleParamsSimiles,
    validateContent: () => true,
});

export const GetProposalsAction = createGenericAction({
    name: "GET_PROPOSALS",
    description: "Fetches a list of proposals based on provided parameters",
    template: GovTemplates.getProposalsTemplate,
    examples: GovExamples.getProposalsExample,
    functionName: "getProposals",
    similes: GovSimiles.getProposalsSimiles,
    validateContent: () => true,
});

export const GetProposalAction = createGenericAction({
    name: "GET_PROPOSAL",
    description: "Fetches details of a specific proposal by its ID",
    template: GovTemplates.getProposalTemplate,
    examples: GovExamples.getProposalExample,
    similes: GovSimiles.getProposalsSimiles,
    functionName: "getProposal",
    validateContent: () => true,
});

export const GetProposalDepositsAction = createGenericAction({
    name: "GET_PROPOSAL_DEPOSITS",
    description: "Fetches deposits for a specific proposal",
    template: GovTemplates.getProposalDepositsTemplate,
    examples: GovExamples.getProposalDepositsExample,
    similes: GovSimiles.getProposalDepositsSimiles,
    functionName: "getProposalDeposits",
    validateContent: () => true,
});

export const GetProposalVotesAction = createGenericAction({
    name: "GET_PROPOSAL_VOTES",
    description: "Fetches votes for a specific proposal",
    template: GovTemplates.getProposalVotesTemplate,
    examples: GovExamples.getProposalVotesExample,
    similes: GovSimiles.getProposalVotesSimiles,
    functionName: "getProposalVotes",
    validateContent: () => true,
});

export const GetProposalTallyAction = createGenericAction({
    name: "GET_PROPOSAL_TALLY",
    description: "Fetches the tally results of a specific proposal",
    template: GovTemplates.getProposalTallyTemplate,
    examples: GovExamples.getProposalTallyExample,
    similes: GovSimiles.getProposalTallySimiles,
    functionName: "getProposalTally",
    validateContent: () => true,
});

// Message Actions
export const MsgSubmitProposalExpiryFuturesMarketLaunchAction =
    createGenericAction({
        name: "MSG_SUBMIT_PROPOSAL_EXPIRY_FUTURES_MARKET_LAUNCH",
        description: "Submits a proposal to launch an expiry futures market",
        template:
            GovTemplates.msgSubmitProposalExpiryFuturesMarketLaunchTemplate,
        examples: GovExamples.msgSubmitProposalExpiryFuturesMarketLaunchExample,
        similes: GovSimiles.msgSubmitProposalExpiryFuturesMarketLaunchSimiles,
        functionName: "msgSubmitProposalExpiryFuturesMarketLaunch",
        validateContent: () => true,
    });

export const MsgSubmitProposalSpotMarketLaunchAction = createGenericAction({
    name: "MSG_SUBMIT_PROPOSAL_SPOT_MARKET_LAUNCH",
    description: "Submits a proposal to launch a spot market",
    template: GovTemplates.msgSubmitProposalSpotMarketLaunchTemplate,
    examples: GovExamples.msgSubmitProposalSpotMarketLaunchExample,
    similes: GovSimiles.msgSubmitProposalSpotMarketLaunchSimiles,
    functionName: "msgSubmitProposalSpotMarketLaunch",
    validateContent: () => true,
});

export const MsgSubmitProposalPerpetualMarketLaunchAction = createGenericAction(
    {
        name: "MSG_SUBMIT_PROPOSAL_PERPETUAL_MARKET_LAUNCH",
        description: "Submits a proposal to launch a perpetual market",
        template: GovTemplates.msgSubmitProposalPerpetualMarketLaunchTemplate,
        examples: GovExamples.msgSubmitProposalPerpetualMarketLaunchExample,
        similes: GovSimiles.msgSubmitProposalPerpetualMarketLaunchSimiles,
        functionName: "msgSubmitProposalPerpetualMarketLaunch",
        validateContent: () => true,
    }
);

export const MsgVoteAction = createGenericAction({
    name: "MSG_VOTE",
    description: "Casts a vote on a specific proposal",
    template: GovTemplates.msgVoteTemplate,
    examples: GovExamples.msgVoteExample,
    similes: GovSimiles.msgVoteSimiles,
    functionName: "msgVote",
    validateContent: () => true,
});

export const MsgSubmitTextProposalAction = createGenericAction({
    name: "MSG_SUBMIT_TEXT_PROPOSAL",
    description: "Submits a text-based proposal",
    template: GovTemplates.msgSubmitTextProposalTemplate,
    examples: GovExamples.msgSubmitTextProposalExample,
    similes: GovSimiles.msgSubmitTextProposalSimiles,
    functionName: "msgSubmitTextProposal",
    validateContent: () => true,
});

export const MsgSubmitProposalSpotMarketParamUpdateAction = createGenericAction(
    {
        name: "MSG_SUBMIT_PROPOSAL_SPOT_MARKET_PARAM_UPDATE",
        description: "Submits a proposal to update spot market parameters",
        template: GovTemplates.msgSubmitProposalSpotMarketParamUpdateTemplate,
        examples: GovExamples.msgSubmitProposalSpotMarketParamUpdateExample,
        similes: GovSimiles.msgSubmitProposalSpotMarketParamUpdateSimiles,
        functionName: "msgSubmitProposalSpotMarketParamUpdate",
        validateContent: () => true,
    }
);

export const MsgSubmitGenericProposalAction = createGenericAction({
    name: "MSG_SUBMIT_GENERIC_PROPOSAL",
    description: "Submits a generic proposal",
    template: GovTemplates.msgSubmitGenericProposalTemplate,
    examples: GovExamples.msgSubmitGenericProposalExample,
    similes: GovSimiles.msgSubmitGenericProposalSimiles,
    functionName: "msgSubmitGenericProposal",
    validateContent: () => true,
});

export const MsgGovDepositAction = createGenericAction({
    name: "MSG_GOV_DEPOSIT",
    description: "Deposits tokens to a specific proposal",
    similes: GovSimiles.msgGovDepositSimiles,
    template: GovTemplates.msgGovDepositTemplate,
    examples: GovExamples.msgGovDepositExample,
    functionName: "msgGovDeposit",
    validateContent: () => true,
});

// Export all actions as a group
export const GovActions = [
    GetGovernanceModuleParamsAction,
    GetProposalsAction,
    GetProposalAction,
    GetProposalDepositsAction,
    GetProposalVotesAction,
    GetProposalTallyAction,
    MsgSubmitProposalExpiryFuturesMarketLaunchAction,
    MsgSubmitProposalSpotMarketLaunchAction,
    MsgSubmitProposalPerpetualMarketLaunchAction,
    MsgVoteAction,
    MsgSubmitTextProposalAction,
    MsgSubmitProposalSpotMarketParamUpdateAction,
    MsgSubmitGenericProposalAction,
    MsgGovDepositAction,
];
