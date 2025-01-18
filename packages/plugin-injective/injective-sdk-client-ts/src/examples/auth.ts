export const getAuthModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the auth module parameters, including max memo characters, transaction signature limit, transaction size cost per byte, and signature verification costs.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Auth module parameters retrieved successfully.",
            action: "GET_AUTH_MODULE_PARAMS",
            content: {
                maxMemoCharacters: 256,
                txSigLimit: 7,
                txSizeCostPerByte: 10,
                sigVerifyCostEd25519: 590,
                sigVerifyCostSecp256k1: 1000,
            },
        },
    },
];

export const getAccountDetailsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch the account details for address inj1exampleaddress.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Account details retrieved successfully.",
            action: "GET_ACCOUNT_DETAILS",
            content: {
                codeHash: "0xabcdef1234567890",
                baseAccount: {
                    address: "inj1exampleaddress",
                    pubKey: {
                        key: "A1B2C3D4E5F6G7H8I9J0",
                        typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                    },
                    accountNumber: 123456,
                    sequence: 789012,
                },
            },
        },
    },
];

export const getAccountsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the list of all accounts with pagination.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Accounts list retrieved successfully.",
            action: "GET_ACCOUNTS",
            content: {
                pagination: {
                    nextKey: "eyJwYWdlIjoyfQ==",
                    total: 250,
                },
                accounts: [
                    {
                        codeHash: "0xabcdef1234567890",
                        baseAccount: {
                            address: "inj1account1address",
                            pubKey: {
                                key: "Z9Y8X7W6V5U4T3S2R1Q",
                                typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                            },
                            accountNumber: 654321,
                            sequence: 210987,
                        },
                    },
                    {
                        codeHash: "0x1234567890abcdef",
                        baseAccount: {
                            address: "inj1account2address",
                            pubKey: {
                                key: "L1K2J3H4G5F6D7S8A9Q",
                                typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                            },
                            accountNumber: 112233,
                            sequence: 445566,
                        },
                    },
                ],
            },
        },
    },
];

export const getGrantsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch all grants for granter inj1granteraddress and grantee inj1granteeaddress with message type /cosmos.bank.v1beta1.MsgSend.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Grants fetched successfully.",
            action: "GET_GRANTS",
            content: {
                pagination: {
                    nextKey: "eyJwYWdlIjozfQ==",
                    total: 15,
                },
                grants: [
                    {
                        authorization: {
                            "@type":
                                "/cosmos.authz.v1beta1.GenericAuthorization",
                            msg: "/cosmos.bank.v1beta1.MsgSend",
                        },
                        authorizationType: "GenericAuthorization",
                        expiration: "2024-12-31T23:59:59Z",
                    },
                    {
                        authorization: {
                            "@type": "/cosmos.authz.v1beta1.SendAuthorization",
                            spendLimit: [
                                {
                                    denom: "inj",
                                    amount: "1000000",
                                },
                            ],
                        },
                        authorizationType: "SendAuthorization",
                        expiration: "2025-06-30T12:00:00Z",
                    },
                ],
            },
        },
    },
];

export const getGranterGrantsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all grants made by granter inj1granteraddress with pagination.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Granter's grants fetched successfully.",
            action: "GET_GRANTER_GRANTS",
            content: {
                pagination: {
                    nextKey: "eyJwYWdlIjozfQ==",
                    total: 10,
                },
                grants: [
                    {
                        granter: "inj1granteraddress",
                        grantee: "inj1grantee1address",
                        authorization: {
                            "@type":
                                "/cosmos.authz.v1beta1.GenericAuthorization",
                            msg: "/cosmos.bank.v1beta1.MsgSend",
                        },
                        authorizationType: "GenericAuthorization",
                        expiration: "2024-12-31T23:59:59Z",
                    },
                    {
                        granter: "inj1granteraddress",
                        grantee: "inj1grantee2address",
                        authorization: {
                            "@type": "/cosmos.authz.v1beta1.SendAuthorization",
                            spendLimit: [
                                {
                                    denom: "usdt",
                                    amount: "500000",
                                },
                            ],
                        },
                        authorizationType: "SendAuthorization",
                        expiration: "2025-01-15T08:30:00Z",
                    },
                ],
            },
        },
    },
];

export const getGranteeGrantsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all grants received by grantee inj1granteeaddress with pagination.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Grantee's grants fetched successfully.",
            action: "GET_GRANTEE_GRANTS",
            content: {
                pagination: {
                    nextKey: "eyJwYWdlIjozfQ==",
                    total: 8,
                },
                grants: [
                    {
                        granter: "inj1granter1address",
                        grantee: "inj1granteeaddress",
                        authorization: {
                            "@type":
                                "/cosmos.authz.v1beta1.GenericAuthorization",
                            msg: "/cosmos.bank.v1beta1.MsgSend",
                        },
                        authorizationType: "GenericAuthorization",
                        expiration: "2024-12-31T23:59:59Z",
                    },
                    {
                        granter: "inj1granter2address",
                        grantee: "inj1granteeaddress",
                        authorization: {
                            "@type": "/cosmos.authz.v1beta1.SendAuthorization",
                            spendLimit: [
                                {
                                    denom: "inj",
                                    amount: "250000",
                                },
                            ],
                        },
                        authorizationType: "SendAuthorization",
                        expiration: "2025-03-10T16:45:00Z",
                    },
                ],
            },
        },
    },
];

export const msgGrantExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Grant authorization to grantee inj1granteeaddress for message type /cosmos.bank.v1beta1.MsgSend.",
        },
    },
];

export const msgGrantResponseExample = [
    {
        user: "{{agent}}",
        content: {
            text: "Authorization granted successfully.",
            action: "MSG_GRANT",
            content: {
                txHash: "0xgrant123hash456def789ghi012jkl345mno678pqr901stu234vwx",
                success: true,
            },
        },
    },
];

export const msgExecExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Execute authorized messages for grantee inj1granteeaddress: Send 1000000000 inj to inj1recipientaddress.",
        },
    },
];

export const msgExecResponseExample = [
    {
        user: "{{agent}}",
        content: {
            text: "Authorized messages executed successfully.",
            action: "MSG_EXEC",
            content: {
                txHash: "0xexec123hash456def789ghi012jkl345mno678pqr901stu234vwx",
                success: true,
            },
        },
    },
];

export const msgRevokeExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Revoke authorization for grantee inj1granteeaddress for message type /cosmos.bank.v1beta1.MsgSend.",
        },
    },
];

export const msgRevokeResponseExample = [
    {
        user: "{{agent}}",
        content: {
            text: "Authorization revoked successfully.",
            action: "MSG_REVOKE",
            content: {
                txHash: "0xrevoke123hash456def789ghi012jkl345mno678pqr901stu234vwx",
                success: true,
            },
        },
    },
];
