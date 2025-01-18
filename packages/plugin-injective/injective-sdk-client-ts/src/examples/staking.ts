// =======================================
// Staking Module
// =======================================

export const getStakingModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve staking module parameters including unbonding time, max validators, max entries, historical entries, and bond denomination.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Staking module parameters retrieved successfully.",
            action: "GET_STAKING_MODULE_PARAMS",
            content: {
                unbondingTime: 1209600,
                maxValidators: 100,
                maxEntries: 7,
                historicalEntries: 10000,
                bondDenom: "inj",
            },
        },
    },
];

export const getPoolExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch staking pool information.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Staking pool information retrieved successfully.",
            action: "GET_POOL",
            content: {
                notBondedTokens: "1000000000000000000",
                bondedTokens: "5000000000000000000",
            },
        },
    },
];

export const getValidatorsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve validators with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Validators retrieved successfully.",
            action: "GET_VALIDATORS",
            content: {
                validators: [
                    {
                        operatorAddress: "injvaloper1...",
                        consensusPubkey: "injvalconspub1...",
                        jailed: false,
                        status: 2,
                        tokens: "1000000",
                        delegatorShares: "1000000.000000000000000000",
                        description: {
                            moniker: "Validator One",
                            identity: "",
                            website: "https://validatorone.com",
                            securityContact: "security@validatorone.com",
                            details: "Leading validator in the network.",
                        },
                        unbondingHeight: "0",
                        unbondingTime: "0",
                        commission: {
                            commissionRates: {
                                rate: "0.100000000000000000",
                                maxRate: "0.200000000000000000",
                                maxChangeRate: "0.010000000000000000",
                            },
                            updateTime: "0",
                        },
                        minSelfDelegation: "1000000",
                    },
                    // ...additional validators
                ],
                pagination: {
                    nextKey: "def456...",
                    total: "100",
                },
            },
        },
    },
];

export const getValidatorExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch details for validator with address 'injvaloper1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Validator details retrieved successfully.",
            action: "GET_VALIDATOR",
            content: {
                operatorAddress: "injvaloper1...",
                consensusPubkey: "injvalconspub1...",
                jailed: false,
                status: 2,
                tokens: "1000000",
                delegatorShares: "1000000.000000000000000000",
                description: {
                    moniker: "Validator One",
                    identity: "",
                    website: "https://validatorone.com",
                    securityContact: "security@validatorone.com",
                    details: "Leading validator in the network.",
                },
                unbondingHeight: "0",
                unbondingTime: "0",
                commission: {
                    commissionRates: {
                        rate: "0.100000000000000000",
                        maxRate: "0.200000000000000000",
                        maxChangeRate: "0.010000000000000000",
                    },
                    updateTime: "0",
                },
                minSelfDelegation: "1000000",
            },
        },
    },
];

export const getValidatorDelegationsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve delegations for validator 'injvaloper1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Validator delegations retrieved successfully.",
            action: "GET_VALIDATOR_DELEGATIONS",
            content: {
                delegations: [
                    {
                        delegation: {
                            delegatorAddress: "inj1delegator1...",
                            validatorAddress: "injvaloper1...",
                            shares: "1000000.000000000000000000",
                        },
                        balance: {
                            denom: "inj",
                            amount: "1000000000000000000",
                        },
                    },
                    // ...additional delegations
                ],
                pagination: {
                    nextKey: "ghi789...",
                    total: "50",
                },
            },
        },
    },
];

export const getValidatorDelegationsNoThrowExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Safely retrieve delegations for validator 'injvaloper1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Validator delegations retrieved successfully (no-throw).",
            action: "GET_VALIDATOR_DELEGATIONS_NO_THROW",
            content: {
                delegations: [
                    {
                        delegation: {
                            delegatorAddress: "inj1delegator1...",
                            validatorAddress: "injvaloper1...",
                            shares: "1000000.000000000000000000",
                        },
                        balance: {
                            denom: "inj",
                            amount: "1000000000000000000",
                        },
                    },
                    // ...additional delegations
                ],
                pagination: {
                    nextKey: "ghi789...",
                    total: "50",
                },
            },
        },
    },
];

export const getValidatorUnbondingDelegationsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch unbonding delegations for validator 'injvaloper1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Validator unbonding delegations retrieved successfully.",
            action: "GET_VALIDATOR_UNBONDING_DELEGATIONS",
            content: {
                unbondingDelegations: [
                    {
                        delegatorAddress: "inj1...",
                        validatorAddress: "injvaloper1...",
                        entries: [
                            {
                                creationHeight: "1000000",
                                completionTime: "1633446400",
                                initialBalance: "1000000000000000000",
                                balance: "1000000000000000000",
                            },
                        ],
                    },
                    // ...additional unbonding delegations
                ],
                pagination: {
                    nextKey: "jkl012...",
                    total: "20",
                },
            },
        },
    },
];

