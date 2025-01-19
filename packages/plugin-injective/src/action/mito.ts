import { createGenericAction } from "./base";
import * as MitoTemplates from "@injective/template/mito";
import * as MitoExamples from "@injective/examples/mito";
import * as MitoSimiles from "@injective/similes/mito";
// Vault Related Actions
export const GetVaultAction = createGenericAction({
    name: "GET_VAULT",
    description: "Fetches the details of a specific vault",
    template: MitoTemplates.getVaultTemplate,
    examples: MitoExamples.getVaultExample,
    similes: MitoSimiles.getVaultSimiles,
    functionName: "getVault",
    validateContent: () => true,
});

export const GetVaultsAction = createGenericAction({
    name: "GET_VAULTS",
    description: "Fetches a list of all vaults with optional filtering",
    template: MitoTemplates.getVaultsTemplate,
    examples: MitoExamples.getVaultsExample,
    similes: MitoSimiles.getVaultSimiles,
    functionName: "getVaults",
    validateContent: () => true,
});

export const GetVaultsByHolderAddressAction = createGenericAction({
    name: "GET_VAULTS_BY_HOLDER_ADDRESS",
    description: "Fetches vaults associated with a specific holder address",
    template: MitoTemplates.getVaultsByHolderAddressTemplate,
    examples: MitoExamples.getVaultsByHolderAddressExample,
    similes: MitoSimiles.getVaultsByHolderAddressSimiles,
    functionName: "getVaultsByHolderAddress",
    validateContent: () => true,
});

// LP Token Related Actions
export const GetLpTokenPriceChartAction = createGenericAction({
    name: "GET_LP_TOKEN_PRICE_CHART",
    description: "Retrieves the price chart data for LP tokens",
    template: MitoTemplates.getLpTokenPriceChartTemplate,
    examples: MitoExamples.getLpTokenPriceChartExample,
    similes: MitoSimiles.getLpTokenPriceChartSimiles,
    functionName: "getLpTokenPriceChart",
    validateContent: () => true,
});

export const GetLPHoldersAction = createGenericAction({
    name: "GET_LP_HOLDERS",
    description: "Retrieves a list of LP token holders",
    template: MitoTemplates.getLPHoldersTemplate,
    examples: MitoExamples.getLPHoldersExample,
    similes: MitoSimiles.getLPHoldersSimiles,
    functionName: "getLPHolders",
    validateContent: () => true,
});

// TVL and Portfolio Actions
export const GetTVLChartAction = createGenericAction({
    name: "GET_TVL_CHART",
    description: "Retrieves the Total Value Locked (TVL) chart data",
    template: MitoTemplates.getTVLChartTemplate,
    examples: MitoExamples.getTVLChartExample,
    similes: MitoSimiles.getTVLChartSimiles,
    functionName: "getTVLChart",
    validateContent: () => true,
});

export const GetHolderPortfolioAction = createGenericAction({
    name: "GET_HOLDER_PORTFOLIO",
    description: "Retrieves the portfolio details of a specific holder",
    template: MitoTemplates.getHolderPortfolioTemplate,
    examples: MitoExamples.getHolderPortfolioExample,
    similes: MitoSimiles.getHolderPortfolioSimiles,
    functionName: "getHolderPortfolio",
    validateContent: () => true,
});

// Leaderboard Related Actions
export const GetLeaderboardAction = createGenericAction({
    name: "GET_LEADERBOARD",
    description: "Retrieves the leaderboard for a specific epoch",
    template: MitoTemplates.getLeaderboardTemplate,
    examples: MitoExamples.getLeaderboardExample,
    similes: MitoSimiles.getLeaderboardSimiles,
    functionName: "getLeaderboard",
    validateContent: () => true,
});

export const GetLeaderboardEpochsAction = createGenericAction({
    name: "GET_LEADERBOARD_EPOCHS",
    description: "Retrieves the epochs associated with leaderboards",
    template: MitoTemplates.getLeaderboardEpochsTemplate,
    examples: MitoExamples.getLeaderboardEpochsExample,
    similes: MitoSimiles.getLeaderboardEpochsSimiles,
    functionName: "getLeaderboardEpochs",
    validateContent: () => true,
});

// Transfer and History Actions
export const GetTransferHistoryAction = createGenericAction({
    name: "GET_TRANSFER_HISTORY",
    description: "Fetches the transfer history based on provided parameters",
    template: MitoTemplates.getTransferHistoryTemplate,
    examples: MitoExamples.getTransferHistoryExample,
    similes: MitoSimiles.getTransferHistorySimiles,
    functionName: "getTransferHistory",
    validateContent: () => true,
});

// Staking Related Actions
export const GetStakingPoolsAction = createGenericAction({
    name: "GET_STAKING_POOLS",
    description: "Retrieves information about staking pools",
    template: MitoTemplates.getStakingPoolsTemplate,
    examples: MitoExamples.getStakingPoolsExample,
    similes: MitoSimiles.getStakingPoolsSimiles,
    functionName: "getStakingPools",
    validateContent: () => true,
});

