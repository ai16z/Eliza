import { Service, type IAgentRuntime, ServiceType } from "@elizaos/core";
import { WebClient } from "@slack/web-api";
import type { ISlackService } from "../types/slack-types";

export class SlackService extends Service implements ISlackService {
    public client: WebClient;

    static get serviceType(): ServiceType {
        return ServiceType.SLACK;
    }

    get serviceType(): ServiceType {
        return ServiceType.SLACK;
    }

    async initialize(runtime: IAgentRuntime): Promise<void> {
        const token = runtime.getSetting("SLACK_BOT_TOKEN");
        if (!token) {
            throw new Error("SLACK_BOT_TOKEN is required");
        }
        this.client = new WebClient(token);
    }
}
