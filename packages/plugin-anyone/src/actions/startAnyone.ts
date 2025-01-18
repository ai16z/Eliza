import type {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    Action,
} from "@elizaos/core";
import { AnyoneClientService } from "../services/AnyoneClientService";
import { AnyoneProxyService } from "../services/AnyoneProxyService";

export const startAnyone: Action = {
    name: "START_ANYONE",
    similes: ["ANYONE"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: "Start the Anyone client and proxy service",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        _callback: HandlerCallback
    ): Promise<boolean> => {
        await AnyoneClientService.initialize();
        //lint says unused
        //const anon = AnyoneClientService.getInstance();
        const proxyService = AnyoneProxyService.getInstance();
        await proxyService.initialize();

        _callback({
            text: `Started Anyone`,
        });

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Can you start Anyone for me?" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll start Anyone right away",
                    action: "START_ANYONE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Initialize the Anyone client please" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Starting Anyone now",
                    action: "START_ANYONE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "I need to start using Anyone" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll help you start Anyone",
                    action: "START_ANYONE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Launch Anyone for me" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll launch Anyone for you now",
                    action: "START_ANYONE",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
