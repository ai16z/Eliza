export * from "./actions/bridge";
export * from "./actions/swap";
export * from "./actions/transfer";
export * from "./providers/wallet";
export * from "./types";

import type { Plugin } from "@elizaos/core";
import { bridgeAction } from "./actions/bridge";
import { swapAction } from "./actions/swap";
import { transferAction } from "./actions/transfer";
import { tronWalletProvider } from "./providers/wallet";

export const tronPlugin: Plugin = {
    name: "tron",
    description: "TRON blockchain integration plugin",
    providers: [tronWalletProvider],
    evaluators: [],
    services: [],
    actions: [transferAction, bridgeAction, swapAction],
};

export default tronPlugin;
