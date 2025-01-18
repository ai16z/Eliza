import type { Plugin} from "@elizaos/core";
import { createDeploymentAction } from "./actions/createDeployment";
import { closeDeploymentAction } from "./actions/closeDeployment";
import { getProviderInfoAction } from "./actions/getProviderInfo";
import { getDeploymentStatusAction } from "./actions/getDeploymentStatus";
import { estimateGas } from "./actions/estimateGas";
import { getDeploymentApiAction } from "./actions/getDeploymentApi";
import { getGPUPricingAction } from "./actions/getGPUPricing";
import { getManifestAction } from "./actions/getManifest";
import { getProvidersListAction } from "./actions/getProvidersList";

const actions = [
  createDeploymentAction,
  closeDeploymentAction,
  getProviderInfoAction,
  getDeploymentStatusAction,
  estimateGas,
  getDeploymentApiAction,
  getGPUPricingAction,
  getManifestAction,
  getProvidersListAction,
];

// Initial banner
console.log("\n┌════════════════════════════════════════┐");
console.log("│          AKASH NETWORK PLUGIN          │");
console.log("├────────────────────────────────────────┤");
console.log("│  Initializing Akash Network Plugin...  │");
console.log("│  Version: 0.1.0                        │");
console.log("└════════════════════════════════════════┘");

// Format action registration message
const formatActionInfo = (action: any) => {
  const name = action.name.padEnd(25);
  const similes = (action.similes?.join(", ") || "none").padEnd(60);
  const hasHandler = action.handler ? "✓" : "✗";
  const hasValidator = action.validate ? "✓" : "✗";
  const hasExamples = action.examples?.length > 0 ? "✓" : "✗";

  return `│ ${name} │ ${hasHandler} │ ${hasValidator} │ ${hasExamples} │ ${similes} │`;
};

// Log registered actions
console.log("\n┌───────────────────────────┬───┬───┬───┬───────────────────────────────────────────────────────────┐");
console.log("│ Action                    │ H │ V │ E │ Similes                                                   │");
console.log("├───────────────────────────┼───┼───┼───┼────────────────────────────────────────────────────────────┤");
actions.forEach(action => {
  console.log(formatActionInfo(action));
});
console.log("└───────────────────────────┴───┴───┴───┴──────────────────────────────────────────────────────────┘");

// Plugin status
console.log("\n┌─────────────────────────────────────┐");
console.log("│           Plugin Status             │");
console.log("├─────────────────────────────────────┤");
console.log(`│ Name    : akash                     │`);
console.log(`│ Actions : ${actions.length.toString().padEnd(24)}  │`);
console.log(`│ Status  : Loaded & Ready            │`);
console.log("└─────────────────────────────────────┘\n");

export const akashPlugin: Plugin = {
  name: "akash",
  description: "Akash Network Plugin for deploying and managing cloud compute",
  actions: actions,
  evaluators: []
};

export default akashPlugin;