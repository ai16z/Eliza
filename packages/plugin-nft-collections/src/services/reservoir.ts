import pRetry from "p-retry";
// import pQueue from "p-queue";
import { PerformanceMonitor } from "../utils/performance";
import {
    ErrorHandler,
    NFTErrorFactory,
    ErrorType,
    ErrorCode,
} from "../utils/error-handler";
import type { MemoryCacheManager } from "./cache-manager";
import type { RateLimiter } from "./rate-limiter";
import type { MarketStats, NFTCollection } from "../types";
import type { IAgentRuntime } from "@elizaos/core";

interface ReservoirServiceConfig {
    cacheManager?: MemoryCacheManager;
    rateLimiter?: RateLimiter;
    maxConcurrent?: number;
    maxRetries?: number;
    batchSize?: number;
}

export class ReservoirService {
    private cacheManager?: MemoryCacheManager;
    private rateLimiter?: RateLimiter;
    // private queue: pQueue;
    private maxRetries: number;
    private batchSize: number;
    private performanceMonitor: PerformanceMonitor;
    private errorHandler: ErrorHandler;

    constructor(config: ReservoirServiceConfig = {}) {
        this.cacheManager = config.cacheManager;
        this.rateLimiter = config.rateLimiter;

        // this.queue = new pQueue({ concurrency: config.maxConcurrent || 5 });
        this.maxRetries = config.maxRetries || 3;
        this.batchSize = config.batchSize || 20;
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.errorHandler = ErrorHandler.getInstance();
    }

