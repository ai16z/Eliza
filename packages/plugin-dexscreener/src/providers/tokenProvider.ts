import type { Provider, IAgentRuntime, Memory, State } from "@elizaos/core";

/*
interface TokenPriceData {
    baseToken: {
        name: string;
        symbol: string;
        address: string;
        decimals: number;
    };
    priceUsd: string;
    priceChange: {
        h1: number;
        h24: number;
    };
    liquidityUsd: string;
    volume: {
        h24: number;
    };
}
*/

export class TokenPriceProvider implements Provider {
    async get(
        runtime: IAgentRuntime,
        message: Memory,
        _state?: State
    ): Promise<string> {
        try {
            const content =
                typeof message.content === "string"
                    ? message.content
                    : message.content?.text;

            if (!content) {
                throw new Error("No message content provided");
            }

            // Extract token from content
            const tokenIdentifier = this.extractToken(content);
            if (!tokenIdentifier) {
                throw new Error("Could not identify token in message");
            }

            console.log(`Fetching price for token: ${tokenIdentifier}`);

            // Make API request
            const isAddress =
                /^0x[a-fA-F0-9]{40}$/.test(tokenIdentifier) ||
                /^[1-9A-HJ-NP-Za-km-z]{43,44}$/.test(tokenIdentifier); // validates for ethAddress and solAddress
            const endpoint = isAddress
                ? `https://api.dexscreener.com/latest/dex/tokens/${tokenIdentifier}`
                : `https://api.dexscreener.com/latest/dex/search?q=${tokenIdentifier}`;

            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.pairs || data.pairs.length === 0) {
                throw new Error(`No pricing data found for ${tokenIdentifier}`);
            }

            // Get best pair by liquidity
            const bestPair = this.getBestPair(data.pairs);
            return this.formatPriceData(bestPair);
        } catch (error) {
            console.error("TokenPriceProvider error:", error);
            return `Error: ${error.message}`;
        }
    }

    private extractToken(content: string): string | null {
        // Try different patterns in order of specificity
        const patterns = [
            /0x[a-fA-F0-9]{40}/, // ETH address
            /[$#]([a-zA-Z0-9]+)/, // $TOKEN or #TOKEN
            /(?:price|value|worth|cost)\s+(?:of|for)\s+([a-zA-Z0-9]+)/i, // "price of TOKEN"
            /\b(?:of|for)\s+([a-zA-Z0-9]+)\b/i, // "of TOKEN"
        ];

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                // Use captured group if it exists, otherwise use full match
                const token = match[1] || match[0];
                // Clean up the token identifier
                return token.replace(/[$#]/g, "").toLowerCase().trim();
            }
        }

        return null;
    }

    private getBestPair(pairs: any[]): any {
        return pairs.reduce((best, current) => {
            const bestLiquidity = Number.parseFloat(best.liquidity?.usd || "0");
            const currentLiquidity = Number.parseFloat(current.liquidity?.usd || "0");
            return currentLiquidity > bestLiquidity ? current : best;
        }, pairs[0]);
    }

    private formatPriceData(pair: any): string {
        const price = Number.parseFloat(pair.priceUsd).toFixed(6);
        //const change24h = pair.priceChange?.h24?.toFixed(2) || "0.00";
        const liquidity = Number.parseFloat(
            pair.liquidity?.usd || "0"
        ).toLocaleString();
        const volume = Number.parseFloat(pair.volume?.h24 || "0").toLocaleString();

        return `
        The price of ${pair.baseToken.symbol} is $${price} USD, with liquidity of $${liquidity} and 24h volume of $${volume}.`;
    }
}

export const tokenPriceProvider = new TokenPriceProvider();
