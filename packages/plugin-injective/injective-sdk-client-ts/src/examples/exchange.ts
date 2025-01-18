export const getAccountPortfolioExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve account portfolio for address 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Account portfolio retrieved successfully.",
            action: "GET_ACCOUNT_PORTFOLIO",
            content: {
                accountAddress: "inj1...",
                bankBalancesList: [
                    {
                        amount: "1000000",
                        denom: "inj",
                    },
                ],
                subaccountsList: [
                    {
                        subaccountId: "subaccount_id",
                        denom: "inj",
                        deposit: {
                            totalBalance: "1000000",
                            availableBalance: "900000",
                        },
                    },
                ],
                positionsWithUpnlList: [
                    {
                        position: {
                            marketId: "market_id",
                            subaccountId: "subaccount_id",
                            direction: "long",
                            quantity: "1.5",
                            entryPrice: "25000.5",
                            margin: "1000",
                            liquidationPrice: "24000.0",
                            markPrice: "25100.0",
                            ticker: "BTC/USDT",
                        },
                        unrealizedPnl: "150.75",
                    },
                ],
            },
        },
    },
];

export const getSubaccountHistoryExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch subaccount history for subaccount ID 'subaccount_id' with denom 'inj' and transfer types ['deposit', 'withdraw'].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Subaccount history retrieved successfully.",
            action: "GET_SUBACCOUNT_HISTORY",
            content: {
                transfers: [
                    {
                        transferType: "deposit",
                        srcSubaccountId: "src_subaccount_id",
                        srcSubaccountAddress: "inj1...",
                        dstSubaccountId: "dst_subaccount_id",
                        dstSubaccountAddress: "inj1...",
                        amount: {
                            amount: "1000000",
                            denom: "inj",
                        },
                        executedAt: 1641859200,
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getSpotMarketExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Lookup spot market with market ID 'market_id'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot market retrieved successfully.",
            action: "GET_SPOT_MARKET",
            content: {
                marketId: "market_id",
                marketStatus: "active",
                ticker: "INJ/USDT",
                baseDenom: "inj",
                quoteDenom: "usdt",
                makerFeeRate: "0.001",
                takerFeeRate: "0.002",
                serviceProviderFee: "0.4",
                minPriceTickSize: 0.000001,
                minQuantityTickSize: 0.000001,
            },
        },
    },
];

export const getDerivativeMarketExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Lookup derivative market with market ID 'market_id'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Derivative market retrieved successfully.",
            action: "GET_DERIVATIVE_MARKET",
            content: {
                marketId: "market_id",
                marketStatus: "active",
                ticker: "BTC/USDT PERP",
                oracleBase: "BTC",
                oracleQuote: "USDT",
                quoteDenom: "usdt",
                makerFeeRate: "0.001",
                takerFeeRate: "0.002",
                serviceProviderFee: "0.4",
                initialMarginRatio: "0.05",
                maintenanceMarginRatio: "0.02",
                isPerpetual: true,
                minPriceTickSize: 0.01,
                minQuantityTickSize: 0.001,
            },
        },
    },
];

export const getExchangePositionsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Query positions of the exchange modules",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Positions retrieved successfully.",
            action: "GET_EXCHANGE_POSITIONS",
            content: {
                positions: [
                    {
                        marketId: "market_id",
                        subaccountId: "subaccount_id",
                        direction: "long",
                        quantity: "1.5",
                        entryPrice: "25000.5",
                        margin: "1000",
                        liquidationPrice: "24000.0",
                        markPrice: "25100.0",
                        ticker: "BTC/USDT",
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getInsuranceFundsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve insurance funds information.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Insurance funds information retrieved successfully.",
            action: "GET_INSURANCE_FUNDS",
            content: {
                funds: [
                    {
                        depositDenom: "inj",
                        insurancePoolTokenDenom: "insurance_pool_token",
                        redemptionNoticePeriodDuration: 1209600,
                        balance: "1000000",
                        totalShare: "1000000",
                        marketId: "market_id",
                        marketTicker: "BTC/USDT PERP",
                        oracleBase: "BTC",
                        oracleQuote: "USDT",
                        oracleType: "band",
                        expiry: 0,
                    },
                ],
            },
        },
    },
];

export const getRedemptionsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Query redemptions for address 'inj1...' with denom 'inj' and status 'pending'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Redemptions retrieved successfully.",
            action: "GET_REDEMPTIONS",
            content: {
                redemptions: [
                    {
                        redemptionId: 1,
                        status: "pending",
                        redeemer: "inj1...",
                        claimableRedemptionTime: 1641859200,
                        redemptionAmount: "1000000",
                        redemptionDenom: "inj",
                        requestedAt: 1641772800,
                        disbursedAmount: "0",
                        disbursedDenom: "",
                        disbursedAt: 0,
                    },
                ],
            },
        },
    },
];

