import { Plugin } from "@elizaos/core";
import { scanTokenAction } from "./actions/scan";
import GoplusSecurityService from "./services/GoplusSecurityService";

export * from "./services/GoplusSecurityService";

export const goplusPlugin: Plugin = {
    name: "goplus",
    description: "goplus Plugin for Eliza - Enables on-chain security checks",
    actions: [scanTokenAction],
    evaluators: [],
    providers: [],
    services: [new GoplusSecurityService()],
};
