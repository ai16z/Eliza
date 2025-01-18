// Auction Module Templates

export const getAuctionModuleParamsTemplate = `
Extract the following details to get auction module parameters:
- **auctionPeriod** (number): The duration of each auction period in seconds
- **minNextBidIncrementRate** (string): The minimum rate at which the next bid must increase

Provide the response in the following JSON format:

\`\`\`json
{
    "auctionPeriod": 3600,
    "minNextBidIncrementRate": "0.1"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAuctionModuleStateTemplate = `
Extract the following details for the auction module state:
- **params** (object): Module parameters containing:
  - **auctionPeriod** (number): The duration of each auction period in seconds
  - **minNextBidIncrementRate** (string): The minimum rate for next bid increment
- **auctionRound** (number): Current auction round number
- **highestBid** (object): Information about the highest bid:
  - **bidder** (string): Address of the highest bidder
  - **amount** (string): Amount of the highest bid
- **auctionEndingTimestamp** (number): Unix timestamp when the auction ends

Provide the response in the following JSON format:

\`\`\`json
{
    "params": {
        "auctionPeriod": 3600,
        "minNextBidIncrementRate": "0.1"
    },
    "auctionRound": 5,
    "highestBid": {
        "bidder": "inj1...",
        "amount": "1000000000"
    },
    "auctionEndingTimestamp": 1632150400
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getCurrentBasketTemplate = `
Extract the following details for the current auction basket:
- **amountList** (array): List of amounts in the basket, each containing:
  - **denom** (string): Token denomination (e.g., "inj")
  - **amount** (string): Token amount
- **auctionRound** (number): Current auction round number
- **auctionClosingTime** (number): Unix timestamp when the auction closes
- **highestBidder** (string): Address of the current highest bidder
- **highestBidAmount** (string): Amount of the current highest bid

Provide the response in the following JSON format:

\`\`\`json
{
    "amountList": [
        {
            "denom": "inj",
            "amount": "1000000000"
        }
    ],
    "auctionRound": 5,
    "auctionClosingTime": 1632150400,
    "highestBidder": "inj1...",
    "highestBidAmount": "1000000000"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAuctionRoundTemplate = `
Extract the following details for getting auction round information:
- **round** (number): The auction round number to query

Ensure that:
1. Round number is positive
2. Round number exists in the system

Provide the round parameter in the following JSON format:

\`\`\`json
{
    "round": 5
}
\`\`\`

The response will contain:
- **auction** (object): Auction information containing:
  - **winner** (string): Address of the auction winner
  - **basketList** (array): List of tokens in the basket
  - **winningBidAmount** (string): Amount of the winning bid
  - **round** (number): Round number
  - **endTimestamp** (number): Unix timestamp when the round ended
  - **updatedAt** (number): Last update timestamp
- **bids** (array): List of bids in the round, each containing:
  - **bidder** (string): Address of the bidder
  - **bidAmount** (string): Bid amount
  - **bidTimestamp** (number): When the bid was placed

Response format:

\`\`\`json
{
    "auction": {
        "winner": "inj1...",
        "basketList": [
            {
                "denom": "inj",
                "amount": "1000000000"
            }
        ],
        "winningBidAmount": "1000000000",
        "round": 5,
        "endTimestamp": 1632150400,
        "updatedAt": 1632150400
    },
    "bids": [
        {
            "bidder": "inj1...",
            "bidAmount": "1000000000",
            "bidTimestamp": 1632150300
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAuctionsTemplate = `
Extract details for retrieving multiple auctions. The response will provide:
- **auction** (array): List of auctions, each containing:
  - **winner** (string): Address of the auction winner
  - **basketList** (array): List of tokens in the basket
  - **winningBidAmount** (string): Amount of the winning bid
  - **round** (number): Auction round number
  - **endTimestamp** (number): Unix timestamp when the auction ended
  - **updatedAt** (number): Last update timestamp

Provide the response in the following JSON format:

\`\`\`json
[
    {
        "winner": "inj1...",
        "basketList": [
            {
                "denom": "inj",
                "amount": "1000000000"
            }
        ],
        "winningBidAmount": "1000000000",
        "round": 5,
        "endTimestamp": 1632150400,
        "updatedAt": 1632150400
    }
]
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgBidTemplate = `
Extract the following details for placing a bid:
- **round** (number): The auction round number to bid in
- **amount** (string): The bid amount in INJ_DENOM

Ensure that:
1. Round number is positive and exists in the system
2. Amount is positive and properly formatted
3. Amount is greater than the current highest bid plus minimum increment

Provide the bid details in the following JSON format:

\`\`\`json
{
    "round": 5,
    "amount": "1000000000"
}
\`\`\`

A successful response will include:
- **txHash** (string): The transaction hash
- **success** (boolean): Whether the bid was successful

Response format:

\`\`\`json
{
    "txHash": "0x...",
    "success": true
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
