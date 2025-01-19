// =======================================
// Mint Module
// =======================================

export const getMintModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve mint module parameters, including mintDenom, inflationRateChange, inflationMax, inflationMin, goalBonded, and blocksPerYear.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Mint module parameters retrieved successfully.",
            action: "GET_MINT_MODULE_PARAMS",
            content: {
                mintDenom: "inj",
                inflationRateChange: "0.130000000000000000",
                inflationMax: "0.200000000000000000",
                inflationMin: "0.070000000000000000",
                goalBonded: "0.670000000000000000",
                blocksPerYear: "6311520",
            },
        },
    },
];

export const getInflationExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the current inflation rate.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Current inflation rate retrieved successfully.",
            action: "GET_INFLATION",
            content: {
                inflation: "0.130000000000000000",
            },
        },
    },
];

export const getAnnualProvisionsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the current annual provisions.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Annual provisions retrieved successfully.",
            action: "GET_ANNUAL_PROVISIONS",
            content: {
                annualProvisions: "5000000000000000000000000",
            },
        },
    },
];