export const getSpotOrdersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Query spot orders for market ID 'market_id1', 'market_id2', subaccount ID 'subaccount_id', order side 'buy', non-conditional, with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot orders retrieved successfully.",
            action: "GET_SPOT_ORDERS",
            content: {
                orders: [
                    {
                        orderHash: "0x...",
                        orderSide: "buy",
                        marketId: "market_id",
                        subaccountId: "subaccount_id",
                        price: "25000.5",
                        quantity: "1.5",
                        unfilledQuantity: "0.5",
                        triggerPrice: "0",
                        feeRecipient: "inj1...",
                        state: "booked",
                        createdAt: 1641859200,
                        updatedAt: 1641859200,
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getDerivativeOrdersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Query derivative orders for market IDs 'market_id1' and 'market_id2', subaccount ID 'subaccount_id', order side 'buy', non-conditional, with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Derivative orders retrieved successfully.",
            action: "GET_DERIVATIVE_ORDERS",
            content: {
                orders: [
                    {
                        orderHash: "0x...",
                        orderSide: "buy",
                        marketId: "market_id",
                        subaccountId: "subaccount_id",
                        margin: "1000",
                        price: "25000.5",
                        quantity: "1.5",
                        unfilledQuantity: "0.5",
                        triggerPrice: "0",
                        feeRecipient: "inj1...",
                        state: "booked",
                        createdAt: 1641859200,
                        updatedAt: 1641859200,
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getHistoricalTradesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch historical trades for market IDs 'market_id1' and 'market_id2', subaccount ID 'subaccount_id', between start time 1641859200 and end time 1641945600, direction 'buy', with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Historical trades retrieved successfully.",
            action: "GET_HISTORICAL_TRADES",
            content: {
                trades: [
                    {
                        orderHash: "0x...",
                        subaccountId: "subaccount_id",
                        marketId: "market_id",
                        tradeId: "trade_id",
                        executedAt: 1641859200,
                        tradeExecutionType: "limit",
                        tradeDirection: "buy",
                        executionPrice: "25000.5",
                        executionQuantity: "1.5",
                        fee: "0.5",
                        feeRecipient: "inj1...",
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getFundingRatesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch funding rates for market ID 'market_id' with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Funding rates retrieved successfully.",
            action: "GET_FUNDING_RATES",
            content: {
                fundingRates: [
                    {
                        marketId: "market_id",
                        rate: "0.0001",
                        timestamp: 1641859200,
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const msgDepositExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Deposit 1,000,000 INJ to subaccount '0x...' from address 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Deposit successful.",
            action: "MSG_DEPOSIT",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgWithdrawExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Withdraw 1,000,000 INJ from subaccount '0x...' to address 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Withdrawal successful.",
            action: "MSG_WITHDRAW",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgCreateSpotMarketOrderExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a spot market order to BUY 0.5 INJ at price 25000.5 for subaccount '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot market order created successfully.",
            action: "MSG_CREATE_SPOT_MARKET_ORDER",
            content: {
                orderHash: "0x...",
                txHash: "0x...",
            },
        },
    },
];

export const msgCreateDerivativeMarketOrderExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a derivative market order to BUY 1.5 BTC/USDT PERP at price 25000.5 with margin 1000 for subaccount '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Derivative market order created successfully.",
            action: "MSG_CREATE_DERIVATIVE_MARKET_ORDER",
            content: {
                orderHash: "0x...",
                txHash: "0x...",
            },
        },
    },
];

export const msgBatchCancelOrdersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Batch cancel spot and derivative orders for subaccount '0x...' with order hashes ['0x...'].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Batch orders canceled successfully.",
            action: "MSG_BATCH_CANCEL_ORDERS",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgBatchUpdateOrdersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Batch update spot and derivative orders for subaccount '0x...' with updated prices and quantities.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Batch orders updated successfully.",
            action: "MSG_BATCH_UPDATE_ORDERS",
            content: {
                spotOrderHashes: ["0x..."],
                derivativeOrderHashes: ["0x..."],
                txHash: "0x...",
            },
        },
    },
];

export const msgAdminUpdateBinaryOptionsMarketExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Admin 'inj1...' updates binary options market '0x...' with settlement price 25000.5, expiry time 1641859200, and settlement time 1641945600.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Binary options market updated successfully.",
            action: "MSG_ADMIN_UPDATE_BINARY_OPTIONS_MARKET",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const getModuleStateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch the current state of the exchange module.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Exchange module state retrieved successfully.",
            action: "GET_MODULE_STATE",
            content: {
                moduleState: {
                    params: {
                        spotMarketInstantListingFee: {
                            amount: "100000000",
                            denom: "inj",
                        },
                        derivativeMarketInstantListingFee: {
                            amount: "1000000000",
                            denom: "inj",
                        },
                        defaultSpotMakerFeeRate: "0.001",
                        defaultSpotTakerFeeRate: "0.002",
                        defaultDerivativeMakerFeeRate: "0.001",
                        defaultDerivativeTakerFeeRate: "0.002",
                        defaultInitialMarginRatio: "0.05",
                        defaultMaintenanceMarginRatio: "0.02",
                        defaultFundingInterval: 3600,
                        fundingMultiple: 3600,
                    },
                    spotMarkets: [],
                    derivativeMarkets: [],
                    spotOrderbooks: [],
                    derivativeOrderbooks: [],
                    balances: [],
                    positions: [],
                },
            },
        },
    },
];

export const getFeeDiscountScheduleExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve the fee discount schedule.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Fee discount schedule retrieved successfully.",
            action: "GET_FEE_DISCOUNT_SCHEDULE",
            content: {
                bucketCount: 10,
                bucketDuration: 1209600,
                quoteDenomsList: ["inj"],
                tierInfosList: [
                    {
                        makerDiscountRate: "0.001",
                        takerDiscountRate: "0.001",
                        stakedAmount: "10000000000",
                        volume: "100000000",
                    },
                ],
                disqualifiedMarketIdsList: [],
            },
        },
    },
];

export const getFeeDiscountAccountInfoExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get fee discount account info for address 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Fee discount account info retrieved successfully.",
            action: "GET_FEE_DISCOUNT_ACCOUNT_INFO",
            content: {
                tierLevel: 1,
                accountInfo: {
                    makerDiscountRate: "0.001",
                    takerDiscountRate: "0.001",
                    stakedAmount: "10000000000",
                    volume: "100000000",
                },
                accountTtl: {
                    tier: 1,
                    ttlTimestamp: 1641945600,
                },
            },
        },
    },
];

export const getModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch module parameters information.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Module parameters retrieved successfully.",
            action: "GET_MODULE_PARAMS",
            content: {
                spotMarketInstantListingFee: {
                    amount: "100000000",
                    denom: "inj",
                },
                derivativeMarketInstantListingFee: {
                    amount: "1000000000",
                    denom: "inj",
                },
                defaultSpotMakerFeeRate: "0.001",
                defaultSpotTakerFeeRate: "0.002",
                defaultDerivativeMakerFeeRate: "0.001",
                defaultDerivativeTakerFeeRate: "0.002",
                defaultInitialMarginRatio: "0.05",
                defaultMaintenanceMarginRatio: "0.02",
                defaultFundingInterval: 3600,
                fundingMultiple: 3600,
                relayerFeeShareRate: "0.4",
                exchangeModuleAdmin: "inj1...",
            },
        },
    },
];

export const getTradingRewardsCampaignExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve current trading rewards campaign information.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Trading rewards campaign information retrieved successfully.",
            action: "GET_TRADING_REWARDS_CAMPAIGN",
            content: {
                tradingRewardCampaignInfo: {
                    campaignDurationSeconds: 604800,
                    quoteDenomsList: ["inj"],
                    tradingRewardBoostInfo: {
                        boostedSpotMarketIdsList: [],
                        spotMarketMultipliersList: [],
                        boostedDerivativeMarketIdsList: [],
                        derivativeMarketMultipliersList: [],
                    },
                    disqualifiedMarketIdsList: [],
                },
                tradingRewardPoolCampaignScheduleList: [
                    {
                        startTimestamp: 1641859200,
                        maxCampaignRewardsList: [
                            {
                                amount: "1000000000",
                                denom: "inj",
                            },
                        ],
                    },
                ],
                totalTradeRewardPoints: "1000000",
                pendingTradingRewardPoolCampaignScheduleList: [],
                pendingTotalTradeRewardPointsList: [],
            },
        },
    },
];

export const getTradeRewardPointsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get trade reward points for addresses ['inj1...', 'inj2...'].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Trade reward points retrieved successfully.",
            action: "GET_TRADE_REWARD_POINTS",
            content: {
                rewardPoints: ["100", "200"],
            },
        },
    },
];

export const getPendingTradeRewardPointsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get pending trade reward points for addresses ['inj1...', 'inj2...'].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Pending trade reward points retrieved successfully.",
            action: "GET_PENDING_TRADE_REWARD_POINTS",
            content: {
                rewardPoints: ["100", "200"],
            },
        },
    },
];

export const getBinaryOptionsMarketsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all active binary options markets with quote denom 'usdt'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Binary options markets retrieved successfully.",
            action: "GET_BINARY_OPTIONS_MARKETS",
            content: {
                markets: [
                    {
                        marketId: "0x...",
                        marketStatus: "active",
                        ticker: "BTC>25000-240630",
                        oracleSymbol: "BTC",
                        oracleProvider: "band",
                        oracleScaleFactor: 6,
                        quoteDenom: "usdt",
                        makerFeeRate: "0.001",
                        takerFeeRate: "0.002",
                        expirationTimestamp: 1719705600,
                        settlementTimestamp: 1719792000,
                        serviceProviderFee: "0.4",
                        minPriceTickSize: 0.01,
                        minQuantityTickSize: 0.001,
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getBinaryOptionsMarketExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Lookup binary options market with market ID '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Binary options market retrieved successfully.",
            action: "GET_BINARY_OPTIONS_MARKET",
            content: {
                market: {
                    marketId: "0x...",
                    marketStatus: "active",
                    ticker: "BTC>25000-240630",
                    oracleSymbol: "BTC",
                    oracleProvider: "band",
                    oracleScaleFactor: 6,
                    quoteDenom: "usdt",
                    makerFeeRate: "0.001",
                    takerFeeRate: "0.002",
                    expirationTimestamp: 1719705600,
                    settlementTimestamp: 1719792000,
                    serviceProviderFee: "0.4",
                    minPriceTickSize: 0.01,
                    minQuantityTickSize: 0.001,
                },
            },
        },
    },
];

export const msgCreateBinaryOptionsMarketExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a new binary options market with ticker 'BTC/USD', oracle 'band', expiry time 1641945600, settlement time 1641945600, admin 'inj1...', quote denom 'inj', min price tick size '0.000001', and min quantity tick size '0.000001'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Binary options market created successfully.",
            action: "MSG_CREATE_BINARY_OPTIONS_MARKET",
            content: {
                marketId: "0x...",
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const getSubaccountTradeNonceExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get trade nonce for subaccount ID 'subaccount_id'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Subaccount trade nonce retrieved successfully.",
            action: "GET_SUBACCOUNT_TRADE_NONCE",
            content: {
                nonce: 5,
            },
        },
    },
];

export const getPositionsV2Example = [
    {
        user: "{{user1}}",
        content: {
            text: "Query positions V2 for account 'inj1...', market ID 'market_id', subaccount ID 'subaccount_id', direction 'long' with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Positions V2 retrieved successfully.",
            action: "GET_POSITIONS_V2",
            content: {
                positions: [
                    {
                        marketId: "market_id",
                        subaccountId: "subaccount_id",
                        direction: "long",
                        quantity: "1.5",
                        entryPrice: "25000.5",
                        margin: "1000",
                        liquidationPrice: "24000.0",
                        markPrice: "25100.0",
                        ticker: "BTC/USDT",
                        aggregateReduceOnlyQuantity: "0",
                        updatedAt: 1641859200,
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getHistoricalBalanceExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get historical balance for account 'inj1...' with daily resolution.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Historical balance data retrieved successfully.",
            action: "GET_HISTORICAL_BALANCE",
            content: {
                t: [1641859200, 1641945600],
                v: [1000.5, 1100.75],
            },
        },
    },
];

export const getHistoricalRpnlExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get historical RPNL for account 'inj1...' with daily resolution.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Historical RPNL data retrieved successfully.",
            action: "GET_HISTORICAL_RPNL",
            content: {
                t: [1641859200, 1641945600],
                v: [1000.5, 1100.75],
            },
        },
    },
];

export const getHistoricalVolumesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get historical volumes for account 'inj1...' with daily resolution.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Historical volumes data retrieved successfully.",
            action: "GET_HISTORICAL_VOLUMES",
            content: {
                t: [1641859200, 1641945600],
                v: [50000.5, 75000.25],
            },
        },
    },
];

export const getDenomHoldersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get holders of denom 'inj' with token address '0x...' and limit 100.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Denom holders retrieved successfully.",
            action: "GET_DENOM_HOLDERS",
            content: {
                holders: [
                    {
                        accountAddress: "inj1...",
                        balance: "1000000",
                    },
                ],
                next: ["next_key"],
            },
        },
    },
];

export const getGridStrategiesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve grid strategies with limit 100, state 'active', market ID 'market_id', market type 'uniform', subaccount ID 'subaccount_id', and account address 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Grid strategies retrieved successfully.",
            action: "GET_GRID_STRATEGIES",
            content: {
                strategies: [
                    {
                        id: "strategy_id",
                        accountAddress: "inj1...",
                        subaccountId: "subaccount_id",
                        marketId: "market_id",
                        strategyType: "uniform",
                        tickSize: "0.1",
                        minPrice: "24000.0",
                        maxPrice: "26000.0",
                        gridCount: 20,
                        state: "active",
                        totalVolume: "100000.5",
                        currentPnL: "1000.25",
                        createdAt: 1641859200,
                        updatedAt: 1641945600,
                    },
                ],
            },
        },
    },
];

export const msgInstantSpotMarketLaunchExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Instantly launch a spot market with ticker 'INJ/USDT', base denom 'inj', quote denom 'usdt', min price tick size '0.000001', and min quantity tick size '0.000001'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Instant spot market launched successfully.",
            action: "MSG_INSTANT_SPOT_MARKET_LAUNCH",
            content: {
                marketId: "0x...",
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const getFundingPaymentsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch funding payments for market ID '0x...' and subaccount ID '0x...' with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Funding payments retrieved successfully.",
            action: "GET_FUNDING_PAYMENTS",
            content: {
                fundingPayments: [
                    {
                        marketId: "0x...",
                        subaccountId: "0x...",
                        amount: "100.5",
                        timestamp: 1641859200,
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getPnlLeaderboardExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get PnL leaderboard for the period from '2024-01-01' to '2024-01-31' with limit 100 and account filter 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "PnL leaderboard retrieved successfully.",
            action: "GET_PNL_LEADERBOARD",
            content: {
                firstDate: "2024-01-01",
                lastDate: "2024-01-31",
                leaders: [
                    {
                        account: "inj1...",
                        pnl: 100000.5,
                        volume: 1000000.0,
                        rank: 1,
                    },
                ],
                accountRow: {
                    account: "inj1...",
                    pnl: 50000.25,
                    volume: 500000.0,
                    rank: 10,
                },
            },
        },
    },
];

export const getVolLeaderboardExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get volume leaderboard for the period from '2024-01-01' to '2024-01-31' with limit 100 and account filter 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Volume leaderboard retrieved successfully.",
            action: "GET_VOL_LEADERBOARD",
            content: {
                firstDate: "2024-01-01",
                lastDate: "2024-01-31",
                leaders: [
                    {
                        account: "inj1...",
                        volume: 1000000.0,
                        rank: 1,
                    },
                ],
                accountRow: {
                    account: "inj1...",
                    volume: 500000.0,
                    rank: 10,
                },
            },
        },
    },
];

export const getPnlLeaderboardFixedResolutionExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get PnL leaderboard with daily resolution, limit 100, and account filter 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "PnL leaderboard with fixed resolution retrieved successfully.",
            action: "GET_PNL_LEADERBOARD_FIXED_RESOLUTION",
            content: {
                firstDate: "2024-01-01",
                lastDate: "2024-01-31",
                leaders: [
                    {
                        account: "inj1...",
                        pnl: 100000.5,
                        volume: 1000000.0,
                        rank: 1,
                    },
                ],
                accountRow: {
                    account: "inj1...",
                    pnl: 50000.25,
                    volume: 500000.0,
                    rank: 10,
                },
            },
        },
    },
];

export const getVolLeaderboardFixedResolutionExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get volume leaderboard with daily resolution, limit 100, and account filter 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Volume leaderboard with fixed resolution retrieved successfully.",
            action: "GET_VOL_LEADERBOARD_FIXED_RESOLUTION",
            content: {
                firstDate: "2024-01-01",
                lastDate: "2024-01-31",
                leaders: [
                    {
                        account: "inj1...",
                        volume: 1000000.0,
                        rank: 1,
                    },
                ],
                accountRow: {
                    account: "inj1...",
                    volume: 500000.0,
                    rank: 10,
                },
            },
        },
    },
];

export const getAtomicSwapHistoryExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get atomic swap history for address 'inj1...', contract address '0x...', with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Atomic swap history retrieved successfully.",
            action: "GET_ATOMIC_SWAP_HISTORY",
            content: {
                swapHistory: [
                    {
                        sender: "inj1...",
                        route: "route_id",
                        sourceCoin: {
                            amount: "1000000",
                            denom: "inj",
                        },
                        destinationCoin: {
                            amount: "900000",
                            denom: "usdt",
                        },
                        fees: [
                            {
                                amount: "1000",
                                denom: "inj",
                            },
                        ],
                        contractAddress: "0x...",
                        indexBySender: 1,
                        indexBySenderContract: 1,
                        txHash: "0x...",
                        executedAt: 1641859200,
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getIsOptedOutOfRewardsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Check if account 'inj1...' has opted out of rewards.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Opt-out status retrieved successfully.",
            action: "GET_IS_OPTED_OUT_OF_REWARDS",
            content: {
                isOptedOut: true,
            },
        },
    },
];

export const getBinaryOptionsMarketsV2Example = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all binary options markets with quote denom 'usdt' and market status 'active' and 'paused'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Binary options markets retrieved successfully.",
            action: "GET_BINARY_OPTIONS_MARKETS_V2",
            content: {
                markets: [
                    {
                        marketId: "0x...",
                        marketStatus: "active",
                        ticker: "BTC>25000-240630",
                        oracleSymbol: "BTC",
                        oracleProvider: "band",
                        oracleScaleFactor: 6,
                        quoteDenom: "usdt",
                        makerFeeRate: "0.001",
                        takerFeeRate: "0.002",
                        expirationTimestamp: 1719705600,
                        settlementTimestamp: 1719792000,
                        serviceProviderFee: "0.4",
                        minPriceTickSize: 0.01,
                        minQuantityTickSize: 0.001,
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getTradingRewardsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve trading rewards for account 'inj1...' and epoch 1.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Trading rewards retrieved successfully.",
            action: "GET_TRADING_REWARDS",
            content: {
                rewards: [
                    {
                        accountAddress: "inj1...",
                        rewards: [
                            {
                                amount: "1000000",
                                denom: "inj",
                            },
                        ],
                        distributedAt: 1641859200,
                    },
                ],
            },
        },
    },
];

export const getSubaccountOrderSummaryExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get order summary for subaccount ID '0x...', market ID '0x...', and order direction 'buy'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Order summary retrieved successfully.",
            action: "GET_SUBACCOUNT_ORDER_SUMMARY",
            content: {
                spotOrdersTotal: "10",
                derivativeOrdersTotal: "5",
                spotOrdersActiveTotal: "3",
                derivativeOrdersActiveTotal: "2",
                spotOrdersCancelledTotal: "5",
                derivativeOrdersCancelledTotal: "2",
                spotOrdersFilledTotal: "2",
                derivativeOrdersFilledTotal: "1",
            },
        },
    },
];

export const getDerivativeMarketsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all derivative markets",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Derivative markets retrieved successfully.",
            action: "GET_DERIVATIVE_MARKETS",
            content: {
                markets: [
                    {
                        marketId: "0x...",
                        marketStatus: "active",
                        ticker: "BTC/USDT PERP",
                        oracleBase: "BTC",
                        oracleQuote: "USDT",
                        quoteDenom: "usdt",
                        makerFeeRate: "0.001",
                        takerFeeRate: "0.002",
                        serviceProviderFee: "0.4",
                        isPerpetual: true,
                        minPriceTickSize: 0.01,
                        minQuantityTickSize: 0.001,
                    },
                ],
            },
        },
    },
];

export const getSpotMarketsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all spot markets with base denom 'inj', quote denom 'usdt', market status 'active' and 'paused'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot markets retrieved successfully.",
            action: "GET_SPOT_MARKETS",
            content: {
                markets: [
                    {
                        marketId: "0x...",
                        marketStatus: "active",
                        ticker: "INJ/USDT",
                        baseDenom: "inj",
                        quoteDenom: "usdt",
                        makerFeeRate: "0.001",
                        takerFeeRate: "0.002",
                        serviceProviderFee: "0.4",
                        minPriceTickSize: 0.000001,
                        minQuantityTickSize: 0.000001,
                    },
                ],
            },
        },
    },
];