export const getValidatorUnbondingDelegationsNoThrowExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Safely fetch unbonding delegations for validator 'injvaloper1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Validator unbonding delegations retrieved successfully (no-throw).",
            action: "GET_VALIDATOR_UNBONDING_DELEGATIONS_NO_THROW",
            content: {
                unbondingDelegations: [
                    {
                        delegatorAddress: "inj1...",
                        validatorAddress: "injvaloper1...",
                        entries: [
                            {
                                creationHeight: "1000000",
                                completionTime: "1633446400",
                                initialBalance: "1000000000000000000",
                                balance: "1000000000000000000",
                            },
                        ],
                    },
                    // ...additional unbonding delegations
                ],
                pagination: {
                    nextKey: "jkl012...",
                    total: "20",
                },
            },
        },
    },
];

export const getDelegationsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch all delegations for delegator address 'inj1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Delegations retrieved successfully.",
            action: "GET_DELEGATIONS",
            content: {
                delegations: [
                    {
                        delegation: {
                            delegatorAddress: "inj1...",
                            validatorAddress: "injvaloper1...",
                            shares: "1000000.000000000000000000",
                        },
                        balance: {
                            denom: "inj",
                            amount: "1000000000000000000",
                        },
                    },
                    // ...additional delegations
                ],
                pagination: {
                    nextKey: "mno345...",
                    total: "100",
                },
            },
        },
    },
];

export const getDelegationsNoThrowExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Safely fetch all delegations for delegator address 'inj1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Delegations retrieved successfully (no-throw).",
            action: "GET_DELEGATIONS_NO_THROW",
            content: {
                delegations: [
                    {
                        delegation: {
                            delegatorAddress: "inj1...",
                            validatorAddress: "injvaloper1...",
                            shares: "1000000.000000000000000000",
                        },
                        balance: {
                            denom: "inj",
                            amount: "1000000000000000000",
                        },
                    },
                    // ...additional delegations
                ],
                pagination: {
                    nextKey: "mno345...",
                    total: "100",
                },
            },
        },
    },
];

export const getUnbondingDelegationsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve unbonding delegations for delegator address 'inj1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Unbonding delegations retrieved successfully.",
            action: "GET_UNBONDING_DELEGATIONS",
            content: {
                unbondingDelegations: [
                    {
                        delegatorAddress: "inj1...",
                        validatorAddress: "injvaloper1...",
                        entries: [
                            {
                                creationHeight: "1000000",
                                completionTime: "1633446400",
                                initialBalance: "1000000000000000000",
                                balance: "1000000000000000000",
                            },
                        ],
                    },
                    // ...additional unbonding delegations
                ],
                pagination: {
                    nextKey: "ghi789...",
                    total: "30",
                },
            },
        },
    },
];

export const getReDelegationsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch redelegations for delegator address 'inj1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Redelegations retrieved successfully.",
            action: "GET_REDELEGATIONS",
            content: {
                redelegations: [
                    {
                        delegatorAddress: "inj1...",
                        validatorSrcAddress: "injvaloper1...",
                        validatorDstAddress: "injvaloper2...",
                        entries: [
                            {
                                creationHeight: "1000000",
                                completionTime: "1633446400",
                                initialBalance: "500000000000000000",
                                sharesDst: "500000.000000000000000000",
                            },
                        ],
                    },
                    // ...additional redelegations
                ],
                pagination: {
                    nextKey: "stu901...",
                    total: "40",
                },
            },
        },
    },
];

