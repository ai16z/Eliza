import {
    type Action,
    type ActionExample,
    elizaLogger,
    formatTimestamp,
    type IAgentRuntime,
    type Memory,
    type State,
} from "@elizaos/core";
import { BirdeyeProvider } from "../birdeye";
import type {
    TokenMarketDataResponse,
    TokenOverviewResponse,
    TokenSecurityResponse,
    TokenTradeDataSingleResponse,
} from "../types/api/token";
import type { BaseAddress } from "../types/shared";
import {
    extractAddresses,
    formatPercentChange,
    formatPrice,
    formatValue,
    shortenAddress,
} from "../utils";

type TokenAddressSearchResult = {
    overview: TokenOverviewResponse;
    tradeData: TokenTradeDataSingleResponse;
    security: TokenSecurityResponse;
    marketData: TokenMarketDataResponse;
};

export const tokenSearchAddressAction = {
    name: "TOKEN_SEARCH_ADDRESS",
    similes: [
        "SEARCH_TOKEN_ADDRESS",
        "FIND_TOKEN_ADDRESS",
        "LOOKUP_TOKEN_ADDRESS",
        "CHECK_TOKEN_ADDRESS",
        "GET_TOKEN_BY_ADDRESS",
        "TOKEN_ADDRESS_INFO",
        "TOKEN_ADDRESS_LOOKUP",
        "TOKEN_ADDRESS_SEARCH",
        "TOKEN_ADDRESS_CHECK",
        "TOKEN_ADDRESS_DETAILS",
        "TOKEN_CONTRACT_SEARCH",
        "TOKEN_CONTRACT_LOOKUP",
        "TOKEN_CONTRACT_INFO",
        "TOKEN_CONTRACT_CHECK",
        "VERIFY_TOKEN_ADDRESS",
        "VALIDATE_TOKEN_ADDRESS",
        "GET_TOKEN_INFO",
        "TOKEN_INFO",
        "TOKEN_REPORT",
        "TOKEN_ANALYSIS",
        "TOKEN_OVERVIEW",
        "TOKEN_SUMMARY",
        "TOKEN_INSIGHT",
        "TOKEN_DATA",
        "TOKEN_STATS",
        "TOKEN_METRICS",
        "TOKEN_PROFILE",
        "TOKEN_REVIEW",
        "TOKEN_CHECK",
        "TOKEN_LOOKUP",
        "TOKEN_FIND",
        "TOKEN_DISCOVER",
        "TOKEN_EXPLORE",
    ],
    description:
        "Search for detailed token information including security and trade data by address",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback?: any
    ) => {
        try {
            const provider = new BirdeyeProvider(runtime.cacheManager);

            // get all contract addresses from the message
            const addresses = extractAddresses(message.content.text);

            elizaLogger.info(
                `Searching Birdeye provider for ${addresses.length} addresses`
            );

            // for each symbol, do a search in Birdeye. This will return a list of token results that may be amatch to the token symbol.
            const results: TokenAddressSearchResult[] = await Promise.all(
                addresses.map(async ({ address, chain: addressChain }) => {
                    // address detection can't distinguish between evm chains, so we currently only do address search on ETH for EVM addresses. Future support will be added for other chains if the user requests it.
                    const chain =
                        addressChain === "evm" ? "ethereum" : addressChain;

                    const [overview, marketData, security, tradeData] =
                        await Promise.all([
                            provider.fetchTokenOverview(
                                {
                                    address,
                                },
                                {
                                    headers: {
                                        "x-chain": chain,
                                    },
                                }
                            ),
                            provider.fetchTokenMarketData(
                                {
                                    address,
                                },
                                {
                                    headers: {
                                        "x-chain": chain,
                                    },
                                }
                            ),
                            provider.fetchTokenSecurityByAddress(
                                {
                                    address,
                                },
                                {
                                    headers: {
                                        "x-chain": chain,
                                    },
                                }
                            ),
                            provider.fetchTokenTradeDataSingle(
                                {
                                    address,
                                },
                                {
                                    headers: {
                                        "x-chain": chain,
                                    },
                                }
                            ),
                        ]);

                    return {
                        overview,
                        marketData,
                        security,
                        tradeData,
                    };
                })
            );

            console.log(results);

            const completeResults = `I performed a search for the token addresses you requested and found the following results:\n\n${results
                .map(
                    (result, i) =>
                        `${formatTokenReport(addresses[i], i, result)}`
                )
                .join("\n\n")}`;

            callback?.({ text: completeResults });
            return true;
        } catch (error) {
            console.error("Error in searchTokens handler:", error.message);
            callback?.({ text: `Error: ${error.message}` });
            return false;
        }
    },
    validate: async (_runtime: IAgentRuntime, message: Memory) => {
        const addresses = extractAddresses(message.content.text);
        return addresses.length > 0;
    },
    examples: [
        [
            {
                user: "user",
                content: {
                    text: "Search for 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
                    action: "TOKEN_SEARCH_ADDRESS",
                },
            },
            {
                user: "user",
                content: {
                    text: "Look up contract So11111111111111111111111111111111111111112",
                    action: "TOKEN_ADDRESS_LOOKUP",
                },
            },
            {
                user: "user",
                content: {
                    text: "Check this address: 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
                    action: "CHECK_TOKEN_ADDRESS",
                },
            },
            {
                user: "user",
                content: {
                    text: "Get info for 0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                    action: "TOKEN_ADDRESS_INFO",
                },
            },
            {
                user: "user",
                content: {
                    text: "Analyze contract 0x514910771af9ca656af840dff83e8264ecf986ca",
                    action: "TOKEN_CONTRACT_SEARCH",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;

// take all the details of the results and present to the user
const formatTokenReport = (
    address: BaseAddress,
    index: number,
    result: TokenAddressSearchResult
) => {
    let output = ``;

    if (result.overview?.data) {
        output += `\n`;
        output += `Token Overview:\n`;
        output += `📝 Name: ${result.overview.data.name}\n`;
        output += result.overview.data.symbol
            ? `🔖 Symbol: ${result.overview.data.symbol.toUpperCase()}\n`
            : "";
        output += `🔗 Address: ${address.address}\n`;
        output += `🔢 Decimals: ${result.overview.data.decimals}\n`;
        output += ``;
        if (result.overview.data.extensions) {
            const ext = result.overview.data.extensions;
            output += `🔗 Links & Info:\n`;
            if (ext.website) output += `   • Website: ${ext.website}\n`;
            if (ext.twitter) output += `   • Twitter: ${ext.twitter}\n`;
            if (ext.telegram) output += `   • Telegram: ${ext.telegram}\n`;
            if (ext.discord) output += `   • Discord: ${ext.discord}\n`;
            if (ext.medium) output += `   • Medium: ${ext.medium}\n`;
            if (ext.coingeckoId)
                output += `   • CoinGecko ID: ${ext.coingeckoId}\n`;
            if (ext.serumV3Usdc)
                output += `   • Serum V3 USDC: ${ext.serumV3Usdc}\n`;
            if (ext.serumV3Usdt)
                output += `   • Serum V3 USDT: ${ext.serumV3Usdt}\n`;
        }
        output += `💧 Liquidity: ${formatValue(result.overview.data.liquidity)}\n`;
        output += `⏰ Last Trade Time: ${formatTimestamp(new Date(result.overview.data.lastTradeHumanTime).getTime() / 1000)}\n`;
        output += `💵 Price: ${formatPrice(result.overview.data.price)}\n`;
        output += `📜 Description: ${result.overview.data.extensions?.description ?? "N/A"}\n`;
    }

    if (result.marketData?.data) {
        output += `\n`;
        output += `Market Data:\n`;
        output += `💧 Liquidity: ${formatValue(result.marketData.data.liquidity)}\n`;
        output += `💵 Price: ${formatPrice(result.marketData.data.price)}\n`;
        output += `📦 Supply: ${formatValue(result.marketData.data.supply)}\n`;
        output += `💰 Market Cap: ${formatValue(result.marketData.data.marketcap)}\n`;
        output += `🔄 Circulating Supply: ${formatValue(result.marketData.data.circulating_supply)}\n`;
        output += `💰 Circulating Market Cap: ${formatValue(result.marketData.data.circulating_marketcap)}\n`;
    }

    if (result.tradeData?.data) {
        output += `\n`;
        output += `Trade Data:\n`;
        output += `👥 Holders: ${result.tradeData.data.holder}\n`;
        output += `📊 Unique Wallets (24h): ${result.tradeData.data.unique_wallet_24h}\n`;
        output += `📉 Price Change (24h): ${formatPercentChange(result.tradeData.data.price_change_24h_percent)}\n`;
        output += `💸 Volume (24h USD): ${formatValue(result.tradeData.data.volume_24h_usd)}\n`;
        output += `💵 Current Price: $${formatPrice(result.tradeData.data.price)}\n`;
    }

    if (result.security?.data) {
        output += `\n`;
        output += `Ownership Distribution:\n`;
        output += `🏠 Owner Address: ${shortenAddress(result.security.data.ownerAddress)}\n`;
        output += `👨‍💼 Creator Address: ${shortenAddress(result.security.data.creatorAddress)}\n`;
        output += `📦 Total Supply: ${formatValue(result.security.data.totalSupply)}\n`;
        output += result.security.data.proxied
            ? `🌿 Mintable: ${result.security.data.mintable ?? "N/A"}\n`
            : "";
        output += result.security.data.proxy
            ? `🔄 Proxied: ${result.security.data.proxy ?? "N/A"}\n`
            : "";
        output += result.security.data.securityChecks
            ? `🔍 Security Checks: ${JSON.stringify(result.security.data.securityChecks)}\n`
            : "";
    }

    return output ?? `No results found for ${address.address}`;
};
