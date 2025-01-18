import type { Plugin } from "@elizaos/core";
import { transferAction } from "./actions/transfer";
import { stakeAction } from "./actions/stake";
import { unstakeAction } from "./actions/unstake";
import { withdrawAction } from "./actions/withdraw";
import { walletProvider } from "./providers";

export const b2Plugin: Plugin = {
    name: "b2",
    description: "B2 Network Plugin for Eliza",
    actions: [transferAction, stakeAction, unstakeAction, withdrawAction],
    providers: [walletProvider],
    evaluators: [],
    services: [],
    clients: [],
};

export default b2Plugin;
