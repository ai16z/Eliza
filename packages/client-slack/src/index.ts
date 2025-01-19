import type { Character, Client as ElizaClient, IAgentRuntime } from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";
import { WebClient } from "@slack/web-api";
import express, { type Request } from "express";
import { EventEmitter } from "events";
import { MessageManager } from "./messages";
import { validateSlackConfig } from "./environment";
import chat_with_attachments from "./actions/chat_with_attachments";
import summarize_conversation from "./actions/summarize_conversation";
// import transcribe_media from './actions/transcribe_media';
import { channelStateProvider } from "./providers/channelState";
import { SlackService } from "./services/slack.service";

interface SlackRequest extends Request {
    rawBody?: Buffer;
}

export class SlackClient extends EventEmitter {
    private client: WebClient;
    private runtime: IAgentRuntime;
    private server: express.Application;
    private messageManager: MessageManager;
    private botUserId: string;
    private character: Character;
    private signingSecret: string;

    constructor(runtime: IAgentRuntime) {
        super();
        elizaLogger.log("🚀 Initializing SlackClient...");
        this.runtime = runtime;
        this.character = runtime.character;

        const token = runtime.getSetting("SLACK_BOT_TOKEN");
        this.signingSecret = runtime.getSetting("SLACK_SIGNING_SECRET");

        if (!token) throw new Error("SLACK_BOT_TOKEN is required");
        if (!this.signingSecret)
            throw new Error("SLACK_SIGNING_SECRET is required");

        this.client = new WebClient(token);
        this.server = express();

        this.server.use(express.raw({ type: "application/json" }));
        this.server.use((req: SlackRequest, res, next) => {
            if (req.body) {
                req.rawBody = Buffer.from(req.body);
                try {
                    req.body = JSON.parse(req.body.toString());
                } catch (error) {
                    elizaLogger.error(
                        "❌ [PARSE] Failed to parse request body:",
                        error
                    );
                }
            }
            next();
        });
    }

    private async handleEvent(event: any) {
        elizaLogger.debug("🎯 [EVENT] Processing event:", {
            type: event.type,
            user: event.user,
            channel: event.channel,
            text: event.text?.slice(0, 100),
        });

        try {
            if (event.type === "message" || event.type === "app_mention") {
                await this.messageManager.handleMessage(event);
            }
        } catch (error) {
            elizaLogger.error("❌ [EVENT] Error handling event:", error);
        }
    }

    private async verifyPermissions() {
        elizaLogger.debug("🔒 [PERMISSIONS] Verifying bot permissions...");

        try {
            // Test channel list access with all types
            const channels = await this.client.conversations.list({
                types: "public_channel,private_channel,im,mpim",
            });

            if (!channels.ok) {
                throw new Error(`Failed to list channels: ${channels.error}`);
            }

            elizaLogger.debug("📋 [PERMISSIONS] Channel access verified");

            // Test message sending (to self)
            const testMessage = await this.client.chat.postMessage({
                channel: this.botUserId,
                text: "Permission test message",
            });

            if (!testMessage.ok) {
                throw new Error(
                    `Failed to send test message: ${testMessage.error}`
                );
            }

            elizaLogger.debug("💬 [PERMISSIONS] Message sending verified");

            elizaLogger.debug("✅ [PERMISSIONS] All permissions verified");
        } catch (error: any) {
            elizaLogger.error(
                "❌ [PERMISSIONS] Permission verification failed:",
                error
            );
            elizaLogger.error(
                "Please ensure the following scopes are added to your Slack app:"
            );
            elizaLogger.error("- app_mentions:read     (for mentions)");
            elizaLogger.error("- channels:history      (for public channels)");
            elizaLogger.error("- channels:read         (for channel info)");
            elizaLogger.error("- chat:write            (for sending messages)");
            elizaLogger.error("- groups:history        (for private channels)");
            elizaLogger.error(
                "- groups:read           (for private channel info)"
            );
            elizaLogger.error("- im:history            (for DMs)");
            elizaLogger.error("- im:read               (for DM info)");
            elizaLogger.error("- im:write              (for sending DMs)");
            elizaLogger.error("- mpim:history          (for group DMs)");
            elizaLogger.error("- mpim:read             (for group DM info)");
            elizaLogger.error("- users:read            (for user info)");
            throw new Error("Permission verification failed");
        }
    }

