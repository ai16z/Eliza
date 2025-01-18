import { elizaLogger } from "@elizaos/core";
import {
    type Hash,
    type Address,
    parseUnits,
    encodeFunctionData,
} from "viem";
import { b2Network } from "./chains";
import type { WalletProvider } from "../providers";
import { TOKEN_ADDRESSES } from "./constants";

export const getTxReceipt = async (walletProvider: WalletProvider, tx: Hash) => {
    const publicClient = walletProvider.getPublicClient();
    const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
    });
    return receipt;
};

export const sendNativeAsset = async (
    walletProvider: WalletProvider,
    recipient: Address,
    amount: number
) => {
    const decimals = await walletProvider.getDecimals(TOKEN_ADDRESSES["B2-BTC"]);
    const walletClient = walletProvider.getWalletClient();

    const args = {
        to: recipient,
        value: parseUnits(amount.toString(), decimals),
    };
    const tx = await walletClient.sendTransaction(args);
    return tx as Hash;
};

export const sendToken = async (
    walletProvider: WalletProvider,
    tokenAddress: Address,
    recipient: Address,
    amount: number
) => {
    const decimals = await walletProvider.getDecimals(tokenAddress);
    const publicClient = walletProvider.getPublicClient();
    try {
        const { result, request } = await publicClient.simulateContract({
            account: walletProvider.getAccount(),
            address: tokenAddress,
            abi: [
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "dst",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                        },
                    ],
                    name: "transfer",
                    outputs: [
                        {
                            internalType: "bool",
                            name: "",
                            type: "bool",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                },
            ],
            functionName: "transfer",
            args: [recipient, parseUnits(amount.toString(), decimals)],
        });

        if (!result) {
            throw new Error("Transfer failed");
        }

        elizaLogger.debug("Request:", request);
        const walletClient = walletProvider.getWalletClient();
        const tx = await walletClient.writeContract(request);
        elizaLogger.debug("Transaction:", tx);
        return tx as Hash;
    } catch (error) {
        elizaLogger.error("Error simulating contract:", error);
        return;
    }
};

export const approve = async (
    walletProvider: WalletProvider,
    tokenAddress: Address,
    spender: Address,
    amount: number
) => {
    try {
        const decimals = await walletProvider.getDecimals(tokenAddress);
        const publicClient = walletProvider.getPublicClient();
        const { result, request } = await publicClient.simulateContract({
            account: walletProvider.getAccount(),
            address: tokenAddress,
            abi: [
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "_spender",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "_value",
                            type: "uint256",
                        },
                    ],
                    name: "approve",
                    outputs: [
                        {
                            internalType: "bool",
                            name: "",
                            type: "bool",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                },
            ],
            functionName: "approve",
            args: [spender, parseUnits(amount.toString(), decimals)],
        });

        if (!result) {
            throw new Error("Approve failed");
        }
        elizaLogger.debug("Request:", request);
        const walletClient = walletProvider.getWalletClient();
        const tx = await walletClient.writeContract(request);
        elizaLogger.debug("Transaction:", tx);
        return tx;
    } catch (error) {
        elizaLogger.error("Error approving:", error);
        return;
    }
};

export const depositBTC = async (
    walletProvider: WalletProvider,
    farmAddress: Address,
    amount: string | number
) => {
    try {
        const decimals = b2Network.nativeCurrency.decimals;
        // const publicClient = walletProvider.getPublicClient();

        const walletClient = walletProvider.getWalletClient();
        const data = encodeFunctionData({
            abi: [
                {
                    "inputs": [

                    ],
                    "name": "depositBTC",
                    "outputs": [

                    ],
                    "stateMutability": "payable",
                    "type": "function"
                },
            ],
            functionName: 'depositBTC',
            args: [],
        });

        const args = {
            account: walletProvider.getAddress(),
            to: farmAddress,
            data,
            value: parseUnits(amount.toString(), decimals),
        };
        const txHash = await walletClient.sendTransaction(args);

        elizaLogger.debug("Transaction hash:", txHash);
        return txHash;
    } catch (error) {
        elizaLogger.error("Error depositBTC:", error);
        return;
    }
};

// function unstake(uint256 _pid, uint256 _amount) public {}
export const unstake = async (
    walletProvider: WalletProvider,
    farmAddress: Address,
    amount: string | number
) => {
    try {
        const BTC_PID = 0;
        const decimals = b2Network.nativeCurrency.decimals;
        const publicClient = walletProvider.getPublicClient();
        const { _result, request } = await publicClient.simulateContract({
            account: walletProvider.getAccount(),
            address: farmAddress,
            abi: [
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_pid",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "unstake",
                    "outputs": [

                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
            ],
            functionName: "unstake",
            args: [BigInt(BTC_PID), parseUnits(amount.toString(), decimals)],
        });
        elizaLogger.debug("Request:", request);

        const walletClient = walletProvider.getWalletClient();
        const tx = await walletClient.writeContract(request);
        elizaLogger.debug("Transaction:", tx);
        return tx;
    } catch (error) {
        elizaLogger.error("Error unstake:", error);
        return;
    }
};

// function withdraw(uint256 _pid) public {}
export const withdraw = async (
    walletProvider: WalletProvider,
    farmAddress: Address,
) => {
    try {
        const BTC_PID = 0;
        const publicClient = walletProvider.getPublicClient();
        const { _result, request } = await publicClient.simulateContract({
            account: walletProvider.getAccount(),
            address: farmAddress,
            abi: [
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_pid",
                            "type": "uint256"
                        }
                    ],
                    "name": "withdraw",
                    "outputs": [

                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
            ],
            functionName: "withdraw",
            args: [BigInt(BTC_PID)],
        });
        elizaLogger.debug("Request:", request);

        const walletClient = walletProvider.getWalletClient();
        const tx = await walletClient.writeContract(request);
        elizaLogger.debug("Transaction:", tx);
        return tx;
    } catch (error) {
        elizaLogger.error("Error withdraw:", error);
        return;
    }
};