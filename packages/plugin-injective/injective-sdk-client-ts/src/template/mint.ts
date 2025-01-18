// Mint Module Templates

export const getMintModuleParamsTemplate = `
Extract the mint module parameters.

The response will contain:
- **mintDenom** (string): Type of coin to mint
- **inflationRateChange** (string): Maximum annual change in inflation rate
- **inflationMax** (string): Maximum inflation rate
- **inflationMin** (string): Minimum inflation rate
- **goalBonded** (string): Goal of percent bonded atoms
- **blocksPerYear** (string): Expected blocks per year

Response format:

\`\`\`json
{
    "mintDenom": "inj",
    "inflationRateChange": "0.130000000000000000",
    "inflationMax": "0.200000000000000000",
    "inflationMin": "0.070000000000000000",
    "goalBonded": "0.670000000000000000",
    "blocksPerYear": "6311520"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getInflationTemplate = `
Extract the current inflation rate.

The response will contain:
- **inflation** (string): Current inflation rate

Response format:

\`\`\`json
{
    "inflation": "0.130000000000000000"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAnnualProvisionsTemplate = `
Extract the current annual provisions.

The response will contain:
- **annualProvisions** (string): Current annual provisions

Response format:

\`\`\`json
{
    "annualProvisions": "5000000000000000000000000"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
