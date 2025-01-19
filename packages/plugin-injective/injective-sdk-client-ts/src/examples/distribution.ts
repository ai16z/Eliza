export const getDistributionModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the distribution module parameters, including community tax, base proposer reward, bonus proposer reward, and withdraw address enabled status.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Distribution module parameters retrieved successfully.",
            action: "GET_DISTRIBUTION_MODULE_PARAMS",
            content: {
                communityTax: "0.020000000000000000",
                baseProposerReward: "0.010000000000000000",
                bonusProposerReward: "0.040000000000000000",
                withdrawAddrEnabled: true,
            },
        },
    },
];

export const getDelegatorRewardsForValidatorExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get delegator rewards for delegator address inj1delegatoraddress and validator address injvaloper1validatoraddress.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Delegator rewards retrieved successfully.",
            action: "GET_DELEGATOR_REWARDS_FOR_VALIDATOR",
            content: [
                {
                    denom: "inj",
                    amount: "1000000000",
                },
            ],
        },
    },
];

export const getDelegatorRewardsForValidatorNoThrowExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get delegator rewards for delegator address inj1delegatoraddress and validator address injvaloper1validatoraddress without throwing errors.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Delegator rewards retrieved successfully (no-throw).",
            action: "GET_DELEGATOR_REWARDS_FOR_VALIDATOR_NO_THROW",
            content: [
                {
                    denom: "inj",
                    amount: "1000000000",
                },
            ],
        },
    },
];

export const getDelegatorRewardsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all delegator rewards for delegator address inj1delegatoraddress.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Delegator rewards retrieved successfully.",
            action: "GET_DELEGATOR_REWARDS",
            content: [
                {
                    validatorAddress: "injvaloper1validatoraddress1",
                    rewards: [
                        {
                            denom: "inj",
                            amount: "500000000",
                        },
                    ],
                },
                {
                    validatorAddress: "injvaloper1validatoraddress2",
                    rewards: [
                        {
                            denom: "inj",
                            amount: "500000000",
                        },
                    ],
                },
            ],
        },
    },
];

export const getDelegatorRewardsNoThrowExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all delegator rewards for delegator address inj1delegatoraddress without throwing errors.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Delegator rewards retrieved successfully (no-throw).",
            action: "GET_DELEGATOR_REWARDS_NO_THROW",
            content: [
                {
                    validatorAddress: "injvaloper1validatoraddress1",
                    rewards: [
                        {
                            denom: "inj",
                            amount: "500000000",
                        },
                    ],
                },
                {
                    validatorAddress: "injvaloper1validatoraddress2",
                    rewards: [
                        {
                            denom: "inj",
                            amount: "500000000",
                        },
                    ],
                },
            ],
        },
    },
];

export const msgWithdrawDelegatorRewardExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Withdraw delegator rewards for delegator address inj1delegatoraddress and validator address injvaloper1validatoraddress.",
        },
    },
];

export const msgWithdrawDelegatorRewardResponseExample = [
    {
        user: "{{agent}}",
        content: {
            text: "Delegator rewards withdrawal submitted successfully.",
            action: "MSG_WITHDRAW_DELEGATOR_REWARD",
            content: {
                delegatorAddress: "inj1delegatoraddress",
                validatorAddress: "injvaloper1validatoraddress",
            },
        },
    },
];

export const msgWithdrawDelegatorRewardTransactionResponseExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Confirm the withdraw delegator reward transaction.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Withdraw delegator reward transaction processed successfully.",
            action: "MSG_WITHDRAW_DELEGATOR_REWARD_RESPONSE",
            content: {
                txHash: "0xwithdrawdelegatorrewardhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgWithdrawValidatorCommissionExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Withdraw validator commission for validator address injvaloper1validatoraddress.",
        },
    },
];

export const msgWithdrawValidatorCommissionResponseExample = [
    {
        user: "{{agent}}",
        content: {
            text: "Validator commission withdrawal submitted successfully.",
            action: "MSG_WITHDRAW_VALIDATOR_COMMISSION",
            content: {
                validatorAddress: "injvaloper1validatoraddress",
            },
        },
    },
];

export const msgWithdrawValidatorCommissionTransactionResponseExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Confirm the withdraw validator commission transaction.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Withdraw validator commission transaction processed successfully.",
            action: "MSG_WITHDRAW_VALIDATOR_COMMISSION_RESPONSE",
            content: {
                txHash: "0xwithdrawvalidatorcommissionhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];
