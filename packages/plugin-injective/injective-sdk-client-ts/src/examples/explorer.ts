export const getTxByHashExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve transaction details for hash 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Transaction details retrieved successfully.",
            action: "GET_TX_BY_HASH",
            content: {
                id: "tx_id_12345",
                blockNumber: 12345,
                blockTimestamp: "2024-01-11T12:00:00Z",
                hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                memo: "Payment for services",
                code: 0,
                data: "base64EncodedDataHere",
                info: "Transaction executed successfully",
                gasWanted: 100000,
                gasUsed: 80000,
                gasFee: {
                    amounts: [
                        {
                            amount: "1000000",
                            denom: "inj",
                        },
                    ],
                    gasLimit: 100000,
                    payer: "inj1payeraddress...",
                    granter: "inj1granteraddress...",
                },
                txType: "MsgSend",
                signatures: [
                    {
                        pubkey: "cosmospub1addwnpepq...",
                        address: "inj1senderaddress...",
                        signature: "signatureDataHere",
                        sequence: 5,
                    },
                ],
                messages: [
                    {
                        key: "recipient",
                        value: "inj1recipientaddress...",
                    },
                ],
            },
        },
    },
];

export const getAccountTxExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the latest 10 transactions for account address inj1accountaddress...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Account transactions retrieved successfully.",
            action: "GET_ACCOUNT_TX",
            content: {
                txs: [
                    {
                        id: "tx_id_12345",
                        blockNumber: 12345,
                        blockTimestamp: "2024-01-11T12:00:00Z",
                        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                        txType: "MsgSend",
                    },
                    // ...additional transactions
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getValidatorExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve details for validator address injvaloper1validatoraddress...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Validator details retrieved successfully.",
            action: "GET_EXPLORER_VALIDATOR",
            content: {
                id: "validator_id_123",
                moniker: "ValidatorMoniker",
                operatorAddress: "injvaloper1validatoraddress...",
                consensusAddress: "injvalcons1validatorconsensus...",
                jailed: false,
                status: 1,
                tokens: "1000000000",
                delegatorShares: "1000000000",
                description: {
                    moniker: "ValidatorMoniker",
                    identity: "validatorIdentity",
                    website: "https://validatorwebsite.com",
                    securityContact: "security@validator.com",
                    details: "Detailed description of the validator.",
                },
                uptimePercentage: 99.9,
                commissionRate: "0.1",
                commissionMaxRate: "0.2",
                commissionMaxChangeRate: "0.01",
            },
        },
    },
];

export const getValidatorUptimeExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve uptime details for validator address injvaloper1validatoraddress...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Validator uptime details retrieved successfully.",
            action: "GET_VALIDATOR_UPTIME",
            content: [
                {
                    blockNumber: 12345,
                    status: "signed",
                },
                {
                    blockNumber: 12346,
                    status: "missed",
                },
                // ...additional uptime records
            ],
        },
    },
];

export const getPeggyDepositTxsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve Peggy deposit transactions for sender eth1senderaddress and receiver inj1receiveraddress...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Peggy deposit transactions retrieved successfully.",
            action: "GET_PEGGY_DEPOSIT_TXS",
            content: [
                {
                    sender: "eth1senderaddress",
                    receiver: "inj1receiveraddress",
                    eventNonce: 123,
                    eventHeight: 12345,
                    amount: "1000000000",
                    denom: "peggy0xabcdef",
                    orchestratorAddress: "inj1orchestratoraddress",
                    state: "completed",
                    txHashesList: [
                        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                    ],
                },
                // ...additional deposit transactions
            ],
        },
    },
];

export const getPeggyWithdrawalTxsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve Peggy withdrawal transactions for sender inj1senderaddress and receiver eth1receiveraddress...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Peggy withdrawal transactions retrieved successfully.",
            action: "GET_PEGGY_WITHDRAWAL_TXS",
            content: [
                {
                    sender: "inj1senderaddress",
                    receiver: "eth1receiveraddress",
                    amount: "1000000000",
                    denom: "peggy0xabcdef",
                    bridgeFee: "1000000",
                    outgoingTxId: 123,
                    batchTimeout: 100,
                    batchNonce: 5,
                    state: "completed",
                    txHashesList: [
                        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                    ],
                },
                // ...additional withdrawal transactions
            ],
        },
    },
];

export const getBlocksExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the latest 10 blocks before block number 12345 and after block number 12300...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Blocks retrieved successfully.",
            action: "GET_BLOCKS",
            content: {
                blocks: [
                    {
                        height: 12345,
                        proposer: "injvaloper1proposeraddress...",
                        moniker: "ProposerMoniker",
                        blockHash: "0xblockhash1234567890abcdef...",
                        parentHash: "0xparenthash1234567890abcdef...",
                        numPreCommits: 150,
                        numTxs: 10,
                        timestamp: "2024-01-11T12:00:00Z",
                    },
                    // ...additional blocks
                ],
            },
        },
    },
];

export const getBlockExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve details for block with height 12345.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Block details retrieved successfully.",
            action: "GET_BLOCK",
            content: {
                block: {
                    height: 12345,
                    proposer: "injvaloper1proposeraddress...",
                    moniker: "ProposerMoniker",
                    blockHash: "0xblockhash1234567890abcdef...",
                    parentHash: "0xparenthash1234567890abcdef...",
                    numPreCommits: 150,
                    numTxs: 10,
                    timestamp: "2024-01-11T12:00:00Z",
                },
            },
        },
    },
];

export const getTxsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve transactions of type MsgSend from the bank module between block numbers 12300 and 12345, limited to 10 results.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Transactions retrieved successfully.",
            action: "GET_TXS",
            content: {
                transactions: [
                    {
                        id: "tx_id_12345",
                        blockNumber: 12345,
                        blockTimestamp: "2024-01-11T12:00:00Z",
                        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                        txType: "MsgSend",
                    },
                    // ...additional transactions
                ],
            },
        },
    },
];

export const getIBCTransferTxsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve IBC transfer transactions sent by inj1senderaddress to cosmos1receiveraddress through source channel channel-1 and destination channel channel-0, limited to 10 results.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "IBC transfer transactions retrieved successfully.",
            action: "GET_IBC_TRANSFER_TXS",
            content: [
                {
                    sender: "inj1senderaddress",
                    receiver: "cosmos1receiveraddress",
                    sourcePort: "transfer",
                    sourceChannel: "channel-1",
                    destinationPort: "transfer",
                    destinationChannel: "channel-0",
                    amount: "1000000000",
                    denom: "inj",
                    timeoutHeight: "1-1000000",
                    timeoutTimestamp: 1641945600,
                    state: "completed",
                },
                // ...additional IBC transfer transactions
            ],
        },
    },
];

export const getExplorerStatsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the latest explorer statistics.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Explorer statistics retrieved successfully.",
            action: "GET_EXPLORER_STATS",
            content: {
                assets: "1000",
                txsTotal: "1000000",
                addresses: "50000",
                injSupply: "100000000",
                txsInPast30Days: "100000",
                txsInPast24Hours: "10000",
                blockCountInPast24Hours: "5000",
                txsPerSecondInPast24Hours: "0.5",
                txsPerSecondInPast100Blocks: "0.8",
            },
        },
    },
];
