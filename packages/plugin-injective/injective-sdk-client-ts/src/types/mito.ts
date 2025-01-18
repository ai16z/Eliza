import type {
    Coin,
    MitoVault,
    MitoPagination,
    MitoPriceSnapshot,
    MitoSubscription,
    MitoHolders,
    MitoPortfolio,
    MitoLeaderboard,
    MitoTransfer,
    MitoLeaderboardEpoch,
    MitoStakingPool,
    MitoMission,
    MitoMissionLeaderboard,
    MitoIDO,
    MitoIDOSubscriber,
    MitoTokenInfo,
    MitoIDOSubscription,
    MitoIDOSubscriptionActivity,
    MitoWhitelistAccount,
    MitoClaimReference,
} from "@injectivelabs/sdk-ts";
import type { PaginationParams, TimeRangeParams, AddressParams } from "./base";
// Mito Module Params
// Param interfaces

export interface GetVaultParams {
    contractAddress?: string;
    slug?: string;
}

export interface GetVaultsParams {
    limit?: number;
    codeId?: string;
    pageIndex?: number;
}

export interface GetLpTokenPriceChartParams {
    to?: string;
    from?: string;
    vaultAddress: string;
}

export interface GetTVLChartParams {
    to?: string;
    from?: string;
    vaultAddress: string;
}

export interface GetVaultsByHolderAddressParams {
    skip?: number;
    limit?: number;
    holderAddress: string;
    vaultAddress?: string;
}

export interface GetLPHoldersParams {
    skip?: number;
    limit?: number;
    vaultAddress: string;
    stakingContractAddress: string;
}

export interface GetHolderPortfolioParams {
    holderAddress: string;
    stakingContractAddress: string;
}

export interface GetTransferHistoryParams {
    vault?: string;
    account?: string;
    limit?: number;
    toNumber?: number;
    fromNumber?: number;
}

export interface GetLeaderboardParams {
    epochId?: number;
}

export interface GetLeaderboardEpochsParams {
    limit?: number;
    toEpochId?: number;
    fromEpochId?: number;
}

export interface GetStakingPoolsParams {
    staker?: string;
    stakingContractAddress: string;
}

export interface GetStakingHistoryParams {
    staker?: string;
    limit?: number;
    toNumber?: number;
    fromNumber?: number;
}

export interface GetStakingRewardsByAccountParams {
    staker: string;
    stakingContractAddress: string;
}

export interface GetMissionsParams {
    accountAddress: string;
}

export interface GetMissionLeaderboardParams {
    userAddress?: string;
}

export interface GetIDOParams {
    contractAddress: string;
    accountAddress?: string;
}

export interface GetIDOsParams {
    status?: string;
    limit?: number;
    toNumber?: number;
    accountAddress?: string;
    ownerAddress?: string;
}

export interface GetIDOSubscribersParams {
    skip?: number;
    limit?: number;
    sortBy?: string;
    contractAddress: string;
}

export interface GetIDOSubscriptionParams {
    contractAddress: string;
    accountAddress: string;
}

export interface GetIDOActivitiesParams {
    contractAddress?: string;
    accountAddress?: string;
    limit?: number;
    toNumber?: string;
}

export interface GetIDOWhitelistParams {
    skip?: number;
    limit?: number;
    idoAddress: string;
}

export interface GetClaimReferencesParams {
    skip?: number;
    limit?: number;
    idoAddress: string;
    accountAddress: string;
}

// Response interfaces
export interface GetVaultResponse {
    vault: MitoVault;
}

export interface GetVaultsResponse {
    vaults: MitoVault[];
    pagination?: MitoPagination;
}

export interface GetLpTokenPriceChartResponse {
    priceSnapshots: MitoPriceSnapshot[];
}

export interface GetTVLChartResponse {
    priceSnapshots: MitoPriceSnapshot[];
}

export interface GetVaultsByHolderAddressResponse {
    subscriptions: MitoSubscription[];
    pagination?: MitoPagination;
}

export interface GetLPHoldersResponse {
    holders: MitoHolders[];
    pagination?: MitoPagination;
}

export interface GetHolderPortfolioResponse {
    portfolio: MitoPortfolio;
}

