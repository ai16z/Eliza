import type { Plugin } from "@elizaos/core";
import { startAnyone } from "./actions/startAnyone.ts";
import { stopAnyone } from "./actions/stopAnyone.ts";
export * as actions from "./actions";

export const anyonePlugin: Plugin = {
    name: "anyone",
    description: "Proxy requests through Anyone",
    actions: [startAnyone, stopAnyone],
};
