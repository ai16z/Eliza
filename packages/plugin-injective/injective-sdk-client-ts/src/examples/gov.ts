export const getGovernanceModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve governance module parameters, including votingParams, tallyParams, and depositParams.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Governance module parameters retrieved successfully.",
            action: "GET_GOVERNANCE_MODULE_PARAMS",
            content: {
                votingParams: {
                    votingPeriod: 604800,
                },
                tallyParams: {
                    quorum: "0.334",
                    threshold: "0.5",
                    vetoThreshold: "0.334",
                },
                depositParams: {
                    minDepositList: [
                        {
                            denom: "inj",
                            amount: "100000000000000000000",
                        },
                    ],
                    maxDepositPeriod: 1209600,
                },
            },
        },
    },
];

export const getProposalsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve proposals with status 2 and paginate the results with a limit of 100.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Proposals retrieved successfully.",
            action: "GET_PROPOSALS",
            content: {
                proposals: [
                    {
                        proposalId: 1,
                        title: "Example Proposal",
                        summary: "This is an example proposal",
                        proposer: "inj1proposeraddress...",
                        status: 2,
                        finalTallyResult: {
                            yesCount: "100",
                            abstainCount: "10",
                            noCount: "5",
                            noWithVetoCount: "2",
                        },
                        submitTime: 1632150400,
                        depositEndTime: 1633360000,
                        votingStartTime: 1633360000,
                        votingEndTime: 1633964800,
                        totalDeposits: [
                            {
                                denom: "inj",
                                amount: "100000000000000000000",
                            },
                        ],
                    },
                    // ...additional proposals
                ],
                pagination: {
                    nextKey: "",
                    total: 100,
                },
            },
        },
    },
];

export const getProposalExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve details for proposal with ID 1.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Proposal details retrieved successfully.",
            action: "GET_PROPOSAL",
            content: {
                proposalId: 1,
                title: "Example Proposal",
                summary: "This is an example proposal",
                proposer: "inj1proposeraddress...",
                status: 2,
                finalTallyResult: {
                    yesCount: "100",
                    abstainCount: "10",
                    noCount: "5",
                    noWithVetoCount: "2",
                },
                submitTime: 1632150400,
                depositEndTime: 1633360000,
                votingStartTime: 1633360000,
                votingEndTime: 1633964800,
                totalDeposits: [
                    {
                        denom: "inj",
                        amount: "100000000000000000000",
                    },
                ],
            },
        },
    },
];

export const getProposalDepositsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve deposits for proposal ID 1 with pagination parameters.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Proposal deposits retrieved successfully.",
            action: "GET_PROPOSAL_DEPOSITS",
            content: {
                deposits: [
                    {
                        depositor: "inj1depositoraddress...",
                        amounts: [
                            {
                                denom: "inj",
                                amount: "100000000000000000000",
                            },
                        ],
                    },
                    // ...additional deposits
                ],
                pagination: {
                    nextKey: "",
                    total: 10,
                },
            },
        },
    },
];

export const getProposalVotesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve votes for proposal ID 1 with pagination parameters.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Proposal votes retrieved successfully.",
            action: "GET_PROPOSAL_VOTES",
            content: {
                votes: [
                    {
                        proposalId: 1,
                        voter: "inj1voteraddress...",
                        options: [
                            {
                                option: 1,
                                weight: "1.0",
                            },
                        ],
                        metadata: "",
                    },
                    // ...additional votes
                ],
                pagination: {
                    nextKey: "",
                    total: 100,
                },
            },
        },
    },
];

export const getProposalTallyExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve tally results for proposal ID 1.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Proposal tally retrieved successfully.",
            action: "GET_PROPOSAL_TALLY",
            content: {
                yesCount: "100",
                abstainCount: "10",
                noCount: "5",
                noWithVetoCount: "2",
            },
        },
    },
];

export const msgSubmitProposalExpiryFuturesMarketLaunchExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Submit an expiry futures market launch proposal titled 'Launch BTC-USDT Quarterly Futures'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Expiry futures market launch proposal submitted successfully.",
            action: "MSG_SUBMIT_PROPOSAL_EXPIRY_FUTURES_MARKET_LAUNCH",
            content: {
                txHash: "0xsubmitproposalexpiryfutureshash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgSubmitProposalSpotMarketLaunchExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Submit a spot market launch proposal titled 'Launch INJ-USDT Spot Market'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot market launch proposal submitted successfully.",
            action: "MSG_SUBMIT_PROPOSAL_SPOT_MARKET_LAUNCH",
            content: {
                txHash: "0xsubmitproposalspotmarkethash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgSubmitProposalPerpetualMarketLaunchExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Submit a perpetual market launch proposal titled 'Launch ETH-USDT Perpetual'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Perpetual market launch proposal submitted successfully.",
            action: "MSG_SUBMIT_PROPOSAL_PERPETUAL_MARKET_LAUNCH",
            content: {
                txHash: "0xsubmitproposalperpetualmarkethash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgVoteExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Submit a vote for proposal ID 1 with option 1 and weight 1.0.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Vote submitted successfully.",
            action: "MSG_VOTE",
            content: {
                txHash: "0xvotehash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgSubmitTextProposalExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Submit a text proposal titled 'Community Pool Spend'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Text proposal submitted successfully.",
            action: "MSG_SUBMIT_TEXT_PROPOSAL",
            content: {
                txHash: "0xsubmittextproposalhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgSubmitProposalSpotMarketParamUpdateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Submit a spot market parameter update proposal titled 'Update INJ-USDT Spot Market Parameters'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot market parameter update proposal submitted successfully.",
            action: "MSG_SUBMIT_PROPOSAL_SPOT_MARKET_PARAM_UPDATE",
            content: {
                txHash: "0xsubmitproposalspotmarketparamupdatehash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgSubmitGenericProposalExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Submit a generic governance proposal titled 'Generic Proposal'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Generic governance proposal submitted successfully.",
            action: "MSG_SUBMIT_GENERIC_PROPOSAL",
            content: {
                txHash: "0xsubmitgenericproposalhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgGovDepositExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Deposit 100 INJ to proposal ID 1.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Deposit to proposal submitted successfully.",
            action: "MSG_GOV_DEPOSIT",
            content: {
                txHash: "0xgovdeposithash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];
