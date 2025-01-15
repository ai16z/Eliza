// export interface TokenOverviewResponse {
//     address: string;
//     decimals: number;
//     symbol: string;
//     name: string;
//     extensions: {
//         coingeckoId: string | null;
//         website: string | null;
//         telegram: string | null;
//         twitter: string | null;
//         description: string | null;
//         discord: string | null;
//         medium: string | null;
//     };
//     logoURI: string;
//     liquidity: number;
//     lastTradeUnixTime: number;
//     lastTradeHumanTime: string;
//     price: number;
//     supply: number;
//     mc: number;
//     circulatingSupply: number;
//     realMc: number;
//     holder: number;
//     // Price changes
//     priceChange24hPercent: number;
//     priceChange12hPercent: number;
//     priceChange8hPercent: number;
//     priceChange4hPercent: number;
//     priceChange2hPercent: number;
//     priceChange1hPercent: number;
//     priceChange30mPercent: number;
//     // Volume data
//     v24hUSD: number;
//     v12hUSD: number;
//     v8hUSD: number;
//     v4hUSD: number;
//     v2hUSD: number;
//     v1hUSD: number;
//     v30mUSD: number;
//     // Unique wallets
//     uniqueWallet24h: number;
//     uniqueWallet12h: number;
//     uniqueWallet8h: number;
//     uniqueWallet4h: number;
//     uniqueWallet2h: number;
//     uniqueWallet1h: number;
//     uniqueWallet30m: number;
// }

// export interface BirdeyeApiError {
//     success: false;
//     error: string;
// }

// export async function fetchTokenOverview(
//     tokenAddress: string,
//     apiKey?: string,
//     cache?: {
//         get: (key: string) => any;
//         set: (key: string, value: any) => void;
//     }
// ): Promise<TokenOverviewResponse> {
//     try {
//         // Check cache first if provided
//         if (cache) {
//             const cacheKey = `token_overview_${tokenAddress}`;
//             const cachedData = cache.get(cacheKey);
//             if (cachedData) {
//                 console.log(
//                     `Returning cached token overview for ${tokenAddress}`
//                 );
//                 return cachedData;
//             }
//         }

//         const response = await fetch(
//             `https://public-api.birdeye.so/defi/token_overview?address=${tokenAddress}`,
//             {
//                 method: "GET",
//                 headers: {
//                     accept: "application/json",
//                     "x-api-key": apiKey || "",
//                 },
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (!data.success || !data.data) {
//             throw new Error("Failed to fetch token overview data");
//         }

//         // Cache the response if cache is provided
//         if (cache) {
//             const cacheKey = `token_overview_${tokenAddress}`;
//             cache.set(cacheKey, data.data);
//         }

//         return data.data;
//     } catch (error) {
//         console.error("Error fetching token overview:", error);
//         throw error;
//     }
// }

// export interface TrendingToken {
//     address: string;
//     decimals: number;
//     liquidity: number;
//     logoURI: string;
//     name: string;
//     symbol: string;
//     volume24hUSD: number;
//     rank: number;
//     price: number;
// }

// export interface TrendingTokensResponse {
//     updateUnixTime: number;
//     updateTime: string;
//     tokens: TrendingToken[];
//     total: number;
// }

export interface SerperNewsResponse {
    searchParameters: SearchParameters;
    news: News[];
    credits: number;
}

export interface SearchParameters {
    q: string;
    type: string;
    tbs: string;
    engine: string;
}

export interface News {
    title: string;
    link: string;
    snippet: string;
    date: string;
    source: string;
    imageUrl: string;
    position: number;
}

export async function fetchSerperNews(
    q: string,
    apiKey?: string,
    cache?: {
        get: (key: string) => any;
        set: (key: string, value: any) => void;
    },
    limit: number = 20
): Promise<SerperNewsResponse> {
    try {
        // Check cache first if provided
        if (cache) {
            const cacheKey = `cNews_${limit}`;
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                console.log(`Returning cached news data`);
                return cachedData;
            }
        }

        const query = JSON.stringify({
            q: q,
            tbs: "qdr:d",
        });
        const config = {
            method: "POST",
            headers: {
                "X-API-KEY": "b0c75fc1c24744969d7f06e59414eaef43baf8e0",
                "Content-Type": "application/json",
            },
            body: query,
        };
        const response = await fetch(`https://google.serper.dev/news`, config);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
        }

        const data = await response.json();
        if (!data.news) {
            throw new Error("Failed to fetch latest news data");
        }

        // Cache the response if cache is provided
        if (cache) {
            const cacheKey = `cNews_${limit}`;
            cache.set(cacheKey, data.data);
        }

        return data;
    } catch (error) {
        console.error("Error fetching news data:", error);
        throw error;
    }
}
