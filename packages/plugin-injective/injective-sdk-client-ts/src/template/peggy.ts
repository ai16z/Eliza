// Peggy Module Templates

export const getPeggyModuleParamsTemplate = `
Extract the Peggy module parameters.

Response will contain the following parameters:
- **bridgeParams** (object): Bridge parameters containing:
  - **bridgeChainId** (string): Chain ID for the bridge
  - **peggyId** (string): Unique identifier for the Peggy bridge
  - **signedValsetsWindow** (string): Window for signed validator sets
  - **signedBatchesWindow** (string): Window for signed batches
  - **signedClaimsWindow** (string): Window for signed claims
  - **targetBatchTimeout** (string): Target timeout for batches
  - **averageBlockTime** (string): Average block time
  - **averageEthereumBlockTime** (string): Average Ethereum block time
  - **slashFractionValset** (string): Slash fraction for validator sets
  - **slashFractionBatch** (string): Slash fraction for batches
  - **slashFractionClaim** (string): Slash fraction for claims
  - **slashFractionConflictingClaim** (string): Slash fraction for conflicting claims
  - **unbondSlashingValsetsWindow** (string): Unbond slashing window for validator sets
  - **bridgeContractAddress** (string): Ethereum bridge contract address
  - **bridgeActive** (boolean): Whether the bridge is active
  - **oracles** (string[]): List of oracle addresses

Response format:

\`\`\`json
{
    "bridgeParams": {
        "bridgeChainId": "1",
        "peggyId": "peggy1",
        "signedValsetsWindow": "10000",
        "signedBatchesWindow": "10000",
        "signedClaimsWindow": "10000",
        "targetBatchTimeout": "43200000",
        "averageBlockTime": "5000",
        "averageEthereumBlockTime": "15000",
        "slashFractionValset": "0.001",
        "slashFractionBatch": "0.001",
        "slashFractionClaim": "0.001",
        "slashFractionConflictingClaim": "0.001",
        "unbondSlashingValsetsWindow": "10000",
        "bridgeContractAddress": "0x...",
        "bridgeActive": true,
        "oracles": [
            "0x..."
        ]
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgSendToEthTemplate = `
Extract the following details for sending tokens to Ethereum:
- **amount** (object): Token amount containing:
  - **denom** (string): Token denomination
  - **amount** (string): Token amount
- **bridgeFee** (object): Bridge fee containing:
  - **denom** (string): Fee denomination
  - **amount** (string): Fee amount
- **ethDest** (string): Destination Ethereum address

Ensure that:
1. Amount is positive and properly formatted
2. Bridge fee is sufficient for the transfer
3. Ethereum destination address is valid
4. Token denomination is supported by the bridge

Request format:

\`\`\`json
{
    "amount": {
        "denom": "inj",
        "amount": "1000000000000000000"
    },
    "bridgeFee": {
        "denom": "inj",
        "amount": "1000000000000000"
    },
    "ethDest": "0x..."
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
