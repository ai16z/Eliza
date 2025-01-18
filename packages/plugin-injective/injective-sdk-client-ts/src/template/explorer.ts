export const getTxByHashTemplate = `
Extract the following details for transaction lookup:
- **hash** (string): Transaction hash to lookup

Provide the request in the following JSON format:

\`\`\`json
{
    "hash": "0x..."
}
\`\`\`

Response format:

\`\`\`json
{
    "id": "tx_id",
    "blockNumber": 12345,
    "blockTimestamp": "2024-01-11T12:00:00Z",
    "hash": "0x...",
    "memo": "transaction memo",
    "code": 0,
    "data": "base64_encoded_data",
    "info": "transaction info",
    "gasWanted": 100000,
    "gasUsed": 80000,
    "gasFee": {
        "amounts": [
            {
                "amount": "1000000",
                "denom": "inj"
            }
        ],
        "gasLimit": 100000,
        "payer": "inj1...",
        "granter": "inj1..."
    },
    "txType": "MsgSend",
    "signatures": [
        {
            "pubkey": "public_key",
            "address": "inj1...",
            "signature": "sig_data",
            "sequence": 5
        }
    ],
    "messages": [
        {
            "key": "message_key",
            "value": "message_value"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAccountTxTemplate = `
Extract the following details for account transactions:
- **address** (string): Account address
- **limit** (number, optional): Number of results
- **type** (string, optional): Transaction type filter
- **before** (number, optional): Results before this block
- **after** (number, optional): Results after this block
- **startTime** (number, optional): Start timestamp
- **endTime** (number, optional): End timestamp

Provide the request in the following JSON format:

\`\`\`json
{
    "address": "inj1...",
    "limit": 10,
    "type": "MsgSend",
    "before": 12345,
    "after": 12300,
    "startTime": 1641859200,
    "endTime": 1641945600
}
\`\`\`

Response format:

\`\`\`json
{
    "txs": [
        {
            "id": "tx_id",
            "blockNumber": 12345,
            "blockTimestamp": "2024-01-11T12:00:00Z",
            "hash": "0x...",
            "txType": "MsgSend"
        }
    ],
    "pagination": {
        "total": 100
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getValidatorTemplate = `
Extract the following details for validator lookup:
- **address** (string): Validator address

Provide the request in the following JSON format:

\`\`\`json
{
    "address": "injvaloper1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "id": "validator_id",
    "moniker": "Validator Name",
    "operatorAddress": "injvaloper1...",
    "consensusAddress": "injvalcons1...",
    "jailed": false,
    "status": 1,
    "tokens": "1000000000",
    "delegatorShares": "1000000000",
    "description": {
        "moniker": "Validator Name",
        "identity": "keybase_id",
        "website": "https://validator.com",
        "securityContact": "security@validator.com",
        "details": "Validator details"
    },
    "uptimePercentage": 99.9,
    "commissionRate": "0.1",
    "commissionMaxRate": "0.2",
    "commissionMaxChangeRate": "0.01"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getValidatorUptimeTemplate = `
Extract the following details for validator uptime:
- **validatorAddress** (string): Validator address

Provide the request in the following JSON format:

\`\`\`json
{
    "validatorAddress": "injvaloper1..."
}
\`\`\`

Response format:

\`\`\`json
[
    {
        "blockNumber": 12345,
        "status": "signed"
    }
]
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getPeggyDepositTxsTemplate = `
Extract the following details for Peggy deposit transactions:
- **sender** (string, optional): Sender address
- **receiver** (string, optional): Receiver address
- **limit** (number, optional): Number of results
- **skip** (number, optional): Number of results to skip

Provide the request in the following JSON format:

\`\`\`json
{
    "sender": "eth_address",
    "receiver": "inj1...",
    "limit": 10,
    "skip": 0
}
\`\`\`

Response format:

\`\`\`json
[
    {
        "sender": "eth_address",
        "receiver": "inj1...",
        "eventNonce": 123,
        "eventHeight": 12345,
        "amount": "1000000000",
        "denom": "peggy0x...",
        "orchestratorAddress": "inj1...",
        "state": "completed",
        "txHashesList": ["0x..."]
    }
]
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getPeggyWithdrawalTxsTemplate = `
Extract the following details for Peggy withdrawal transactions:
- **sender** (string, optional): Sender address
- **receiver** (string, optional): Receiver address
- **limit** (number, optional): Number of results
- **skip** (number, optional): Number of results to skip

Provide the request in the following JSON format:

