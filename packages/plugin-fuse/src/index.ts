export * from "./actions/transfer";
export * from "./providers/wallet";
export * from "./types";

import type { Plugin } from "@elizaos/core";
import { transferAction } from "./actions/transfer";
import { fuseWalletProvider } from "./providers/wallet";

export const fusePlugin: Plugin = {
    name: "fuse",
    description: "Fuse blockchain integration plugin",
    providers: [fuseWalletProvider],
    evaluators: [],
    services: [],
    actions: [transferAction],
};

export default fusePlugin;
