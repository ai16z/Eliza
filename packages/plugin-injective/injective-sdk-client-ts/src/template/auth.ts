export const getAuthModuleParamsTemplate = `
Extract the following details for auth module parameters:
- **maxMemoCharacters** (number): Maximum number of characters allowed in memo
- **txSigLimit** (number): Transaction signature limit
- **txSizeCostPerByte** (number): Cost per byte for transaction size
- **sigVerifyCostEd25519** (number): Cost for Ed25519 signature verification
- **sigVerifyCostSecp256k1** (number): Cost for Secp256k1 signature verification

Provide the response in the following JSON format:

\`\`\`json
{
    "maxMemoCharacters": 256,
    "txSigLimit": 7,
    "txSizeCostPerByte": 10,
    "sigVerifyCostEd25519": 590,
    "sigVerifyCostSecp256k1": 1000
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAccountDetailsTemplate = `
Extract the following details for account information:
- **codeHash** (string): Hash of the account's code
- **baseAccount** (object): Base account information containing:
  - **address** (string): Account address
  - **pubKey** (object, optional): Public key information:
    - **key** (string): The public key
    - **typeUrl** (string): Type URL of the public key
  - **accountNumber** (number): Account number
  - **sequence** (number): Account sequence

Provide the response in the following JSON format:

\`\`\`json
{
    "codeHash": "0x...",
    "baseAccount": {
        "address": "inj1...",
        "pubKey": {
            "key": "key_string",
            "typeUrl": "/cosmos.crypto.secp256k1.PubKey"
        },
        "accountNumber": 12345,
        "sequence": 67890
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAccountsTemplate = `
Extract the following details for multiple accounts:
- **pagination** (object): Pagination information containing:
  - **nextKey** (string): Key for the next page
  - **total** (number): Total number of items
- **accounts** (array): List of accounts, each containing:
  - **codeHash** (string): Hash of the account's code
  - **baseAccount** (object): Base account information

Provide the response in the following JSON format:

\`\`\`json
{
    "pagination": {
        "nextKey": "next_page_key",
        "total": 100
    },
    "accounts": [
        {
            "codeHash": "0x...",
            "baseAccount": {
                "address": "inj1...",
                "pubKey": {
                    "key": "key_string",
                    "typeUrl": "/cosmos.crypto.secp256k1.PubKey"
                },
                "accountNumber": 12345,
                "sequence": 67890
            }
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getGrantsTemplate = `
Extract the following details for fetching grants:
- **pagination** (object, optional): Pagination options
- **granter** (string): Address of the granter
- **grantee** (string): Address of the grantee
- **msgTypeUrl** (string, optional): Type of message authorization

Provide the request in the following JSON format:

\`\`\`json
{
    "pagination": {
        "key": "base64_encoded_key",
        "offset": 0,
        "limit": 100,
        "reverse": false
    },
    "granter": "inj1...",
    "grantee": "inj1...",
    "msgTypeUrl": "/cosmos.bank.v1beta1.MsgSend"
}
\`\`\`

Response format:

\`\`\`json
{
    "pagination": {
        "nextKey": "next_page_key",
        "total": 100
    },
    "grants": [
        {
            "authorization": {
                "@type": "/cosmos.authz.v1beta1.GenericAuthorization",
                "msg": "/cosmos.bank.v1beta1.MsgSend"
            },
            "authorizationType": "GenericAuthorization",
            "expiration": "2024-12-31T23:59:59Z"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getGranterGrantsTemplate = `
Extract the following details for fetching granter's grants:
- **granter** (string): Address of the granter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "granter": "inj1...",
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
    "pagination": {
        "nextKey": "next_page_key",
        "total": 100
    },
    "grants": [
        {
            "granter": "inj1...",
            "grantee": "inj1...",
            "authorization": {
                "@type": "/cosmos.authz.v1beta1.GenericAuthorization",
                "msg": "/cosmos.bank.v1beta1.MsgSend"
            },
            "authorizationType": "GenericAuthorization",
            "expiration": "2024-12-31T23:59:59Z"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getGranteeGrantsTemplate = `
Extract the following details for fetching grantee's grants:
- **grantee** (string): Address of the grantee
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "grantee": "inj1...",
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
    "pagination": {
        "nextKey": "next_page_key",
        "total": 100
    },
    "grants": [
        {
            "granter": "inj1...",
            "grantee": "inj1...",
            "authorization": {
                "@type": "/cosmos.authz.v1beta1.GenericAuthorization",
                "msg": "/cosmos.bank.v1beta1.MsgSend"
            },
            "authorizationType": "GenericAuthorization",
            "expiration": "2024-12-31T23:59:59Z"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgGrantTemplate = `
Extract the following details for granting authorization:
- **messageType** (string): Type of message to authorize
- **grantee** (string): Address of the grantee
- **granter** (string): Address of the granter

Provide the request in the following JSON format:

\`\`\`json
{
    "messageType": "/cosmos.bank.v1beta1.MsgSend",
    "grantee": "inj1...",
    "granter": "inj1..."
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

export const msgExecTemplate = `
Extract the following details for executing authorized messages:
- **grantee** (string): Address of the grantee executing the messages
- **msgs** (array): Array of messages to execute

Provide the request in the following JSON format:

\`\`\`json
{
    "grantee": "inj1...",
    "msgs": [
        {
            "@type": "/cosmos.bank.v1beta1.MsgSend",
            "fromAddress": "inj1...",
            "toAddress": "inj1...",
            "amount": [
                {
                    "denom": "inj",
                    "amount": "1000000000"
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

export const msgRevokeTemplate = `
Extract the following details for revoking authorization:
- **messageType** (string): Type of message authorization to revoke
- **grantee** (string): Address of the grantee
- **granter** (string): Address of the granter

Provide the request in the following JSON format:

\`\`\`json
{
    "messageType": "/cosmos.bank.v1beta1.MsgSend",
    "grantee": "inj1...",
    "granter": "inj1..."
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
