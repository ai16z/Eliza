import type { Plugin } from "@elizaos/core";

import { TransferAction } from "./actions/";

export const zksyncEraPlugin: Plugin = {
    name: "zksync-era",
    description: "ZKsync Era Plugin for Eliza",
    actions: [TransferAction],
    evaluators: [],
    providers: [],
};

export default zksyncEraPlugin;