export const GetStakingHistoryAction = createGenericAction({
    name: "GET_STAKING_HISTORY",
    description: "Retrieves the staking history based on provided parameters",
    template: MitoTemplates.getStakingHistoryTemplate,
    examples: MitoExamples.getStakingHistoryExample,
    similes: MitoSimiles.getStakingHistorySimiles,
    functionName: "getStakingHistory",
    validateContent: () => true,
});

export const GetStakingRewardsByAccountAction = createGenericAction({
    name: "GET_STAKING_REWARDS_BY_ACCOUNT",
    description: "Retrieves staking rewards for a specific account",
    template: MitoTemplates.getStakingRewardsByAccountTemplate,
    examples: MitoExamples.getStakingRewardsByAccountExample,
    similes: MitoSimiles.getStakingRewardsByAccountSimiles,
    functionName: "getStakingRewardsByAccount",
    validateContent: () => true,
});

// Mission Related Actions
export const GetMissionsAction = createGenericAction({
    name: "GET_MISSIONS",
    description: "Fetches a list of missions based on provided parameters",
    template: MitoTemplates.getMissionsTemplate,
    examples: MitoExamples.getMissionsExample,
    similes: MitoSimiles.getMissionsSimiles,
    functionName: "getMissions",
    validateContent: () => true,
});

export const GetMissionLeaderboardAction = createGenericAction({
    name: "GET_MISSION_LEADERBOARD",
    description:
        "Retrieves the leaderboard for missions based on the user address",
    template: MitoTemplates.getMissionLeaderboardTemplate,
    examples: MitoExamples.getMissionLeaderboardExample,
    similes: MitoSimiles.getMissionLeaderboardSimiles,
    functionName: "getMissionLeaderboard",
    validateContent: () => true,
});

// IDO Related Actions
export const GetIDOAction = createGenericAction({
    name: "GET_IDO",
    description: "Fetches details of a specific Initial DEX Offering (IDO)",
    template: MitoTemplates.getIDOTemplate,
    examples: MitoExamples.getIDOExample,
    similes: MitoSimiles.getIDOSimiles,
    functionName: "getIDO",
    validateContent: () => true,
});

export const GetIDOsAction = createGenericAction({
    name: "GET_IDOS",
    description: "Retrieves a list of all IDOs with optional filtering",
    template: MitoTemplates.getIDOsTemplate,
    examples: MitoExamples.getIDOsExample,
    similes: MitoSimiles.getIDOsSimiles,
    functionName: "getIDOs",
    validateContent: () => true,
});

export const GetIDOSubscribersAction = createGenericAction({
    name: "GET_IDO_SUBSCRIBERS",
    description: "Fetches subscribers for a specific IDO",
    template: MitoTemplates.getIDOSubscribersTemplate,
    examples: MitoExamples.getIDOSubscribersExample,
    similes: MitoSimiles.getIDOSubscribersSimiles,
    functionName: "getIDOSubscribers",
    validateContent: () => true,
});

export const GetIDOSubscriptionAction = createGenericAction({
    name: "GET_IDO_SUBSCRIPTION",
    description: "Retrieves the subscription details for a specific IDO",
    template: MitoTemplates.getIDOSubscriptionTemplate,
    examples: MitoExamples.getIDOSubscriptionExample,
    similes: MitoSimiles.getIDOSubscriptionSimiles,
    functionName: "getIDOSubscription",
    validateContent: () => true,
});

export const GetIDOActivitiesAction = createGenericAction({
    name: "GET_IDO_ACTIVITIES",
    description: "Retrieves activities related to a specific IDO",
    template: MitoTemplates.getIDOActivitiesTemplate,
    examples: MitoExamples.getIDOActivitiesExample,
    similes: MitoSimiles.getIDOActivitiesSimiles,
    functionName: "getIDOActivities",
    validateContent: () => true,
});

export const GetIDOWhitelistAction = createGenericAction({
    name: "GET_IDO_WHITELIST",
    description: "Fetches the whitelist for a specific IDO",
    template: MitoTemplates.getIDOWhitelistTemplate,
    examples: MitoExamples.getIDOWhitelistExample,
    similes: MitoSimiles.getIDOWhitelistSimiles,
    functionName: "getIDOWhitelist",
    validateContent: () => true,
});

export const GetClaimReferencesAction = createGenericAction({
    name: "GET_CLAIM_REFERENCES",
    description: "Retrieves claim references based on provided parameters",
    template: MitoTemplates.getClaimReferencesTemplate,
    examples: MitoExamples.getClaimReferencesExample,
    similes: MitoSimiles.getClaimReferencesSimiles,
    functionName: "getClaimReferences",
    validateContent: () => true,
});

