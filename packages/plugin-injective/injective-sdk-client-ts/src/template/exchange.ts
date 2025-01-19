export const getAccountPortfolioTemplate = `
Extract the following details for account portfolio:
- **address** (string): Account address

Provide the request in the following JSON format:

\`\`\`json
{
    "address": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "accountAddress": "inj1...",
    "bankBalancesList": [
        {
            "amount": "1000000",
            "denom": "inj"
        }
    ],
    "subaccountsList": [
        {
            "subaccountId": "subaccount_id",
            "denom": "inj",
            "deposit": {
                "totalBalance": "1000000",
                "availableBalance": "900000"
            }
        }
    ],
    "positionsWithUpnlList": [
        {
            "position": {
                "marketId": "market_id",
                "subaccountId": "subaccount_id",
                "direction": "long",
                "quantity": "1.5",
                "entryPrice": "25000.5",
                "margin": "1000",
                "liquidationPrice": "24000.0",
                "markPrice": "25100.0",
                "ticker": "BTC/USDT"
            },
            "unrealizedPnl": "150.75"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getSubaccountHistoryTemplate = `
Extract the following details for subaccount history:
- **subaccountId** (string): Subaccount ID
- **denom** (string, optional): Token denomination
- **transferTypes** (string[], optional): Types of transfers to include
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "subaccountId": "subaccount_id",
    "denom": "inj",
    "transferTypes": ["deposit", "withdraw"],
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "transfers": [
        {
            "transferType": "deposit",
            "srcSubaccountId": "src_subaccount_id",
            "srcSubaccountAddress": "inj1...",
            "dstSubaccountId": "dst_subaccount_id",
            "dstSubaccountAddress": "inj1...",
            "amount": {
                "amount": "1000000",
                "denom": "inj"
            },
            "executedAt": 1641859200
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

export const getSpotMarketTemplate = `
Extract the following details for spot market lookup:
- **marketId** (string): Market ID

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "market_id"
}
\`\`\`

Response format:

\`\`\`json
{
    "marketId": "market_id",
    "marketStatus": "active",
    "ticker": "INJ/USDT",
    "baseDenom": "inj",
    "quoteDenom": "usdt",
    "makerFeeRate": "0.001",
    "takerFeeRate": "0.002",
    "serviceProviderFee": "0.4",
    "minPriceTickSize": 0.000001,
    "minQuantityTickSize": 0.000001
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDerivativeMarketTemplate = `
Extract the following details for derivative market lookup:
- **marketId** (string): Market ID

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "market_id"
}
\`\`\`

Response format:

\`\`\`json
{
    "marketId": "market_id",
    "marketStatus": "active",
    "ticker": "BTC/USDT PERP",
    "oracleBase": "BTC",
    "oracleQuote": "USDT",
    "quoteDenom": "usdt",
    "makerFeeRate": "0.001",
    "takerFeeRate": "0.002",
    "serviceProviderFee": "0.4",
    "initialMarginRatio": "0.05",
    "maintenanceMarginRatio": "0.02",
    "isPerpetual": true,
    "minPriceTickSize": 0.01,
    "minQuantityTickSize": 0.001
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getExchangePositionsTemplate = `
Extract the exchange module's open positions
Response format:

\`\`\`json
{
    "positions": [
        {
            "marketId": "market_id",
            "subaccountId": "subaccount_id",
            "direction": "long",
            "quantity": "1.5",
            "entryPrice": "25000.5",
            "margin": "1000",
            "liquidationPrice": "24000.0",
            "markPrice": "25100.0",
            "ticker": "BTC/USDT"
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

export const getExchangeInsuranceFundsTemplate = `
Extract insurance funds information.

Response format:

\`\`\`json
{
    "funds": [
        {
            "depositDenom": "inj",
            "insurancePoolTokenDenom": "insurance_pool_token",
            "redemptionNoticePeriodDuration": 1209600,
            "balance": "1000000",
            "totalShare": "1000000",
            "marketId": "market_id",
            "marketTicker": "BTC/USDT PERP",
            "oracleBase": "BTC",
            "oracleQuote": "USDT",
            "oracleType": "band",
            "expiry": 0
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getRedemptionsTemplate = `
Extract the following details for redemptions query:
- **address** (string): Account address
- **denom** (string, optional): Token denomination
- **status** (string, optional): Redemption status

Provide the request in the following JSON format:

\`\`\`json
{
    "address": "inj1...",
    "denom": "inj",
    "status": "pending"
}
\`\`\`

Response format:

\`\`\`json
{
    "redemptions": [
        {
            "redemptionId": 1,
            "status": "pending",
            "redeemer": "inj1...",
            "claimableRedemptionTime": 1641859200,
            "redemptionAmount": "1000000",
            "redemptionDenom": "inj",
            "requestedAt": 1641772800,
            "disbursedAmount": "0",
            "disbursedDenom": "",
            "disbursedAt": 0
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getSpotOrdersTemplate = `
Extract the following details for spot orders query:
- **marketId** (string, optional): Market ID filter
- **marketIds** (string[], optional): Multiple market IDs filter
- **subaccountId** (string, optional): Subaccount ID filter
- **orderSide** (string, optional): Order side (buy/sell)
- **isConditional** (boolean, optional): Whether order is conditional
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "market_id",
    "marketIds": ["market_id1", "market_id2"],
    "subaccountId": "subaccount_id",
    "orderSide": "buy",
    "isConditional": false,
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "orders": [
        {
            "orderHash": "0x...",
            "orderSide": "buy",
            "marketId": "market_id",
            "subaccountId": "subaccount_id",
            "price": "25000.5",
            "quantity": "1.5",
            "unfilledQuantity": "0.5",
            "triggerPrice": "0",
            "feeRecipient": "inj1...",
            "state": "booked",
            "createdAt": 1641859200,
            "updatedAt": 1641859200
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

export const getDerivativeOrdersTemplate = `
Extract the following details for derivative orders query:
- **marketId** (string, optional): Market ID filter
- **marketIds** (string[], optional): Multiple market IDs filter
- **subaccountId** (string, optional): Subaccount ID filter
- **orderSide** (string, optional): Order side (buy/sell)
- **isConditional** (boolean, optional): Whether order is conditional
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "market_id",
    "marketIds": ["market_id1", "market_id2"],
    "subaccountId": "subaccount_id",
    "orderSide": "buy",
    "isConditional": false,
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "orders": [
        {
            "orderHash": "0x...",
            "orderSide": "buy",
            "marketId": "market_id",
            "subaccountId": "subaccount_id",
            "margin": "1000",
            "price": "25000.5",
            "quantity": "1.5",
            "unfilledQuantity": "0.5",
            "triggerPrice": "0",
            "feeRecipient": "inj1...",
            "state": "booked",
            "createdAt": 1641859200,
            "updatedAt": 1641859200
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

export const getHistoricalTradesTemplate = `
Extract the following details for historical trades query:
- **marketId** (string, optional): Market ID filter
- **marketIds** (string[], optional): Multiple market IDs filter
- **subaccountId** (string, optional): Subaccount ID filter
- **endTime** (number, optional): End timestamp
- **startTime** (number, optional): Start timestamp
- **direction** (string, optional): Trade direction
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "market_id",
    "marketIds": ["market_id1", "market_id2"],
    "subaccountId": "subaccount_id",
    "endTime": 1641945600,
    "startTime": 1641859200,
    "direction": "buy",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "trades": [
        {
            "orderHash": "0x...",
            "subaccountId": "subaccount_id",
            "marketId": "market_id",
            "tradeId": "trade_id",
            "executedAt": 1641859200,
            "tradeExecutionType": "limit",
            "tradeDirection": "buy",
            "executionPrice": "25000.5",
            "executionQuantity": "1.5",
            "fee": "0.5",
            "feeRecipient": "inj1..."
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

export const getFundingRatesTemplate = `
Extract the following details for funding rates query:
- **marketId** (string, optional): Market ID filter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "market_id",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "fundingRates": [
        {
            "marketId": "market_id",
            "rate": "0.0001",
            "timestamp": 1641859200
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

// Account & Portfolio Related Templates
export const msgDepositTemplate = `
Extract the following details for deposit:
- **injectiveAddress** (string): Injective sender address
- **subaccountId** (string): Subaccount ID to deposit to
- **amount** (string): Amount to deposit

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "subaccountId": "0x...",
    "amount": "1000000"
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgWithdrawTemplate = `
Extract the following details for withdrawal:
- **injectiveAddress** (string): Injective sender address
- **subaccountId** (string): Subaccount ID to withdraw from
- **amount** (string): Amount to withdraw

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "subaccountId": "0x...",
    "amount": "1000000"
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Order Related Templates
export const msgCreateSpotMarketOrderTemplate = `
Extract the following details for creating spot market order:
- **marketId** (string): Market ID
- **subaccountId** (string): Subaccount ID
- **injectiveAddress** (string): Injective sender address
- **orderType** (string): Order type (BUY/SELL)
- **price** (string): Order price
- **quantity** (string): Order quantity

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "0x...",
    "subaccountId": "0x...",
    "injectiveAddress": "inj1...",
    "orderType": "BUY",
    "price": "25000.5",
    "quantity": "0.5"
}
\`\`\`

Response format:

\`\`\`json
{
    "orderHash": "0x...",
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCreateDerivativeMarketOrderTemplate = `
Extract the following details for creating derivative market order:
- **marketId** (string): Market ID
- **subaccountId** (string): Subaccount ID
- **injectiveAddress** (string): Injective sender address
- **orderType** (string): Order type (BUY/SELL)
- **price** (string): Order price
- **quantity** (string): Order quantity
- **margin** (string): Order margin
- **leverage** (string): Order leverage

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "0x...",
    "subaccountId": "0x...",
    "injectiveAddress": "inj1...",
    "orderType": "BUY",
    "price": "25000.5",
    "quantity": "0.5",
    "margin": "1000",
    "leverage": "10"
}
\`\`\`

Response format:

\`\`\`json
{
    "orderHash": "0x...",
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgBatchCancelOrdersTemplate = `
Extract the following details for batch canceling orders:
- **injectiveAddress** (string): Injective sender address
- **orders** (array): List of orders to cancel containing:
  - marketId (string)
  - subaccountId (string)
  - orderHash (string)
  - orderMask (number)

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "orders": [
        {
            "marketId": "0x...",
            "subaccountId": "0x...",
            "orderHash": "0x...",
            "orderMask": 1
        }
    ]
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgBatchUpdateOrdersTemplate = `
Extract the following details for batch updating orders:
- **injectiveAddress** (string): Injective sender address
- **spotOrders** (array, optional): List of spot orders to update
- **derivativeOrders** (array, optional): List of derivative orders to update
Each order contains:
  - marketId (string)
  - subaccountId (string)
  - orderHash (string, optional)
  - orderType (string)
  - price (string)
  - quantity (string)

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "spotOrders": [
        {
            "marketId": "0x...",
            "subaccountId": "0x...",
            "orderHash": "0x...",
            "orderType": "BUY",
            "price": "25000.5",
            "quantity": "0.5"
        }
    ],
    "derivativeOrders": [
        {
            "marketId": "0x...",
            "subaccountId": "0x...",
            "orderHash": "0x...",
            "orderType": "SELL",
            "price": "25100.5",
            "quantity": "1.0"
        }
    ]
}
\`\`\`

Response format:

\`\`\`json
{
    "spotOrderHashes": ["0x..."],
    "derivativeOrderHashes": ["0x..."],
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgExternalTransferTemplate = `
Extract the following details for external transfer:
- **injectiveAddress** (string): Injective sender address
- **sourceSubaccountId** (string): Source subaccount ID
- **destinationSubaccountId** (string): Destination subaccount ID
- **amount** (string): Amount to transfer

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "sourceSubaccountId": "0x...",
    "destinationSubaccountId": "0x...",
    "amount": "1000000"
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgIncreasePositionMarginTemplate = `
Extract the following details for increasing position margin:
- **injectiveAddress** (string): Injective sender address
- **marketId** (string): Market ID
- **sourceSubaccountId** (string): Source subaccount ID
- **destinationSubaccountId** (string): Destination subaccount ID
- **amount** (string): Margin amount to add

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "marketId": "0x...",
    "sourceSubaccountId": "0x...",
    "destinationSubaccountId": "0x...",
    "amount": "1000000"
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgRewardsOptOutTemplate = `
Extract the following details for opting out of rewards:
- **injectiveAddress** (string): Injective sender address

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Admin Related Templates
export const msgAdminUpdateBinaryOptionsMarketTemplate = `
Extract the following details for admin updating binary options market:
- **injectiveAddress** (string): Admin injective address
- **marketId** (string): Market ID
- **settlementPrice** (string): Settlement price
- **expiryTime** (number): Expiry timestamp
- **settlementTime** (number): Settlement timestamp

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "marketId": "0x...",
    "settlementPrice": "25000.5",
    "expiryTime": 1641859200,
    "settlementTime": 1641945600
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Module State & Parameters
export const getModuleStateTemplate = `
Extract module state information.

Response format:

\`\`\`json
{
    "moduleState": {
        "params": {
            "spotMarketInstantListingFee": {
                "amount": "100000000",
                "denom": "inj"
            },
            "derivativeMarketInstantListingFee": {
                "amount": "1000000000",
                "denom": "inj"
            },
            "defaultSpotMakerFeeRate": "0.001",
            "defaultSpotTakerFeeRate": "0.002",
            "defaultDerivativeMakerFeeRate": "0.001",
            "defaultDerivativeTakerFeeRate": "0.002",
            "defaultInitialMarginRatio": "0.05",
            "defaultMaintenanceMarginRatio": "0.02",
            "defaultFundingInterval": 3600,
            "fundingMultiple": 3600
        },
        "spotMarkets": [],
        "derivativeMarkets": [],
        "spotOrderbooks": [],
        "derivativeOrderbooks": [],
        "balances": [],
        "positions": []
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getFeeDiscountScheduleTemplate = `
Extract fee discount schedule information.

Response format:

\`\`\`json
{
    "bucketCount": 10,
    "bucketDuration": 1209600,
    "quoteDenomsList": ["inj"],
    "tierInfosList": [
        {
            "makerDiscountRate": "0.001",
            "takerDiscountRate": "0.001",
            "stakedAmount": "10000000000",
            "volume": "100000000"
        }
    ],
    "disqualifiedMarketIdsList": []
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getFeeDiscountAccountInfoTemplate = `
Extract the following details for fee discount account info:
- **injAddress** (string): Injective address

Provide the request in the following JSON format:

\`\`\`json
{
    "injAddress": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "tierLevel": 1,
    "accountInfo": {
        "makerDiscountRate": "0.001",
        "takerDiscountRate": "0.001",
        "stakedAmount": "10000000000",
        "volume": "100000000"
    },
    "accountTtl": {
        "tier": 1,
        "ttlTimestamp": 1641945600
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Trading Rewards
export const getTradingRewardsCampaignTemplate = `
Extract trading rewards campaign information.

Response format:

\`\`\`json
{
    "tradingRewardCampaignInfo": {
        "campaignDurationSeconds": 604800,
        "quoteDenomsList": ["inj"],
        "tradingRewardBoostInfo": {
            "boostedSpotMarketIdsList": [],
            "spotMarketMultipliersList": [],
            "boostedDerivativeMarketIdsList": [],
            "derivativeMarketMultipliersList": []
        },
        "disqualifiedMarketIdsList": []
    },
    "tradingRewardPoolCampaignScheduleList": [
        {
            "startTimestamp": 1641859200,
            "maxCampaignRewardsList": [
                {
                    "amount": "1000000000",
                    "denom": "inj"
                }
            ]
        }
    ],
    "totalTradeRewardPoints": "1000000",
    "pendingTradingRewardPoolCampaignScheduleList": [],
    "pendingTotalTradeRewardPointsList": []
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getTradeRewardPointsTemplate = `
Extract the following details for trade reward points:
- **injectiveAddresses** (string[]): List of Injective addresses

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddresses": ["inj1...", "inj2..."]
}
\`\`\`

Response format:

\`\`\`json
{
    "rewardPoints": ["100", "200"]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getPendingTradeRewardPointsTemplate = `
Extract the following details for pending trade reward points:
- **injectiveAddresses** (string[]): List of Injective addresses

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddresses": ["inj1...", "inj2..."]
}
\`\`\`

Response format:

\`\`\`json
{
    "rewardPoints": ["100", "200"]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Binary Options Markets
export const msgCreateBinaryOptionsMarketTemplate = `
Extract the following details for creating binary options market:
- **oracle** (string): Oracle provider
- **symbol** (string): Trading symbol
- **expiryTime** (number): Market expiry timestamp
- **settlementTime** (number): Settlement timestamp
- **admin** (string): Admin address
- **quoteDenom** (string): Quote denomination
- **minPriceTickSize** (string): Minimum price tick size
- **minQuantityTickSize** (string): Minimum quantity tick size

Provide the request in the following JSON format:

\`\`\`json
{
    "oracle": "band",
    "symbol": "BTC/USD",
    "expiryTime": 1641945600,
    "settlementTime": 1641945600,
    "admin": "inj1...",
    "quoteDenom": "inj",
    "minPriceTickSize": "0.000001",
    "minQuantityTickSize": "0.000001"
}
\`\`\`

Response format:

\`\`\`json
{
    "marketId": "0x...",
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Subaccount Trade Nonce
export const getSubaccountTradeNonceTemplate = `
Extract the following details for subaccount trade nonce:
- **subaccountId** (string): Subaccount ID

Provide the request in the following JSON format:

\`\`\`json
{
    "subaccountId": "subaccount_id"
}
\`\`\`

Response format:

\`\`\`json
{
    "nonce": 5
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Position History
export const getPositionsV2Template = `
Extract the following details for positions V2 query:
- **address** (string, optional): Account address
- **marketId** (string, optional): Market ID
- **marketIds** (string[], optional): Multiple market IDs
- **subaccountId** (string, optional): Subaccount ID
- **direction** (string, optional): Position direction
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "address": "inj1...",
    "marketId": "market_id",
    "marketIds": ["market_id1", "market_id2"],
    "subaccountId": "subaccount_id",
    "direction": "long",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "positions": [
        {
            "marketId": "market_id",
            "subaccountId": "subaccount_id",
            "direction": "long",
            "quantity": "1.5",
            "entryPrice": "25000.5",
            "margin": "1000",
            "liquidationPrice": "24000.0",
            "markPrice": "25100.0",
            "ticker": "BTC/USDT",
            "aggregateReduceOnlyQuantity": "0",
            "updatedAt": 1641859200
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

// Historical Data
export const getHistoricalBalanceTemplate = `
Extract the following details for historical balance:
- **account** (string): Account address
- **resolution** (string): Time resolution for data points

Provide the request in the following JSON format:

\`\`\`json
{
    "account": "inj1...",
    "resolution": "1d"
}
\`\`\`

Response format:

\`\`\`json
{
    "t": [1641859200, 1641945600],
    "v": [1000.5, 1100.75]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Denom Holders
export const getDenomHoldersTemplate = `
Extract the following details for denom holders:
- **denom** (string): Token denomination
- **token** (string, optional): Token address
- **limit** (number, optional): Number of results

Provide the request in the following JSON format:

\`\`\`json
{
    "denom": "inj",
    "token": "0x...",
    "limit": 100
}
\`\`\`

Response format:

\`\`\`json
{
    "holders": [
        {
            "accountAddress": "inj1...",
            "balance": "1000000"
        }
    ],
    "next": ["next_key"]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Grid Strategies
export const getGridStrategiesTemplate = `
Extract the following details for grid strategies:
- **skip** (number, optional): Number of items to skip
- **limit** (number, optional): Number of items to return
- **state** (string, optional): Strategy state
- **marketId** (string, optional): Market ID
- **marketType** (string, optional): Market type
- **strategyType** (string[], optional): Strategy types
- **subaccountId** (string, optional): Subaccount ID
- **accountAddress** (string, optional): Account address

Provide the request in the following JSON format:

\`\`\`json
{
    "skip": 0,
    "limit": 100,
    "state": "active",
    "marketId": "market_id",
    "marketType": "spot",
    "strategyType": ["uniform"],
    "subaccountId": "subaccount_id",
    "accountAddress": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "strategies": [
        {
            "id": "strategy_id",
            "accountAddress": "inj1...",
            "subaccountId": "subaccount_id",
            "marketId": "market_id",
            "strategyType": "uniform",
            "tickSize": "0.1",
            "minPrice": "24000.0",
            "maxPrice": "26000.0",
            "gridCount": 20,
            "state": "active",
            "totalVolume": "100000.5",
            "currentPnL": "1000.25",
            "createdAt": 1641859200,
            "updatedAt": 1641945600
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Instant Market Launch
export const msgInstantSpotMarketLaunchTemplate = `
Extract the following details for instant spot market launch:
- **ticker** (string): Market ticker
- **baseDenom** (string): Base denomination
- **quoteDenom** (string): Quote denomination
- **minPriceTickSize** (string): Minimum price tick size
- **minQuantityTickSize** (string): Minimum quantity tick size

Provide the request in the following JSON format:

\`\`\`json
{
    "ticker": "INJ/USDT",
    "baseDenom": "inj",
    "quoteDenom": "usdt",
    "minPriceTickSize": "0.000001",
    "minQuantityTickSize": "0.000001"
}
\`\`\`

Response format:

\`\`\`json
{
    "marketId": "0x...",
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getModuleParamsTemplate = `
Extract module parameters information.

Response format:

\`\`\`json
{
    "spotMarketInstantListingFee": {
        "amount": "100000000",
        "denom": "inj"
    },
    "derivativeMarketInstantListingFee": {
        "amount": "1000000000",
        "denom": "inj"
    },
    "defaultSpotMakerFeeRate": "0.001",
    "defaultSpotTakerFeeRate": "0.002",
    "defaultDerivativeMakerFeeRate": "0.001",
    "defaultDerivativeTakerFeeRate": "0.002",
    "defaultInitialMarginRatio": "0.05",
    "defaultMaintenanceMarginRatio": "0.02",
    "defaultFundingInterval": 3600,
    "fundingMultiple": 3600,
    "relayerFeeShareRate": "0.4",
    "exchangeModuleAdmin": "inj1..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getOrderStatesTemplate = `
Extract the following details for order states:
- **spotOrderHashes** (string[], optional): Spot order hashes
- **derivativeOrderHashes** (string[], optional): Derivative order hashes

Provide the request in the following JSON format:

\`\`\`json
{
    "spotOrderHashes": ["0x..."],
    "derivativeOrderHashes": ["0x..."]
}
\`\`\`

Response format:

\`\`\`json
{
    "spotOrderStates": {
        "orderHash": "OrderState"
    },
    "derivativeOrderStates": {
        "orderHash": "OrderState"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getSubaccountOrderSummaryTemplate = `
Extract the following details for subaccount order summary:
- **subaccountId** (string): Subaccount ID
- **marketId** (string, optional): Market ID filter
- **orderDirection** (string, optional): Order direction filter

Provide the request in the following JSON format:

\`\`\`json
{
    "subaccountId": "0x...",
    "marketId": "0x...",
    "orderDirection": "buy"
}
\`\`\`

Response format:

\`\`\`json
{
    "spotOrdersTotal": "10",
    "derivativeOrdersTotal": "5",
    "spotOrdersActiveTotal": "3",
    "derivativeOrdersActiveTotal": "2",
    "spotOrdersCancelledTotal": "5",
    "derivativeOrdersCancelledTotal": "2",
    "spotOrdersFilledTotal": "2",
    "derivativeOrdersFilledTotal": "1"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDerivativeMarketsTemplate = `
Extract the following details for derivative markets:
- **quoteDenom** (string, optional): Quote denomination filter, this needs to be in denom format!
- **marketStatus** (string, optional): Market status filter
- **marketStatuses** (string[], optional): Multiple market status filter

Provide the request in the following JSON format:

\`\`\`json
{
    "quoteDenom": "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "marketStatus": "active",
    "marketStatuses": ["active", "paused"]
}
\`\`\`

Response format:

\`\`\`json
{
    "markets": [
        {
            "marketId": "0x...",
            "marketStatus": "active",
            "ticker": "BTC/USDT PERP",
            "oracleBase": "BTC",
            "oracleQuote": "USDT",
            "quoteDenom": "usdt",
            "makerFeeRate": "0.001",
            "takerFeeRate": "0.002",
            "serviceProviderFee": "0.4",
            "isPerpetual": true,
            "minPriceTickSize": 0.01,
            "minQuantityTickSize": 0.001
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getSpotMarketsTemplate = `
Extract the following details for spot markets:
- **baseDenom** (string, optional): Base denomination filter
- **quoteDenom** (string, optional): Quote denomination filter
- **marketStatus** (string, optional): Market status filter
- **marketStatuses** (string[], optional): Multiple market status filter

Provide the request in the following JSON format:

\`\`\`json
{
    "baseDenom": "inj",
    "quoteDenom": "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "marketStatus": "active",
    "marketStatuses": ["active", "paused"]
}
\`\`\`

Response format:

\`\`\`json
{
    "markets": [
        {
            "marketId": "0x...",
            "marketStatus": "active",
            "ticker": "INJ/USDT",
            "baseDenom": "inj",
            "quoteDenom": "usdt",
            "makerFeeRate": "0.001",
            "takerFeeRate": "0.002",
            "serviceProviderFee": "0.4",
            "minPriceTickSize": 0.000001,
            "minQuantityTickSize": 0.000001
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getSubaccountsListTemplate = `
Extract the following details for subaccounts list:
- **address** (string): Account address

Provide the request in the following JSON format:

\`\`\`json
{
    "address": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "subaccounts": ["0x..."]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getSubaccountBalancesListTemplate = `
Extract the following details for subaccount balances:
- **subaccountId** (string): Subaccount ID

Provide the request in the following JSON format:

\`\`\`json
{
    "subaccountId": "0x..."
}
\`\`\`

Response format:

\`\`\`json
{
    "balances": [
        {
            "subaccountId": "0x...",
            "accountAddress": "inj1...",
            "denom": "inj",
            "deposit": {
                "totalBalance": "1000000",
                "availableBalance": "900000"
            }
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getOrderbooksV2Template = `
Extract the following details for orderbooks V2:
- **marketIds** (string[]): List of market IDs

Provide the request in the following JSON format:

\`\`\`json
{
    "marketIds": ["0x..."]
}
\`\`\`

Response format:

\`\`\`json
{
    "orderbooks": [
        {
            "marketId": "0x...",
            "orderbook": {
                "sequence": "123",
                "buys": [
                    {
                        "price": "25000.5",
                        "quantity": "1.5",
                        "timestamp": 1641859200
                    }
                ],
                "sells": [
                    {
                        "price": "25100.5",
                        "quantity": "0.5",
                        "timestamp": 1641859200
                    }
                ]
            }
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getTradingRewardsTemplate = `
Extract the following details for trading rewards:
- **address** (string): Account address
- **epoch** (number): Reward epoch

Provide the request in the following JSON format:

\`\`\`json
{
    "address": "inj1...",
    "epoch": 1
}
\`\`\`

Response format:

\`\`\`json
{
    "rewards": [
        {
            "accountAddress": "inj1...",
            "rewards": [
                {
                    "amount": "1000000",
                    "denom": "inj"
                }
            ],
            "distributedAt": 1641859200
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getHistoricalRpnlTemplate = `
Extract the following details for historical RPNL:
- **account** (string): Account address
- **resolution** (string): Time resolution for data points

Provide the request in the following JSON format:

\`\`\`json
{
    "account": "inj1...",
    "resolution": "1d"
}
\`\`\`

Response format:

\`\`\`json
{
    "t": [1641859200, 1641945600],
    "v": [1000.5, 1100.75]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getHistoricalVolumesTemplate = `
Extract the following details for historical volumes:
- **account** (string): Account address
- **resolution** (string): Time resolution for data points

Provide the request in the following JSON format:

\`\`\`json
{
    "account": "inj1...",
    "resolution": "1d"
}
\`\`\`

Response format:

\`\`\`json
{
    "t": [1641859200, 1641945600],
    "v": [50000.5, 75000.25]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getFundingPaymentsTemplate = `
Extract the following details for funding payments:
- **marketId** (string, optional): Market ID filter
- **marketIds** (string[], optional): Multiple market IDs filter
- **subaccountId** (string, optional): Subaccount ID filter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "0x...",
    "marketIds": ["0x..."],
    "subaccountId": "0x...",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "fundingPayments": [
        {
            "marketId": "0x...",
            "subaccountId": "0x...",
            "amount": "100.5",
            "timestamp": 1641859200
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

export const getPnlLeaderboardTemplate = `
Extract the following details for PnL leaderboard:
- **startDate** (string): Start date
- **endDate** (string): End date
- **limit** (number, optional): Number of results
- **account** (string, optional): Account address filter

Provide the request in the following JSON format:

\`\`\`json
{
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "limit": 100,
    "account": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "firstDate": "2024-01-01",
    "lastDate": "2024-01-31",
    "leaders": [
        {
            "account": "inj1...",
            "pnl": 100000.5,
            "volume": 1000000.0,
            "rank": 1
        }
    ],
    "accountRow": {
        "account": "inj1...",
        "pnl": 50000.25,
        "volume": 500000.0,
        "rank": 10
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getVolLeaderboardTemplate = `
Extract the following details for volume leaderboard:
- **startDate** (string): Start date
- **endDate** (string): End date
- **limit** (number, optional): Number of results
- **account** (string, optional): Account address filter

Provide the request in the following JSON format:

\`\`\`json
{
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "limit": 100,
    "account": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "firstDate": "2024-01-01",
    "lastDate": "2024-01-31",
    "leaders": [
        {
            "account": "inj1...",
            "volume": 1000000.0,
            "rank": 1
        }
    ],
    "accountRow": {
        "account": "inj1...",
        "volume": 500000.0,
        "rank": 10
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getPnlLeaderboardFixedResolutionTemplate = `
Extract the following details for PnL leaderboard with fixed resolution:
- **resolution** (string): Time resolution
- **limit** (number, optional): Number of results
- **account** (string, optional): Account address filter

Provide the request in the following JSON format:

\`\`\`json
{
    "resolution": "1d",
    "limit": 100,
    "account": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "firstDate": "2024-01-01",
    "lastDate": "2024-01-31",
    "leaders": [
        {
            "account": "inj1...",
            "pnl": 100000.5,
            "volume": 1000000.0,
            "rank": 1
        }
    ],
    "accountRow": {
        "account": "inj1...",
        "pnl": 50000.25,
        "volume": 500000.0,
        "rank": 10
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getVolLeaderboardFixedResolutionTemplate = `
Extract the following details for volume leaderboard with fixed resolution:
- **resolution** (string): Time resolution
- **limit** (number, optional): Number of results
- **account** (string, optional): Account address filter

Provide the request in the following JSON format:

\`\`\`json
{
    "resolution": "1d",
    "limit": 100,
    "account": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "firstDate": "2024-01-01",
    "lastDate": "2024-01-31",
    "leaders": [
        {
            "account": "inj1...",
            "volume": 1000000.0,
            "rank": 1
        }
    ],
    "accountRow": {
        "account": "inj1...",
        "volume": 500000.0,
        "rank": 10
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAtomicSwapHistoryTemplate = `
Extract the following details for atomic swap history:
- **address** (string): Account address
- **contractAddress** (string): Contract address
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "address": "inj1...",
    "contractAddress": "0x...",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "swapHistory": [
        {
            "sender": "inj1...",
            "route": "route_id",
            "sourceCoin": {
                "amount": "1000000",
                "denom": "inj"
            },
            "destinationCoin": {
                "amount": "900000",
                "denom": "usdt"
            },
            "fees": [
                {
                    "amount": "1000",
                    "denom": "inj"
                }
            ],
            "contractAddress": "0x...",
            "indexBySender": 1,
            "indexBySenderContract": 1,
            "txHash": "0x...",
            "executedAt": 1641859200
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

export const getIsOptedOutOfRewardsTemplate = `
Extract the following details for rewards opt-out status:
- **account** (string): Account address

Provide the request in the following JSON format:

\`\`\`json
{
    "account": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "isOptedOut": true
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getBinaryOptionsMarketsTemplate = `
Extract the following details for binary options markets:
- **marketStatus** (string, optional): Market status filter
- **quoteDenom** (string, optional): Quote denomination filter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "marketStatus": "active",
    "quoteDenom": "usdt",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "markets": [
        {
            "marketId": "0x...",
            "marketStatus": "active",
            "ticker": "BTC>25000-240630",
            "oracleSymbol": "BTC",
            "oracleProvider": "band",
            "oracleScaleFactor": 6,
            "quoteDenom": "usdt",
            "makerFeeRate": "0.001",
            "takerFeeRate": "0.002",
            "expirationTimestamp": 1719705600,
            "settlementTimestamp": 1719792000,
            "serviceProviderFee": "0.4",
            "minPriceTickSize": 0.01,
            "minQuantityTickSize": 0.001
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

export const getBinaryOptionsMarketTemplate = `
Extract the following details for binary options market lookup:
- **marketId** (string): Market ID

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "0x..."
}
\`\`\`

Response format:

\`\`\`json
{
    "market": {
        "marketId": "0x...",
        "marketStatus": "active",
        "ticker": "BTC>25000-240630",
        "oracleSymbol": "BTC",
        "oracleProvider": "band",
        "oracleScaleFactor": 6,
        "quoteDenom": "usdt",
        "makerFeeRate": "0.001",
        "takerFeeRate": "0.002",
        "expirationTimestamp": 1719705600,
        "settlementTimestamp": 1719792000,
        "serviceProviderFee": "0.4",
        "minPriceTickSize": 0.01,
        "minQuantityTickSize": 0.001
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDerivativeOrderHistoryTemplate = `
Extract the following details for derivative order history:
- **subaccountId** (string, optional): Subaccount ID filter
- **marketId** (string, optional): Market ID filter
- **marketIds** (string[], optional): Multiple market IDs filter
- **orderTypes** (string[], optional): Order types filter
- **executionTypes** (string[], optional): Execution types filter
- **direction** (string, optional): Order direction filter
- **isConditional** (boolean, optional): Whether order is conditional
- **state** (string, optional): Order state filter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "subaccountId": "0x...",
    "marketId": "0x...",
    "marketIds": ["0x..."],
    "orderTypes": ["limit", "market"],
    "executionTypes": ["limit", "market"],
    "direction": "buy",
    "isConditional": false,
    "state": "booked",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "orderHistory": [
        {
            "orderHash": "0x...",
            "marketId": "0x...",
            "isActive": true,
            "subaccountId": "0x...",
            "executionType": "limit",
            "orderType": "buy",
            "price": "25000.5",
            "triggerPrice": "0",
            "quantity": "1.5",
            "filledQuantity": "0.5",
            "state": "booked",
            "createdAt": 1641859200,
            "updatedAt": 1641859200,
            "direction": "buy",
            "isConditional": false,
            "triggerAt": 0,
            "margin": "1000"
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

export const getPositionsListTemplate = `
Extract the following details for positions list:
- **marketId** (string, optional): Market ID filter
- **marketIds** (string[], optional): Multiple market IDs filter
- **subaccountId** (string, optional): Subaccount ID filter
- **direction** (string, optional): Position direction filter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "0x...",
    "marketIds": ["0x..."],
    "subaccountId": "0x...",
    "direction": "long",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "positions": [
        {
            "marketId": "0x...",
            "subaccountId": "0x...",
            "direction": "long",
            "quantity": "1.5",
            "entryPrice": "25000.5",
            "margin": "1000",
            "liquidationPrice": "24000.0",
            "markPrice": "25100.0",
            "ticker": "BTC/USDT"
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

export const getDerivativeTradesTemplate = `
Extract the following details for derivative trades:
- **marketId** (string, optional): Market ID filter
- **marketIds** (string[], optional): Multiple market IDs filter
- **subaccountId** (string, optional): Subaccount ID filter
- **executionSide** (string, optional): Execution side filter
- **direction** (string, optional): Trade direction filter
- **executionTypes** (string[], optional): Execution types filter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "0x...",
    "marketIds": ["0x..."],
    "subaccountId": "0x...",
    "executionSide": "taker",
    "direction": "buy",
    "executionTypes": ["market", "limit"],
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "trades": [
        {
            "orderHash": "0x...",
            "subaccountId": "0x...",
            "marketId": "0x...",
            "tradeId": "trade_id",
            "executedAt": 1641859200,
            "tradeExecutionType": "market",
            "executionSide": "taker",
            "tradeDirection": "buy",
            "executionPrice": "25000.5",
            "executionQuantity": "1.5",
            "executionMargin": "1000",
            "fee": "25.0",
            "feeRecipient": "inj1...",
            "isLiquidation": false,
            "payout": "37525.75"
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

export const getDerivativeSubaccountOrdersListTemplate = `
Extract the following details for derivative subaccount orders:
- **subaccountId** (string): Subaccount ID
- **marketId** (string, optional): Market ID filter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "subaccountId": "0x...",
    "marketId": "0x...",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "orders": [
        {
            "orderHash": "0x...",
            "orderSide": "buy",
            "marketId": "0x...",
            "subaccountId": "0x...",
            "isReduceOnly": false,
            "margin": "1000",
            "price": "25000.5",
            "quantity": "1.5",
            "unfilledQuantity": "0.5",
            "triggerPrice": "0",
            "feeRecipient": "inj1...",
            "state": "booked",
            "createdAt": 1641859200,
            "updatedAt": 1641859200,
            "orderNumber": 1,
            "orderType": "limit",
            "isConditional": false,
            "triggerAt": 0,
            "placedOrderHash": "0x...",
            "executionType": "limit"
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

export const getOrderbookTemplate = `
Extract the following details for orderbooks:
- **marketIds** (string[]): Market IDs

Provide the request in the following JSON format:

\`\`\`json
{
    "marketIds": ["0x..."]
}
\`\`\`

Response format:

\`\`\`json
{
    "orderbook": [
        "marketId": "0x...",
        "orderbook": {
            "sequence": "123",
            "buys": [
                {
                    "price": "25000.5",
                    "quantity": "1.5",
                    "timestamp": 1641859200
                }
            ],
            "sells": [
                {
                    "price": "25100.5",
                    "quantity": "0.5",
                    "timestamp": 1641859200
                }
            ]
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgBatchCancelBinaryOptionsOrdersTemplate = `
Extract the following details for batch canceling binary options orders:
- **injectiveAddress** (string): Injective sender address
- **orders** (array): List of orders to cancel containing:
  - marketId (string)
  - subaccountId (string)
  - orderHash (string)

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "orders": [
        {
            "marketId": "0x...",
            "subaccountId": "0x...",
            "orderHash": "0x..."
        }
    ]
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCancelBinaryOptionsOrderTemplate = `
Extract the following details for canceling a binary options order:
- **injectiveAddress** (string): Injective sender address
- **marketId** (string): Market ID
- **subaccountId** (string): Subaccount ID
- **orderHash** (string): Order hash

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "marketId": "0x...",
    "subaccountId": "0x...",
    "orderHash": "0x..."
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCreateBinaryOptionsLimitOrderTemplate = `
Extract the following details for creating binary options limit order:
- **injectiveAddress** (string): Injective sender address
- **marketId** (string): Market ID
- **subaccountId** (string): Subaccount ID
- **feeRecipient** (string): Fee recipient address
- **price** (string): Order price
- **quantity** (string): Order quantity
- **orderType** (string): Order type (BUY/SELL)

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "marketId": "0x...",
    "subaccountId": "0x...",
    "feeRecipient": "inj1...",
    "price": "25000.5",
    "quantity": "1.5",
    "orderType": "BUY"
}
\`\`\`

Response format:

\`\`\`json
{
    "orderHash": "0x...",
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgLiquidatePositionTemplate = `
Extract the following details for liquidating a position:
- **injectiveAddress** (string): Injective sender address
- **subaccountId** (string): Subaccount ID to liquidate
- **marketId** (string): Market ID
- **order** (object): Liquidation order details containing:
  - marketId (string)
  - orderType (string)
  - price (string)
  - quantity (string)
  - margin (string)

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "subaccountId": "0x...",
    "marketId": "0x...",
    "order": {
        "marketId": "0x...",
        "orderType": "SELL",
        "price": "24000.0",
        "quantity": "1.5",
        "margin": "1000"
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgReclaimLockedFundsTemplate = `
Extract the following details for reclaiming locked funds:
- **injectiveAddress** (string): Injective sender address
- **lockedAccountPubKey** (string): Public key of the locked account
- **lockedAccountSignature** (string): Signature from the locked account

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "lockedAccountPubKey": "0x...",
    "lockedAccountSignature": "0x..."
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgSignDataTemplate = `
Extract the following details for signing data:
- **injectiveAddress** (string): Injective sender address
- **data** (string): Data to sign

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "data": "0x..."
}
\`\`\`

Response format:

\`\`\`json
{
    "signature": "0x...",
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCreateSpotLimitOrderTemplate = `
Extract the following details for creating spot limit order:
- **injectiveAddress** (string): Injective sender address
- **marketId** (string): Market ID
- **subaccountId** (string): Subaccount ID
- **orderType** (string): Order type (BUY/SELL)
- **price** (string): Order price
- **quantity** (string): Order quantity
- **feeRecipient** (string): Fee recipient address

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "marketId": "0x...",
    "subaccountId": "0x...",
    "orderType": "BUY",
    "price": "25000.5",
    "quantity": "1.5",
    "feeRecipient": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "orderHash": "0x...",
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCreateDerivativeLimitOrderTemplate = `
Extract the following details for creating derivative limit order:
- **injectiveAddress** (string): Injective sender address
- **marketId** (string): Market ID
- **subaccountId** (string): Subaccount ID
- **orderType** (string): Order type (BUY/SELL)
- **price** (string): Order price
- **quantity** (string): Order quantity
- **margin** (string): Order margin
- **feeRecipient** (string): Fee recipient address

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "marketId": "0x...",
    "subaccountId": "0x...",
    "orderType": "BUY",
    "price": "25000.5",
    "quantity": "1.5",
    "margin": "1000",
    "feeRecipient": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "orderHash": "0x...",
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgBatchCancelSpotOrdersTemplate = `
Extract the following details for batch canceling spot orders:
- **injectiveAddress** (string): Injective sender address
- **orders** (array): List of orders to cancel containing:
  - marketId (string)
  - subaccountId (string)
  - orderHash (string)

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "orders": [
        {
            "marketId": "0x...",
            "subaccountId": "0x...",
            "orderHash": "0x..."
        }
    ]
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgBatchCancelDerivativeOrdersTemplate = `
Extract the following details for batch canceling derivative orders:
- **injectiveAddress** (string): Injective sender address
- **orders** (array): List of orders to cancel containing:
  - marketId (string)
  - subaccountId (string)
  - orderHash (string)

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "orders": [
        {
            "marketId": "0x...",
            "subaccountId": "0x...",
            "orderHash": "0x..."
        }
    ]
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCancelSpotOrderTemplate = `
Extract the following details for canceling a spot order:
- **injectiveAddress** (string): Injective sender address
- **marketId** (string): Market ID
- **subaccountId** (string): Subaccount ID
- **orderHash** (string): Order hash

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "marketId": "0x...",
    "subaccountId": "0x...",
    "orderHash": "0x..."
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCancelDerivativeOrderTemplate = `
Extract the following details for canceling a derivative order:
- **injectiveAddress** (string): Injective sender address
- **marketId** (string): Market ID
- **subaccountId** (string): Subaccount ID
- **orderHash** (string): Order hash

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "marketId": "0x...",
    "subaccountId": "0x...",
    "orderHash": "0x..."
}
\`\`\`

Response format:

\`\`\`json
{
    "success": true,
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getSpotSubaccountOrdersListTemplate = `
Extract the following details for spot subaccount orders:
- **subaccountId** (string): Subaccount ID
- **marketId** (string, optional): Market ID filter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "subaccountId": "0x...",
    "marketId": "0x...",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "orders": [
        {
            "orderHash": "0x...",
            "orderSide": "buy",
            "marketId": "0x...",
            "subaccountId": "0x...",
            "price": "25000.5",
            "quantity": "1.5",
            "unfilledQuantity": "0.5",
            "triggerPrice": "0",
            "feeRecipient": "inj1...",
            "state": "booked",
            "createdAt": 1641859200,
            "updatedAt": 1641859200
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

export const getSpotSubaccountTradesListTemplate = `
Extract the following details for spot subaccount trades:
- **subaccountId** (string): Subaccount ID
- **marketId** (string, optional): Market ID filter
- **direction** (string, optional): Trade direction
- **executionType** (string, optional): Execution type
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "subaccountId": "0x...",
    "marketId": "0x...",
    "direction": "buy",
    "executionType": "market",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "trades": [
        {
            "orderHash": "0x...",
            "subaccountId": "0x...",
            "marketId": "0x...",
            "tradeId": "trade_id",
            "executedAt": 1641859200,
            "executionSide": "taker",
            "tradeExecutionType": "market",
            "tradeDirection": "buy",
            "executionPrice": "25000.5",
            "executionQuantity": "1.5",
            "fee": "25.0",
            "feeRecipient": "inj1..."
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

export const msgCreateBinaryOptionsMarketOrderTemplate = `
Extract the following details for creating binary options market order:
- **injectiveAddress** (string): Injective sender address
- **marketId** (string): Market ID
- **subaccountId** (string): Subaccount ID
- **feeRecipient** (string): Fee recipient address
- **price** (string): Order price
- **quantity** (string): Order quantity
- **orderType** (string): Order type (BUY/SELL)

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "marketId": "0x...",
    "subaccountId": "0x...",
    "feeRecipient": "inj1...",
    "price": "25000.5",
    "quantity": "1.5",
    "orderType": "BUY"
}
\`\`\`

Response format:

\`\`\`json
{
    "orderHash": "0x...",
    "txHash": "0x..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getSpotOrderHistoryTemplate = `
Extract the following details for spot order history:
- **subaccountId** (string, optional): Subaccount ID filter
- **marketId** (string, optional): Market ID filter
- **marketIds** (string[], optional): Multiple market IDs filter
- **orderTypes** (string[], optional): Order types filter
- **executionTypes** (string[], optional): Execution types filter
- **direction** (string, optional): Order direction filter
- **isConditional** (boolean, optional): Whether order is conditional
- **state** (string, optional): Order state filter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "subaccountId": "0x...",
    "marketId": "0x...",
    "marketIds": ["0x..."],
    "orderTypes": ["limit", "market"],
    "executionTypes": ["limit", "market"],
    "direction": "buy",
    "isConditional": false,
    "state": "booked",
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "orderHistory": [
        {
            "orderHash": "0x...",
            "marketId": "0x...",
            "active": true,
            "subaccountId": "0x...",
            "executionType": "limit",
            "orderType": "buy",
            "price": "25000.5",
            "triggerPrice": "0",
            "quantity": "1.5",
            "filledQuantity": "0.5",
            "state": "booked",
            "createdAt": 1641859200,
            "updatedAt": 1641859200,
            "direction": "buy"
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

export const getSpotTradesTemplate = `
Extract the following details for spot trades:
- **marketId** (string, optional): Market ID filter
- **marketIds** (string[], optional): Multiple market IDs filter
- **subaccountId** (string, optional): Subaccount ID filter
- **executionSide** (string, optional): Execution side filter
- **direction** (string, optional): Trade direction filter
- **executionTypes** (string[], optional): Execution types filter
- **pagination** (object, optional): Pagination options

Provide the request in the following JSON format:

\`\`\`json
{
    "marketId": "0x...",
    "marketIds": ["0x..."],
    "subaccountId": "0x...",
    "executionSide": "taker",
    "direction": "buy",
    "executionTypes": ["market", "limit"],
    "pagination": {
        "from": 1,
        "to": 100,
        "limit": 10
    }
}
\`\`\`

Response format:

\`\`\`json
{
    "trades": [
        {
            "orderHash": "0x...",
            "subaccountId": "0x...",
            "marketId": "0x...",
            "tradeId": "trade_id",
            "executedAt": 1641859200,
            "executionSide": "taker",
            "tradeExecutionType": "market",
            "tradeDirection": "buy",
            "price": "25000.5",
            "quantity": "1.5",
            "fee": "25.0",
            "feeRecipient": "inj1..."
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

export const getAccountPortfolioBalancesTemplate = `
Extract the following details for account portfolio balances:
- **address** (string): Account address

Provide the request in the following JSON format:

\`\`\`json
{
    "address": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "balances": [
        {
            "denom": "inj",
            "totalBalance": "1000000",
            "availableBalance": "900000",
            "lockedBalance": "100000"
        }
    ],
    "subaccountBalances": [
        {
            "subaccountId": "0x...",
            "denom": "inj",
            "deposit": {
                "totalBalance": "1000000",
                "availableBalance": "900000"
            }
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getRewardsTemplate = `
Extract the following details for rewards:
- **address** (string): Account address
- **epoch** (number): Reward epoch

Provide the request in the following JSON format:

\`\`\`json
{
    "address": "inj1...",
    "epoch": 1
}
\`\`\`

Response format:

\`\`\`json
{
    "rewards": [
        {
            "accountAddress": "inj1...",
            "rewards": [
                {
                    "amount": "1000000",
                    "denom": "inj"
                }
            ],
            "distributedAt": 1641859200
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
