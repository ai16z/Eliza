// Insurance Fund Module Templates

export const getInsuranceModuleParamsTemplate = `
Extract the following details for insurance module parameters:
- **defaultRedemptionNoticePeriodDuration** (number): Default duration for redemption notice period in seconds

Provide the response in the following JSON format:

\`\`\`json
{
    "defaultRedemptionNoticePeriodDuration": 1209600
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getInsuranceFundsTemplate = `
Request to fetch all insurance funds. No parameters required.

Response will contain an array of insurance funds with the following details:
- **depositDenom** (string): Denomination of deposits
- **insurancePoolTokenDenom** (string): Denomination of pool tokens
- **redemptionNoticePeriodDuration** (number): Duration for redemption notice
- **balance** (string): Current fund balance
- **totalShare** (string): Total share amount
- **marketId** (string): Market identifier
- **marketTicker** (string): Market ticker symbol
- **oracleBase** (string): Oracle base asset
- **oracleQuote** (string): Oracle quote asset
- **oracleType** (number): Type of oracle
- **expiry** (number): Expiry timestamp

Response format:

\`\`\`json
{
    "insuranceFunds": [
        {
            "depositDenom": "inj",
            "insurancePoolTokenDenom": "share1",
            "redemptionNoticePeriodDuration": 1209600,
            "balance": "1000000000000000000",
            "totalShare": "1000000000000000000",
            "marketId": "0x1234...",
            "marketTicker": "BTC/USDT",
            "oracleBase": "BTC",
            "oracleQuote": "USDT",
            "oracleType": 1,
            "expiry": 1640995200
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getInsuranceFundTemplate = `
Extract the following details to get a specific insurance fund:
- **marketId** (string): Market identifier for the insurance fund

Request format:

\`\`\`json
{
    "marketId": "0x1234..."
}
\`\`\`

Response format:

\`\`\`json
{
    "depositDenom": "inj",
    "insurancePoolTokenDenom": "share1",
    "redemptionNoticePeriodDuration": 1209600,
    "balance": "1000000000000000000",
    "totalShare": "1000000000000000000",
    "marketId": "0x1234...",
    "marketTicker": "BTC/USDT",
    "oracleBase": "BTC",
    "oracleQuote": "USDT",
    "oracleType": 1,
    "expiry": 1640995200
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getEstimatedRedemptionsTemplate = `
Extract the following details for estimated redemptions:
- **marketId** (string): Market identifier
- **address** (string): Account address

Request format:

\`\`\`json
{
    "marketId": "0x1234...",
    "address": "inj1..."
}
\`\`\`

Response will contain array of redemption amounts:
- **amounts** (array): List of redemption amounts containing:
  - **amount** (string): Redemption amount
  - **denom** (string): Token denomination

Response format:

\`\`\`json
{
    "amounts": [
        {
            "amount": "1000000000000000000",
            "denom": "inj"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getPendingRedemptionsTemplate = `
Extract the following details for pending redemptions:
- **marketId** (string): Market identifier
- **address** (string): Account address

Request format:

\`\`\`json
{
    "marketId": "0x1234...",
    "address": "inj1..."
}
\`\`\`

Response will contain array of pending redemption amounts:
- **amounts** (array): List of pending redemption amounts containing:
  - **amount** (string): Redemption amount
  - **denom** (string): Token denomination

Response format:

\`\`\`json
{
    "amounts": [
        {
            "amount": "1000000000000000000",
            "denom": "inj"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCreateInsuranceFundTemplate = `
Extract the following details for creating an insurance fund:
- **marketId** (string): Market identifier
- **ticker** (string): Market ticker symbol
- **quoteDenom** (string): Quote denomination
- **oracleBase** (string): Oracle base asset
- **oracleQuote** (string): Oracle quote asset
- **oracleType** (number): Type of oracle
- **expiry** (number): Optional expiry timestamp
- **initialDeposit** (object): Initial deposit containing:
  - **amount** (string): Deposit amount
  - **denom** (string): Token denomination

Request format:

\`\`\`json
{
    "marketId": "0x1234...",
    "ticker": "BTC/USDT",
    "quoteDenom": "peggy0x...",
    "oracleBase": "BTC",
    "oracleQuote": "USDT",
    "oracleType": 1,
    "expiry": 1640995200,
    "initialDeposit": {
        "amount": "1000000000000000000",
        "denom": "inj"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgRequestRedemptionTemplate = `
Extract the following details for requesting a redemption:
- **marketId** (string): Market identifier
- **amount** (object): Redemption amount containing:
  - **amount** (string): Amount to redeem
  - **denom** (string): Token denomination

Request format:

\`\`\`json
{
    "marketId": "0x1234...",
    "amount": {
        "amount": "1000000000000000000",
        "denom": "share1"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgUnderwriteTemplate = `
Extract the following details for underwriting an insurance fund:
- **marketId** (string): Market identifier
- **deposit** (object): Deposit amount containing:
  - **amount** (string): Amount to deposit
  - **denom** (string): Token denomination

Request format:

\`\`\`json
{
    "marketId": "0x1234...",
    "deposit": {
        "amount": "1000000000000000000",
        "denom": "inj"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
