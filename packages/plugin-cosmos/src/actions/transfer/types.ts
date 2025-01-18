import type { z } from "zod";
import type { cosmosTransferParamsSchema } from "./schema";

export type CosmosTransferParams = z.infer<typeof cosmosTransferParamsSchema>;
