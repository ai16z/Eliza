export { listingTemplates } from "./nft-listing";
export { floorSweepTemplates } from "./floor-sweep";
export { marketStatsTemplates } from "./market-stats";
export { socialAnalyticsTemplates } from "./social-analytics";

export const listNftTemplate = `Given the recent messages and NFT information below:

{{recentMessages}}

{{nftInfo}}

Extract the following information about the requested NFT listing:
- Collection address: Must be a valid Ethereum address starting with "0x"
- Token ID: Must be a valid token ID number
- Price in ETH: Must be a string representing the amount in ETH (only number without coin symbol, e.g., "1.5")
- Marketplace: Must be "ikigailabs"

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    "collectionAddress": string,
    "tokenId": string,
    "price": string,
    "marketplace": "ikigailabs"
}
\`\`\`
`;

export const floorSweepTemplate = `Given the recent messages and NFT information below:

{{recentMessages}}

{{nftInfo}}

Extract the following information about the requested floor sweep:
- Collection address: Must be a valid Ethereum address starting with "0x"
- Quantity: Number of NFTs to sweep
- Maximum price per NFT in ETH: Must be a string representing the amount in ETH
- Sort by: Optional sorting criteria (e.g., "price_asc", "rarity_desc")

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    "collectionAddress": string,
    "quantity": number,
    "maxPricePerNft": string,
    "sortBy": "price_asc" | "price_desc" | "rarity_asc" | "rarity_desc" | null
}
\`\`\`
`;

export const marketStatsTemplate = `Given the recent messages and NFT information below:

{{recentMessages}}

{{nftInfo}}

Extract the following information about the requested market stats:
- Collection address: Must be a valid Ethereum address starting with "0x"
- Time period: Must be one of ["1h", "24h", "7d", "30d", "all"]
- Stat type: Must be one of ["floor", "volume", "sales", "holders"]

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    "collectionAddress": string,
    "timePeriod": "1h" | "24h" | "7d" | "30d" | "all",
    "statType": "floor" | "volume" | "sales" | "holders"
}
\`\`\`
`;

export const socialAnalyticsTemplate = `Given the recent messages and NFT information below:

{{recentMessages}}

{{nftInfo}}

Extract the following information about the requested social analytics:
- Collection address: Must be a valid Ethereum address starting with "0x"
- Platform: Must be one of ["twitter", "discord", "telegram", "all"]
- Metric type: Must be one of ["sentiment", "engagement", "growth", "mentions"]
- Time period: Must be one of ["1h", "24h", "7d", "30d"]

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    "collectionAddress": string,
    "platform": "twitter" | "discord" | "telegram" | "all",
    "metricType": "sentiment" | "engagement" | "growth" | "mentions",
    "timePeriod": "1h" | "24h" | "7d" | "30d"
}
\`\`\`
`;
