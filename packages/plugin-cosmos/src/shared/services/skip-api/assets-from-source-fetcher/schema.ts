import { z } from "zod";

export const skipApiAssetsFromSourceParamsSchema = z.object({
    source_asset_denom: z.string(),
    source_asset_chain_id: z.string(),
    allow_multi_tx: z.boolean(),
});

export const skipApiAssetsFromSourceResponseAssetSchema = z.object({
    denom: z.string(),
    chain_id: z.string(),
    origin_denom: z.string(),
    origin_chain_id: z.string(),
    trace: z.string(),
    symbol: z.string().optional(),
    name: z.string().optional(),
    logo_uri: z.string().optional(),
    decimals: z.number().optional(),
    recommended_symbol: z.string().optional(),
});

export const skipApiAssetsFromSourceResponseSchema = z.object({
    dest_assets: z.record(
        z.string(),
        z.object({
            assets: z.array(skipApiAssetsFromSourceResponseAssetSchema),
        })
    ),
});
