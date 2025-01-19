import type { Plugin } from "@elizaos/core";
import transfer from "./actions/transfer";
import createToken from "./actions/createToken";

export const multiversxPlugin: Plugin = {
    name: "multiversx",
    description: "MultiversX Plugin for Eliza",
    actions: [transfer, createToken],
    evaluators: [],
    providers: [],
};

export default multiversxPlugin;
