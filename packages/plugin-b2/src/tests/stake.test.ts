import { describe, it, expect, beforeEach } from "vitest";
import { generatePrivateKey } from "viem/accounts";

import { StakeAction } from "../actions/stake";
import { WalletProvider } from "../providers";
import type { StakeParams } from "../types";

describe("Stake Action", () => {
    let wp: WalletProvider;

    beforeEach(async () => {
        const pk = generatePrivateKey();
        wp = new WalletProvider(pk);
    });
    describe("Constructor", () => {
        it("should initialize with stake action", () => {
            const sa = new StakeAction(wp);
            expect(sa).toBeDefined();
        });
    });
    describe("Stake", () => {
        let sa: StakeAction;
        beforeEach(() => {
            sa = new StakeAction(wp);
            expect(sa).toBeDefined();
        });
        it("should initialize with stake action", () => {
            const sa = new StakeAction(wp);
            expect(sa).toBeDefined();
        });

        it("throws if not enough gas", async () => {
            const params = {
                amount: "1",
            } as StakeParams;
            await expect(
                sa.stake(params)
            ).rejects.toThrow(
                "Stake failed: The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
            );
        });

    });
});
