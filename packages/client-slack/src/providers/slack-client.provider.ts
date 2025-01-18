import { WebClient } from "@slack/web-api";
import type { SlackConfig, SlackClientContext } from "../types/slack-types";
import { SlackUtils, type RetryOptions } from "../utils/slack-utils";
import { elizaLogger } from "@elizaos/core";

export class SlackClientProvider {
    private client: WebClient;
    private config: SlackConfig;
    private retryOptions: RetryOptions;

    constructor(config: SlackConfig, retryOptions: RetryOptions = {}) {
        this.config = config;
        this.client = new WebClient(config.botToken);
        this.retryOptions = {
            maxRetries: 3,
            initialDelay: 1000,
            maxDelay: 5000,
            ...retryOptions,
        };
    }

    public getContext(): SlackClientContext {
        return {
            client: this.client,
            config: this.config,
        };
    }

    public async validateConnection(): Promise<boolean> {
        try {
            const result = await SlackUtils.withRateLimit(
                () => this.client.auth.test(),
                this.retryOptions
            );

            if (result.ok) {
                this.config.botId = result.user_id || this.config.botId;
                elizaLogger.log("Bot ID:", this.config.botId);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Slack connection validation failed:", error);
            return false;
        }
    }

    public async sendMessage(channel: string, text: string): Promise<any> {
        return SlackUtils.sendMessageWithRetry(
            this.client,
            channel,
            text,
            this.retryOptions
        );
    }

    public async replyInThread(
        channel: string,
        threadTs: string,
        text: string
    ): Promise<any> {
        return SlackUtils.replyInThread(
            this.client,
            channel,
            threadTs,
            text,
            this.retryOptions
        );
    }

    public async validateChannel(channelId: string): Promise<boolean> {
        return SlackUtils.validateChannel(this.client, channelId);
    }

    public formatMessage(
        text: string,
        options?: {
            blocks?: any[];
            attachments?: any[];
        }
    ) {
        return SlackUtils.formatMessage(text, options);
    }

    public async withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
        return SlackUtils.withRateLimit(fn, this.retryOptions);
    }
}
