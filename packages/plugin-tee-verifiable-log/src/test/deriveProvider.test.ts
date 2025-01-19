import { beforeEach, describe, expect, it } from "vitest";
import { v4 as uuidv4 } from "uuid";

import { DeriveProvider } from "../providers/dreriveProvider.ts";

describe("DeriveProvider", () => {
    let deriveProvider: DeriveProvider;
    const teeEndpoint = "LOCAL";
    beforeEach(() => {
        deriveProvider = new DeriveProvider(teeEndpoint);
    });
    describe("DeriveProvider Management", () => {
        it("should deriveKeyPair when available", async () => {
            const agentId = uuidv4();
            const { keys } = await deriveProvider.deriveKeyPair({
                agentId: agentId,
                bizModel: "test",
            });
            expect(keys).not.toBeNull();
        });
        it("should deriveKeyPair when available 2", async () => {
            const agentId = uuidv4();
            const plantText = "Helo World";
            const { success, errorMsg, ivHex, encryptedData } =
                await deriveProvider.encryptAgentData(
                    {
                        agentId: agentId,
                        bizModel: "test",
                    },
                    plantText
                );
            console.log("encryptAgentData:", {
                success,
                errorMsg,
                ivHex,
                encryptedData,
            });
            expect(success).toBe(true);
            expect(errorMsg).toBe("");

            const result =
                await deriveProvider.decryptAgentData(
                    {
                        agentId: agentId,
                        bizModel: "test",
                    },
                    ivHex,
                    encryptedData
                );
            console.log("=====",result)
            expect(result.plainText).toBe(plantText);
        });
    });
});