export interface GetTransferHistoryResponse {
    transfers: MitoTransfer[];
    pagination?: MitoPagination;
}

export interface GetLeaderboardResponse {
    leaderboard: MitoLeaderboard;
}

export interface GetLeaderboardEpochsResponse {
    epochs: MitoLeaderboardEpoch[];
    pagination?: MitoPagination;
}

export interface GetStakingPoolsResponse {
    pools: MitoStakingPool[];
    pagination?: MitoPagination;
}

export interface StakingActivity {
    action: string;
    txHash: string;
    staker: string;
    vaultAddress: string;
    numberByAccount: number;
    timestamp: number;
    rewardedTokens: Coin[];
    stakeAmount: Coin | undefined;
}

export interface GetStakingHistoryResponse {
    activities: StakingActivity[];
    pagination?: MitoPagination;
}

export interface StakingReward {
    apr: number;
    vaultName: string;
    vaultAddress: string;
    lockTimestamp: number;
    claimableRewards: Coin[];
    stakedAmount: Coin | undefined;
    lockedAmount: Coin | undefined;
}

export interface GetStakingRewardsByAccountResponse {
    rewards: StakingReward[];
    pagination?: MitoPagination;
}

export interface GetMissionsResponse {
    missions: MitoMission[];
}

export interface GetMissionLeaderboardResponse {
    leaderboard: MitoMissionLeaderboard;
}

export interface GetIDOResponse {
    ido?: MitoIDO;
}

export interface GetIDOsResponse {
    idos: MitoIDO[];
    pagination?: MitoPagination;
}

export interface GetIDOSubscribersResponse {
    marketId: string;
    quoteDenom: string;
    subscribers: MitoIDOSubscriber[];
    pagination?: MitoPagination;
    tokenInfo?: MitoTokenInfo;
}

export interface GetIDOSubscriptionResponse {
    subscription?: MitoIDOSubscription;
}

export interface GetIDOActivitiesResponse {
    activities: MitoIDOSubscriptionActivity[];
    pagination?: MitoPagination;
}

export interface GetIDOWhitelistResponse {
    idoAddress?: string;
    accounts: MitoWhitelistAccount[];
    pagination?: MitoPagination;
}

export interface GetClaimReferencesResponse {
    claimReferences: MitoClaimReference[];
    pagination?: MitoPagination;
}

export interface VaultParams {
    contractAddress?: string;
    slug?: string;
}

export interface VaultsParams extends PaginationParams {
    limit?: number;
    codeId?: string;
    pageIndex?: number;
}

export interface ChartParams extends TimeRangeParams {
    vaultAddress: string;
}

export interface VaultHolderParams extends PaginationParams {
    skip?: number;
    limit?: number;
    holderAddress: string;
    vaultAddress?: string;
}

export interface LPHoldersParams extends PaginationParams {
    skip?: number;
    limit?: number;
    vaultAddress: string;
    stakingContractAddress: string;
}

export interface HolderPortfolioParams {
    holderAddress: string;
    stakingContractAddress: string;
}

export interface TransferHistoryParams extends PaginationParams {
    vault?: string;
    account?: string;
    limit?: number;
    toNumber?: number;
    fromNumber?: number;
}

export interface LeaderboardEpochParams extends PaginationParams {
    limit?: number;
    toEpochId?: number;
    fromEpochId?: number;
}

export interface StakingPoolParams {
    staker?: string;
    stakingContractAddress: string;
}

export interface StakingHistoryParams extends PaginationParams {
    staker?: string;
    limit?: number;
    toNumber?: number;
    fromNumber?: number;
}

export interface StakingRewardsParams {
    staker: string;
    stakingContractAddress: string;
}

export interface MissionParams extends AddressParams {
    accountAddress: string;
}

export interface IDOParams {
    contractAddress: string;
    accountAddress?: string;
}

export interface IDOListParams extends PaginationParams {
    status?: string;
    limit?: number;
    toNumber?: number;
    accountAddress?: string;
    ownerAddress?: string;
}

export interface IDOSubscribersParams extends PaginationParams {
    skip?: number;
    limit?: number;
    sortBy?: string;
    contractAddress: string;
}

export interface IDOSubscriptionParams {
    contractAddress: string;
    accountAddress: string;
}

