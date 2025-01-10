# `@elizaos/plugin-gecko`

This plugin provides actions and providers for interacting with CoinGecko API, using free version
https://docs.coingecko.com/v3.0.1/reference/introduction

to get the Free Public API access, read here how to get an API
https://support.coingecko.com/hc/en-us/articles/21880397454233-User-Guide-How-to-sign-up-for-CoinGecko-Demo-API-and-generate-an-API-key

---

## Configuration

### Default Setup

By default, CoinGecko plugin is enabled. To use it, simply add your API key to the `.env` file:

```env
COINGECKO_API_KEY=your-gecko-key-here
COINGECKO_PRO=FALSE
```

If using Paid version, add COINGECKO_PRO to TRUE so different endpoints can be used.

## Provider

The **Coin Provider** gets the list of all the coins from Gecko API
https://docs.coingecko.com/v3.0.1/reference/coins-list
with its respective id,name and symbol, this can then be used for actions

---

## Actions

### Price

Get the current price and market cap of a coin/token from CoingGecko API, provide ticker or name of currency you want:

**Example usage:**

```env
Get me price of Pendle token
```

### Get Price per address

Get the current price and market cap of a coin/token from CoingGecko API by providing currency address and base platform

### Get Trending coins

Returns Top 15 trending coins (sorted by the most popular user searches)

**Example usage:**

```env
Get me price for 0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825 on Base

Get price for HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC on Solana

Get me current trending coins
```

---
