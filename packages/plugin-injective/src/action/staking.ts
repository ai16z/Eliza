import { createGenericAction } from "./base";
import * as StakingTemplates from "@injective/template/staking";
import * as StakingExamples from "@injective/examples/staking";
import * as StakingSimiles from "@injective/similes/staking";
// Module and Pool Query Actions
export const GetStakingModuleParamsAction = createGenericAction({
    name: "GET_STAKING_MODULE_PARAMS",
    description: "Fetches the staking module parameters",
    template: StakingTemplates.getStakingModuleParamsTemplate,
    examples: StakingExamples.getStakingModuleParamsExample,
    similes: StakingSimiles.getStakingModuleParamsSimiles,
    functionName: "getStakingModuleParams",
    validateContent: () => true,
});

export const GetPoolAction = createGenericAction({
    name: "GET_POOL",
    description: "Fetches the staking pool information",
    template: StakingTemplates.getPoolTemplate,
    examples: StakingExamples.getPoolExample,
    similes: StakingSimiles.getPoolSimiles,
    functionName: "getPool",
    validateContent: () => true,
});

// Validator Query Actions
export const GetValidatorsAction = createGenericAction({
    name: "GET_VALIDATORS",
    description: "Fetches a list of validators with optional pagination",
    template: StakingTemplates.getValidatorsTemplate,
    examples: StakingExamples.getValidatorsExample,
    similes: StakingSimiles.getValidatorSimiles,
    functionName: "getValidators",
    validateContent: () => true,
});

export const GetValidatorAction = createGenericAction({
    name: "GET_VALIDATOR",
    description: "Fetches a specific validator by address",
    template: StakingTemplates.getValidatorTemplate,
    examples: StakingExamples.getValidatorExample,
    similes: StakingSimiles.getValidatorSimiles,
    functionName: "getValidator",
    validateContent: () => true,
});

// Delegation Query Actions
export const GetValidatorDelegationsAction = createGenericAction({
    name: "GET_VALIDATOR_DELEGATIONS",
    description: "Fetches delegations for a specific validator",
    template: StakingTemplates.getValidatorDelegationsTemplate,
    examples: StakingExamples.getValidatorDelegationsExample,
    similes: StakingSimiles.getValidatorDelegationsSimiles,
    functionName: "getValidatorDelegations",
    validateContent: () => true,
});

export const GetValidatorDelegationsNoThrowAction = createGenericAction({
    name: "GET_VALIDATOR_DELEGATIONS_NO_THROW",
    description:
        "Fetches delegations for a specific validator without throwing an error",
    template: StakingTemplates.getValidatorDelegationsNoThrowTemplate,
    examples: StakingExamples.getValidatorDelegationsNoThrowExample,
    similes: StakingSimiles.getValidatorDelegationsNoThrowSimiles,
    functionName: "getValidatorDelegationsNoThrow",
    validateContent: () => true,
});

export const GetValidatorUnbondingDelegationsAction = createGenericAction({
    name: "GET_VALIDATOR_UNBONDING_DELEGATIONS",
    description: "Fetches unbonding delegations for a specific validator",
    template: StakingTemplates.getValidatorUnbondingDelegationsTemplate,
    examples: StakingExamples.getValidatorUnbondingDelegationsExample,
    similes: StakingSimiles.getValidatorUnbondingDelegationsSimiles,
    functionName: "getValidatorUnbondingDelegations",
    validateContent: () => true,
});

export const GetValidatorUnbondingDelegationsNoThrowAction =
    createGenericAction({
        name: "GET_VALIDATOR_UNBONDING_DELEGATIONS_NO_THROW",
        description:
            "Fetches unbonding delegations for a specific validator without throwing an error",
        template:
            StakingTemplates.getValidatorUnbondingDelegationsNoThrowTemplate,
        examples:
            StakingExamples.getValidatorUnbondingDelegationsNoThrowExample,
        similes: StakingSimiles.getValidatorDelegationsNoThrowSimiles,
        functionName: "getValidatorUnbondingDelegationsNoThrow",
        validateContent: () => true,
    });

