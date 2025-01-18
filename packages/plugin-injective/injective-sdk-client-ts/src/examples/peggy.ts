// =======================================
// Peggy Module
// =======================================

export const getPeggyModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve Peggy module parameters, including bridgeChainId, peggyId, signedValsetsWindow, signedBatchesWindow, signedClaimsWindow, targetBatchTimeout, averageBlockTime, averageEthereumBlockTime, slash fractions, unbondSlashingValsetsWindow, bridgeContractAddress, bridgeActive status, and oracles.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Peggy module parameters retrieved successfully.",
            action: "GET_PEGGY_MODULE_PARAMS",
            content: {
                bridgeParams: {
                    bridgeChainId: "1",
                    peggyId: "peggy1",
                    signedValsetsWindow: "10000",
                    signedBatchesWindow: "10000",
                    signedClaimsWindow: "10000",
                    targetBatchTimeout: "43200000",
                    averageBlockTime: "5000",
                    averageEthereumBlockTime: "15000",
                    slashFractionValset: "0.001",
                    slashFractionBatch: "0.001",
                    slashFractionClaim: "0.001",
                    slashFractionConflictingClaim: "0.001",
                    unbondSlashingValsetsWindow: "10000",
                    bridgeContractAddress: "0xBridgeContractAddress...",
                    bridgeActive: true,
                    oracles: [
                        "0xOracleAddress1...",
                        "0xOracleAddress2...",
                        // ...additional oracle addresses
                    ],
                },
            },
        },
    },
];

export const msgSendToEthExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Send 1,000,000,000 inj with a bridge fee of 1,000,000 inj to Ethereum address 0xEthereumAddress...",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Tokens sent to Ethereum successfully.",
            action: "MSG_SEND_TO_ETH",
            content: {
                txHash: "0xibctransferhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];