export const GetLaunchpadSubscribeAction = createGenericAction({
    name: "GET_LAUNCHPAD_SUBSCRIBE",
    description: "Subscribes to a launchpad offering",
    template: MitoTemplates.getLaunchpadSubscribeTemplate,
    examples: MitoExamples.getLaunchpadSubscribeExample,
    similes: MitoSimiles.getLaunchpadSubscribeSimiles,
    functionName: "getLaunchpadSubscribe",
    validateContent: () => true,
});

export const GetLaunchpadClaimAction = createGenericAction({
    name: "GET_LAUNCHPAD_CLAIM",
    description: "Claims tokens from a launchpad offering",
    template: MitoTemplates.getLaunchpadClaimTemplate,
    examples: MitoExamples.getLaunchpadClaimExample,
    similes: MitoSimiles.getLaunchpadClaimSimiles,
    functionName: "getLaunchpadClaim",
    validateContent: () => true,
});

// Vault Related Actions
export const GetSubscribeVaultAction = createGenericAction({
    name: "GET_SUBSCRIBE_VAULT",
    description: "Subscribes to a specific vault",
    template: MitoTemplates.getSubscribeVaultTemplate,
    examples: MitoExamples.getSubscribeVaultExample,
    similes: MitoSimiles.getSubscribeVaultSimiles,
    functionName: "getSubscribeVault",
    validateContent: () => true,
});

export const GetInstantiateCPMMVaultAction = createGenericAction({
    name: "GET_INSTANTIATE_CPMM_VAULT",
    description: "Creates a new CPMM vault instance",
    template: MitoTemplates.getInstantiateCPMMVaultTemplate,
    examples: MitoExamples.getInstantiateCPMMVaultExample,
    similes: MitoSimiles.getInstantiateCPMMVaultSimiles,
    functionName: "getInstantiateCPMMVault",
    validateContent: () => true,
});

export const GetRedeemFromVaultAction = createGenericAction({
    name: "GET_REDEEM_FROM_VAULT",
    description: "Redeems tokens from a specific vault",
    template: MitoTemplates.getRedeemFromVaultTemplate,
    examples: MitoExamples.getRedeemFromVaultExample,
    similes: MitoSimiles.getRedeemFromVaultSimiles,
    functionName: "getRedeemFromVault",
    validateContent: () => true,
});

export const GetStakeVaultLPAction = createGenericAction({
    name: "GET_STAKE_VAULT_LP",
    description: "Stakes LP tokens in a vault",
    template: MitoTemplates.getStakeVaultLPTemplate,
    examples: MitoExamples.getStakeVaultLPExample,
    similes: MitoSimiles.getStakeVaultLPSimiles,
    functionName: "getStakeVaultLP",
    validateContent: () => true,
});

export const GetUnstakeVaultLPAction = createGenericAction({
    name: "GET_UNSTAKE_VAULT_LP",
    description: "Unstakes LP tokens from a vault",
    template: MitoTemplates.getUnstakeVaultLPTemplate,
    examples: MitoExamples.getUnstakeVaultLPExample,
    similes: MitoSimiles.getUnstakeVaultLPSimiles,
    functionName: "getUnstakeVaultLP",
    validateContent: () => true,
});

export const GetClaimVaultRewardsAction = createGenericAction({
    name: "GET_CLAIM_VAULT_REWARDS",
    description: "Claims rewards from a vault",
    template: MitoTemplates.getClaimVaultRewardsTemplate,
    examples: MitoExamples.getClaimVaultRewardsExample,
    similes: MitoSimiles.getClaimVaultRewardsSimiles,
    functionName: "getClaimVaultRewards",
    validateContent: () => true,
});

// Export all actions as a group
export const MitoActions = [
    GetVaultAction,
    GetVaultsAction,
    GetVaultsByHolderAddressAction,
    GetLpTokenPriceChartAction,
    GetLPHoldersAction,
    GetTVLChartAction,
    GetHolderPortfolioAction,
    GetLeaderboardAction,
    GetLeaderboardEpochsAction,
    GetTransferHistoryAction,
    GetStakingPoolsAction,
    GetStakingHistoryAction,
    GetStakingRewardsByAccountAction,
    GetMissionsAction,
    GetMissionLeaderboardAction,
    GetIDOAction,
    GetIDOsAction,
    GetIDOSubscribersAction,
    GetIDOSubscriptionAction,
    GetIDOActivitiesAction,
    GetIDOWhitelistAction,
    GetClaimReferencesAction,
    GetLaunchpadSubscribeAction,
    GetLaunchpadClaimAction,
    GetSubscribeVaultAction,
    GetInstantiateCPMMVaultAction,
    GetRedeemFromVaultAction,
    GetStakeVaultLPAction,
    GetUnstakeVaultLPAction,
    GetClaimVaultRewardsAction,
];
