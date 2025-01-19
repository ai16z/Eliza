import type { Plugin } from "@elizaos/core";
import escrow from "./actions/escrow.ts";
import deployment from "./actions/deployment.ts";
import { tokensProvider } from "./providers/tokens.ts";
import { deploymentProvider } from "./providers/deployment.ts";
import {
    SUPPORTED_TOKENS,
    DEPLOYMENT_CONFIGS,
    LEASE_STATES,
} from "./utils/constants.ts";

export const CONFIG = {
    SUPPORTED_TOKENS,
    DEPLOYMENT_CONFIGS,
    LEASE_STATES,
};

export const spheronPlugin: Plugin = {
    name: "spheron",
    description: "Spheron Protocol Plugin for Eliza",
    actions: [escrow, deployment],
    evaluators: [],
    providers: [tokensProvider, deploymentProvider],
};

export default spheronPlugin;

// Export types
export * from "./types/index.ts";
export * from "./environment.ts";
export * from "./utils/index.ts";
