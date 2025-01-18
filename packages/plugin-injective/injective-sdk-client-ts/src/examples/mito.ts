// =======================================
// Mito Module
// =======================================

export const getVaultExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve details for the vault with contract address inj1... and slug 'vault-slug'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Vault details retrieved successfully.",
            action: "GET_VAULT",
            content: {
                contractAddress: "inj1...",
                codeId: "1",
                vaultName: "Example Vault",
                marketId: "0x123...",
                currentTvl: 1000000,
                profits: {
                    allTimeChange: 10.5,
                    threeMonthsChange: 5.2,
                    oneMonthChange: 2.1,
                    oneDayChange: 0.5,
                    oneWeekChange: 1.2,
                    oneYearChange: 15.3,
                    threeYearsChange: 45.6,
                    sixMonthsChange: 8.4,
                },
                updatedAt: 1632150400,
                vaultType: "perpetual",
                lpTokenPrice: 1.05,
                subaccountInfo: {
                    subaccountId: "0x123...",
                    balancesList: [
                        {
                            denom: "inj",
                            totalBalance: "1000000000",
                        },
                    ],
                },
                masterContractAddress: "inj1...",
                totalLpAmount: "1000000",
                slug: "vault-slug",
                createdAt: 1632150400,
                notionalValueCap: "10000000",
                tvlChanges: {
                    allTimeChange: 20.5,
                },
                apy: 15.2,
                apy7D: 14.8,
                apy7DFq: 14.9,
                apyue: 15.0,
                apyV3: 15.1,
                registrationMode: "open",
            },
        },
    },
];

export const getVaultsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the latest 10 vaults with code ID 1.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Vaults retrieved successfully.",
            action: "GET_VAULTS",
            content: {
                vaults: [
                    {
                        contractAddress: "inj1...",
                        vaultName: "Example Vault",
                        currentTvl: 1000000,
                        lpTokenPrice: 1.05,
                        apy: 15.2,
                    },
                    {
                        contractAddress: "inj2...",
                        vaultName: "Another Vault",
                        currentTvl: 500000,
                        lpTokenPrice: 1.1,
                        apy: 14.5,
                    },
                    // ...additional vaults
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getLpTokenPriceChartExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve LP token price chart for vault address inj1... from timestamp 1633360000 to 1640995200.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "LP token price chart retrieved successfully.",
            action: "GET_LP_TOKEN_PRICE_CHART",
            content: {
                priceSnapshots: [
                    {
                        price: 1.05,
                        updatedAt: 1633360000,
                    },
                    {
                        price: 1.06,
                        updatedAt: 1633446400,
                    },
                    // ...additional price snapshots
                ],
            },
        },
    },
];

export const getTVLChartExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve TVL chart for vault address inj1... from timestamp 1633360000 to 1640995200.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "TVL chart retrieved successfully.",
            action: "GET_TVL_CHART",
            content: {
                priceSnapshots: [
                    {
                        price: 1000000,
                        updatedAt: 1633360000,
                    },
                    {
                        price: 1005000,
                        updatedAt: 1633446400,
                    },
                    // ...additional TVL snapshots
                ],
            },
        },
    },
];

export const getVaultsByHolderAddressExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve vaults subscribed by holder address inj1... with vault address inj1..., skipping 0 and limiting to 10 records.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Vaults by holder address retrieved successfully.",
            action: "GET_VAULTS_BY_HOLDER_ADDRESS",
            content: {
                subscriptions: [
                    {
                        vaultInfo: {
                            contractAddress: "inj1...",
                            vaultName: "Example Vault",
                            currentTvl: 1000000,
                        },
                        lpAmount: "1000000",
                        holderAddress: "inj1...",
                        lpAmountPercentage: 0.1,
                    },
                    {
                        vaultInfo: {
                            contractAddress: "inj2...",
                            vaultName: "Another Vault",
                            currentTvl: 500000,
                        },
                        lpAmount: "500000",
                        holderAddress: "inj1...",
                        lpAmountPercentage: 0.05,
                    },
                    // ...additional subscriptions
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getLPHoldersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve LP holders for vault address inj1... and staking contract address inj1..., skipping 0 and limiting to 10 records.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "LP holders retrieved successfully.",
            action: "GET_LP_HOLDERS",
            content: {
                holders: [
                    {
                        holderAddress: "inj1...",
                        vaultAddress: "inj1...",
                        amount: "1000000",
                        updatedAt: 1633360000,
                        lpAmountPercentage: 0.1,
                        redemptionLockTime: "1640995200",
                        stakedAmount: "500000",
                    },
                    {
                        holderAddress: "inj2...",
                        vaultAddress: "inj1...",
                        amount: "500000",
                        updatedAt: 1633446400,
                        lpAmountPercentage: 0.05,
                        redemptionLockTime: "1643587200",
                        stakedAmount: "250000",
                    },
                    // ...additional holders
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getHolderPortfolioExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve portfolio for holder address inj1... and staking contract address inj1....",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Holder portfolio retrieved successfully.",
            action: "GET_HOLDER_PORTFOLIO",
            content: {
                totalValue: 1000000,
                pnl: 50000,
                totalValueChartList: [
                    {
                        price: 1000000,
                        updatedAt: 1633360000,
                    },
                    {
                        price: 1005000,
                        updatedAt: 1633446400,
                    },
                    // ...additional total value snapshots
                ],
                pnlChartList: [
                    {
                        price: 50000,
                        updatedAt: 1633360000,
                    },
                    {
                        price: 50500,
                        updatedAt: 1633446400,
                    },
                    // ...additional PnL snapshots
                ],
                updatedAt: 1633446400,
            },
        },
    },
];

export const getLeaderboardExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve leaderboard for epoch ID 1.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Leaderboard retrieved successfully.",
            action: "GET_LEADERBOARD",
            content: {
                entries: [
                    {
                        address: "inj1...",
                        accruedPoints: "100",
                    },
                    {
                        address: "inj2...",
                        accruedPoints: "95",
                    },
                    // ...additional leaderboard entries
                ],
                snapshotBlock: "1000000",
                updatedAt: 1633360000,
                rank: "1",
            },
        },
    },
];

export const getLeaderboardEpochsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve leaderboard epochs with a limit of 10, from epoch ID 1 to 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Leaderboard epochs retrieved successfully.",
            action: "GET_LEADERBOARD_EPOCHS",
            content: {
                epochs: [
                    {
                        epochId: 1,
                        startAt: 1633360000,
                        endAt: 1640995200,
                        isLive: true,
                    },
                    {
                        epochId: 2,
                        startAt: 1640995200,
                        endAt: 1643587200,
                        isLive: false,
                    },
                    // ...additional epochs
                ],
                pagination: {
                    total: 10,
                },
            },
        },
    },
];

