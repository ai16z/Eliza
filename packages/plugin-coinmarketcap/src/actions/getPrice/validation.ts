import { z } from "zod";
import type { GetPriceContent } from "./types";

export const GetPriceSchema = z.object({
    symbol: z.string(),
    currency: z.string().default("USD"),
});

export function isGetPriceContent(
    content: GetPriceContent
): content is GetPriceContent {
    return (
        typeof content.symbol === "string" &&
        typeof content.currency === "string"
    );
}
