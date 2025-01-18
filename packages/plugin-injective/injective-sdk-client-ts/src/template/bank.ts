export const getBankModuleParamsTemplate = `
Extract the following details for bank module parameters:
- **sendEnabledList** (array): List of send-enabled denominations containing:
  - **denom** (string): Denomination
  - **enabled** (boolean): Whether sending is enabled
- **defaultSendEnabled** (boolean): Default send enabled status

Provide the response in the following JSON format:

\`\`\`json
{
    "sendEnabledList": [
        {
            "denom": "inj",
            "enabled": true
        }
    ],
    "defaultSendEnabled": true
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getBankBalanceTemplate = `
Extract the following details for bank balance:
- **accountAddress** (string): Address of the account
- **denom** (string): Denomination to query

Provide the request in the following JSON format:

\`\`\`json
{
    "accountAddress": "inj1...",
    "denom": "inj"
}
\`\`\`

Response format:

\`\`\`json
{
    "denom": "inj",
    "amount": "1000000000"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getBankBalancesTemplate = `
Extract the following details for all bank balances:
- **accountAddress** (string): Address of the account
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "accountAddress": "inj1...",
    "pagination": {
        "key": "base64_encoded_key",
        "offset": 0,
        "limit": 100,
        "reverse": false
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "balances": [
        {
            "denom": "inj",
            "amount": "1000000000"
        }
    ],
    "pagination": {
        "nextKey": "next_page_key",
        "total": 100
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getTotalSupplyTemplate = `
Extract total supply with optional pagination.

Response format:

\`\`\`json
{
    "supply": [
        {
            "denom": "inj",
            "amount": "1000000000000"
        }
    ],
    "pagination": {
        "nextKey": "next_page_key",
        "total": 100
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAllTotalSupplyTemplate = `
Extract complete total supply for all denominations.

Response format:

\`\`\`json
{
    "supply": [
        {
            "denom": "inj",
            "amount": "1000000000000"
        }
    ],
    "pagination": {
        "nextKey": "next_page_key",
        "total": 100
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getSupplyOfTemplate = `
Extract the following details for supply of specific denomination:
- **denom** (string): Denomination to query

Provide the request in the following JSON format:

\`\`\`json
{
    "denom": "inj"
}
\`\`\`

Response format:

\`\`\`json
{
    "denom": "inj",
    "amount": "1000000000000"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDenomsMetadataTemplate = `
Extract metadata for all denominations with optional pagination.

Response format:

\`\`\`json
{
    "metadatas": [
        {
            "description": "The native staking token of the Injective blockchain",
            "denom_units": [
                {
                    "denom": "inj",
                    "exponent": 0,
                    "aliases": ["inj"]
                }
            ],
            "base": "inj",
            "display": "inj",
            "name": "Injective",
            "symbol": "INJ"
        }
    ],
    "pagination": {
        "nextKey": "next_page_key",
        "total": 100
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDenomMetadataTemplate = `
Extract the following details for denomination metadata:
- **denom** (string): Denomination to query

Provide the request in the following JSON format:

\`\`\`json
{
    "denom": "inj"
}
\`\`\`

Response format:

\`\`\`json
{
    "description": "The native staking token of the Injective blockchain",
    "denom_units": [
        {
            "denom": "inj",
            "exponent": 0,
            "aliases": ["inj"]
        }
    ],
    "base": "inj",
    "display": "inj",
    "name": "Injective",
    "symbol": "INJ"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDenomOwnersTemplate = `
Extract the following details for denomination owners:
- **denom** (string): Denomination to query
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "denom": "inj",
    "pagination": {
        "key": "base64_encoded_key",
        "offset": 0,
        "limit": 100,
        "reverse": false
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "denomOwners": [
        {
            "address": "inj1...",
            "balance": {
                "denom": "inj",
                "amount": "1000000000"
            }
        }
    ],
    "pagination": {
        "nextKey": "next_page_key",
        "total": 100
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgSendTemplate = `
Extract the following details for sending tokens:
- **srcInjectiveAddress** (string): Source address
- **dstInjectiveAddress** (string): Destination address
- **amount** (object): Amount to send containing:
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Provide the request in the following JSON format:

\`\`\`json
{
    "srcInjectiveAddress": "inj1...",
    "dstInjectiveAddress": "inj1...",
    "amount": {
        "denom": "inj",
        "amount": "1000000000"
    }
}
\`\`\`

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

export const msgMultiSendTemplate = `
Extract the following details for multi-send transaction:
- **inputs** (array): List of input addresses and amounts
- **outputs** (array): List of output addresses and amounts

Each input/output contains:
- **address** (string): Injective address
- **amount** (array): List of coins containing:
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Provide the request in the following JSON format:

\`\`\`json
{
    "inputs": [
        {
            "address": "inj1...",
            "coins": [
                {
                    "denom": "inj",
                    "amount": "1000000000"
                }
            ]
        }
    ],
    "outputs": [
        {
            "address": "inj1...",
            "coins": [
                {
                    "denom": "inj",
                    "amount": "500000000"
                }
            ]
        },
        {
            "address": "inj1...",
            "coins": [
                {
                    "denom": "inj",
                    "amount": "500000000"
                }
            ]
        }
    ]
}
\`\`\`

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
