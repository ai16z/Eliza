import type { Plugin } from "@elizaos/core";
import { walletProvider, getClient } from "./provider";
import { getAgentKitActions } from "./actions";

export const agentKitPlugin: Plugin = {
    name: "[AgentKit] Integration",
    description: "AgentKit integration plugin",
    providers: [walletProvider],
    evaluators: [],
    services: [],
    actions: await getAgentKitActions({
        getClient,
    }),
};

export default agentKitPlugin;
