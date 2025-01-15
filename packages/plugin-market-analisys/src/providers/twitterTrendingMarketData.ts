import { elizaLogger, Provider } from "@elizaos/core";
import { fetchTokenOverview, fetchTrendingTokens } from "../utils/birdeye";

interface FormattedMarketData {
    symbol: string;
    name: string;
    price: string;
    priceChange24h: string;
    priceChange1h: string;
    volume24h: string;
    volume1h: string;
    marketCap: string;
    realMarketCap: string;
    liquidity: string;
    holders: string;
    uniqueWallets24h: string;
    uniqueWallets1h: string;
    socialLinks: string[];
}

function formatNumber(num: number): string {
    if (num >= 1e9) {
        return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
        return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
        return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
}

function formatPercentage(num: number): string {
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(2)}%`;
}

function getSocialLinks(extensions: any): string[] {
    const links = [];
    if (extensions.website) links.push(`🌐 ${extensions.website}`);
    if (extensions.twitter) links.push(`🐦 ${extensions.twitter}`);
    if (extensions.telegram) links.push(`📱 ${extensions.telegram}`);
    if (extensions.discord) links.push(`💬 ${extensions.discord}`);
    return links;
}

export const twitterTrendingMarketData: Provider = {
    get: async (runtime, message, state) => {
        if (!message.content.action || message.content.action !== "TWEET") {
            return "";
        }

        try {
            const trendingTokens = await fetchTrendingTokens(
                runtime.character.settings.secrets.BIRDEYE_API_KEY
            );

            const randomIndex = Math.floor(
                Math.random() * Math.min(10, trendingTokens.tokens.length)
            );
            const selectedToken = trendingTokens.tokens[randomIndex];

            const tokenData = await fetchTokenOverview(
                selectedToken.address,
                runtime.character.settings.secrets.BIRDEYE_API_KEY
            );

            const formattedData: FormattedMarketData = {
                symbol: tokenData.symbol,
                name: tokenData.name,
                price: formatNumber(tokenData.price),
                priceChange24h: formatPercentage(
                    tokenData.priceChange24hPercent
                ),
                priceChange1h: formatPercentage(tokenData.priceChange1hPercent),
                volume24h: formatNumber(tokenData.v24hUSD),
                volume1h: formatNumber(tokenData.v1hUSD),
                marketCap: formatNumber(tokenData.mc),
                realMarketCap: formatNumber(tokenData.realMc),
                liquidity: formatNumber(tokenData.liquidity),
                holders: tokenData.holder.toLocaleString(),
                uniqueWallets24h: tokenData.uniqueWallet24h.toLocaleString(),
                uniqueWallets1h: tokenData.uniqueWallet1h.toLocaleString(),
                socialLinks: getSocialLinks(tokenData.extensions),
            };

            // Build comprehensive market report
            let report = `🚀 ${formattedData.name} ($${formattedData.symbol}) Market Report\n\n`;

            // Price and Changes
            report += `💰 Price: ${formattedData.price}\n`;
            report += `📈 24h Change: ${formattedData.priceChange24h}\n`;
            report += `⏰ 1h Change: ${formattedData.priceChange1h}\n\n`;

            // Volume and Liquidity
            report += `📊 24h Volume: ${formattedData.volume24h}\n`;
            report += `📊 1h Volume: ${formattedData.volume1h}\n`;
            report += `💧 Liquidity: ${formattedData.liquidity}\n\n`;

            // Market Caps
            report += `💎 Market Cap: ${formattedData.marketCap}\n`;
            report += `💎 Real MC: ${formattedData.realMarketCap}\n\n`;

            // Holder Metrics
            report += `👥 Holders: ${formattedData.holders}\n`;
            report += `🔄 24h Active Wallets: ${formattedData.uniqueWallets24h}\n`;
            report += `🔄 1h Active Wallets: ${formattedData.uniqueWallets1h}\n\n`;

            elizaLogger.log(report);

            return report;
        } catch (error) {
            console.error(
                "Error in twitterTrendingMarketData provider:",
                error
            );
            return "";
        }
    },
};