    async start() {
        try {
            elizaLogger.log("Starting Slack client...");

            const config = await validateSlackConfig(this.runtime);

            // Initialize and register Slack service
            const slackService = new SlackService();
            await slackService.initialize(this.runtime);
            await this.runtime.registerService(slackService);

            // Get detailed bot info
            const auth = await this.client.auth.test();
            if (!auth.ok) throw new Error("Failed to authenticate with Slack");

            this.botUserId = auth.user_id as string;
            elizaLogger.debug("🤖 [INIT] Bot info:", {
                user_id: auth.user_id,
                bot_id: auth.bot_id,
                team_id: auth.team_id,
                user: auth.user,
                team: auth.team,
            });

            // Verify bot user details
            try {
                const botInfo = await this.client.users.info({
                    user: this.botUserId,
                });

                elizaLogger.debug("👤 [BOT] Bot user details:", {
                    name: botInfo.user?.name,
                    real_name: botInfo.user?.real_name,
                    is_bot: botInfo.user?.is_bot,
                    is_app_user: botInfo.user?.is_app_user,
                    status: botInfo.user?.profile?.status_text,
                });
            } catch (error) {
                elizaLogger.error(
                    "❌ [BOT] Failed to verify bot details:",
                    error
                );
            }

            // Verify permissions
            await this.verifyPermissions();

            // Initialize message manager
            this.messageManager = new MessageManager(
                this.client,
                this.runtime,
                this.botUserId
            );

            // Register actions and providers
            this.runtime.registerAction(chat_with_attachments);
            this.runtime.registerAction(summarize_conversation);
            // this.runtime.registerAction(transcribe_media);
            this.runtime.providers.push(channelStateProvider);

            // Add request logging middleware
            this.server.use((req: SlackRequest, res, next) => {
                elizaLogger.debug("🌐 [HTTP] Incoming request:", {
                    method: req.method,
                    path: req.path,
                    headers: req.headers,
                    body: req.body,
                    query: req.query,
                    timestamp: new Date().toISOString(),
                });
                next();
            });

            // Setup event handling endpoint
            this.server.post(
                "/slack/events",
                async (req: SlackRequest, res) => {
                    try {
                        elizaLogger.debug(
                            "📥 [REQUEST] Incoming Slack event:",
                            {
                                type: req.body?.type,
                                event: req.body?.event?.type,
                                challenge: req.body?.challenge,
                                raw: JSON.stringify(req.body, null, 2),
                            }
                        );

                        // Handle URL verification
                        if (req.body?.type === "url_verification") {
                            elizaLogger.debug(
                                "🔑 [VERIFICATION] Challenge received:",
                                req.body.challenge
                            );
                            return res.send(req.body.challenge);
                        }

                        // Process the event
                        if (req.body?.event) {
                            elizaLogger.debug("🎯 [EVENT] Processing event:", {
                                type: req.body.event.type,
                                user: req.body.event.user,
                                text: req.body.event.text,
                                channel: req.body.event.channel,
                                ts: req.body.event.ts,
                            });
                            await this.handleEvent(req.body.event);
                        } else {
                            elizaLogger.warn(
                                "⚠️ [EVENT] Received request without event data"
                            );
                        }

                        // Acknowledge receipt
                        res.status(200).send();
                    } catch (error) {
                        elizaLogger.error(
                            "❌ [ERROR] Error processing request:",
                            error
                        );
                        res.status(500).json({
                            error: "Internal server error",
                        });
                    }
                }
            );

            // Setup interactions endpoint
            this.server.post(
                "/slack/interactions",
                async (req: SlackRequest, res) => {
                    try {
                        elizaLogger.debug(
                            "🔄 [INTERACTION] Incoming interaction:",
                            {
                                type: req.body?.type,
                                action: req.body?.action,
                                callback_id: req.body?.callback_id,
                                raw: JSON.stringify(req.body, null, 2),
                            }
                        );

                        // Always acknowledge interaction
                        res.status(200).send();
                    } catch (error) {
                        elizaLogger.error(
                            "❌ [ERROR] Error processing interaction:",
                            error
                        );
                        res.status(500).json({
                            error: "Internal server error",
                        });
                    }
                }
            );

            // Start server
            const port = config.SLACK_SERVER_PORT;
            this.server.listen(port, () => {
                elizaLogger.success(
                    `🚀 [SERVER] Slack event server is running on port ${port}`
                );
                elizaLogger.success(
                    `✅ [INIT] Slack client successfully started for character ${this.character.name}`
                );
                elizaLogger.success(
                    `🤖 [READY] Bot user: @${auth.user} (${this.botUserId})`
                );
                elizaLogger.success(
                    `📡 [EVENTS] Listening for events at: /slack/events`
                );
                elizaLogger.success(
                    `💡 [INTERACTIONS] Listening for interactions at: /slack/interactions`
                );
                elizaLogger.success(`💡 [HELP] To interact with the bot:`);
                elizaLogger.success(
                    `   1. Direct message: Find @${auth.user} in DMs`
                );
                elizaLogger.success(
                    `   2. Channel: Mention @${auth.user} in any channel`
                );
            });
        } catch (error) {
            elizaLogger.error("❌ [INIT] Failed to start Slack client:", error);
            throw error;
        }
    }

    async stop() {
        elizaLogger.log("Stopping Slack client...");
        if (this.server) {
            await new Promise<void>((resolve) => {
                this.server.listen().close(() => {
                    elizaLogger.log("Server stopped");
                    resolve();
                });
            });
        }
    }
}

export const SlackClientInterface: ElizaClient = {
    start: async (runtime: IAgentRuntime) => {
        const client = new SlackClient(runtime);
        await client.start();
        return client;
    },
    stop: async (_runtime: IAgentRuntime) => {
        elizaLogger.warn("Slack client stopping...");
    },
};

export default SlackClientInterface;
