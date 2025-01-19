import type { Plugin } from "@elizaos/core";
import { createTransferAction } from "./actions/transfer";
import { createCosmosWalletProvider } from "./providers/wallet";
import type { ICosmosPluginOptions } from "./shared/interfaces";
import { createIBCTransferAction } from "./actions/ibc-transfer";

export const createCosmosPlugin = (
    pluginOptions?: ICosmosPluginOptions
): Plugin => ({
    name: "cosmos",
    description: "Cosmos blockchain integration plugin",
    providers: [createCosmosWalletProvider(pluginOptions)],
    evaluators: [],
    services: [],
    actions: [
        createTransferAction(pluginOptions),
        createIBCTransferAction(pluginOptions),
    ],
});

export default createCosmosPlugin;
