// =======================================
// Insurance Fund Module
// =======================================

export const getInsuranceModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve insurance module parameters, including the default redemption notice period duration.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Insurance module parameters retrieved successfully.",
            action: "GET_INSURANCE_MODULE_PARAMS",
            content: {
                defaultRedemptionNoticePeriodDuration: 1209600,
            },
        },
    },
];

export const getInsuranceFundsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch all insurance funds.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Insurance funds retrieved successfully.",
            action: "GET_INSURANCE_FUNDS",
            content: {
                insuranceFunds: [
                    {
                        depositDenom: "inj",
                        insurancePoolTokenDenom: "share1",
                        redemptionNoticePeriodDuration: 1209600,
                        balance: "1000000000000000000",
                        totalShare: "1000000000000000000",
                        marketId: "0x1234abcd...",
                        marketTicker: "BTC/USDT",
                        oracleBase: "BTC",
                        oracleQuote: "USDT",
                        oracleType: 1,
                        expiry: 1640995200,
                    },
                    {
                        depositDenom: "inj",
                        insurancePoolTokenDenom: "share2",
                        redemptionNoticePeriodDuration: 1209600,
                        balance: "500000000000000000",
                        totalShare: "500000000000000000",
                        marketId: "0x5678efgh...",
                        marketTicker: "ETH/USDT",
                        oracleBase: "ETH",
                        oracleQuote: "USDT",
                        oracleType: 1,
                        expiry: 1643587200,
                    },
                    // ...additional insurance funds
                ],
            },
        },
    },
];

export const getInsuranceFundExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve details for the insurance fund with market ID 0x1234abcd...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Insurance fund details retrieved successfully.",
            action: "GET_INSURANCE_FUND",
            content: {
                depositDenom: "inj",
                insurancePoolTokenDenom: "share1",
                redemptionNoticePeriodDuration: 1209600,
                balance: "1000000000000000000",
                totalShare: "1000000000000000000",
                marketId: "0x1234abcd...",
                marketTicker: "BTC/USDT",
                oracleBase: "BTC",
                oracleQuote: "USDT",
                oracleType: 1,
                expiry: 1640995200,
            },
        },
    },
];

export const getEstimatedRedemptionsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get estimated redemptions for market ID 0x1234abcd... and address inj1useraddress...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Estimated redemptions retrieved successfully.",
            action: "GET_ESTIMATED_REDEMPTIONS",
            content: {
                amounts: [
                    {
                        amount: "1000000000000000000",
                        denom: "inj",
                    },
                    {
                        amount: "500000000000000000",
                        denom: "share1",
                    },
                ],
            },
        },
    },
];

export const getPendingRedemptionsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve pending redemptions for market ID 0x1234abcd... and address inj1useraddress...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Pending redemptions retrieved successfully.",
            action: "GET_PENDING_REDEMPTIONS",
            content: {
                amounts: [
                    {
                        amount: "500000000000000000",
                        denom: "inj",
                    },
                ],
            },
        },
    },
];

export const msgCreateInsuranceFundExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a new insurance fund with market ID 0x1234abcd..., ticker 'BTC/USDT', and an initial deposit of 1,000,000,000 inj.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Insurance fund creation submitted successfully.",
            action: "MSG_CREATE_INSURANCE_FUND",
            content: {
                txHash: "0xcreateinsurancefundhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgRequestRedemptionExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Request a redemption of 1,000,000,000 share1 from insurance fund with market ID 0x1234abcd...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Redemption request submitted successfully.",
            action: "MSG_REQUEST_REDEMPTION",
            content: {
                txHash: "0xrequestredemptionhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgUnderwriteExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Underwrite 1,000,000,000 inj to insurance fund with market ID 0x1234abcd...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Underwriting submitted successfully.",
            action: "MSG_UNDERWRITE",
            content: {
                txHash: "0xunderwritehash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];
