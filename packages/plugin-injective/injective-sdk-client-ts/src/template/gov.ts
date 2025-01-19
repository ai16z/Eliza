// Governance Module Templates

export const getGovernanceModuleParamsTemplate = `
Extract the following details to get governance module parameters:
- **votingParams** (object): Contains:
  - **votingPeriod** (number): Duration of the voting period in seconds
- **tallyParams** (object): Contains:
  - **quorum** (string): Minimum percentage of voting power required
  - **threshold** (string): Minimum percentage for proposal to pass
  - **vetoThreshold** (string): Minimum veto percentage to reject
- **depositParams** (object): Contains:
  - **minDepositList** (array): Required minimum deposits
  - **maxDepositPeriod** (number): Maximum deposit period in seconds

Provide the response in the following JSON format:

\`\`\`json
{
    "votingParams": {
        "votingPeriod": 604800
    },
    "tallyParams": {
        "quorum": "0.334",
        "threshold": "0.5",
        "vetoThreshold": "0.334"
    },
    "depositParams": {
        "minDepositList": [
            {
                "denom": "inj",
                "amount": "100000000000000000000"
            }
        ],
        "maxDepositPeriod": 1209600
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getProposalsTemplate = `
Extract the following details for retrieving proposals:
- **status** (CosmosGovV1Gov.ProposalStatus): Filter by proposal status
- **pagination** (PaginationOption): Optional pagination parameters

Response will contain:
- **proposals** (Proposal[]): List of proposals
- **pagination**: Pagination response information

Provide the request in the following JSON format:

\`\`\`json
{
    "status": 2,
    "pagination": {
        "key": "",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "proposals": [
        {
            "proposalId": 1,
            "title": "Example Proposal",
            "summary": "This is an example proposal",
            "proposer": "inj1...",
            "status": 2,
            "finalTallyResult": {
                "yesCount": "100",
                "abstainCount": "10",
                "noCount": "5",
                "noWithVetoCount": "2"
            },
            "submitTime": 1632150400,
            "depositEndTime": 1633360000,
            "votingStartTime": 1633360000,
            "votingEndTime": 1633964800,
            "totalDeposits": [
                {
                    "denom": "inj",
                    "amount": "100000000000000000000"
                }
            ]
        }
    ],
    "pagination": {
        "nextKey": "",
        "total": 100
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getProposalTemplate = `
Extract the following details for retrieving a specific proposal:
- **proposalId** (number): The ID of the proposal

Provide the request in the following JSON format:

\`\`\`json
{
    "proposalId": 1
}
\`\`\`

Response format:

\`\`\`json
{
    "proposalId": 1,
    "title": "Example Proposal",
    "summary": "This is an example proposal",
    "proposer": "inj1...",
    "status": 2,
    "finalTallyResult": {
        "yesCount": "100",
        "abstainCount": "10",
        "noCount": "5",
        "noWithVetoCount": "2"
    },
    "submitTime": 1632150400,
    "depositEndTime": 1633360000,
    "votingStartTime": 1633360000,
    "votingEndTime": 1633964800,
    "totalDeposits": [
        {
            "denom": "inj",
            "amount": "100000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getProposalDepositsTemplate = `
Extract the following details for retrieving proposal deposits:
- **proposalId** (number): The ID of the proposal
- **pagination** (PaginationOption): Optional pagination parameters

Response will contain:
- **deposits** (ProposalDeposit[]): List of deposits
- **pagination**: Pagination response information

Request format:

\`\`\`json
{
    "proposalId": 1,
    "pagination": {
        "key": "",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "deposits": [
        {
            "depositor": "inj1...",
            "amounts": [
                {
                    "denom": "inj",
                    "amount": "100000000000000000000"
                }
            ]
        }
    ],
    "pagination": {
        "nextKey": "",
        "total": 10
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getProposalVotesTemplate = `
Extract the following details for retrieving proposal votes:
- **proposalId** (number): The ID of the proposal
- **pagination** (PaginationOption): Optional pagination parameters

Request format:

\`\`\`json
{
    "proposalId": 1,
    "pagination": {
        "key": "",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "votes": [
        {
            "proposalId": 1,
            "voter": "inj1...",
            "options": [
                {
                    "option": 1,
                    "weight": "1.0"
                }
            ],
            "metadata": ""
        }
    ],
    "pagination": {
        "nextKey": "",
        "total": 100
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getProposalTallyTemplate = `
Extract the following details for retrieving proposal tally:
- **proposalId** (number): The ID of the proposal

Request format:

\`\`\`json
{
    "proposalId": 1
}
\`\`\`

Response format:

\`\`\`json
{
    "yesCount": "100",
    "abstainCount": "10",
    "noCount": "5",
    "noWithVetoCount": "2"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgSubmitProposalExpiryFuturesMarketLaunchTemplate = `