\`\`\`json
{
    "sender": "inj1...",
    "receiver": "eth_address",
    "limit": 10,
    "skip": 0
}
\`\`\`

Response format:

\`\`\`json
[
    {
        "sender": "inj1...",
        "receiver": "eth_address",
        "amount": "1000000000",
        "denom": "peggy0x...",
        "bridgeFee": "1000000",
        "outgoingTxId": 123,
        "batchTimeout": 100,
        "batchNonce": 5,
        "state": "completed",
        "txHashesList": ["0x..."]
    }
]
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getBlocksTemplate = `
Extract the following details for blocks query:
- **before** (number, optional): Results before this block
- **after** (number, optional): Results after this block
- **limit** (number, optional): Number of results
- **from** (number, optional): Start block height
- **to** (number, optional): End block height

Provide the request in the following JSON format:

\`\`\`json
{
    "before": 12345,
    "after": 12300,
    "limit": 10,
    "from": 12300,
    "to": 12345
}
\`\`\`

Response format:

\`\`\`json
{
    "blocks": [
        {
            "height": 12345,
            "proposer": "injvaloper1...",
            "moniker": "Validator Name",
            "blockHash": "0x...",
            "parentHash": "0x...",
            "numPreCommits": 150,
            "numTxs": 10,
            "timestamp": "2024-01-11T12:00:00Z"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getBlockTemplate = `
Extract the following details for block lookup:
- **id** (string): Block height or hash

Provide the request in the following JSON format:

\`\`\`json
{
    "id": "12345"
}
\`\`\`

Response format:

\`\`\`json
{
    "block": {
        "height": 12345,
        "proposer": "injvaloper1...",
        "moniker": "Validator Name",
        "blockHash": "0x...",
        "parentHash": "0x...",
        "numPreCommits": 150,
        "numTxs": 10,
        "timestamp": "2024-01-11T12:00:00Z"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getTxsTemplate = `
Extract the following details for transactions query:
- **before** (number, optional): Results before this block
- **after** (number, optional): Results after this block
- **limit** (number, optional): Number of results
- **skip** (number, optional): Number of results to skip
- **type** (string, optional): Transaction type filter
- **chainModule** (string, optional): Chain module filter
- **startTime** (number, optional): Start timestamp
- **endTime** (number, optional): End timestamp

Provide the request in the following JSON format:

\`\`\`json
{
    "before": 12345,
    "after": 12300,
    "limit": 10,
    "skip": 0,
    "type": "MsgSend",
    "chainModule": "bank",
    "startTime": 1641859200,
    "endTime": 1641945600
}
\`\`\`

Response format:

\`\`\`json
{
    "transactions": [
        {
            "id": "tx_id",
            "blockNumber": 12345,
            "blockTimestamp": "2024-01-11T12:00:00Z",
            "hash": "0x...",
            "txType": "MsgSend"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getIBCTransferTxsTemplate = `
Extract the following details for IBC transfer transactions:
- **sender** (string, optional): Sender address
- **receiver** (string, optional): Receiver address
- **srcChannel** (string, optional): Source channel
- **srcPort** (string, optional): Source port
- **destChannel** (string, optional): Destination channel
- **destPort** (string, optional): Destination port
- **limit** (number, optional): Number of results
- **skip** (number, optional): Number of results to skip

Provide the request in the following JSON format:

\`\`\`json
{
    "sender": "inj1...",
    "receiver": "cosmos1...",
    "srcChannel": "channel-1",
    "srcPort": "transfer",
    "destChannel": "channel-0",
    "destPort": "transfer",
    "limit": 10,
    "skip": 0
}
\`\`\`

Response format:

\`\`\`json
[
    {
        "sender": "inj1...",
        "receiver": "cosmos1...",
        "sourcePort": "transfer",
        "sourceChannel": "channel-1",
        "destinationPort": "transfer",
        "destinationChannel": "channel-0",
        "amount": "1000000000",
        "denom": "inj",
        "timeoutHeight": "1-1000000",
        "timeoutTimestamp": 1641945600,
        "state": "completed"
    }
]
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getExplorerStatsTemplate = `
Extract explorer statistics.

Response format:

\`\`\`json
{
    "assets": "1000",
    "txsTotal": "1000000",
    "addresses": "50000",
    "injSupply": "100000000",
    "txsInPast30Days": "100000",
    "txsInPast24Hours": "10000",
    "blockCountInPast24Hours": "5000",
    "txsPerSecondInPast24Hours": "0.5",
    "txsPerSecondInPast100Blocks": "0.8"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