    async makeRequest<T>(
        endpoint: string,
        params: Record<string, any> = {},
        priority = 0,
        runtime: IAgentRuntime
    ): Promise<T> {
        const endOperation = this.performanceMonitor.startOperation(
            "makeRequest",
            {
                endpoint,
                params,
                priority,
            }
        );

        try {
            const cacheKey = `reservoir:${endpoint}:${JSON.stringify(params)}`;

            // Check cache first
            if (this.cacheManager) {
                const cached = await this.cacheManager.get<T>(cacheKey);
                if (cached) {
                    endOperation();
                    return cached;
                }
            }

            // Check rate limit
            if (this.rateLimiter) {
                await this.rateLimiter.consume("reservoir", 1);
            }
            const reservoirApiKey = runtime.getSetting("RESERVOIR_API_KEY");

            // Make the request with retries
            const result = await pRetry(
                async () => {
                    const response = await fetch(
                        `https://api.reservoir.tools${endpoint}?${new URLSearchParams(
                            params
                        ).toString()}`,
                        {
                            headers: {
                                "x-api-key": reservoirApiKey,
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error(
                            `Reservoir API error: ${response.status}`
                        );
                    }

                    return response.json();
                },
                {
                    retries: this.maxRetries,
                    onFailedAttempt: (error) => {
                        console.error(
                            `Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`
                        );
                    },
                }
            );

            // Cache the result
            if (this.cacheManager) {
                await this.cacheManager.set(cacheKey, result);
            }

            endOperation();
            return result;
        } catch (error) {
            this.performanceMonitor.recordMetric({
                operation: "makeRequest",
                duration: 0,
                success: false,
                metadata: {
                    error: error.message,
                    endpoint,
                    params,
                },
            });

            const nftError = NFTErrorFactory.create(
                ErrorType.API,
                ErrorCode.API_ERROR,
                `API request failed: ${endpoint}`,
                { originalError: error },
                true
            );
            this.errorHandler.handleError(nftError);
            throw error;
        }
    }

    async getTopCollections(
        runtime: IAgentRuntime,
        limit = 10
    ): Promise<NFTCollection[]> {
        const endOperation = this.performanceMonitor.startOperation(
            "getTopCollections",
            { limit }
        );

        try {
            const batchSize = 20; // Optimal batch size for Reservoir API
            const batches = Math.ceil(limit / batchSize);
            const promises = [];

            for (let i = 0; i < batches; i++) {
                const offset = i * batchSize;
                const currentLimit = Math.min(batchSize, limit - offset);

                promises.push(
                    this.makeRequest<any>(
                        `/collections/v6`,
                        {
                            limit: currentLimit,
                            offset,
                            sortBy: "1DayVolume",
                        },
                        1,
                        runtime
                    )
                );
            }

            const results = await Promise.all(promises);
            const collections = results.flatMap((data) => data.collections);

            const mappedCollections = collections
                .slice(0, limit)
                .map((collection: any) => ({
                    address: collection.id,
                    name: collection.name,
                    symbol: collection.symbol,
                    description: collection.description,
                    imageUrl: collection.image,
                    externalUrl: collection.externalUrl,
                    twitterUsername: collection.twitterUsername,
                    discordUrl: collection.discordUrl,
                    verified:
                        collection.openseaVerificationStatus === "verified",
                    floorPrice: collection.floorAsk?.price?.amount?.native || 0,
                    volume24h: collection.volume24h || 0,
                    marketCap: collection.marketCap || 0,
                    totalSupply: collection.tokenCount || 0,
                    holders: collection.ownerCount || 0,
                    lastUpdate: new Date().toISOString(),
                }));

            endOperation(); // Record successful completion
            return mappedCollections;
        } catch (error) {
            this.performanceMonitor.recordMetric({
                operation: "getTopCollections",
                duration: 0,
                success: false,
                metadata: { error: error.message },
            });

            const nftError = NFTErrorFactory.create(
                ErrorType.API,
                ErrorCode.API_ERROR,
                "Failed to fetch top collections",
                { originalError: error },
                true
            );
            this.errorHandler.handleError(nftError);
            throw error;
        }
    }

    async getMarketStats(): Promise<MarketStats> {
        return Promise.resolve({} as MarketStats);
    }

    async getCollectionActivity(_collectionAddress: string): Promise<any> {
        return Promise.resolve(null);
    }

    async getCollectionTokens(_collectionAddress: string): Promise<any> {
        return Promise.resolve(null);
    }

    async getCollectionAttributes(_collectionAddress: string): Promise<any> {
        return Promise.resolve(null);
    }

    async getFloorListings(_options: {
        collection: string;
        limit: number;
        sortBy: "price" | "rarity";
    }): Promise<
        Array<{
            tokenId: string;
            price: number;
            seller: string;
            marketplace: string;
        }>
    > {
        return Promise.resolve([]);
    }

    async executeBuy(_options: {
        listings: Array<{
            tokenId: string;
            price: number;
            seller: string;
            marketplace: string;
        }>;
        taker: string;
    }): Promise<{
        path: string;
        steps: Array<{
            action: string;
            status: string;
        }>;
    }> {
        return Promise.resolve({
            path: "",
            steps: [],
        });
    }

    async createListing(_options: {
        tokenId: string;
        collectionAddress: string;
        price: number;
        expirationTime?: number; // Unix timestamp
        marketplace: "ikigailabs";
        currency?: string; // Default to ETH
        quantity?: number; // Default to 1 for ERC721
    }): Promise<{
        listingId: string;
        status: string;
        transactionHash?: string;
        marketplaceUrl: string;
    }> {
        return Promise.resolve({
            listingId: "",
            status: "",
            transactionHash: undefined,
            marketplaceUrl: "",
        });
    }

    async cancelListing(_options: {
        listingId: string;
        marketplace: "ikigailabs";
    }): Promise<{
        status: string;
        transactionHash?: string;
    }> {
        return Promise.resolve({
            status: "",
            transactionHash: undefined,
        });
    }

    async getOwnedNFTs(_owner: string): Promise<
        Array<{
            tokenId: string;
            collectionAddress: string;
            name: string;
            imageUrl?: string;
            attributes?: Record<string, string>;
        }>
    > {
        return Promise.resolve([]);
    }
}
