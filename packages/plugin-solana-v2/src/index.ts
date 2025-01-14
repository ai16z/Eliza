import { Plugin } from "@elizaos/core";
import { positionProvider } from "./providers/orca/positionProvider";
import { repositionEvaluator } from "./evaluators/orca/repositionEvaluator";
import { repositionPositions } from "./actions/orca/repositionPositions";
import { managePositions } from "./actions/orca/managePositions";

export const solanaPluginV2: Plugin = {
    name: "solanaV2",
    description: "Solana Plugin V2 for Eliza",
    actions: [managePositions, repositionPositions],
    evaluators: [repositionEvaluator],
    providers: [positionProvider],
};

export default solanaPluginV2;