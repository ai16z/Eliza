export const getAuctionModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the auction module parameters, including the auction period and the minimum next bid increment rate.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Auction module parameters retrieved successfully.",
            action: "GET_AUCTION_MODULE_PARAMS",
            content: {
                auctionPeriod: 7200,
                minNextBidIncrementRate: "0.05",
            },
        },
    },
];

export const getAuctionModuleStateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get the current state of the auction module, including parameters, auction round, highest bid, and auction ending timestamp.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Auction module state retrieved successfully.",
            action: "GET_AUCTION_MODULE_STATE",
            content: {
                params: {
                    auctionPeriod: 7200,
                    minNextBidIncrementRate: "0.05",
                },
                auctionRound: 12,
                highestBid: {
                    bidder: "inj1xmpl3bidderaddress",
                    amount: "2500000000",
                },
                auctionEndingTimestamp: 1700000000,
            },
        },
    },
];

export const getCurrentBasketExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch the details of the current auction basket, including the list of amounts, auction round, closing time, highest bidder, and highest bid amount.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Current auction basket details retrieved successfully.",
            action: "GET_CURRENT_BASKET",
            content: {
                amountList: [
                    {
                        denom: "inj",
                        amount: "500000000",
                    },
                    {
                        denom: "usdt",
                        amount: "1000000",
                    },
                ],
                auctionRound: 12,
                auctionClosingTime: 1700003600,
                highestBidder: "inj1xmpl3bidderaddress",
                highestBidAmount: "2500000000",
            },
        },
    },
];

export const getAuctionRoundExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve information for auction round number 12.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Auction round 12 details retrieved successfully.",
            action: "GET_AUCTION_ROUND",
            content: {
                auction: {
                    winner: "inj1w1nn3raddress",
                    basketList: [
                        {
                            denom: "inj",
                            amount: "500000000",
                        },
                        {
                            denom: "usdt",
                            amount: "1000000",
                        },
                    ],
                    winningBidAmount: "2500000000",
                    round: 12,
                    endTimestamp: 1700000000,
                    updatedAt: 1700000000,
                },
                bids: [
                    {
                        bidder: "inj1bidder1address",
                        bidAmount: "2000000000",
                        bidTimestamp: 1699999000,
                    },
                    {
                        bidder: "inj1bidder2address",
                        bidAmount: "2500000000",
                        bidTimestamp: 1699999500,
                    },
                ],
            },
        },
    },
];

export const getAuctionsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the list of all past auctions with their details.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "List of auctions retrieved successfully.",
            action: "GET_AUCTIONS",
            content: [
                {
                    winner: "inj1w1nn3raddress",
                    basketList: [
                        {
                            denom: "inj",
                            amount: "500000000",
                        },
                        {
                            denom: "usdt",
                            amount: "1000000",
                        },
                    ],
                    winningBidAmount: "2500000000",
                    round: 12,
                    endTimestamp: 1700000000,
                    updatedAt: 1700000000,
                },
                {
                    winner: "inj1w1nn3raddress2",
                    basketList: [
                        {
                            denom: "inj",
                            amount: "750000000",
                        },
                        {
                            denom: "usdt",
                            amount: "1500000",
                        },
                    ],
                    winningBidAmount: "3500000000",
                    round: 11,
                    endTimestamp: 1699996400,
                    updatedAt: 1699996400,
                },
            ],
        },
    },
];

export const msgBidExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Place a bid of 2600000000 INJ_DENOM in auction round 12.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Bid placed successfully.",
            action: "PLACE_BID",
            content: {
                round: 12,
                amount: "2600000000",
            },
        },
    },
];

export const msgBidResponseExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Confirm the bid transaction.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Bid transaction processed.",
            action: "BID_TRANSACTION_RESPONSE",
            content: {
                txHash: "0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];
