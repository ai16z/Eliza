import { z } from "zod";
import { IBCTransferParamsSchema } from "./schema";

export type IBCTransferActionParams = z.infer<typeof IBCTransferParamsSchema>;
