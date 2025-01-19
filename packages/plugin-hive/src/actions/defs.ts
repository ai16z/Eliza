import { z } from "zod";

// Common types
export const AssetAmountSchema = z.string().regex(/^\d+\.?\d*\s(HIVE|HBD)$/, {
    message: "Amount must be in format '0.000 HIVE' or '0.000 HBD'",
});

export type AssetAmount = z.infer<typeof AssetAmountSchema>;

// Transfer action definitions
export const TransferContentSchema = z.object({
    to: z.string().min(1, "Recipient is required"),
    amount: AssetAmountSchema,
    memo: z.string().optional(),
});

export type TransferContent = z.infer<typeof TransferContentSchema>;

export const TRANSFER_ACTIONS = [
    "SEND_TOKEN",
    "TRANSFER_TOKEN",
    "SEND_HIVE",
    "SEND_HBD",
    "PAY",
] as const;

// Post/Comment action definitions
export const PostContentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    parentAuthor: z.string().optional(),
    parentPermlink: z.string().optional(),
    permlink: z.string().optional(),
    tags: z.array(z.string()).optional(),
    beneficiaries: z
        .array(
            z.object({
                account: z.string(),
                weight: z.number().min(1).max(10000),
            })
        )
        .optional(),
});

export type PostContent = z.infer<typeof PostContentSchema>;

export const POST_ACTIONS = [
    "CREATE_POST",
    "CREATE_COMMENT",
    "POST_CONTENT",
] as const;

// Vote action definitions
export const VoteContentSchema = z.object({
    author: z.string().min(1, "Author is required"),
    permlink: z.string().min(1, "Permlink is required"),
    weight: z.number().min(-10000).max(10000),
});

export type VoteContent = z.infer<typeof VoteContentSchema>;

export const VOTE_ACTIONS = ["VOTE", "UPVOTE", "DOWNVOTE"] as const;

// Follow action definitions
export const FollowContentSchema = z.object({
    account: z.string().min(1, "Account to follow is required"),
    type: z.enum(["blog", "ignore"]).default("blog"),
});

export type FollowContent = z.infer<typeof FollowContentSchema>;

export const FOLLOW_ACTIONS = ["FOLLOW", "UNFOLLOW", "MUTE", "UNMUTE"] as const;

// Power up/down action definitions
export const PowerOperationSchema = z.object({
    amount: AssetAmountSchema,
    to: z.string().optional(), // If not provided, power up/down for self
});

export type PowerOperation = z.infer<typeof PowerOperationSchema>;

export const POWER_ACTIONS = [
    "POWER_UP",
    "POWER_DOWN",
    "DELEGATE_POWER",
] as const;

// Market order definitions
export const MarketOrderSchema = z.object({
    amount: AssetAmountSchema,
    exchangeRate: z.number().positive(),
    orderType: z.enum(["limit", "market"]),
    expiration: z.number().optional(), // Unix timestamp
});

export type MarketOrder = z.infer<typeof MarketOrderSchema>;

export const MARKET_ACTIONS = [
    "CREATE_ORDER",
    "CANCEL_ORDER",
    "CONVERT_HBD",
] as const;

// Witness action definitions
export const WitnessUpdateSchema = z.object({
    blockSigningKey: z.string(),
    url: z.string().url(),
    fee: AssetAmountSchema,
    accountCreationFee: AssetAmountSchema,
    maximumBlockSize: z.number(),
    hbdInterestRate: z.number(),
});

export type WitnessUpdate = z.infer<typeof WitnessUpdateSchema>;

export const WITNESS_ACTIONS = ["UPDATE_WITNESS", "VOTE_WITNESS"] as const;

// Combine all action types
export const ActionTypes = [
    ...TRANSFER_ACTIONS,
    ...POST_ACTIONS,
    ...VOTE_ACTIONS,
    ...FOLLOW_ACTIONS,
    ...POWER_ACTIONS,
    ...MARKET_ACTIONS,
    ...WITNESS_ACTIONS,
] as const;

export type HiveActionType = (typeof ActionTypes)[number];

// Generic action content type
export type HiveActionContent =
    | TransferContent
    | PostContent
    | VoteContent
    | FollowContent
    | PowerOperation
    | MarketOrder
    | WitnessUpdate;
