export * from "./actions/getScore";

import type { Plugin } from "@elizaos/core";
import { getPassportScoreAction } from "./actions/getScore";

export const gitcoinPassportPlugin: Plugin = {
    name: "passport",
    description: "Gitcoin passport integration plugin",
    providers: [],
    evaluators: [],
    services: [],
    actions: [getPassportScoreAction],
};

export default gitcoinPassportPlugin;