export const GetDelegationAction = createGenericAction({
    name: "GET_DELEGATION",
    description: "Fetches a specific delegation",
    template: StakingTemplates.getDelegationTemplate,
    examples: StakingExamples.getDelegationExample,
    similes: StakingSimiles.getDelegationSimiles,
    functionName: "getDelegation",
    validateContent: () => true,
});

export const GetDelegationsAction = createGenericAction({
    name: "GET_DELEGATIONS",
    description: "Fetches all delegations for a delegator",
    template: StakingTemplates.getDelegationsTemplate,
    examples: StakingExamples.getDelegationsExample,
    similes: StakingSimiles.getDelegationsSimiles,
    functionName: "getDelegations",
    validateContent: () => true,
});

export const GetDelegationsNoThrowAction = createGenericAction({
    name: "GET_DELEGATIONS_NO_THROW",
    description:
        "Fetches all delegations for a delegator without throwing an error",
    template: StakingTemplates.getDelegationsNoThrowTemplate,
    examples: StakingExamples.getDelegationsNoThrowExample,
    similes: StakingSimiles.getDelegationsNoThrowSimiles,
    functionName: "getDelegationsNoThrow",
    validateContent: () => true,
});

export const GetDelegatorsAction = createGenericAction({
    name: "GET_DELEGATORS",
    description: "Fetches all delegators for a validator",
    template: StakingTemplates.getDelegatorsTemplate,
    examples: StakingExamples.getDelegatorsExample,
    similes: StakingSimiles.getDelegatorsSimiles,
    functionName: "getDelegators",
    validateContent: () => true,
});

export const GetDelegatorsNoThrowAction = createGenericAction({
    name: "GET_DELEGATORS_NO_THROW",
    description:
        "Fetches all delegators for a validator without throwing an error",
    template: StakingTemplates.getDelegatorsNoThrowTemplate,
    examples: StakingExamples.getDelegatorsNoThrowExample,
    similes: StakingSimiles.getDelegatorsNoThrowSimiles,
    functionName: "getDelegatorsNoThrow",
    validateContent: () => true,
});

export const GetUnbondingDelegationsAction = createGenericAction({
    name: "GET_UNBONDING_DELEGATIONS",
    description: "Fetches all unbonding delegations for a delegator",
    template: StakingTemplates.getUnbondingDelegationsTemplate,
    examples: StakingExamples.getUnbondingDelegationsExample,
    similes: StakingSimiles.getUnbondingDelegationsSimiles,
    functionName: "getUnbondingDelegations",
    validateContent: () => true,
});

export const GetUnbondingDelegationsNoThrowAction = createGenericAction({
    name: "GET_UNBONDING_DELEGATIONS_NO_THROW",
    description:
        "Fetches all unbonding delegations for a delegator without throwing an error",
    template: StakingTemplates.getUnbondingDelegationsNoThrowTemplate,
    examples: StakingExamples.getUnbondingDelegationsNoThrowExample,
    similes: StakingSimiles.getUnbondingDelegationsNoThrowSimiles,
    functionName: "getUnbondingDelegationsNoThrow",
    validateContent: () => true,
});

export const GetReDelegationsAction = createGenericAction({
    name: "GET_REDELEGATIONS",
    description: "Fetches all redelegations for a delegator",
    template: StakingTemplates.getReDelegationsTemplate,
    examples: StakingExamples.getReDelegationsExample,
    similes: StakingSimiles.getReDelegationsSimiles,
    functionName: "getReDelegations",
    validateContent: () => true,
});

export const GetReDelegationsNoThrowAction = createGenericAction({
    name: "GET_REDELEGATIONS_NO_THROW",
    description:
        "Fetches all redelegations for a delegator without throwing an error",
    template: StakingTemplates.getReDelegationsNoThrowTemplate,
    examples: StakingExamples.getReDelegationsNoThrowExample,
    similes: StakingSimiles.getReDelegationsNoThrowSimiles,
    functionName: "getReDelegationsNoThrow",
    validateContent: () => true,
});

