import type { Plugin } from "@elizaos/core";
import { getOnChainActions } from "./actions";
import { getZilliqaWalletClient, getWalletProviders } from "./wallet";

export async function zilliqaPlugin(
    getSetting: (key: string) => string | undefined
): Promise<Plugin> {
    const zilliqaWalletClient = await getZilliqaWalletClient(getSetting);
    const walletClient = zilliqaWalletClient!.getEVM();
    const actions = await getOnChainActions(walletClient, zilliqaWalletClient!);

    return {
        name: "[ZILLIQA] Onchain Actions",
        description: "Zilliqa integration plugin",
        providers: getWalletProviders(walletClient, zilliqaWalletClient),
        evaluators: [],
        services: [],
        actions: actions,
    };
}

export default zilliqaPlugin;
