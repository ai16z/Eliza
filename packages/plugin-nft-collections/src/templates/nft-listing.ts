import type { NFTCollection } from "../types";

export const listingTemplates = {
    successfulListing: ({
        collection,
        tokenId,
        purchasePrice,
        listingPrice,
        isPriceAutomatic,
        status,
        marketplaceUrl,
        transactionHash,
    }: {
        collection: NFTCollection | string;
        tokenId: string;
        purchasePrice: number;
        listingPrice: number;
        isPriceAutomatic: boolean;
        status: string;
        marketplaceUrl: string;
        transactionHash?: string;
    }) => `Successfully created listing on ikigailabs.xyz:
• Collection: ${typeof collection === "string" ? collection : collection.name} (${typeof collection === "string" ? collection : collection.address})
• Token ID: ${tokenId}
• Purchase Price: ${purchasePrice.toFixed(1)} ETH
• Listing Price: ${listingPrice.toFixed(1)} ETH (${isPriceAutomatic ? "2x purchase price" : "user specified"})
• Status: ${status}
• Listing URL: ${marketplaceUrl}${transactionHash ? `\n• Transaction: ${transactionHash}` : ""}`,

    listingFailed: (error: string) => `Failed to list NFT: ${error}`,

    missingDetails: () => "Please provide the collection address and token ID",

    notOwned: () => "You don't own this NFT",

    noPurchaseHistory: () =>
        "Could not find purchase history for this NFT. Please specify a listing price.",

    noPurchasePrice: () =>
        "Could not determine purchase price. Please specify a listing price.",

    listingInProgress: ({
        collection,
        tokenId,
    }: {
        collection: NFTCollection | string;
        tokenId: string;
    }) =>
        `Creating listing for Token #${tokenId} from collection ${typeof collection === "string" ? collection : collection.name}...`,

    listingCancelled: ({
        listingId,
        transactionHash,
    }: {
        listingId: string;
        transactionHash?: string;
    }) =>
        `Successfully cancelled listing ${listingId}${transactionHash ? `\nTransaction: ${transactionHash}` : ""}`,
};