Extract the following details for submitting an expiry futures market launch proposal:
- **title** (string): Proposal title
- **description** (string): Proposal description
- **marketId** (string): Market identifier
- **ticker** (string): Market ticker symbol
- **quoteDenom** (string): Quote denomination
- **oracleBase** (string): Oracle base
- **oracleQuote** (string): Oracle quote
- **expiry** (number): Expiry timestamp
- **initialDeposit** (Coin[]): Initial deposit amount

Request format:

\`\`\`json
{
    "title": "Launch BTC-USDT Quarterly Futures",
    "description": "Proposal to launch BTC-USDT quarterly futures market",
    "marketId": "0x123...",
    "ticker": "BTC-USDT-Q",
    "quoteDenom": "peggy0x123...USDT",
    "oracleBase": "BTC",
    "oracleQuote": "USDT",
    "expiry": 1640995200,
    "initialDeposit": [
        {
            "denom": "inj",
            "amount": "100000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgSubmitProposalSpotMarketLaunchTemplate = `
Extract the following details for submitting a spot market launch proposal:
- **title** (string): Proposal title
- **description** (string): Proposal description
- **ticker** (string): Market ticker symbol
- **baseDenom** (string): Base denomination
- **quoteDenom** (string): Quote denomination
- **initialDeposit** (Coin[]): Initial deposit amount

Request format:

\`\`\`json
{
    "title": "Launch INJ-USDT Spot Market",
    "description": "Proposal to launch INJ-USDT spot market",
    "ticker": "INJ-USDT",
    "baseDenom": "inj",
    "quoteDenom": "peggy0x123...USDT",
    "initialDeposit": [
        {
            "denom": "inj",
            "amount": "100000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgSubmitProposalPerpetualMarketLaunchTemplate = `
Extract the following details for submitting a perpetual market launch proposal:
- **title** (string): Proposal title
- **description** (string): Proposal description
- **ticker** (string): Market ticker symbol
- **quoteDenom** (string): Quote denomination
- **oracleBase** (string): Oracle base
- **oracleQuote** (string): Oracle quote
- **initialDeposit** (Coin[]): Initial deposit amount

Request format:

\`\`\`json
{
    "title": "Launch ETH-USDT Perpetual",
    "description": "Proposal to launch ETH-USDT perpetual market",
    "ticker": "ETH-USDT-PERP",
    "quoteDenom": "peggy0x123...USDT",
    "oracleBase": "ETH",
    "oracleQuote": "USDT",
    "initialDeposit": [
        {
            "denom": "inj",
            "amount": "100000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgVoteTemplate = `
Extract the following details for submitting a vote:
- **proposalId** (number): The ID of the proposal
- **options** (WeightedVoteOption[]): Vote options with weights
- **metadata** (string): Optional vote metadata

Request format:

\`\`\`json
{
    "proposalId": 1,
    "options": [
        {
            "option": 1,
            "weight": "1.0"
        }
    ],
    "metadata": ""
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgSubmitTextProposalTemplate = `
Extract the following details for submitting a text proposal:
- **title** (string): Proposal title
- **description** (string): Proposal description
- **initialDeposit** (Coin[]): Initial deposit amount

Request format:

\`\`\`json
{
    "title": "Community Pool Spend",
    "description": "Proposal to spend community pool funds",
    "initialDeposit": [
        {
            "denom": "inj",
            "amount": "100000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgSubmitProposalSpotMarketParamUpdateTemplate = `
Extract the following details for submitting a spot market parameter update proposal:
- **title** (string): Proposal title
- **description** (string): Proposal description
- **marketId** (string): Market identifier
- **makerFeeRate** (string): Maker fee rate
- **takerFeeRate** (string): Taker fee rate
- **initialDeposit** (Coin[]): Initial deposit amount

Request format:

\`\`\`json
{
    "title": "Update INJ-USDT Spot Market Parameters",
    "description": "Proposal to update INJ-USDT spot market parameters",
    "marketId": "0x123...",
    "makerFeeRate": "-0.0001",
    "takerFeeRate": "0.001",
    "initialDeposit": [
        {
            "denom": "inj",
            "amount": "100000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgSubmitGenericProposalTemplate = `
Extract the following details for submitting a generic proposal:
- **title** (string): Proposal title
- **description** (string): Proposal description
- **messages** (any[]): Proposal messages
- **initialDeposit** (Coin[]): Initial deposit amount

Request format:

\`\`\`json
{
    "title": "Generic Proposal",
    "description": "Generic governance proposal",
    "messages": [],
    "initialDeposit": [
        {
            "denom": "inj",
            "amount": "100000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgGovDepositTemplate = `
Extract the following details for depositing to a proposal:
- **proposalId** (number): The ID of the proposal
- **amount** (Coin[]): Deposit amount

Request format:

\`\`\`json
{
    "proposalId": 1,
    "amount": [
        {
            "denom": "inj",
            "amount": "100000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
