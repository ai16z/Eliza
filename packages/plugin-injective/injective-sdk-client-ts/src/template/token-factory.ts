// Token Factory Module Templates

export const getDenomsFromCreatorTemplate = `
Extract the following details for fetching denominations from creator:
- **creator** (string): Creator's address

Request format:

\`\`\`json
{
    "creator": "inj1..."
}
\`\`\`

Response will contain an array of denominations:
- **denoms** (array): List of denomination strings

Response format:

\`\`\`json
{
    "denoms": [
        "factory/inj1.../token1",
        "factory/inj1.../token2"
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDenomAuthorityMetadataTemplate = `
Extract the following details for fetching denomination authority metadata:
- **creator** (string): Creator's address
- **subDenom** (string): Sub-denomination identifier

Request format:

\`\`\`json
{
    "creator": "inj1...",
    "subDenom": "token1"
}
\`\`\`

Response will contain authority metadata:
- **authorityMetadata** (object): Authority metadata information
  - **admin** (string): Admin address (can be undefined)

Response format:

\`\`\`json
{
    "authorityMetadata": {
        "admin": "inj1..."
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getTokenFactoryModuleParamsTemplate = `
Request to fetch token factory module parameters. No parameters required.

Response will contain module parameters:
- **denomCreationFee** (array): Array of creation fee coins
  - **denom** (string): Token denomination
  - **amount** (string): Fee amount

Response format:

\`\`\`json
{
    "denomCreationFee": [
        {
            "denom": "inj",
            "amount": "1000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getTokenFactoryModuleStateTemplate = `
Request to fetch token factory module state. No parameters required.

Response will contain module state:
- **denomCreationFee** (array): Array of creation fee coins
  - **denom** (string): Token denomination
  - **amount** (string): Fee amount
- **factoryDenoms** (array): List of factory denominations with metadata
  - **denom** (string): Full denomination string
  - **authorityMetadata** (object): Authority metadata
    - **admin** (string): Admin address

Response format:

\`\`\`json
{
    "denomCreationFee": [
        {
            "denom": "inj",
            "amount": "1000000000000000000"
        }
    ],
    "factoryDenoms": [
        {
            "denom": "factory/inj1.../token1",
            "authorityMetadata": {
                "admin": "inj1..."
            }
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgBurnTemplate = `
Extract the following details for burning tokens:
- **amount** (object): Amount to burn
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Request format:

\`\`\`json
{
    "amount": {
        "denom": "factory/inj1.../token1",
        "amount": "1000000000000000000"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgChangeAdminTemplate = `
Extract the following details for changing token admin:
- **denom** (string): Token denomination
- **newAdmin** (string): New admin address

Request format:

\`\`\`json
{
    "denom": "factory/inj1.../token1",
    "newAdmin": "inj1..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCreateDenomTemplate = `
Extract the following details for creating a new denomination:
- **subDenom** (string): Sub-denomination identifier

Request format:

\`\`\`json
{
    "subDenom": "token1"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgMintTemplate = `
Extract the following details for minting tokens:
- **totalAmount** (object): Amount to mint
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Request format:

\`\`\`json
{
    "totalAmount": {
        "denom": "factory/inj1.../token1",
        "amount": "1000000000000000000"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgSetDenomMetadataTemplate = `
Extract the following details for setting denomination metadata:
- **description** (string): Token description
- **denom** (string): Token denomination
- **name** (string): Token name
- **symbol** (string): Token symbol
- **uri** (string): Project URI
- **uriHash** (string): URI hash

Request format:

\`\`\`json
{
    "description": "Example Token",
    "denom": "factory/inj1.../token1",
    "name": "Example Token",
    "symbol": "EXT",
    "uri": "https://example.com",
    "uriHash": "hash123"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
