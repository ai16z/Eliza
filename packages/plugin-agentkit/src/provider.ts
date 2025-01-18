import type { Provider, IAgentRuntime } from "@elizaos/core";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import * as fs from "fs";

const WALLET_DATA_FILE = "wallet_data.txt";

export async function getClient(
    networkId = "base-sepolia"
): Promise<CdpAgentkit> {
    let walletDataStr: string | null = null;

    // Read existing wallet data if available
    if (fs.existsSync(WALLET_DATA_FILE)) {
        try {
            walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
        } catch (error) {
            console.error("Error reading wallet data:", error);
            // Continue without wallet data
        }
    }

    // Configure CDP AgentKit
    const config = {
        cdpWalletData: walletDataStr || undefined,
        networkId,
    };

    const agentkit = await CdpAgentkit.configureWithWallet(config);
    // Save wallet data
    const exportedWallet = await agentkit.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

    return agentkit;
}

export const walletProvider: Provider = {
    async get(runtime: IAgentRuntime): Promise<string | null> {
        try {
            const client = await getClient(
                runtime.getSetting("COINBASE_AGENT_KIT_NETWORK")
            );
            const address = (await (client as any).wallet.addresses)[0].id;
            return `AgentKit Wallet Address: ${address}`;
        } catch (error) {
            console.error("Error in AgentKit provider:", error);
            return null;
        }
    },
};
