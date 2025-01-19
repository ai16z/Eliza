export const getBankModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the bank module parameters, including send enabled list and default send enabled status.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Bank module parameters retrieved successfully.",
            action: "GET_BANK_MODULE_PARAMS",
            content: {
                sendEnabledList: [
                    {
                        denom: "inj",
                        enabled: true,
                    },
                    {
                        denom: "usdt",
                        enabled: false,
                    },
                ],
                defaultSendEnabled: true,
            },
        },
    },
];

export const getBankBalanceExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch the bank balance for account inj1exampleaddress and denomination inj.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Bank balance retrieved successfully.",
            action: "GET_BANK_BALANCE",
            content: {
                denom: "inj",
                amount: "1000000000",
            },
        },
    },
];

export const getBankBalancesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all bank balances for account inj1exampleaddress with pagination.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Bank balances retrieved successfully.",
            action: "GET_BANK_BALANCES",
            content: {
                balances: [
                    {
                        denom: "inj",
                        amount: "1000000000",
                    },
                    {
                        denom: "usdt",
                        amount: "5000000",
                    },
                ],
                pagination: {
                    nextKey: "eyJwYWdlIjozfQ==",
                    total: 2,
                },
            },
        },
    },
];

export const getTotalSupplyExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the total supply with optional pagination.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Total supply retrieved successfully.",
            action: "GET_TOTAL_SUPPLY",
            content: {
                supply: [
                    {
                        denom: "inj",
                        amount: "1000000000000",
                    },
                    {
                        denom: "usdt",
                        amount: "2000000000",
                    },
                ],
                pagination: {
                    nextKey: "eyJwYWdlIjozfQ==",
                    total: 2,
                },
            },
        },
    },
];

export const getAllTotalSupplyExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the complete total supply for all denominations.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Complete total supply retrieved successfully.",
            action: "GET_ALL_TOTAL_SUPPLY",
            content: {
                supply: [
                    {
                        denom: "inj",
                        amount: "1000000000000",
                    },
                    {
                        denom: "usdt",
                        amount: "2000000000",
                    },
                    {
                        denom: "btc",
                        amount: "500000000",
                    },
                ],
                pagination: {
                    nextKey: null,
                    total: 3,
                },
            },
        },
    },
];

export const getSupplyOfExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get the supply of denomination inj.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Supply of inj retrieved successfully.",
            action: "GET_SUPPLY_OF",
            content: {
                denom: "inj",
                amount: "1000000000000",
            },
        },
    },
];

export const getDenomsMetadataExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch metadata for all denominations with pagination.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Denomination metadata fetched successfully.",
            action: "GET_DENOMS_METADATA",
            content: {
                metadatas: [
                    {
                        description:
                            "The native staking token of the Injective blockchain",
                        denom_units: [
                            {
                                denom: "inj",
                                exponent: 0,
                                aliases: ["inj"],
                            },
                        ],
                        base: "inj",
                        display: "inj",
                        name: "Injective",
                        symbol: "INJ",
                    },
                    {
                        description: "USD Tether",
                        denom_units: [
                            {
                                denom: "usdt",
                                exponent: 0,
                                aliases: ["usdt"],
                            },
                        ],
                        base: "usdt",
                        display: "usdt",
                        name: "Tether USD",
                        symbol: "USDT",
                    },
                ],
                pagination: {
                    nextKey: "eyJwYWdlIjozfQ==",
                    total: 2,
                },
            },
        },
    },
];

export const getDenomMetadataExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve metadata for denomination inj.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Denomination metadata for inj retrieved successfully.",
            action: "GET_DENOM_METADATA",
            content: {
                description:
                    "The native staking token of the Injective blockchain",
                denom_units: [
                    {
                        denom: "inj",
                        exponent: 0,
                        aliases: ["inj"],
                    },
                    {
                        denom: "inj",
                        exponent: 6,
                        aliases: ["uinj"],
                    },
                ],
                base: "inj",
                display: "inj",
                name: "Injective",
                symbol: "INJ",
            },
        },
    },
];

export const getDenomOwnersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get the owners of denomination inj with pagination.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Denomination owners retrieved successfully.",
            action: "GET_DENOM_OWNERS",
            content: {
                denomOwners: [
                    {
                        address: "inj1address1",
                        balance: {
                            denom: "inj",
                            amount: "500000000",
                        },
                    },
                    {
                        address: "inj1address2",
                        balance: {
                            denom: "inj",
                            amount: "300000000",
                        },
                    },
                ],
                pagination: {
                    nextKey: "eyJwYWdlIjozfQ==",
                    total: 2,
                },
            },
        },
    },
];

export const msgSendExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Send 1000000000 inj from inj1senderaddress to inj1recipientaddress.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Send transaction submitted successfully.",
            action: "MSG_SEND",
            content: {
                srcInjectiveAddress: "inj1senderaddress",
                dstInjectiveAddress: "inj1recipientaddress",
                amount: {
                    denom: "inj",
                    amount: "1000000000",
                },
            },
        },
    },
];

export const msgSendResponseExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Confirm the send transaction.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Send transaction processed successfully.",
            action: "MSG_SEND_RESPONSE",
            content: {
                txHash: "0xsendinghash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgMultiSendExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Execute a multi-send transaction: send 500000000 inj and 2500000 usdt from inj1senderaddress to inj1recipient1address and inj1recipient2address.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Multi-send transaction submitted successfully.",
            action: "MSG_MULTI_SEND",
            content: {
                inputs: [
                    {
                        address: "inj1senderaddress",
                        coins: [
                            {
                                denom: "inj",
                                amount: "500000000",
                            },
                            {
                                denom: "usdt",
                                amount: "2500000",
                            },
                        ],
                    },
                ],
                outputs: [
                    {
                        address: "inj1recipient1address",
                        coins: [
                            {
                                denom: "inj",
                                amount: "300000000",
                            },
                        ],
                    },
                    {
                        address: "inj1recipient2address",
                        coins: [
                            {
                                denom: "inj",
                                amount: "200000000",
                            },
                        ],
                    },
                ],
            },
        },
    },
];

export const msgMultiSendResponseExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Confirm the multi-send transaction.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Multi-send transaction processed successfully.",
            action: "MSG_MULTI_SEND_RESPONSE",
            content: {
                txHash: "0xmultisendhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];
