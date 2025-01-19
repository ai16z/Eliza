import type { Plugin } from "@elizaos/core";
import { zgUpload } from "./actions/upload";

export const zgPlugin: Plugin = {
    description: "ZeroG Plugin for Eliza",
    name: "ZeroG",
    actions: [zgUpload],
    evaluators: [],
    providers: [],
};