export const getTransferHistoryExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve transfer history for vault address inj1... and account address inj1..., skipping 0 and limiting to 10 records up to number 100.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Transfer history retrieved successfully.",
            action: "GET_TRANSFER_HISTORY",
            content: {
                transfers: [
                    {
                        lpAmount: "1000000",
                        coins: [
                            {
                                denom: "inj",
                                amount: "1000000",
                            },
                        ],
                        usdValue: "1000000",
                        isDeposit: true,
                        executedAt: 1633360000,
                        account: "inj1...",
                        vault: "inj1...",
                        txHash: "0x...",
                        tidByVault: 1,
                        tidByAccount: 1,
                    },
                    {
                        lpAmount: "500000",
                        coins: [
                            {
                                denom: "inj",
                                amount: "500000",
                            },
                        ],
                        usdValue: "500000",
                        isDeposit: false,
                        executedAt: 1633446400,
                        account: "inj2...",
                        vault: "inj1...",
                        txHash: "0x...",
                        tidByVault: 2,
                        tidByAccount: 2,
                    },
                    // ...additional transfer records
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getStakingPoolsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve staking pools for staker address inj1... and staking contract address inj1..., skipping 0 and limiting to 10 records.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Staking pools retrieved successfully.",
            action: "GET_STAKING_POOLS",
            content: {
                pools: [
                    {
                        vaultName: "Example Vault",
                        vaultAddress: "inj1...",
                        stakeDenom: "inj",
                        gauges: [
                            {
                                id: "1",
                                owner: "inj1...",
                                startTimestamp: 1633360000,
                                endTimestamp: 1640995200,
                                rewardTokens: [
                                    {
                                        denom: "inj",
                                        amount: "1000000",
                                    },
                                ],
                                lastDistribution: 1633360000,
                                status: "active",
                            },
                        ],
                        apr: 15.2,
                        totalLiquidity: 1000000,
                        stakingAddress: "inj1...",
                        aprBreakdown: {
                            inj: 15.2,
                        },
                    },
                    {
                        vaultName: "Another Vault",
                        vaultAddress: "inj2...",
                        stakeDenom: "inj",
                        gauges: [
                            {
                                id: "2",
                                owner: "inj2...",
                                startTimestamp: 1633446400,
                                endTimestamp: 1643587200,
                                rewardTokens: [
                                    {
                                        denom: "inj",
                                        amount: "500000",
                                    },
                                ],
                                lastDistribution: 1633446400,
                                status: "active",
                            },
                        ],
                        apr: 14.5,
                        totalLiquidity: 500000,
                        stakingAddress: "inj2...",
                        aprBreakdown: {
                            inj: 14.5,
                        },
                    },
                    // ...additional staking pools
                ],
                pagination: {
                    total: 10,
                },
            },
        },
    },
];

export const getStakingHistoryExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve staking history for staker address inj1..., skipping 0 and limiting to 10 records up to number 100.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Staking history retrieved successfully.",
            action: "GET_STAKING_HISTORY",
            content: {
                activities: [
                    {
                        action: "stake",
                        txHash: "0x...",
                        staker: "inj1...",
                        vaultAddress: "inj1...",
                        numberByAccount: 1,
                        timestamp: 1633360000,
                        rewardedTokens: [
                            {
                                denom: "inj",
                                amount: "1000000",
                            },
                        ],
                        stakeAmount: {
                            denom: "inj",
                            amount: "1000000",
                        },
                    },
                    {
                        action: "unstake",
                        txHash: "0x...",
                        staker: "inj2...",
                        vaultAddress: "inj1...",
                        numberByAccount: 2,
                        timestamp: 1633446400,
                        rewardedTokens: [
                            {
                                denom: "inj",
                                amount: "500000",
                            },
                        ],
                        stakeAmount: {
                            denom: "inj",
                            amount: "500000",
                        },
                    },
                    // ...additional staking activities
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getStakingRewardsByAccountExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve staking rewards for staker address inj1... and staking contract address inj1....",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Staking rewards by account retrieved successfully.",
            action: "GET_STAKING_REWARDS_BY_ACCOUNT",
            content: {
                rewards: [
                    {
                        apr: 15.2,
                        vaultName: "Example Vault",
                        vaultAddress: "inj1...",
                        lockTimestamp: 1633360000,
                        claimableRewards: [
                            {
                                denom: "inj",
                                amount: "1000000",
                            },
                        ],
                        stakedAmount: {
                            denom: "inj",
                            amount: "1000000",
                        },
                        lockedAmount: {
                            denom: "inj",
                            amount: "1000000",
                        },
                    },
                    {
                        apr: 14.5,
                        vaultName: "Another Vault",
                        vaultAddress: "inj2...",
                        lockTimestamp: 1633446400,
                        claimableRewards: [
                            {
                                denom: "inj",
                                amount: "500000",
                            },
                        ],
                        stakedAmount: {
                            denom: "inj",
                            amount: "500000",
                        },
                        lockedAmount: {
                            denom: "inj",
                            amount: "500000",
                        },
                    },
                    // ...additional rewards
                ],
                pagination: {
                    total: 10,
                },
            },
        },
    },
];

