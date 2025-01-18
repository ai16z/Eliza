import { createGenericAction } from "./base";
import * as DistributionTemplates from "@injective/template/distribution";
import * as DistributionExamples from "@injective/examples/distribution";
import * as DistributionSimilies from "@injective/similes/distribution";

export const GetDistributionModuleParamsAction = createGenericAction({
    name: "GET_DISTRIBUTION_MODULE_PARAMS",
    description: "Fetches the distribution module parameters",
    template: DistributionTemplates.getDistributionModuleParamsTemplate,
    examples: DistributionExamples.getDistributionModuleParamsExample,
    similes: DistributionSimilies.getDistributionModuleParamsSimiles,
    functionName: "getDistributionModuleParams",
    validateContent: () => true,
});

export const GetDelegatorRewardsForValidatorAction = createGenericAction({
    name: "GET_DELEGATOR_REWARDS_FOR_VALIDATOR",
    description: "Fetches the delegator rewards for a specific validator",
    template: DistributionTemplates.getDelegatorRewardsForValidatorTemplate,
    examples: DistributionExamples.getDelegatorRewardsForValidatorExample,
    similes: DistributionSimilies.getDelegatorRewardsForValidatorSimiles,
    functionName: "getDelegatorRewardsForValidator",
    validateContent: () => true,
});

export const GetDelegatorRewardsForValidatorNoThrowAction = createGenericAction(
    {
        name: "GET_DELEGATOR_REWARDS_FOR_VALIDATOR_NO_THROW",
        description:
            "Fetches the delegator rewards for a specific validator without throwing errors",
        template:
            DistributionTemplates.getDelegatorRewardsForValidatorNoThrowTemplate,
        examples:
            DistributionExamples.getDelegatorRewardsForValidatorNoThrowExample,
        similes:
            DistributionSimilies.getDelegatorRewardsForValidatorNoThrowSimiles,
        functionName: "getDelegatorRewardsForValidatorNoThrow",
        validateContent: () => true,
    }
);

export const GetDelegatorRewardsAction = createGenericAction({
    name: "GET_DELEGATOR_REWARDS",
    description: "Fetches the rewards for a delegator",
    template: DistributionTemplates.getDelegatorRewardsTemplate,
    examples: DistributionExamples.getDelegatorRewardsExample,
    similes: DistributionSimilies.getDelegatorRewardsSimiles,
    functionName: "getDelegatorRewards",
    validateContent: () => true,
});

export const GetDelegatorRewardsNoThrowAction = createGenericAction({
    name: "GET_DELEGATOR_REWARDS_NO_THROW",
    description: "Fetches the rewards for a delegator without throwing errors",
    template: DistributionTemplates.getDelegatorRewardsNoThrowTemplate,
    examples: DistributionExamples.getDelegatorRewardsNoThrowExample,
    similes: DistributionSimilies.getDelegatorRewardsNoThrowSimiles,
    functionName: "getDelegatorRewardsNoThrow",
    validateContent: () => true,
});

export const MsgWithdrawDelegatorRewardAction = createGenericAction({
    name: "MSG_WITHDRAW_DELEGATOR_REWARD",
    description: "Withdraws delegator rewards from a specific validator",
    template: DistributionTemplates.msgWithdrawDelegatorRewardTemplate,
    examples: DistributionExamples.msgWithdrawDelegatorRewardExample,
    similes: DistributionSimilies.msgWithdrawDelegatorRewardSimiles,
    functionName: "msgWithdrawDelegatorReward",
    validateContent: () => true,
});

export const MsgWithdrawValidatorCommissionAction = createGenericAction({
    name: "MSG_WITHDRAW_VALIDATOR_COMMISSION",
    description: "Withdraws validator commission rewards",
    template: DistributionTemplates.msgWithdrawValidatorCommissionTemplate,
    examples: DistributionExamples.msgWithdrawValidatorCommissionExample,
    similes: DistributionSimilies.msgWithdrawValidatorCommissionSimiles,
    functionName: "msgWithdrawValidatorCommission",
    validateContent: () => true,
});

// Export all actions as a group
export const DistributionActions = [
    GetDistributionModuleParamsAction,
    GetDelegatorRewardsForValidatorAction,
    GetDelegatorRewardsForValidatorNoThrowAction,
    GetDelegatorRewardsAction,
    GetDelegatorRewardsNoThrowAction,
    MsgWithdrawDelegatorRewardAction,
    MsgWithdrawValidatorCommissionAction,
];