export const msgCreateValidatorExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a new validator with moniker 'Validator One', identity 'keybase-id', website 'https://validatorone.com', security contact 'security@validatorone.com', details 'Leading validator in the network.', commission rate 0.10, max rate 0.20, max change rate 0.01, minimum self-delegation of 1000000000000000000 inj, delegator address 'inj1...', validator address 'injvaloper1...', public key 'injvalconspub1...', and initial self-delegation of 1000000000000000000 inj.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Validator creation submitted successfully.",
            action: "MSG_CREATE_VALIDATOR",
            content: {
                txHash: "0xcreatevalidatorhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgEditValidatorExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Edit validator 'injvaloper1...' with new moniker 'Validator One Updated', new identity 'new-keybase-id', new website 'https://new-validatorone.com', new security contact 'newsecurity@validatorone.com', new details 'Updated details.', new commission rate 0.15, and new minimum self-delegation of 2000000000000000000 inj.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Validator edited successfully.",
            action: "MSG_EDIT_VALIDATOR",
            content: {
                txHash: "0xeditvalidatorhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgDelegateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Delegate 1000000000000000000 inj from delegator address 'inj1...' to validator address 'injvaloper1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Delegation submitted successfully.",
            action: "MSG_DELEGATE",
            content: {
                txHash: "0xdelegationhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgBeginRedelegateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Begin redelegating 1000000000000000000 inj from validator 'injvaloper1...' to validator 'injvaloper2...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Redelegation submitted successfully.",
            action: "MSG_BEGIN_REDELEGATE",
            content: {
                txHash: "0xredelegationhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgUndelegateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Undelegate 1000000000000000000 inj from delegator address 'inj1...' to validator address 'injvaloper1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Undelegation submitted successfully.",
            action: "MSG_UNDELEGATE",
            content: {
                txHash: "0xundelegationhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgCancelUnbondingDelegationExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Cancel undelegation of 1000000000000000000 inj from delegator address 'inj1...' to validator address 'injvaloper1...' initiated at height 1000000.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Unbonding delegation cancellation submitted successfully.",
            action: "MSG_CANCEL_UNBONDING_DELEGATION",
            content: {
                txHash: "0xcancelundelegationhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const getDelegationExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch delegation details for delegator address 'inj1...' and validator address 'injvaloper1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Delegation details retrieved successfully.",
            action: "GET_DELEGATION",
            content: {
                delegation: {
                    delegatorAddress: "inj1...",
                    validatorAddress: "injvaloper1...",
                    shares: "1000000000000000000",
                },
                balance: {
                    denom: "inj",
                    amount: "1000000000000000000",
                },
            },
        },
    },
];

export const getDelegatorsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all delegators for validator 'injvaloper1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Delegators retrieved successfully.",
            action: "GET_DELEGATORS",
            content: {
                delegators: [
                    {
                        delegation: {
                            delegatorAddress: "inj1delegator1...",
                            validatorAddress: "injvaloper1...",
                            shares: "1000000.000000000000000000",
                        },
                        balance: {
                            denom: "inj",
                            amount: "1000000000000000000",
                        },
                    },
                    // ...additional delegators
                ],
                pagination: {
                    nextKey: "def456...",
                    total: "50",
                },
            },
        },
    },
];

export const getDelegatorsNoThrowExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Safely retrieve all delegators for validator 'injvaloper1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Delegators retrieved successfully (no-throw).",
            action: "GET_DELEGATORS_NO_THROW",
            content: {
                delegators: [
                    {
                        delegation: {
                            delegatorAddress: "inj1delegator1...",
                            validatorAddress: "injvaloper1...",
                            shares: "1000000.000000000000000000",
                        },
                        balance: {
                            denom: "inj",
                            amount: "1000000000000000000",
                        },
                    },
                    // ...additional delegators
                ],
                pagination: {
                    nextKey: "def456...",
                    total: "50",
                },
            },
        },
    },
];

export const getUnbondingDelegationsNoThrowExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Safely retrieve unbonding delegations for delegator address 'inj1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Unbonding delegations retrieved successfully (no-throw).",
            action: "GET_UNBONDING_DELEGATIONS_NO_THROW",
            content: {
                unbondingDelegations: [
                    {
                        delegatorAddress: "inj1...",
                        validatorAddress: "injvaloper1...",
                        entries: [
                            {
                                creationHeight: "1000000",
                                completionTime: "1633446400",
                                initialBalance: "1000000000000000000",
                                balance: "1000000000000000000",
                            },
                        ],
                    },
                    // ...additional unbonding delegations
                ],
                pagination: {
                    nextKey: "ghi789...",
                    total: "30",
                },
            },
        },
    },
];

export const getReDelegationsNoThrowExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Safely fetch redelegations for delegator address 'inj1...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Redelegations retrieved successfully (no-throw).",
            action: "GET_REDELEGATIONS_NO_THROW",
            content: {
                redelegations: [
                    {
                        delegatorAddress: "inj1...",
                        validatorSrcAddress: "injvaloper1...",
                        validatorDstAddress: "injvaloper2...",
                        entries: [
                            {
                                creationHeight: "1000000",
                                completionTime: "1633446400",
                                initialBalance: "500000000000000000",
                                sharesDst: "500000.000000000000000000",
                            },
                        ],
                    },
                    // ...additional redelegations
                ],
                pagination: {
                    nextKey: "stu901...",
                    total: "40",
                },
            },
        },
    },
];
