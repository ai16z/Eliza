export * from "./actions/createInvoice";
export * from "./providers/lightning";
export * from "./types";

import type { Plugin } from "@elizaos/core";
import { createInvoiceAction } from "./actions/createInvoice";
import { payInvoiceAction } from "./actions/payInvoice";
import { lndProvider } from "./providers/lightning";

export const lightningPlugin: Plugin = {
    name: "lightning",
    description: "lightning integration plugin",
    providers: [lndProvider],
    evaluators: [],
    services: [],
    actions: [createInvoiceAction, payInvoiceAction],
};

export default lightningPlugin;
