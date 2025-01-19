import { type Client, type IAgentRuntime, elizaLogger } from "@elizaos/core";
import { FarcasterClient } from "./client";
import { FarcasterPostManager } from "./post";
import { FarcasterInteractionManager } from "./interactions";
import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import { validateFarcasterConfig, type FarcasterConfig } from "./environment";

/**
 * A manager that orchestrates all Farcaster operations:
 * - client: base operations (Neynar client, hub connection, etc.)
 * - posts: autonomous posting logic
 * - interactions: handling mentions, replies, likes, etc.
 */
class FarcasterManager {
    client: FarcasterClient;
    posts: FarcasterPostManager;
    interactions: FarcasterInteractionManager;
    private signerUuid: string;

    constructor(runtime: IAgentRuntime, farcasterConfig: FarcasterConfig) {
        const cache = new Map<string, any>();
        this.signerUuid = runtime.getSetting("FARCASTER_NEYNAR_SIGNER_UUID")!;

        const neynarConfig = new Configuration({
            apiKey: runtime.getSetting("FARCASTER_NEYNAR_API_KEY")!,
        });

        const neynarClient = new NeynarAPIClient(neynarConfig);

        this.client = new FarcasterClient({
            runtime,
            ssl: true,
            url: runtime.getSetting("FARCASTER_HUB_URL") ?? "hub.pinata.cloud",
            neynar: neynarClient,
            signerUuid: this.signerUuid,
            cache,
            farcasterConfig,
        });

        elizaLogger.success("Farcaster Neynar client initialized.");

        this.posts = new FarcasterPostManager(
            this.client,
            runtime,
            this.signerUuid,
            cache
        );

        this.interactions = new FarcasterInteractionManager(
            this.client,
            runtime,
            this.signerUuid,
            cache
        );
    }

    async start() {
        await Promise.all([this.posts.start(), this.interactions.start()]);
    }

    async stop() {
        await Promise.all([this.posts.stop(), this.interactions.stop()]);
    }
}

export const FarcasterClientInterface: Client = {
    async start(runtime: IAgentRuntime) {
        const farcasterConfig = await validateFarcasterConfig(runtime);

        elizaLogger.log("Farcaster client started");

        const manager = new FarcasterManager(runtime, farcasterConfig);

        // Start all services
        await manager.start();
        runtime.clients.farcaster = manager;
        return manager;
    },

    async stop(runtime: IAgentRuntime) {
        try {
            // stop it
            elizaLogger.log("Stopping farcaster client", runtime.agentId);
            if (runtime.clients.farcaster) {
                await runtime.clients.farcaster.stop();
            }
        } catch (e) {
            elizaLogger.error("client-farcaster interface stop error", e);
        }
    },
};

export default FarcasterClientInterface;