export const getMissionsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve missions for account address inj1....",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Missions retrieved successfully.",
            action: "GET_MISSIONS",
            content: {
                missions: [
                    {
                        id: "mission1",
                        points: "100",
                        completed: true,
                        accruedPoints: "50",
                        updatedAt: 1633360000,
                        progress: 0.5,
                        expected: 100,
                    },
                    {
                        id: "mission2",
                        points: "200",
                        completed: false,
                        accruedPoints: "150",
                        updatedAt: 1633446400,
                        progress: 0.75,
                        expected: 200,
                    },
                    // ...additional missions
                ],
            },
        },
    },
];

export const getMissionLeaderboardExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve mission leaderboard for user address inj1....",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Mission leaderboard retrieved successfully.",
            action: "GET_MISSION_LEADERBOARD",
            content: {
                entries: [
                    {
                        address: "inj1...",
                        accruedPoints: "100",
                    },
                    {
                        address: "inj2...",
                        accruedPoints: "95",
                    },
                    // ...additional leaderboard entries
                ],
                updatedAt: 1633360000,
                rank: "1",
            },
        },
    },
];

export const getIDOExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve IDO information for contract address inj1... and account address inj1....",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "IDO information retrieved successfully.",
            action: "GET_IDO",
            content: {
                ido: {
                    startTime: 1633360000,
                    endTime: 1640995200,
                    owner: "inj1...",
                    status: "active",
                    tokenInfo: {
                        denom: "inj",
                        supply: "1000000",
                        symbol: "INJ",
                        decimal: 18,
                        logoUrl: "https://example.com/logo.png",
                    },
                    capPerAddress: "1000000",
                    contractAddress: "inj1...",
                    subscribedAmount: "500000",
                    projectTokenAmount: "1000000",
                    targetAmountInQuoteDenom: "1000000",
                    secondBeforeStartToSetQuotePrice: 3600,
                    targetAmountInUsd: "1000000",
                    tokenPrice: 1.0,
                    isAccountWhiteListed: true,
                    isLaunchWithVault: true,
                    isVestingScheduleEnabled: true,
                    name: "Example IDO",
                    progress: [
                        {
                            status: "active",
                            timestamp: 1633360000,
                        },
                    ],
                    quoteDenom: "inj",
                    stakeToSubscription: [
                        {
                            stakedAmount: "1000000",
                            subscribableAmount: "500000",
                        },
                    ],
                    useWhitelist: true,
                    marketId: "0x...",
                    vaultAddress: "inj1...",
                },
            },
        },
    },
];

