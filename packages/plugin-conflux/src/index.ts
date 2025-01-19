import type { Plugin } from "@elizaos/core";
import { transfer } from "./actions/transfer";
import { bridgeTransfer } from "./actions/bridgeTransfer";
import { confiPump } from "./actions/confiPump";

export const confluxPlugin: Plugin = {
    name: "conflux",
    description: "Conflux Plugin for Eliza",
    actions: [transfer, bridgeTransfer, confiPump],
    providers: [],
};
