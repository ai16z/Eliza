import type { InjectiveGrpcBase } from "../grpc/grpc-base";
import {
    MsgSubmitProposalExpiryFuturesMarketLaunch,
    MsgSubmitProposalSpotMarketLaunch,
    MsgSubmitProposalPerpetualMarketLaunch,
    MsgVote,
    MsgSubmitTextProposal,
    MsgSubmitProposalSpotMarketParamUpdate,
    MsgSubmitGenericProposal,
    MsgGovDeposit,
    type TxResponse,
} from "@injectivelabs/sdk-ts";
import type * as GovernanceTypes from "../types/gov";
import {
    type StandardResponse,
    createSuccessResponse,
    createErrorResponse,
} from "../types/index";

/**
 * Governance Module Chain GRPC Async Functions with Error Handling
 */

/**
 * Fetches the governance module parameters.
 *
 * @this InjectiveGrpcBase
 * @returns {Promise<StandardResponse>} The standard response containing governance module parameters or an error.
 */
export async function getGovernanceModuleParams(
    this: InjectiveGrpcBase
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcGovApi.fetchModuleParams();
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getModuleParamsError", err);
    }
}

/**
 * Fetches a list of proposals based on provided parameters.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.GetProposalsParams} params - Parameters to filter proposals.
 * @returns {Promise<StandardResponse>} The standard response containing a list of proposals or an error.
 */
export async function getProposals(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.GetProposalsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcGovApi.fetchProposals(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getProposalsError", err);
    }
}

/**
 * Fetches details of a specific proposal by its ID.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.GetProposalParams} params - Parameters including the proposal ID.
 * @returns {Promise<StandardResponse>} The standard response containing proposal details or an error.
 */
export async function getProposal(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.GetProposalParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcGovApi.fetchProposal(
            params.proposalId
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getProposalError", err);
    }
}

/**
 * Fetches deposits for a specific proposal.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.GetProposalDepositsParams} params - Parameters including the proposal ID.
 * @returns {Promise<StandardResponse>} The standard response containing proposal deposits or an error.
 */
export async function getProposalDeposits(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.GetProposalDepositsParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcGovApi.fetchProposalDeposits(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getProposalDepositsError", err);
    }
}

/**
 * Fetches votes for a specific proposal.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.GetProposalVotesParams} params - Parameters including the proposal ID.
 * @returns {Promise<StandardResponse>} The standard response containing proposal votes or an error.
 */
export async function getProposalVotes(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.GetProposalVotesParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcGovApi.fetchProposalVotes(params);
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getProposalVotesError", err);
    }
}

/**
 * Fetches the tally results of a specific proposal.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.GetProposalTallyParams} params - Parameters including the proposal ID.
 * @returns {Promise<StandardResponse>} The standard response containing proposal tally or an error.
 */
export async function getProposalTally(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.GetProposalTallyParams
): Promise<StandardResponse> {
    try {
        const result = await this.chainGrpcGovApi.fetchProposalTally(
            params.proposalId
        );
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("getProposalTallyError", err);
    }
}

/**
 * Submits a proposal to launch an expiry futures market.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.MsgSubmitProposalExpiryFuturesMarketLaunchParams} params - Parameters to submit the proposal.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgSubmitProposalExpiryFuturesMarketLaunch(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.MsgSubmitProposalExpiryFuturesMarketLaunchParams
): Promise<StandardResponse> {
    try {
        const msg = MsgSubmitProposalExpiryFuturesMarketLaunch.fromJSON({
            ...params,
            proposer: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "msgSubmitProposalExpiryFuturesMarketLaunchError",
            err
        );
    }
}

/**
 * Submits a proposal to launch a spot market.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.MsgSubmitProposalSpotMarketLaunchParams} params - Parameters to submit the proposal.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgSubmitProposalSpotMarketLaunch(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.MsgSubmitProposalSpotMarketLaunchParams
): Promise<StandardResponse> {
    try {
        const msg = MsgSubmitProposalSpotMarketLaunch.fromJSON({
            ...params,
            proposer: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "msgSubmitProposalSpotMarketLaunchError",
            err
        );
    }
}

/**
 * Submits a proposal to launch a perpetual market.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.MsgSubmitProposalPerpetualMarketLaunchParams} params - Parameters to submit the proposal.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgSubmitProposalPerpetualMarketLaunch(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.MsgSubmitProposalPerpetualMarketLaunchParams
): Promise<StandardResponse> {
    try {
        const msg = MsgSubmitProposalPerpetualMarketLaunch.fromJSON({
            ...params,
            proposer: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "msgSubmitProposalPerpetualMarketLaunchError",
            err
        );
    }
}

/**
 * Casts a vote on a specific proposal.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.MsgVoteParams} params - Parameters to cast the vote.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgVote(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.MsgVoteParams
): Promise<StandardResponse> {
    try {
        const msg = MsgVote.fromJSON({
            ...params,
            voter: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgVoteError", err);
    }
}

/**
 * Submits a text-based proposal.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.MsgSubmitTextProposalParams} params - Parameters to submit the text proposal.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgSubmitTextProposal(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.MsgSubmitTextProposalParams
): Promise<StandardResponse> {
    try {
        const msg = MsgSubmitTextProposal.fromJSON({
            ...params,
            proposer: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgSubmitTextProposalError", err);
    }
}

/**
 * Submits a proposal to update spot market parameters.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.MsgSubmitProposalSpotMarketParamUpdateParams} params - Parameters to submit the proposal.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgSubmitProposalSpotMarketParamUpdate(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.MsgSubmitProposalSpotMarketParamUpdateParams
): Promise<StandardResponse> {
    try {
        const msg = MsgSubmitProposalSpotMarketParamUpdate.fromJSON({
            ...params,
            proposer: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse(
            "msgSubmitProposalSpotMarketParamUpdateError",
            err
        );
    }
}

/**
 * Submits a generic proposal.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.MsgSubmitGenericProposalParams} params - Parameters to submit the generic proposal.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgSubmitGenericProposal(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.MsgSubmitGenericProposalParams
): Promise<StandardResponse> {
    try {
        const msg = MsgSubmitGenericProposal.fromJSON({
            ...params,
            proposer: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgSubmitGenericProposalError", err);
    }
}

/**
 * Deposits tokens to a specific proposal.
 *
 * @this InjectiveGrpcBase
 * @param {GovernanceTypes.MsgGovDepositParams} params - Parameters to deposit tokens to a proposal.
 * @returns {Promise<StandardResponse>} The standard response containing the transaction result or an error.
 */
export async function msgGovDeposit(
    this: InjectiveGrpcBase,
    params: GovernanceTypes.MsgGovDepositParams
): Promise<StandardResponse> {
    try {
        const msg = MsgGovDeposit.fromJSON({
            ...params,
            depositor: this.injAddress,
        });
        const result: TxResponse = await this.msgBroadcaster.broadcast({
            msgs: msg,
        });
        return createSuccessResponse(result);
    } catch (err) {
        return createErrorResponse("msgDepositError", err);
    }
}