export interface IDOActivityParams extends PaginationParams {
    contractAddress?: string;
    accountAddress?: string;
    limit?: number;
    toNumber?: string;
}

export interface IDOWhitelistParams extends PaginationParams {
    skip?: number;
    limit?: number;
    idoAddress: string;
}

export interface ClaimReferenceParams extends PaginationParams {
    skip?: number;
    limit?: number;
    idoAddress: string;
    accountAddress: string;
}

export enum VaultContractType {
    ManagedVault = "crates.io:managed-vault",
    CPMM = "crates.io:vault-cpmm-spot",
    ASMMSpot = "crates.io:vault-asmm-spot",
    ASMMPerp = "crates.io:vault-asmm-perp",
}

export enum DerivativeRedemptionType {
    QuoteOnly = "QuoteOnly",
    PositionAndQuote = "PositionAndQuote",
}

export enum SpotRedemptionType {
    BaseOnly = "BaseOnly",
    QuoteOnly = "QuoteOnly",
    BaseAndQuote = "BaseAndQuote",
    FixedBaseAndQuote = "FixedBaseAndQuote",
    VariableBaseAndQuote = "VariableBaseAndQuote",
}

export enum VaultMarketType {
    Spot = "Spot",
    Derivative = "Derivative",
}

export interface GetLaunchpadSubscribeParams {
    amount: number;
    quoteTokenDenom: string;
    quoteTokenDecimals: number;
    contractAddress: string;
}
export interface GetLaunchpadClaimParams {
    contractAddress: string;
}

export interface GetSubscribeVaultParams {
    market: {
        baseDenom: string;
        baseDecimals: number;
        quoteDecimals: number;
        quoteDenom: string;
    };

    baseAmount: number;
    quoteAmount: number;
    subscriptionType: SpotRedemptionType;
    vaultDetails: {
        vaultSubaccountId: string;
        vaultMasterAddress: string;
        vaultType: VaultContractType;
    };
    slippage?: {
        max_penalty: string;
    };
}

export interface GetInstantiateCPMMVaultParams {
    MITO_MASTER_CONTRACT_ADDRESS: string;
    CPMM_CONTRACT_CODE: number;
    senderWalletAddress: string;
    marketId: string;
    feeBps: number;
    baseDecimals: number;
    quoteDecimals: number;
    funds: {
        denom: string;
        amount: string;
    }[];
    // Overrides default parameters
    notionalValueCap?: string;
    pricingStrategy?: {
        SmoothingPricingWithRelativePriceRange: {
            bid_range: string;
            ask_range: string;
        };
    };
    maxInvariantSensitivityBps?: string;
    maxPriceSensitivityBps?: string;
    orderType?: string;
}

export interface GetVaultSubscribeParams {
    vaultType: VaultContractType;
    slippage?: {
        max_penalty: string;
    };

    vaultSubaccountId: string;
    baseAmount: number;
    quoteAmount: number;
    market: {
        baseDenom: string;
        baseDecimals: number;
        quoteDenom: string;
        quoteDecimals: number;
    };
    subscriptionType: SpotRedemptionType;
    masterAddress: string;
}

export interface GetVaultRedeemParams {
    vaultSubaccountId: string;
    marketType: VaultMarketType;
    slippage?: {
        max_penalty: string;
    };
    redemptionType: SpotRedemptionType | DerivativeRedemptionType;
    redeemAmount: number;
    vaultBaseDecimals: number;
    masterAddress: string;
    vaultLpDenom: string;
}

export interface GetStakeVaultLPParams {
    amount: number;
    vaultLpDenom: string;
    vaultTokenDecimals: number;
    stakingContractAddress: string;
}

export interface GetUnstakeVaultLPParams {
    amount: number;
    vaultLpDenom: string;
    vaultTokenDecimals: number;
    stakingContractAddress: string;
}

export interface GetClaimVaultRewardsParams {
    vaultLpDenom: string;
    stakingContractAddress: string;
}

export interface GetVaultsParams {
    skip?: number;
    limit?: number;
}

export interface GetLPHoldersParams {
    vaultAddress: string;
    stakingContractAddress: string;
}

export interface GetStakingPoolsParams {
    stakingContractAddress: string;
}
