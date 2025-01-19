import { z } from "zod";

export const NFTCollectionSchema = z.object({
    address: z.string(),
    name: z.string(),
    symbol: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    externalUrl: z.string().optional(),
    twitterUsername: z.string().optional(),
    discordUrl: z.string().optional(),
    verified: z.boolean().default(true),
    featured: z.boolean().default(false),
    createdAt: z.string().optional(),
    // Market data
    floorPrice: z.number().optional(),
    volume24h: z.number().optional(),
    marketCap: z.number().optional(),
    holders: z.number().optional(),
    totalSupply: z.number().optional(),
    // Social metrics
    twitterFollowers: z.number().optional(),
    discordMembers: z.number().optional(),
    // Trading features
    supportedMarketplaces: z.array(z.string()).optional(),
    hasRoyalties: z.boolean().optional(),
    royaltyPercentage: z.number().optional(),
    // Metadata
    traits: z.record(z.string(), z.array(z.string())).optional(),
    categories: z.array(z.string()).optional(),
    lastUpdate: z.string().optional(),
});

export type NFTCollection = z.infer<typeof NFTCollectionSchema>;

/**
 * Curated list of NFT collections featured on ikigailabs.xyz
 * This list is used to prioritize and enhance functionality for these collections
 */
export const CURATED_COLLECTIONS: NFTCollection[] = [
    {
        address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
        name: "Bored Ape Yacht Club",
        symbol: "BAYC",
        description:
            "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs.",
        verified: true,
        featured: true,
        twitterUsername: "BoredApeYC",
        discordUrl: "https://discord.gg/3P5K3dzgdB",
    },
    // Add more collections here...
];

/**
 * Map of collection addresses to their metadata for quick lookup
 */
export const COLLECTIONS_MAP = new Map<string, NFTCollection>(
    CURATED_COLLECTIONS.map((collection) => [
        collection.address.toLowerCase(),
        collection,
    ])
);

/**
 * Check if a collection address is in our curated list
 */
export function isCuratedCollection(address: string): boolean {
    return COLLECTIONS_MAP.has(address.toLowerCase());
}

/**
 * Get collection metadata if it exists in our curated list
 */
export function getCuratedCollection(
    address: string
): NFTCollection | undefined {
    return COLLECTIONS_MAP.get(address.toLowerCase());
}

/**
 * Get all curated collection addresses
 */
export function getCuratedAddresses(): string[] {
    return CURATED_COLLECTIONS.map((collection) =>
        collection.address.toLowerCase()
    );
}

/**
 * Get featured collection addresses
 */
export function getFeaturedAddresses(): string[] {
    return CURATED_COLLECTIONS.filter((collection) => collection.featured).map(
        (collection) => collection.address.toLowerCase()
    );
}

/**
 * Get verified collection addresses
 */
export function getVerifiedAddresses(): string[] {
    return CURATED_COLLECTIONS.filter((collection) => collection.verified).map(
        (collection) => collection.address.toLowerCase()
    );
}
