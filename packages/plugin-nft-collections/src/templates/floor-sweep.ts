import type { NFTCollection } from "../types";

export const floorSweepTemplates = {
    successfulSweep: ({
        collection,
        quantity,
        totalPrice,
        averagePrice,
        path,
        steps,
    }: {
        collection: NFTCollection | string;
        quantity: number;
        totalPrice: number;
        averagePrice: number;
        path: string;
        steps: Array<{ action: string; status: string }>;
    }) => `Successfully swept ${quantity} NFTs from collection ${typeof collection === "string" ? collection : collection.name}:
• Total Cost: ${totalPrice} ETH
• Average Price: ${averagePrice.toFixed(4)} ETH
• Transaction Path: ${path}
• Status: ${steps.map((step) => `${step.action} - ${step.status}`).join(", ")}`,

    sweepFailed: (error: string) => `Failed to sweep floor NFTs: ${error}`,

    missingCollection: () => "No valid collection address found in message",

    insufficientListings: (available: number, requested: number) =>
        `Only ${available} NFTs available at floor price (requested ${requested})`,

    sweepInProgress: ({
        collection,
        quantity,
    }: {
        collection: NFTCollection | string;
        quantity: number;
    }) =>
        `Sweeping ${quantity} NFTs from collection ${typeof collection === "string" ? collection : collection.name}...`,

    floorPriceUpdate: ({
        collection,
        floorPrice,
        change24h,
    }: {
        collection: NFTCollection | string;
        floorPrice: number;
        change24h: number;
    }) => `Current floor price for ${typeof collection === "string" ? collection : collection.name}:
• Price: ${floorPrice} ETH
• 24h Change: ${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}%`,

    marketplaceBreakdown: (
        marketplaces: Array<{
            name: string;
            floorPrice: number;
            availableTokens: number;
        }>
    ) => `Floor prices across marketplaces:
${marketplaces
    .sort((a, b) => a.floorPrice - b.floorPrice)
    .map(
        (m) =>
            `• ${m.name}: ${m.floorPrice} ETH (${m.availableTokens} available)`
    )
    .join("\n")}`,
};
