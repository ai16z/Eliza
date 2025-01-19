import { z } from "zod";
import {
    skipApiAssetsFromSourceParamsSchema,
    skipApiAssetsFromSourceResponseAssetSchema,
    skipApiAssetsFromSourceResponseSchema,
} from "./schema";

export type SkipApiAssetsFromSourceParams = z.infer<
    typeof skipApiAssetsFromSourceParamsSchema
>;
export type SkipApiAssetsFromSourceResponseAsset = z.infer<
    typeof skipApiAssetsFromSourceResponseAssetSchema
>;
export type SkipApiAssetsFromSourceResponse = z.infer<
    typeof skipApiAssetsFromSourceResponseSchema
>;
