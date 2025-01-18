import { describe, it, expect, beforeEach } from "vitest";
import { generatePrivateKey } from "viem/accounts";
import { WithdrawAction } from "../actions/withdraw";
import { WalletProvider } from "../providers";
import type { WithdrawParams } from "../types";

describe("Withdraw Action", () => {
    let wp: WalletProvider;

    beforeEach(async () => {
        const pk = generatePrivateKey();
        wp = new WalletProvider(pk);
    });
    describe("Constructor", () => {
        it("should initialize with withdraw action", () => {
            const wa = new WithdrawAction(wp);
            expect(wa).toBeDefined();
        });
    });
    describe("Withdraw", () => {
        let wa: WithdrawAction;
        beforeEach(() => {
            wa = new WithdrawAction(wp);
            expect(wa).toBeDefined();
        });
        it("should initialize with withdraw action", () => {
            wa = new WithdrawAction(wp);
            expect(wa).toBeDefined();
        });
        it("throws if not enough gas", async () => {
            const params = {} as WithdrawParams;
            wa = new WithdrawAction(wp);
            await expect(
                wa.withdraw(params)
            ).rejects.toThrow(
                "Withdraw failed: The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
            );
        });

    });
});
