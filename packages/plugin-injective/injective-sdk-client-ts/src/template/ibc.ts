// IBC Module Templates

export const getDenomTraceTemplate = `
Extract the following details to get denom trace information:
- **hash** (string): The hash of the denomination to trace

Provide the request in the following JSON format:

\`\`\`json
{
    "hash": "hash_string"
}
\`\`\`

The response will contain:
- **path** (string): Chain of port/channel identifiers used for tracing
- **baseDenom** (string): Base denomination of the relayed fungible token

Response format:

\`\`\`json
{
    "path": "transfer/channel-0/transfer/channel-1",
    "baseDenom": "uatom"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDenomsTraceTemplate = `
Extract the following details to get multiple denom traces:
- **pagination** (object): Optional pagination parameters containing:
  - **key** (string): Pagination key
  - **offset** (number): Pagination offset
  - **limit** (number): Number of records to return
  - **countTotal** (boolean): Whether to count total records

Provide the request in the following JSON format:

\`\`\`json
{
    "pagination": {
        "key": "",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

The response will contain an array of denom traces:
- **denomTraces** (array): List of denomination traces, each containing:
  - **path** (string): Chain of port/channel identifiers
  - **baseDenom** (string): Base denomination
- **pagination** (object): Pagination response information

Response format:

\`\`\`json
{
    "denomTraces": [
        {
            "path": "transfer/channel-0/transfer/channel-1",
            "baseDenom": "uatom"
        },
        {
            "path": "transfer/channel-2",
            "baseDenom": "uosmo"
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

export const msgIBCTransferTemplate = `
Extract the following details for IBC token transfer:
- **sourcePort** (string): Source port ID (e.g., "transfer")
- **sourceChannel** (string): Source channel ID
- **token** (object): Token to transfer containing:
  - **denom** (string): Token denomination
  - **amount** (string): Token amount
- **receiver** (string): Receiver address on destination chain
- **timeoutHeight** (object): Optional timeout height containing:
  - **revisionNumber** (string): Chain revision number
  - **revisionHeight** (string): Block height for timeout
- **timeoutTimestamp** (string): Optional timeout timestamp in nanoseconds
- **memo** (string): Optional transfer memo

Ensure that:
1. Port ID and channel ID are valid
2. Token amount is positive
3. Receiver address is valid for destination chain
4. Either timeoutHeight or timeoutTimestamp is specified

Provide the transfer details in the following JSON format:

\`\`\`json
{
    "sourcePort": "transfer",
    "sourceChannel": "channel-0",
    "token": {
        "denom": "inj",
        "amount": "1000000000000000000"
    },
    "receiver": "cosmos1...",
    "timeoutHeight": {
        "revisionNumber": "1",
        "revisionHeight": "1000000"
    },
    "timeoutTimestamp": "1640995200000000000",
    "memo": "Optional transfer memo"
}
\`\`\`

Success response format:

\`\`\`json
{
    "txHash": "0x...",
    "success": true
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
