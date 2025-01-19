import type { Plugin } from "@elizaos/core";
import { walletProvider, getClient } from "./provider";
import { getAgentKitActions } from "./actions";

// Initial banner
console.log("\n┌════════════════════════════════════════┐");
console.log("│          AGENTKIT PLUGIN               │");
console.log("├────────────────────────────────────────┤");
console.log("│  Initializing AgentKit Plugin...       │");
console.log("│  Version: 0.0.1                        │");
console.log("└════════════════════════════════════════┘");

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
