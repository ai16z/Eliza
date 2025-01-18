import InjectiveActions from "./action";
import type { Plugin } from "@elizaos/core";
export const injectivePlugin: Plugin = {
    name: "injective",
    description: "A plugin for interacting with the Injective blockchain",
    actions: InjectiveActions,
    evaluators: [],
    providers: [], //TODO: Integrate with injective-trader to run MM and Taking Strats
};

export default injectivePlugin;
