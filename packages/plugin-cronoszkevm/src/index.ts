import type { Plugin } from "@elizaos/core";

import { TransferAction } from "./actions";

export const cronosZkEVMPlugin: Plugin = {
    name: "cronoszkevm",
    description: "Cronos zkEVM plugin for Eliza",
    actions: [TransferAction],
    evaluators: [],
    providers: [],
};

export default cronosZkEVMPlugin;
