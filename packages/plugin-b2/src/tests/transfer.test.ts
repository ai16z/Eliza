import { describe, it, expect, beforeEach } from "vitest";
import { generatePrivateKey } from "viem/accounts";
import { getEnvVariable } from "@elizaos/core";

import { TransferAction } from "../actions/transfer";
import { WalletProvider } from "../providers";
import type { TransferParams } from "../types";
import { TOKEN_ADDRESSES } from "../utils/constants";

describe("Transfer Action", () => {
    let wp: WalletProvider;
    let wp1: WalletProvider;

    beforeEach(async () => {
        const pk = generatePrivateKey();
        const pk1 = getEnvVariable("ARTHERA_PRIVATE_KEY") as `0x${string}`;
        wp = new WalletProvider(pk);
        console.log(wp.getAddress());
        if (pk1) {
            wp1 = new WalletProvider(pk1);
        }
    });
    describe("Constructor", () => {
        it("should initialize with transfer action", () => {
            const ta = new TransferAction(wp);

            expect(ta).toBeDefined();
        });
    });
    describe("Transfer", () => {
        let ta: TransferAction;
        let ta1: TransferAction;
        let receiverAddress: `0x${string}`;

        beforeEach(() => {
            ta = new TransferAction(wp);
            if (wp1) {
                ta1 = new TransferAction(wp1);
                receiverAddress = wp1.getAddress();
            }
            else {
                receiverAddress = wp.getAddress();
            }
        });

        it("throws if not enough gas", async () => {
            const params = {
                tokenAddress: TOKEN_ADDRESSES["B2-BTC"],
                recipient: receiverAddress,
                amount: "1",
            } as TransferParams;
            await expect(
                ta.transfer(params)
            ).rejects.toThrow(
                "Transfer failed: The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
            );
        });

        if (wp1) {
            console.log("----------------------------------------------");
            it("transfers tokens", async () => {
                const params = {
                    tokenAddress: TOKEN_ADDRESSES["B2-BTC"],
                    recipient: receiverAddress,
                    amount: "0.001",
                } as TransferParams;
                const tx = await ta1.transfer(params);
                expect(tx).toBeDefined();
                expect(tx.from).toEqual(wp1.getAddress());
                expect(tx.recipient).toEqual(receiverAddress);
                expect(tx.amount).toEqual(1000000000000000n);
            });
        }
    });
});