export const getIDOsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all active IDOs with a limit of 10, up to IDO number 100, for account address inj1... and owner address inj1....",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "IDOs retrieved successfully.",
            action: "GET_IDOS",
            content: {
                idos: [
                    {
                        startTime: 1633360000,
                        endTime: 1640995200,
                        owner: "inj1...",
                        status: "active",
                        contractAddress: "inj1...",
                        name: "Example IDO",
                    },
                    {
                        startTime: 1633446400,
                        endTime: 1643587200,
                        owner: "inj2...",
                        status: "upcoming",
                        contractAddress: "inj2...",
                        name: "Another IDO",
                    },
                    // ...additional IDOs
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getIDOSubscribersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve subscribers for IDO with contract address inj1..., skipping 0 and limiting to 10 records sorted by subscribed amount.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "IDO subscribers retrieved successfully.",
            action: "GET_IDO_SUBSCRIBERS",
            content: {
                idoAddress: "inj1...",
                accounts: [
                    {
                        accountAddress: "inj1...",
                        updatedAt: 1633360000,
                        weight: "1.0",
                    },
                    {
                        accountAddress: "inj2...",
                        updatedAt: 1633446400,
                        weight: "0.8",
                    },
                    // ...additional subscriber accounts
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getIDOSubscriptionExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve IDO subscription details for contract address inj1... and account address inj1....",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "IDO subscription details retrieved successfully.",
            action: "GET_IDO_SUBSCRIPTION",
            content: {
                subscription: {
                    maxSubscriptionCoin: {
                        denom: "inj",
                        amount: "1000000",
                    },
                    committedAmount: "500000",
                    price: 1.0,
                    claimableCoins: [
                        {
                            denom: "token",
                            amount: "500000",
                        },
                    ],
                    rewardClaimed: false,
                    tokenInfo: {
                        denom: "inj",
                        supply: "1000000",
                        symbol: "INJ",
                        decimal: 18,
                        logoUrl: "https://example.com/logo.png",
                    },
                    quoteDenom: "inj",
                    updatedAt: 1633360000,
                    stakedAmount: "1000000",
                    marketId: "0x...",
                },
            },
        },
    },
];

export const getIDOActivitiesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve IDO activities for contract address inj1..., account address inj1..., skipping 0 and limiting to 10 records up to number 100.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "IDO activities retrieved successfully.",
            action: "GET_IDO_ACTIVITIES",
            content: {
                activities: [
                    {
                        address: "inj1...",
                        subscribedCoin: {
                            denom: "inj",
                            amount: "1000000",
                        },
                        usdValue: 1000000,
                        timestamp: 1633360000,
                        txHash: "0x...",
                    },
                    {
                        address: "inj2...",
                        subscribedCoin: {
                            denom: "inj",
                            amount: "500000",
                        },
                        usdValue: 500000,
                        timestamp: 1633446400,
                        txHash: "0x...",
                    },
                    // ...additional activities
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getIDOWhitelistExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve IDO whitelist for contract address inj1..., skipping 0 and limiting to 10 records.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "IDO whitelist retrieved successfully.",
            action: "GET_IDO_WHITELIST",
            content: {
                idoAddress: "inj1...",
                accounts: [
                    {
                        accountAddress: "inj1...",
                        updatedAt: 1633360000,
                        weight: "1.0",
                    },
                    {
                        accountAddress: "inj2...",
                        updatedAt: 1633446400,
                        weight: "0.8",
                    },
                    // ...additional whitelist accounts
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getClaimReferencesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve claim references for IDO with contract address inj1... and account address inj1..., skipping 0 and limiting to 10 records up to number 100.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Claim references retrieved successfully.",
            action: "GET_CLAIM_REFERENCES",
            content: {
                claimReferences: [
                    {
                        denom: "inj",
                        updatedAt: 1633360000,
                        claimedAmount: "500000",
                        claimableAmount: "1000000",
                        accountAddress: "inj1...",
                        cwContractAddress: "inj1...",
                        idoContractAddress: "inj1...",
                        startVestingTime: 1633360000,
                        vestingDurationSeconds: 2592000,
                    },
                    {
                        denom: "token",
                        updatedAt: 1633446400,
                        claimedAmount: "300000",
                        claimableAmount: "700000",
                        accountAddress: "inj2...",
                        cwContractAddress: "inj2...",
                        idoContractAddress: "inj2...",
                        startVestingTime: 1633446400,
                        vestingDurationSeconds: 2592000,
                    },
                    // ...additional claim references
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

//Mito execute messages examples

export const getLaunchpadSubscribeExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Subscribe to launchpad with 1000 INJ tokens.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Launchpad subscription processed successfully.",
            action: "LAUNCHPAD_SUBSCRIBE",
            content: {
                amount: 1000,
                quoteTokenDenom: "inj",
                quoteTokenDecimals: 18,
                contractAddress: "inj1...",
            },
        },
    },
];

export const getSubscribeVaultExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Subscribe to vault with 1.5 INJ and 1000 USDT.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Vault subscription processed successfully.",
            action: "SUBSCRIBE_VAULT",
            content: {
                market: {
                    baseDenom: "inj",
                    baseDecimals: 18,
                    quoteDecimals: 6,
                    quoteDenom: "usdt",
                },
                baseAmount: 1.5,
                quoteAmount: 1000,
                subscriptionType: "BaseOnly",
                vaultDetails: {
                    vaultSubaccountId: "0x...",
                    vaultMasterAddress: "inj1...",
                    vaultType: "crates.io:vault-cpmm-spot",
                },
                slippage: {
                    max_penalty: "0.1",
                },
            },
        },
    },
];

export const getInstantiateCPMMVaultExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a new CPMM vault for INJ/USDT trading pair.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "CPMM vault instantiated successfully.",
            action: "INSTANTIATE_CPMM_VAULT",
            content: {
                MITO_MASTER_CONTRACT_ADDRESS: "inj1...",
                CPMM_CONTRACT_CODE: 123,
                senderWalletAddress: "inj1...",
                marketId: "0x...",
                feeBps: 30,
                baseDecimals: 18,
                quoteDecimals: 6,
                funds: [
                    {
                        denom: "inj",
                        amount: "1000000000000000000",
                    },
                ],
                notionalValueCap: "1000000",
                pricingStrategy: {
                    SmoothingPricingWithRelativePriceRange: {
                        bid_range: "0.01",
                        ask_range: "0.01",
                    },
                },
                maxInvariantSensitivityBps: "100",
                maxPriceSensitivityBps: "100",
                orderType: "LIMIT",
            },
        },
    },
];

