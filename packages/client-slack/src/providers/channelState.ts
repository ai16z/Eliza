import type { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";

interface SlackEvent {
    channel: string;
    channel_type: string;
    thread_ts?: string;
    user?: string;
    team?: string;
}

export const channelStateProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const slackEvent = state?.slackEvent as SlackEvent | undefined;
        if (!slackEvent) {
            return "";
        }

        const agentName = state?.agentName || "The agent";
        const senderName = state?.senderName || "someone";
        const channelId = slackEvent.channel;
        const channelType = slackEvent.channel_type;

        // For direct messages
        if (channelType === "im") {
            return `${agentName} is currently in a direct message conversation with ${senderName}`;
        }

        // For channel messages
        let response = `${agentName} is currently having a conversation in the Slack channel <#${channelId}>`;

        // Add thread context if in a thread
        if (slackEvent.thread_ts) {
            response += ` in a thread`;
        }

        // Add team context if available
        if (slackEvent.team) {
            response += ` in the workspace ${slackEvent.team}`;
        }

        return response;
    },
};
