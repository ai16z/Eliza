export interface TokenOverviewResponse {
    address: string;
    decimals: number;
    symbol: string;
    name: string;
    extensions: {
        coingeckoId: string | null;
        website: string | null;
        telegram: string | null;
        twitter: string | null;
        description: string | null;
        discord: string | null;
        medium: string | null;
    };
    logoURI: string;
    liquidity: number;
    lastTradeUnixTime: number;
    lastTradeHumanTime: string;
    price: number;
    supply: number;
    mc: number;
    circulatingSupply: number;
    realMc: number;
    holder: number;
    // Price changes
    priceChange24hPercent: number;
    priceChange12hPercent: number;
    priceChange8hPercent: number;
    priceChange4hPercent: number;
    priceChange2hPercent: number;
    priceChange1hPercent: number;
    priceChange30mPercent: number;
    // Volume data
    v24hUSD: number;
    v12hUSD: number;
    v8hUSD: number;
    v4hUSD: number;
    v2hUSD: number;
    v1hUSD: number;
    v30mUSD: number;
    // Unique wallets
    uniqueWallet24h: number;
    uniqueWallet12h: number;
    uniqueWallet8h: number;
    uniqueWallet4h: number;
    uniqueWallet2h: number;
    uniqueWallet1h: number;
    uniqueWallet30m: number;
}

export interface BirdeyeApiError {
    success: false;
    error: string;
}

export async function fetchTokenOverview(
    tokenAddress: string,
    apiKey?: string,
    cache?: {
        get: (key: string) => any;
        set: (key: string, value: any) => void;
    }
): Promise<TokenOverviewResponse> {
    try {
        // Check cache first if provided
        if (cache) {
            const cacheKey = `token_overview_${tokenAddress}`;
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                console.log(
                    `Returning cached token overview for ${tokenAddress}`
                );
                return cachedData;
            }
        }

        const response = await fetch(
            `https://public-api.birdeye.so/defi/token_overview?address=${tokenAddress}`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey || "",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.data) {
            throw new Error("Failed to fetch token overview data");
        }

        // Cache the response if cache is provided
        if (cache) {
            const cacheKey = `token_overview_${tokenAddress}`;
            cache.set(cacheKey, data.data);
        }

        return data.data;
    } catch (error) {
        console.error("Error fetching token overview:", error);
        throw error;
    }
}

export interface TrendingToken {
    address: string;
    decimals: number;
    liquidity: number;
    logoURI: string;
    name: string;
    symbol: string;
    volume24hUSD: number;
    rank: number;
    price: number;
}

export interface TrendingTokensResponse {
    updateUnixTime: number;
    updateTime: string;
    tokens: TrendingToken[];
    total: number;
}

export async function fetchTrendingTokens(
    apiKey?: string,
    cache?: {
        get: (key: string) => any;
        set: (key: string, value: any) => void;
    },
    limit: number = 20
): Promise<TrendingTokensResponse> {
    try {
        // Check cache first if provided
        if (cache) {
            const cacheKey = `trending_tokens_${limit}`;
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                console.log(`Returning cached trending tokens`);
                return cachedData;
            }
        }

        const response = await fetch(
            `https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=${limit}`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey || "",
                    "x-chain": "sui",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.data) {
            throw new Error("Failed to fetch trending tokens data");
        }

        // Cache the response if cache is provided
        if (cache) {
            const cacheKey = `trending_tokens_${limit}`;
            cache.set(cacheKey, data.data);
        }

        return data.data;
    } catch (error) {
        console.error("Error fetching trending tokens:", error);
        throw error;
    }
}
