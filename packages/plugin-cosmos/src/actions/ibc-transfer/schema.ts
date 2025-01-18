import { z } from "zod";

export const IBCTransferParamsSchema = z.object({
    chainName: z.string(),
    symbol: z.string(),
    amount: z.string().regex(/^\d+$/, "Amount must be a numeric string"),
    toAddress: z.string().regex(/^[a-z0-9]+$/, "Invalid bech32 address format"),
    targetChainName: z.string(),
});
