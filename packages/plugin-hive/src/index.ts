// Definitions
export * from "./environment";
// export * from "./types";
export * from "./actions/defs";
// export * as queries from "./queries";

// Providers
export * from "./providers/wallet.provider";
export * from "./providers/content.provider";

import type { Plugin } from "@elizaos/core";
import { hiveWalletProvider } from "./providers/wallet.provider";
import { hiveContentProvider } from "./providers/content.provider";
import { transferToken } from "./actions/transfer";
import { createPost } from "./actions/post";
import { executeVote } from "./actions/vote";
import { executeFollow } from "./actions/follow";

export const hivePlugin: Plugin = {
    name: "hive",
    description: "Hive Blockchain Plugin for Eliza",
    providers: [hiveWalletProvider, hiveContentProvider],
    actions: [transferToken, createPost, executeVote, executeFollow],
    evaluators: [],
    services: [],
};

export default hivePlugin;
