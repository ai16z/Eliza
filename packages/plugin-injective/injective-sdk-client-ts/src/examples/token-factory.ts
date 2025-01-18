// =======================================
// Token Factory Module
// =======================================

export const getDenomsFromCreatorExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all denominations created by creator address 'inj1creator...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Denominations created by 'inj1creator...' retrieved successfully.",
            action: "GET_DENOMS_FROM_CREATOR",
            content: {
                denoms: [
                    "peggy0xabc...",
                    "peggy0xdef...",
                    "peggy0xghi...",
                    // ...additional denominations
                ],
            },
        },
    },
];

export const getDenomAuthorityMetadataExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch authority metadata for denomination 'peggy0xabc...' created by 'inj1creator...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Authority metadata for denomination 'peggy0xabc...' retrieved successfully.",
            action: "GET_DENOM_AUTHORITY_METADATA",
            content: {
                authorityMetadata: {
                    admin: "inj1admin...",
                    mintRestricted: false,
                    burnRestricted: true,
                },
            },
        },
    },
];

export const getTokenFactoryModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve Token Factory module parameters.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Token Factory module parameters retrieved successfully.",
            action: "GET_TOKEN_FACTORY_MODULE_PARAMS",
            content: {
                mintDenom: "inj",
                mintDenomMinAmount: "1000",
                mintDenomMaxAmount: "1000000",
            },
        },
    },
];

export const getTokenFactoryModuleStateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch current state of the Token Factory module.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Token Factory module state retrieved successfully.",
            action: "GET_TOKEN_FACTORY_MODULE_STATE",
            content: {
                totalDenoms: 150,
                activeDenoms: 145,
                pausedDenoms: 5,
            },
        },
    },
];

export const msgBurnExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Burn 5000000 peggy0xabc... from sender address 'inj1sender...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Burn transaction submitted successfully.",
            action: "MSG_BURN",
            content: {
                txHash: "0xburntxhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgChangeAdminExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Change admin of denomination 'peggy0xabc...' to new admin address 'inj1newadmin...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Admin change for denomination 'peggy0xabc...' submitted successfully.",
            action: "MSG_CHANGE_ADMIN",
            content: {
                txHash: "0xchangeadminhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgCreateDenomExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a new denomination 'peggy0xjkl...' with sub-denomination 'subdenom'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Denomination 'peggy0xjkl...' created successfully.",
            action: "MSG_CREATE_DENOM",
            content: {
                txHash: "0xcreatedenomhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgMintExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Mint 10000000 peggy0xabc... to creator address 'inj1creator...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Mint transaction submitted successfully.",
            action: "MSG_MINT",
            content: {
                txHash: "0xminttxhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgSetDenomMetadataExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Set metadata for denomination 'peggy0xabc...' with name 'Peggy Token', symbol 'PEG', description 'Peggy token description', and display denomination 'peg'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Denomination metadata for 'peggy0xabc...' set successfully.",
            action: "MSG_SET_DENOM_METADATA",
            content: {
                txHash: "0xsetmetadatahash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];
