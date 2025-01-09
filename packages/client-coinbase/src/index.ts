import {
    elizaLogger,
    Client,
    IAgentRuntime,
    Memory,
    Content,
    HandlerCallback,
    stringToUuid,
    composeContext,
    generateText,
    ModelClass
} from "@elizaos/core";
import { postTweet } from "@elizaos/plugin-twitter";
import express from "express";
import { WebhookEvent } from "./types";

export class CoinbaseClient implements Client {
    private runtime: IAgentRuntime;
    private server: express.Application;
    private port: number;

    constructor(runtime: IAgentRuntime) {
        this.runtime = runtime;
        this.server = express();
        this.port = Number(runtime.getSetting("COINBASE_WEBHOOK_PORT")) || 3001;
    }

    async initialize(): Promise<void> {
        elizaLogger.info("Initializing Coinbase client");
        try {
            elizaLogger.info("Coinbase client initialized successfully");
            await this.setupWebhookEndpoint();
        } catch (error) {
            elizaLogger.error("Failed to initialize Coinbase client:", error);
            throw error;
        }
    }

    private setupWebhookEndpoint() {
        this.server.use(express.json());

        // Add CORS middleware to allow external requests
        this.server.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            if (req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
            next();
        });

        // Add webhook validation middleware
        const validateWebhook = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const event = req.body as WebhookEvent;
            if (!event.event || !event.ticker || !event.timestamp || !event.price) {
                res.status(400).json({ error: "Invalid webhook payload" });
                return;
            }
            if (event.event !== 'buy' && event.event !== 'sell') {
                res.status(400).json({ error: "Invalid event type" });
                return;
            }
            next();
        };

        // Add health check endpoint
        this.server.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });

        // Main webhook endpoint
        this.server.post("/webhook", validateWebhook, async (req, res) => {
            try {
                const event = req.body as WebhookEvent;
                await this.handleWebhookEvent(event);
                res.status(200).json({ status: "success" });
            } catch (error) {
                elizaLogger.error("Error processing webhook:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        return new Promise<void>((resolve, reject) => {
            try {
                this.server.listen(this.port, '0.0.0.0', () => {
                    elizaLogger.info(`Webhook server listening on port ${this.port}`);
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private async generateTweetContent(event: WebhookEvent, _tradeAmount: number, formattedTimestamp: string): Promise<string> {
        try {
            const roomId = stringToUuid("coinbase-trading");
            const amount = Number(this.runtime.getSetting('COINBASE_TRADING_AMOUNT')) ?? 1;

            const tradeTweetTemplate = `
# Task
Create an engaging and unique tweet announcing a Coinbase trade. Be creative but professional.

Trade details:
- ${event.event.toUpperCase()} order for ${event.ticker}
- Trading amount: $${amount.toFixed(2)}
- Current price: $${Number(event.price).toFixed(2)}
- Time: ${formattedTimestamp}

Requirements:
1. Must be under 180 characters
2. Use 1-2 relevant emojis
3. No hashtags
4. Vary the wording each time to keep it fresh and engaging
5. Can mention market conditions, timing, or strategy when relevant
6. Keep it professional but conversational
7. Include the key information: action, amount, ticker, and price

Example variations for buys:
"📈 Just added $1,000 of BTC to the portfolio at $50,000.00"
"🎯 Strategic BTC purchase: $1,000 at $50,000.00"

Example variations for sells:
"💫 Executed BTC position: Sold $1,000 at $52,000.00"
"📊 Strategic exit: Released $1,000 of BTC at $52,000.00"

Generate only the tweet text, no commentary or markdown.`;

            const context = composeContext({
                template: tradeTweetTemplate,
                state: {
                    event: event.event.toUpperCase(),
                    ticker: event.ticker,
                    amount: `${amount.toFixed(2)}`,
                    price: `${Number(event.price).toFixed(2)}`,
                    timestamp: formattedTimestamp,
                    bio: '',
                    lore: '',
                    messageDirections: '',
                    postDirections: '',
                    persona: '',
                    personality: '',
                    role: '',
                    scenario: '',
                    roomId,
                    actors: '',
                    recentMessages: '',
                    recentMessagesData: []
                }
            });

            const tweetContent = await generateText({
                runtime: this.runtime,
                context,
                modelClass: ModelClass.SMALL,
            });

            const trimmedContent = tweetContent.trim();
            return trimmedContent.length > 180 ? trimmedContent.substring(0, 177) + "..." : trimmedContent;

        } catch (error) {
            elizaLogger.error("Error generating tweet content:", error);
            const amount = Number(this.runtime.getSetting('COINBASE_TRADING_AMOUNT')) ?? 1;
            const fallbackTweet = `🚀 ${event.event.toUpperCase()}: $${amount.toFixed(2)} of ${event.ticker} at $${Number(event.price).toFixed(2)}`;
            return fallbackTweet;
        }
    }

    private async handleWebhookEvent(event: WebhookEvent) {
        const roomId = stringToUuid("coinbase-trading");
        await this.runtime.ensureRoomExists(roomId);
        await this.runtime.ensureParticipantInRoom(this.runtime.agentId, roomId);

        const amount = Number(this.runtime.getSetting('COINBASE_TRADING_AMOUNT')) ?? 1;
        const memory: Memory = {
            id: stringToUuid(`coinbase-${event.timestamp}`),
            userId: this.runtime.agentId,
            agentId: this.runtime.agentId,
            roomId,
            content: {
                text: `Place an advanced market order to ${event.event.toLowerCase()} $${amount} worth of ${event.ticker}`,
                action: "EXECUTE_ADVANCED_TRADE",
                source: "coinbase",
                metadata: {
                    ticker: event.ticker,
                    side: event.event.toUpperCase(),
                    price: event.price,
                    amount: amount,
                    timestamp: event.timestamp
                }
            },
            createdAt: Date.now()
        };

        await this.runtime.messageManager.createMemory(memory);

        const callback: HandlerCallback = async (content: Content) => {
            elizaLogger.info("Trade execution result:", content);
            return [];
        };

        const state = await this.runtime.composeState(memory);
        await this.runtime.processActions(memory, [memory], state, callback);

        // Generate tweet content
        const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        }).format(new Date(event.timestamp));

        try {
            const tweetContent = await this.generateTweetContent(event, amount, formattedTimestamp);
            elizaLogger.info("Generated tweet content:", tweetContent);
            const response = await postTweet(tweetContent);
            elizaLogger.info("Tweet response:", response);
        } catch (error) {
            elizaLogger.error("Failed to post tweet:", error);
        }
    }

    async stop(): Promise<void> {
        try {
            if (this.server?.listen) {
                await new Promise<void>((resolve, reject) => {
                    this.server.listen().close((err: Error | undefined) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
            elizaLogger.info("Coinbase client stopped successfully");
        } catch (error) {
            elizaLogger.error("Error stopping Coinbase client:", error);
            throw error;
        }
    }

    getType(): string {
        return "coinbase";
    }

    getName(): string {
        return "coinbase";
    }

    async start(): Promise<void> {
        await this.initialize();
    }
}

export const CoinbaseClientInterface: Client = {
    start: async (runtime: IAgentRuntime) => {
        elizaLogger.log("Starting Coinbase client with agent ID:", runtime.agentId);
        const client = new CoinbaseClient(runtime);
        await client.start();
        return client;
    },
    stop: async (runtime: IAgentRuntime) => {
        try {
            elizaLogger.log("Stopping Coinbase client");
            await runtime.clients.coinbase.stop();
        } catch (e) {
            elizaLogger.error("Coinbase client stop error:", e);
        }
    },
};

export default CoinbaseClientInterface;