export const getLaunchpadClaimExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Claim tokens from launchpad contract.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Launchpad tokens claimed successfully.",
            action: "LAUNCHPAD_CLAIM",
            content: {
                contractAddress: "inj1...",
            },
        },
    },
];

export const getVaultSubscribeExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Subscribe to a spot trading vault with INJ/USDT.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Vault subscription processed successfully.",
            action: "VAULT_SUBSCRIBE",
            content: {
                vaultType: "crates.io:vault-cpmm-spot",
                slippage: {
                    max_penalty: "0.1",
                },
                vaultSubaccountId: "0x...",
                baseAmount: 1.5,
                quoteAmount: 1000,
                market: {
                    baseDenom: "inj",
                    baseDecimals: 18,
                    quoteDenom: "usdt",
                    quoteDecimals: 6,
                },
                subscriptionType: "BaseOnly",
                masterAddress: "inj1...",
            },
        },
    },
];

export const getRedeemFromVaultExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Redeem 0.01 LP tokens from the vault.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Vault redemption processed successfully.",
            action: "REDEEM_FROM_VAULT",
            content: {
                vaultSubaccountId: "0x...",
                redeemAmount: 0.01,
                vaultBaseDecimals: 18,
                masterAddress: "inj1...",
                vaultLpDenom: "factory/...",
                marketType: "Spot",
                redemptionType: "BaseOnly",
                slippage: {
                    max_penalty: "0.1",
                },
            },
        },
    },
];

export const getStakeVaultLPExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Stake 0.01 LP tokens in the vault.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "LP tokens staked successfully.",
            action: "STAKE_VAULT_LP",
            content: {
                amount: 0.01,
                vaultLpDenom: "factory/...",
                vaultTokenDecimals: 18,
                stakingContractAddress: "inj1...",
            },
        },
    },
];

export const getUnstakeVaultLPExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Unstake 0.01 LP tokens from the vault.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "LP tokens unstaked successfully.",
            action: "UNSTAKE_VAULT_LP",
            content: {
                amount: 0.01,
                vaultLpDenom: "factory/...",
                vaultTokenDecimals: 18,
                stakingContractAddress: "inj1...",
            },
        },
    },
];

export const getClaimVaultRewardsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Claim staking rewards from the vault.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Vault rewards claimed successfully.",
            action: "CLAIM_VAULT_REWARDS",
            content: {
                vaultLpDenom: "factory/...",
                stakingContractAddress: "inj1...",
            },
        },
    },
];
