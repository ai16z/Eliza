import type { Plugin } from "@elizaos/core";
import transfer from "./actions/transfer";

export const quaiPlugin: Plugin = {
    name: "quai",
    description: "Quai Plugin for Eliza",
    actions: [transfer],
    evaluators: [],
    providers: [],
};

export default quaiPlugin;
