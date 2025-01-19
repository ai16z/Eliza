export const getDenomTraceExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the denomination trace for hash transfer/channel-0/uatom.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Denomination trace retrieved successfully.",
            action: "GET_DENOM_TRACE",
            content: {
                denomTrace: {
                    path: "transfer/channel-0",
                    baseDenom: "uatom",
                },
            },
        },
    },
];

export const getDenomsTraceExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all denomination traces with a limit of 100.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Denomination traces retrieved successfully.",
            action: "GET_DENOMS_TRACE",
            content: {
                denomsTrace: [
                    {
                        path: "transfer/channel-0",
                        baseDenom: "uatom",
                    },
                    {
                        path: "transfer/channel-1",
                        baseDenom: "uosmo",
                    },
                    // ...additional denom traces
                ],
            },
        },
    },
];

export const getIBCTransferTxsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve IBC transfer transactions sent by inj1senderaddress... to cosmos1receiveraddress... through source channel channel-0 and destination channel channel-1, limited to 10 results.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "IBC transfer transactions retrieved successfully.",
            action: "GET_IBC_TRANSFER_TXS",
            content: [
                {
                    sender: "inj1senderaddress...",
                    receiver: "cosmos1receiveraddress...",
                    eventNonce: 123,
                    eventHeight: 12345,
                    amount: "1000000000",
                    denom: "peggy0xabcdef...",
                    orchestratorAddress: "inj1orchestratoraddress...",
                    state: "completed",
                    txHashesList: [
                        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                    ],
                },
                // ...additional IBC transfer transactions
            ],
        },
    },
];

export const msgIBCTransferExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Perform an IBC transfer of 1,000,000,000 peggy0xabcdef... from inj1senderaddress... to cosmos1receiveraddress... via port transfer and channel channel-0 with a timeout of 300 seconds.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "IBC transfer submitted successfully.",
            action: "MSG_IBC_TRANSFER",
            content: {
                txHash: "0xibctransferhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];