export const getSubaccountsListExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get list of subaccounts for address 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Subaccounts list retrieved successfully.",
            action: "GET_SUBACCOUNTS_LIST",
            content: {
                subaccounts: ["0x..."],
            },
        },
    },
];

export const getSubaccountBalancesListExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get balances for subaccount ID '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Subaccount balances retrieved successfully.",
            action: "GET_SUBACCOUNT_BALANCES_LIST",
            content: {
                balances: [
                    {
                        subaccountId: "0x...",
                        accountAddress: "inj1...",
                        denom: "inj",
                        deposit: {
                            totalBalance: "1000000",
                            availableBalance: "900000",
                        },
                    },
                ],
            },
        },
    },
];

export const getDerivativeOrderbooksV2Example = [
    {
        user: "{{user1}}",
        content: {
            text: "Get derivative orderbooks for market IDs ['0x...'].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Derivative orderbooks retrieved successfully.",
            action: "GET_DERIVATIVE_ORDERBOOKS_V2",
            content: {
                orderbooks: [
                    {
                        marketId: "0x12...",
                        orderbook: {
                            sequence: "123",
                            buys: [
                                {
                                    price: "25000.5",
                                    quantity: "1.5",
                                    timestamp: 1641859200,
                                },
                            ],
                            sells: [
                                {
                                    price: "25100.5",
                                    quantity: "0.5",
                                    timestamp: 1641859200,
                                },
                            ],
                        },
                    },
                    {
                        marketId: "0x212...",
                        orderbook: {
                            sequence: "123",
                            buys: [
                                {
                                    price: "2500.5",
                                    quantity: "1",
                                    timestamp: 1641859201,
                                },
                            ],
                            sells: [
                                {
                                    price: "2510.5",
                                    quantity: "0.5",
                                    timestamp: 1641859203,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    },
];

export const getDerivativeOrderbookV2Example = [
    {
        user: "{{user1}}",
        content: {
            text: "Get derivative orderbook for market ID '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Derivative orderbooks retrieved successfully.",
            action: "GET_DERIVATIVE_ORDERBOOK_V2",
            content: {
                orderbook: [
                    {
                        marketId: "0x...",
                        orderbook: {
                            sequence: "123",
                            buys: [
                                {
                                    price: "25000.5",
                                    quantity: "1.5",
                                    timestamp: 1641859200,
                                },
                            ],
                            sells: [
                                {
                                    price: "25100.5",
                                    quantity: "0.5",
                                    timestamp: 1641859200,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    },
];

export const getSpotOrderbooksV2Example = [
    {
        user: "{{user1}}",
        content: {
            text: "Get orderbooks for market IDs ['0x...'].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot orderbooks retrieved successfully.",
            action: "GET_SPOT_ORDERBOOKS_V2",
            content: {
                orderbooks: [
                    {
                        marketId: "0x...",
                        orderbook: {
                            sequence: "123",
                            buys: [
                                {
                                    price: "25000.5",
                                    quantity: "1.5",
                                    timestamp: 1641859200,
                                },
                            ],
                            sells: [
                                {
                                    price: "25100.5",
                                    quantity: "0.5",
                                    timestamp: 1641859200,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    },
];

export const getSpotOrderbookV2Example = [
    {
        user: "{{user1}}",
        content: {
            text: "Get spot orderbook for market ID '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot orderbook retrieved successfully.",
            action: "GET_SPOT_ORDERBOOK_V2",
            content: {
                orderbook: [
                    {
                        marketId: "0x...",
                        orderbook: {
                            sequence: "123",
                            buys: [
                                {
                                    price: "25000.5",
                                    quantity: "1.5",
                                    timestamp: 1641859200,
                                },
                            ],
                            sells: [
                                {
                                    price: "25100.5",
                                    quantity: "0.5",
                                    timestamp: 1641859200,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    },
];

export const msgBatchCancelBinaryOptionsOrdersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Batch cancel binary options orders for injective address 'inj1...' with orders [{'marketId': '0x...', 'subaccountId': '0x...', 'orderHash': '0x...'}].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Batch binary options orders canceled successfully.",
            action: "MSG_BATCH_CANCEL_BINARY_OPTIONS_ORDERS",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgCancelBinaryOptionsOrderExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Cancel binary options order with order hash '0x...' for injective address 'inj1...', market ID '0x...', and subaccount ID '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Binary options order canceled successfully.",
            action: "MSG_CANCEL_BINARY_OPTIONS_ORDER",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgCreateBinaryOptionsLimitOrderExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a binary options limit order to BUY 1.5 BTC>25000-240630 at price 25000.5 for subaccount '0x...' with fee recipient 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Binary options limit order created successfully.",
            action: "MSG_CREATE_BINARY_OPTIONS_LIMIT_ORDER",
            content: {
                orderHash: "0x...",
                txHash: "0x...",
            },
        },
    },
];

export const msgLiquidatePositionExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Liquidate position for subaccount '0x...' in market '0x...' with order { marketId: '0x...', orderType: 'SELL', price: '24000.0', quantity: '1.5', margin: '1000' }.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Position liquidated successfully.",
            action: "MSG_LIQUIDATE_POSITION",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgReclaimLockedFundsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Reclaim locked funds for injective address 'inj1...' with locked account public key '0x...' and signature '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Locked funds reclaimed successfully.",
            action: "MSG_RECLAIM_LOCKED_FUNDS",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgSignDataExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Sign data '0x...' for injective address 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Data signed successfully.",
            action: "MSG_SIGN_DATA",
            content: {
                signature: "0x...",
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgCreateSpotLimitOrderExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a spot limit order to BUY 1.5 INJ at price 25000.5 for subaccount '0x...' with fee recipient 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot limit order created successfully.",
            action: "MSG_CREATE_SPOT_LIMIT_ORDER",
            content: {
                orderHash: "0x...",
                txHash: "0x...",
            },
        },
    },
];

export const msgCreateDerivativeLimitOrderExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a derivative limit order to BUY 1.5 BTC/USDT PERP at price 25000.5 with margin 1000 for subaccount '0x...' and fee recipient 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Derivative limit order created successfully.",
            action: "MSG_CREATE_DERIVATIVE_LIMIT_ORDER",
            content: {
                orderHash: "0x...",
                txHash: "0x...",
            },
        },
    },
];

export const msgBatchCancelSpotOrdersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Batch cancel spot orders for injective address 'inj1...' with orders [{'marketId': '0x...', 'subaccountId': '0x...', 'orderHash': '0x...'}].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Batch spot orders canceled successfully.",
            action: "MSG_BATCH_CANCEL_SPOT_ORDERS",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgBatchCancelDerivativeOrdersExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Batch cancel derivative orders for injective address 'inj1...' with orders [{'marketId': '0x...', 'subaccountId': '0x...', 'orderHash': '0x...'}].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Batch derivative orders canceled successfully.",
            action: "MSG_BATCH_CANCEL_DERIVATIVE_ORDERS",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgCancelSpotOrderExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Cancel spot order with order hash '0x...' for injective address 'inj1...', market ID '0x...', and subaccount ID '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot order canceled successfully.",
            action: "MSG_CANCEL_SPOT_ORDER",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const msgCancelDerivativeOrderExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Cancel derivative order with order hash '0x...' for injective address 'inj1...', market ID '0x...', and subaccount ID '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Derivative order canceled successfully.",
            action: "MSG_CANCEL_DERIVATIVE_ORDER",
            content: {
                success: true,
                txHash: "0x...",
            },
        },
    },
];

export const getSpotSubaccountOrdersListExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get spot orders list for subaccount ID '0x...', market ID '0x...', with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot subaccount orders list retrieved successfully.",
            action: "GET_SPOT_SUBACCOUNT_ORDERS_LIST",
            content: {
                orders: [
                    {
                        orderHash: "0x...",
                        orderSide: "buy",
                        marketId: "0x...",
                        subaccountId: "0x...",
                        price: "25000.5",
                        quantity: "1.5",
                        unfilledQuantity: "0.5",
                        triggerPrice: "0",
                        feeRecipient: "inj1...",
                        state: "booked",
                        createdAt: 1641859200,
                        updatedAt: 1641859200,
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getSpotSubaccountTradesListExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get spot trades list for subaccount ID '0x...', market ID '0x...', direction 'buy', execution type 'market', with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot subaccount trades list retrieved successfully.",
            action: "GET_SPOT_SUBACCOUNT_TRADES_LIST",
            content: {
                trades: [
                    {
                        orderHash: "0x...",
                        subaccountId: "0x...",
                        marketId: "0x...",
                        tradeId: "trade_id",
                        executedAt: 1641859200,
                        executionSide: "taker",
                        tradeExecutionType: "market",
                        tradeDirection: "buy",
                        price: "25000.5",
                        quantity: "1.5",
                        fee: "25.0",
                        feeRecipient: "inj1...",
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const msgCreateBinaryOptionsMarketOrderExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Create a binary options market order to BUY 1.5 BTC>25000-240630 at price 25000.5 for subaccount '0x...' with fee recipient 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Binary options market order created successfully.",
            action: "MSG_CREATE_BINARY_OPTIONS_MARKET_ORDER",
            content: {
                orderHash: "0x...",
                txHash: "0x...",
            },
        },
    },
];

export const getSpotOrderHistoryExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get spot order history for subaccount ID '0x...', market ID '0x...', market IDs ['0x...'], order types ['limit', 'market'], execution types ['limit', 'market'], direction 'buy', is conditional false, state 'booked', with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot order history retrieved successfully.",
            action: "GET_SPOT_ORDER_HISTORY",
            content: {
                orderHistory: [
                    {
                        orderHash: "0x...",
                        marketId: "0x...",
                        active: true,
                        subaccountId: "0x...",
                        executionType: "limit",
                        orderType: "buy",
                        price: "25000.5",
                        triggerPrice: "0",
                        quantity: "1.5",
                        filledQuantity: "0.5",
                        state: "booked",
                        createdAt: 1641859200,
                        updatedAt: 1641859200,
                        direction: "buy",
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getSpotTradesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get spot trades for market IDs ['0x...'], subaccount ID '0x...', execution side 'taker', direction 'buy', execution types ['market', 'limit'], with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Spot trades retrieved successfully.",
            action: "GET_SPOT_TRADES",
            content: {
                trades: [
                    {
                        orderHash: "0x...",
                        subaccountId: "0x...",
                        marketId: "0x...",
                        tradeId: "trade_id",
                        executedAt: 1641859200,
                        executionSide: "taker",
                        tradeExecutionType: "market",
                        tradeDirection: "buy",
                        price: "25000.5",
                        quantity: "1.5",
                        fee: "25.0",
                        feeRecipient: "inj1...",
                    },
                ],
                pagination: {
                    total: 100,
                },
            },
        },
    },
];

export const getAccountPortfolioBalancesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Get account portfolio balances for address 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Account portfolio balances retrieved successfully.",
            action: "GET_ACCOUNT_PORTFOLIO_BALANCES",
            content: {
                balances: [
                    {
                        denom: "inj",
                        totalBalance: "1000000",
                        availableBalance: "900000",
                        lockedBalance: "100000",
                    },
                ],
                subaccountBalances: [
                    {
                        subaccountId: "0x...",
                        denom: "inj",
                        deposit: {
                            totalBalance: "1000000",
                            availableBalance: "900000",
                        },
                    },
                ],
            },
        },
    },
];

export const getRewardsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve rewards for account 'inj1...' and epoch 1.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Rewards retrieved successfully.",
            action: "GET_REWARDS",
            content: {
                rewards: [
                    {
                        accountAddress: "inj1...",
                        rewards: [
                            {
                                amount: "1000000",
                                denom: "inj",
                            },
                        ],
                        distributedAt: 1641859200,
                    },
                ],
            },
        },
    },
];

export const getDerivativeOrderHistoryExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve derivative order history for subaccount ID '0x...', market ID '0x...', multiple market IDs ['0x...', '0x...'], order types ['limit', 'market'], execution types ['limit', 'market'], direction 'buy', non-conditional, state 'booked', with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Derivative order history retrieved successfully.",
            action: "GET_DERIVATIVE_ORDER_HISTORY",
            content: {
                orderHistory: [
                    {
                        orderHash: "0xabc123...",
                        marketId: "0xmarket1...",
                        isActive: true,
                        subaccountId: "0xsubaccount1...",
                        executionType: "limit",
                        orderType: "buy",
                        price: "25000.5",
                        triggerPrice: "0",
                        quantity: "1.5",
                        filledQuantity: "0.5",
                        state: "booked",
                        createdAt: 1641859200,
                        updatedAt: 1641859200,
                        direction: "buy",
                        isConditional: false,
                        triggerAt: 0,
                        margin: "1000",
                    },
                    // ...additional order history entries
                ],
                pagination: {
                    total: 50,
                },
            },
        },
    },
];

export const getDerivativeTradesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch derivative trades for market ID '0x...', multiple market IDs ['0x...', '0x...'], subaccount ID '0x...', execution side 'taker', direction 'buy', execution types ['market', 'limit'], with pagination from 1 to 100 and limit 10.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Derivative trades retrieved successfully.",
            action: "GET_DERIVATIVE_TRADES",
            content: {
                trades: [
                    {
                        orderHash: "0xabc123...",
                        subaccountId: "0xsubaccount1...",
                        marketId: "0xmarket1...",
                        tradeId: "trade_001",
                        executedAt: 1641859200,
                        tradeExecutionType: "market",
                        executionSide: "taker",
                        tradeDirection: "buy",
                        executionPrice: "25000.5",
                        executionQuantity: "1.5",
                        executionMargin: "1000",
                        fee: "25.0",
                        feeRecipient: "inj1...",
                        isLiquidation: false,
                        payout: "37525.75",
                    },
                ],
                pagination: {
                    total: 30,
                },
            },
        },
    },
];

export const getOrderStatesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve order states for subaccount ID '0x...', market ID '0x...', with order hashes ['0xorder1...', '0xorder2...'].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Order states retrieved successfully.",
            action: "GET_ORDER_STATES",
            content: {
                orders: [
                    {
                        orderHash: "0xorder1...",
                        state: "filled",
                        filledQuantity: "1.0",
                        remainingQuantity: "0.0",
                        filledAt: 1641859200,
                    },
                    {
                        orderHash: "0xorder2...",
                        state: "cancelled",
                        filledQuantity: "0.0",
                        remainingQuantity: "2.0",
                        filledAt: 0,
                    },
                ],
            },
        },
    },
];

export const msgIncreasePositionMarginExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Increase position margin by 1,000 INJ for subaccount '0x...', market ID '0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Position margin increased successfully.",
            action: "MSG_INCREASE_POSITION_MARGIN",
            content: {
                success: true,
                txHash: "0xdef456...",
            },
        },
    },
];

export const msgRewardsOptOutExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Opt out of trading rewards for account 'inj1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Successfully opted out of rewards.",
            action: "MSG_REWARDS_OPT_OUT",
            content: {
                success: true,
                txHash: "0xghi789...",
            },
        },
    },
];

export const msgExternalTransferExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Transfer 1,000,000 INJ from subaccount '0xsource...' to subaccount '0xdestination...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "External transfer completed successfully.",
            action: "MSG_EXTERNAL_TRANSFER",
            content: {
                success: true,
                txHash: "0xjkl012...",
            },
        },
    },
];
