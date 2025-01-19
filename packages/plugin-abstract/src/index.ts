import type { Plugin } from "@elizaos/core";

import { transferAction } from "./actions";

export const abstractPlugin: Plugin = {
    name: "abstract",
    description: "Abstract Plugin for Eliza",
    actions: [transferAction],
    evaluators: [],
    providers: [],
};

export default abstractPlugin;
