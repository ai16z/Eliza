import { z } from "zod";
import { getAddress, isAddress } from "ethers/lib/utils";

// Enhanced NFT Collection Schema with strict validation
export const NFTCollectionSchema = z.object({
    address: z.string().refine((val) => isAddress(val), {
        message: "Invalid Ethereum address",
    }),
    name: z.string().min(1).max(100),
    symbol: z.string().min(1).max(10).optional(),
    description: z.string().max(5000).optional(),
    imageUrl: z.string().url().optional(),
    externalUrl: z.string().url().optional(),
    twitterUsername: z
        .string()
        .regex(/^[A-Za-z0-9_]{1,15}$/)
        .optional(),
    discordUrl: z.string().url().optional(),
    verified: z.boolean().default(false),
    featured: z.boolean().default(false),
    createdAt: z.string().datetime().optional(),
    floorPrice: z.number().min(0).optional(),
    volume24h: z.number().min(0).optional(),
    marketCap: z.number().min(0).optional(),
    holders: z.number().int().min(0).optional(),
    totalSupply: z.number().int().min(0).optional(),
    twitterFollowers: z.number().int().min(0).optional(),
    discordMembers: z.number().int().min(0).optional(),
    supportedMarketplaces: z.array(z.string()).optional(),
    hasRoyalties: z.boolean().optional(),
    royaltyPercentage: z.number().min(0).max(100).optional(),
    traits: z.record(z.string(), z.array(z.string())).optional(),
    categories: z.array(z.string()).optional(),
    lastUpdate: z.string().datetime().optional(),
});

// Market Data Schema
export const MarketDataSchema = z.object({
    floorPrice: z.number().min(0),
    bestOffer: z.number().min(0).optional(),
    volume24h: z.number().min(0),
    volume7d: z.number().min(0).optional(),
    volume30d: z.number().min(0).optional(),
    marketCap: z.number().min(0),
    holders: z.number().int().min(0),
    sales24h: z.number().int().min(0).optional(),
    averagePrice24h: z.number().min(0).optional(),
    lastUpdate: z.string().datetime(),
});

// Social Metrics Schema
export const SocialMetricsSchema = z.object({
    twitterFollowers: z.number().int().min(0).optional(),
    twitterEngagement: z.number().min(0).optional(),
    discordMembers: z.number().int().min(0).optional(),
    discordActive: z.number().int().min(0).optional(),
    telegramMembers: z.number().int().min(0).optional(),
    telegramActive: z.number().int().min(0).optional(),
    lastUpdate: z.string().datetime(),
});

// Validation Functions
export function validateCollection(data: unknown) {
    return NFTCollectionSchema.parse(data);
}

export function validateMarketData(data: unknown) {
    return MarketDataSchema.parse(data);
}

export function validateSocialMetrics(data: unknown) {
    return SocialMetricsSchema.parse(data);
}

// Type Inference
export type NFTCollection = z.infer<typeof NFTCollectionSchema>;
export type MarketData = z.infer<typeof MarketDataSchema>;
export type SocialMetrics = z.infer<typeof SocialMetricsSchema>;

// Utility Functions
export function isValidEthereumAddress(address: string): boolean {
    return isAddress(address);
}

export function normalizeAddress(address: string): string {
    try {
        return getAddress(address);
    } catch {
        throw new Error("Invalid Ethereum address");
    }
}

export function validateTokenId(
    tokenId: string,
    collection: NFTCollection
): boolean {
    const numericTokenId = BigInt(tokenId);
    if (collection.totalSupply) {
        return (
            numericTokenId >= 0n &&
            numericTokenId < BigInt(collection.totalSupply)
        );
    }
    return numericTokenId >= 0n;
}

export function validatePriceRange(price: number): boolean {
    return price >= 0 && price <= 1000000; // Reasonable price range in ETH
}

export function sanitizeCollectionData(data: unknown): Partial<NFTCollection> {
    try {
        return NFTCollectionSchema.parse(data);
    } catch {
        // Return only the valid fields
        const partial = {};
        const validFields = Object.entries(
            data as Record<string, unknown>
        ).filter(([key, value]) => {
            try {
                NFTCollectionSchema.shape[key].parse(value);
                return true;
            } catch {
                return false;
            }
        });

        for (const [key, value] of validFields) {
            partial[key] = value;
        }

        return partial;
    }
}