// Message Actions
export const MsgBeginRedelegateAction = createGenericAction({
    name: "MSG_BEGIN_REDELEGATE",
    description: "Broadcasts a message to begin redelegating tokens",
    template: StakingTemplates.msgBeginRedelegateTemplate,
    examples: StakingExamples.msgBeginRedelegateExample,
    similes: StakingSimiles.msgBeginRedelegateSimiles,
    functionName: "msgBeginRedelegate",
    validateContent: () => true,
});

export const MsgDelegateAction = createGenericAction({
    name: "MSG_DELEGATE",
    description: "Broadcasts a message to delegate tokens to a validator",
    template: StakingTemplates.msgDelegateTemplate,
    examples: StakingExamples.msgDelegateExample,
    similes: StakingSimiles.msgDelegateSimiles,
    functionName: "msgDelegate",
    validateContent: () => true,
});

export const MsgUndelegateAction = createGenericAction({
    name: "MSG_UNDELEGATE",
    description: "Broadcasts a message to undelegate tokens from a validator",
    template: StakingTemplates.msgUndelegateTemplate,
    examples: StakingExamples.msgUndelegateExample,
    similes: StakingSimiles.msgUndelegateSimiles,
    functionName: "msgUndelegate",
    validateContent: () => true,
});

export const MsgCreateValidatorAction = createGenericAction({
    name: "MSG_CREATE_VALIDATOR",
    description: "Broadcasts a message to create a new validator",
    template: StakingTemplates.msgCreateValidatorTemplate,
    examples: StakingExamples.msgCreateValidatorExample,
    similes: StakingSimiles.msgCreateValidatorSimiles,
    functionName: "msgCreateValidator",
    validateContent: () => true,
});

export const MsgEditValidatorAction = createGenericAction({
    name: "MSG_EDIT_VALIDATOR",
    description: "Broadcasts a message to edit an existing validator",
    template: StakingTemplates.msgEditValidatorTemplate,
    examples: StakingExamples.msgEditValidatorExample,
    similes: StakingSimiles.msgEditValidatorSimiles,
    functionName: "msgEditValidator",
    validateContent: () => true,
});

export const MsgCancelUnbondingDelegationAction = createGenericAction({
    name: "MSG_CANCEL_UNBONDING_DELEGATION",
    description: "Broadcasts a message to cancel an unbonding delegation",
    template: StakingTemplates.msgCancelUnbondingDelegationTemplate,
    examples: StakingExamples.msgCancelUnbondingDelegationExample,
    similes: StakingSimiles.msgCancelUnbondingDelegationSimiles,
    functionName: "msgCancelUnbondingDelegation",
    validateContent: () => true,
});

// Export all actions as a group
export const StakingActions = [
    // Module and Pool Actions
    GetStakingModuleParamsAction,
    GetPoolAction,

    // Validator Actions
    GetValidatorsAction,
    GetValidatorAction,

    // Delegation Query Actions
    GetValidatorDelegationsAction,
    GetValidatorDelegationsNoThrowAction,
    GetValidatorUnbondingDelegationsAction,
    GetValidatorUnbondingDelegationsNoThrowAction,
    GetDelegationAction,
    GetDelegationsAction,
    GetDelegationsNoThrowAction,
    GetDelegatorsAction,
    GetDelegatorsNoThrowAction,
    GetUnbondingDelegationsAction,
    GetUnbondingDelegationsNoThrowAction,
    GetReDelegationsAction,
    GetReDelegationsNoThrowAction,

    // Message Actions
    MsgBeginRedelegateAction,
    MsgDelegateAction,
    MsgUndelegateAction,
    MsgCreateValidatorAction,
    MsgEditValidatorAction,
    MsgCancelUnbondingDelegationAction,
];
