// src/lib/auth.ts
import { type IAgentRuntime, elizaLogger } from "@elizaos/core";
import { IgLoginTwoFactorRequiredError } from "instagram-private-api";
import type { InstagramConfig } from "../environment";
import type { InstagramState } from "../types";
import { fetchProfile } from "./profile";
import { createInitialState, getIgClient } from "./state";

/**
 * Authenticates with Instagram
 */
async function authenticate(
    runtime: IAgentRuntime,
    config: InstagramConfig
): Promise<InstagramState> {
    const ig = getIgClient();
    const state = createInitialState();

    try {
        // Generate device ID
        ig.state.generateDevice(config.INSTAGRAM_USERNAME);

        // Attempt to load cached session
        const cachedSession =
            await runtime.cacheManager.get("instagram/session");
        if (cachedSession) {
            try {
                await ig.state.deserialize(cachedSession);
                const profile = await fetchProfile(runtime, config);
                return {
                    ...state,
                    isInitialized: true,
                    profile,
                };
            } catch {
                elizaLogger.warn(
                    `Cached session invalid, proceeding with fresh login`
                );
            }
        }

        // Proceed with fresh login
        try {
            await ig.account.login(
                config.INSTAGRAM_USERNAME,
                config.INSTAGRAM_PASSWORD
            );

            // Cache the session
            const serialized = await ig.state.serialize();
            await runtime.cacheManager.set("instagram/session", serialized);

            const profile = await fetchProfile(runtime, config);

            return {
                ...state,
                isInitialized: true,
                profile,
            };
        } catch (error) {
            if (error instanceof IgLoginTwoFactorRequiredError) {
                // Handle 2FA if needed - would need to implement 2FA code generation
                throw new Error("2FA authentication not yet implemented");
            }
            throw error;
        }
    } catch (error) {
        elizaLogger.error("Authentication failed:", error);
        throw error;
    }
}

/**
 * Sets up webhooks for real-time updates if needed
 */
async function setupWebhooks() {
    // Implement webhook setup
    // This is a placeholder for future implementation
}

/**
 * Initializes the Instagram client
 */
export async function initializeClient(
    runtime: IAgentRuntime,
    config: InstagramConfig
): Promise<InstagramState> {
    try {
        // Authenticate and get initial state
        const state = await authenticate(runtime, config);

        // Set up webhook handlers if needed
        await setupWebhooks();

        return state;
    } catch (error) {
        elizaLogger.error("Failed to initialize Instagram client:", error);
        throw error;
    }
}

// Export other authentication related functions if needed
export { authenticate, setupWebhooks };
