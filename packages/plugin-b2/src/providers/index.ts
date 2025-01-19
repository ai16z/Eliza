import {
    type IAgentRuntime,
    type Memory,
    type Provider,
    type State,
    elizaLogger,
} from "@elizaos/core";
import { privateKeyToAccount } from "viem/accounts";
import {
    formatUnits,
    type Address,
    type Chain,
    type Account,
    type WalletClient,
    type PrivateKeyAccount,
    http,
    createPublicClient,
    createWalletClient,
    type PublicClient,
    type Transport,
    type RpcSchema,
} from "viem";
import { TOKEN_ADDRESSES } from "../utils/constants";
import { b2Network } from "../utils/chains";

export class WalletProvider implements Provider {
    private account: PrivateKeyAccount;

    constructor(accountOrPrivateKey: PrivateKeyAccount | `0x${string}`) {
        this.setAccount(accountOrPrivateKey);
    }

    private setAccount = (
        accountOrPrivateKey: PrivateKeyAccount | `0x${string}`
    ) => {
        if (typeof accountOrPrivateKey === "string") {
            this.account = privateKeyToAccount(accountOrPrivateKey);
        } else {
            this.account = accountOrPrivateKey;
        }
    };

    async getNativeBalance (
        owner: Address
    ) {
        const publicClient = this.getPublicClient();
        const balance = await publicClient.getBalance({
            address: owner,
        });
        return balance;
    };

    async getTokenBalance (
        tokenAddress: Address,
        owner: Address
    ) {
        if (tokenAddress === TOKEN_ADDRESSES["B2-BTC"]) {
            return this.getNativeBalance(owner);
        }
        const publicClient = this.getPublicClient();
        const balance = await publicClient.readContract({
            address: tokenAddress,
            abi: [
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "account",
                            type: "address",
                        },
                    ],
                    name: "balanceOf",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                    stateMutability: "view",
                    type: "function",
                },
            ],
            functionName: "balanceOf",
            args: [owner],
        });
        return balance;
    };

    getAccount(): Account {
        return this.account;
    }

    getAddress(): Address {
        return this.account.address;
    }

    getPublicClient(): PublicClient<Transport, Chain, Account | undefined, RpcSchema | undefined> {
        return createPublicClient({
            chain: b2Network,
            transport: http(),
        });
    }

    getWalletClient(): WalletClient {
        const transport = http(b2Network.rpcUrls.default.http[0]);
        const walletClient = createWalletClient({
            chain: b2Network,
            transport,
            account: this.account,
        });
        return walletClient;
    }

    async getDecimals(tokenAddress: Address) {
        if (tokenAddress === TOKEN_ADDRESSES["B2-BTC"]) {
            return b2Network.nativeCurrency.decimals;
        }
        const publicClient = this.getPublicClient();
        const decimals = await publicClient.readContract({
            address: tokenAddress,
            abi: [
                {
                    inputs: [],
                    name: "decimals",
                    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
                    stateMutability: "view",
                    type: "function",
                },
            ],
            functionName: "decimals",
        });
        return decimals;
    }

    async get(
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string | null> {
        elizaLogger.debug("walletProvider::get");
        try {
            const privateKey = runtime.getSetting("B2_PRIVATE_KEY");
            if (!privateKey) {
                throw new Error(
                    "B2_PRIVATE_KEY not found in environment variables"
                );
            }
            let accountAddress;
            if (this.account) {
                accountAddress = this.getAddress();
            } else {
                const walletProvider = await initWalletProvider(runtime);
                accountAddress = walletProvider.getAddress();
            }

            let output = `# Wallet Balances\n\n`;
            output += `## Wallet Address\n\n\`${accountAddress}\`\n\n`;

            output += `## Latest Token Balances\n\n`;
            for (const [token, address] of Object.entries(TOKEN_ADDRESSES)) {
                const decimals = await this.getDecimals(address);
                const balance = await this.getTokenBalance(
                    address,
                    accountAddress,
                );
                output += `${token}: ${formatUnits(balance, decimals)}\n`;
            }
            output += `Note: These balances can be used at any time.\n\n`;
            elizaLogger.debug("walletProvider::get output:", output);
            return output;
        } catch (error) {
            elizaLogger.error("Error in b2 wallet provider:", error);
            return null;
        }
    }

};

export const initWalletProvider = async (runtime: IAgentRuntime) => {
    const privateKey = runtime.getSetting("B2_PRIVATE_KEY");
    if (!privateKey) {
        throw new Error(
            "B2_PRIVATE_KEY not found in environment variables"
        );
    }
    return new WalletProvider(privateKey as `0x${string}`);
};

export const walletProvider: Provider = {
    async get(
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string | null> {
        elizaLogger.debug("walletProvider::get");
        const privateKey = runtime.getSetting("B2_PRIVATE_KEY");
        if (!privateKey) {
            throw new Error(
                "B2_PRIVATE_KEY not found in environment variables"
            );
        }
        try {
            const walletProvider = await initWalletProvider(runtime);
            const account = walletProvider.getAccount();
            let output = `# Wallet Balances\n\n`;
            output += `## Wallet Address\n\n\`${account.address}\`\n\n`;

            output += `## Latest Token Balances\n\n`;
            for (const [token, address] of Object.entries(TOKEN_ADDRESSES)) {
                const decimals = await walletProvider.getDecimals(address);
                const balance = await walletProvider.getTokenBalance(
                    address,
                    account.address
                );
                output += `${token}: ${formatUnits(balance, decimals)}\n`;
            }
            output += `Note: These balances can be used at any time.\n\n`;
            elizaLogger.debug("walletProvider::get output:", output);
            return output;
        } catch (error) {
            elizaLogger.error("Error in b2 wallet provider:", error);
            return null;
        }
    }
};