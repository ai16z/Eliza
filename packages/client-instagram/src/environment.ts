import {
    type IAgentRuntime,
    parseBooleanFromText,
} from "@elizaos/core";
import { z } from "zod";

export const DEFAULT_POST_INTERVAL_MIN = 60;
export const DEFAULT_POST_INTERVAL_MAX = 120;
export const DEFAULT_ACTION_INTERVAL = 5;
export const DEFAULT_MAX_ACTIONS = 1;

// Define validation schemas for Instagram usernames and other fields
const instagramUsernameSchema = z
    .string()
    .min(1, "An Instagram Username must be at least 1 character long")
    .max(30, "An Instagram Username cannot exceed 30 characters")
    .refine((username) => {
        // Instagram usernames can contain letters, numbers, periods, and underscores
        return /^[A-Za-z0-9._]+$/.test(username);
    }, "An Instagram Username can only contain letters, numbers, periods, and underscores");

/**
 * Environment configuration schema for Instagram client
 */
export const instagramEnvSchema = z.object({
    INSTAGRAM_DRY_RUN: z.boolean(),
    INSTAGRAM_USERNAME: instagramUsernameSchema,
    INSTAGRAM_PASSWORD: z.string().min(1, "Instagram password is required"),

    // Instagram API credentials
    INSTAGRAM_APP_ID: z.string().min(1, "Instagram App ID is required"),
    INSTAGRAM_APP_SECRET: z.string().min(1, "Instagram App Secret is required"),

    // Optional Business Account ID for additional features
    INSTAGRAM_BUSINESS_ACCOUNT_ID: z.string().optional(),

    // Posting configuration
    INSTAGRAM_POST_INTERVAL_MIN: z.number().int().default(DEFAULT_POST_INTERVAL_MIN),
    INSTAGRAM_POST_INTERVAL_MAX: z.number().int().default(DEFAULT_POST_INTERVAL_MAX),

    // Action processing configuration
    INSTAGRAM_ENABLE_ACTION_PROCESSING: z.boolean().default(false),
    INSTAGRAM_ACTION_INTERVAL: z.number().int().default(DEFAULT_ACTION_INTERVAL),
    INSTAGRAM_MAX_ACTIONS: z.number().int().default(DEFAULT_MAX_ACTIONS),
});

export type InstagramConfig = z.infer<typeof instagramEnvSchema>;

/**
 * Validates and constructs an InstagramConfig object using zod,
 * taking values from the IAgentRuntime or process.env as needed.
 */
export async function validateInstagramConfig(
    runtime: IAgentRuntime
): Promise<InstagramConfig> {
    try {
        const instagramConfig = {
            INSTAGRAM_DRY_RUN: parseBooleanFromText(
                runtime.getSetting("INSTAGRAM_DRY_RUN") ||
                    process.env.INSTAGRAM_DRY_RUN
            ) ?? false,

            INSTAGRAM_USERNAME: runtime.getSetting("INSTAGRAM_USERNAME") ||
                process.env.INSTAGRAM_USERNAME,

            INSTAGRAM_PASSWORD: runtime.getSetting("INSTAGRAM_PASSWORD") ||
                process.env.INSTAGRAM_PASSWORD,

            INSTAGRAM_APP_ID: runtime.getSetting("INSTAGRAM_APP_ID") ||
                process.env.INSTAGRAM_APP_ID,

            INSTAGRAM_APP_SECRET: runtime.getSetting("INSTAGRAM_APP_SECRET") ||
                process.env.INSTAGRAM_APP_SECRET,

            INSTAGRAM_BUSINESS_ACCOUNT_ID: runtime.getSetting("INSTAGRAM_BUSINESS_ACCOUNT_ID") ||
                process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,

            INSTAGRAM_POST_INTERVAL_MIN: Number.parseInt(
                runtime.getSetting("INSTAGRAM_POST_INTERVAL_MIN") ||
                    process.env.INSTAGRAM_POST_INTERVAL_MIN ||
                    DEFAULT_POST_INTERVAL_MIN.toString(),
                10
            ),

            INSTAGRAM_POST_INTERVAL_MAX: Number.parseInt(
                runtime.getSetting("INSTAGRAM_POST_INTERVAL_MAX") ||
                    process.env.INSTAGRAM_POST_INTERVAL_MAX ||
                    DEFAULT_POST_INTERVAL_MAX.toString(),
                10
            ),

            INSTAGRAM_ENABLE_ACTION_PROCESSING: parseBooleanFromText(
                runtime.getSetting("INSTAGRAM_ENABLE_ACTION_PROCESSING") ||
                    process.env.INSTAGRAM_ENABLE_ACTION_PROCESSING
            ) ?? false,

            INSTAGRAM_ACTION_INTERVAL: Number.parseInt(
                runtime.getSetting("INSTAGRAM_ACTION_INTERVAL") ||
                    process.env.INSTAGRAM_ACTION_INTERVAL ||
                    DEFAULT_ACTION_INTERVAL.toString(),
                10
            ),

            INSTAGRAM_MAX_ACTIONS: Number.parseInt(
                runtime.getSetting("MAX_ACTIONS_PROCESSING") ||
                    process.env.MAX_ACTIONS_PROCESSING ||
                    DEFAULT_MAX_ACTIONS.toString(),
                10
            ),
        };

        return instagramEnvSchema.parse(instagramConfig);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Instagram configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}