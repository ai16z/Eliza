import type { Plugin } from "@elizaos/core";
import launchAgent from "./actions/launchAgent";

export const autonomePlugin: Plugin = {
    name: "autonome",
    description: "Autonome Plugin for Eliza",
    actions: [launchAgent],
    evaluators: [],
    providers: [],
};

export default autonomePlugin;
