import { describe, it, expect, beforeEach } from "vitest";
import { generatePrivateKey } from "viem/accounts";

import { UnstakeAction } from "../actions/unstake";
import { WalletProvider } from "../providers";
import type { UnstakeParams } from "../types";

describe("Unstake Action", () => {
    let wp: WalletProvider;

    beforeEach(async () => {
        const pk = generatePrivateKey();
        wp = new WalletProvider(pk);
    });
    describe("Constructor", () => {
        it("should initialize with unstake action", () => {
            const ua = new UnstakeAction(wp);
            expect(ua).toBeDefined();
        });
    });
    describe("Unstake", () => {
        let ua: UnstakeAction;

        beforeEach(() => {
            ua = new UnstakeAction(wp);
            expect(ua).toBeDefined();
        });
        it("should initialize with unstake action", () => {
            const ua = new UnstakeAction(wp);
            expect(ua).toBeDefined();
        });

        it("throws if not enough gas", async () => {
            const params = {
                amount: "1",
            } as UnstakeParams;
            await expect(
                ua.unstake(params)
            ).rejects.toThrow(
                "Unstake failed: The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
            );
        });
    });
});
