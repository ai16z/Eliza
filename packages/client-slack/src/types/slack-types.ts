import type { WebClient } from "@slack/web-api";
import { type Service, ServiceType } from "@elizaos/core";

export interface SlackConfig {
    appId: string;
    clientId: string;
    clientSecret: string;
    signingSecret: string;
    verificationToken: string;
    botToken: string;
    botId: string;
}

export interface SlackClientContext {
    client: any;
    config: SlackConfig;
}

export interface SlackMessage {
    text: string;
    userId: string;
    channelId: string;
    threadTs?: string;
    attachments?: Array<{
        type: string;
        url: string;
        title: string;
        size: number;
    }>;
}

// We'll temporarily use TEXT_GENERATION as our service type
// This is not ideal but allows us to work within current constraints
export const SLACK_SERVICE_TYPE = ServiceType.TEXT_GENERATION;

// Interface extending core Service
export interface ISlackService extends Service {
    client: WebClient;
}
