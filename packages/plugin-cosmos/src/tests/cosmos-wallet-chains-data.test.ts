import { vi, expect, it, describe, beforeEach, type Mock } from "vitest";
import type { Chain } from "@chain-registry/types";
import { getChainByChainName } from "@chain-registry/utils";
import { CosmosWallet } from "../shared/entities/cosmos-wallet.ts";
import { getAvailableChains } from "../shared/helpers/cosmos-chains.ts";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { CosmosWalletChains } from "../shared/entities/cosmos-wallet-chains-data.ts";

vi.mock("@chain-registry/utils", () => ({
    getChainByChainName: vi.fn(),
    getAvailableChains: vi.fn(),
}));

vi.mock("@cosmjs/cosmwasm-stargate", () => ({
    SigningCosmWasmClient: {
        connectWithSigner: vi.fn(),
    },
}));

vi.mock("@skip-go/client", () => ({
    SkipClient: vi.fn(() => ({})),
}));

vi.mock("../shared/entities/cosmos-wallet.ts", () => ({
    CosmosWallet: {
        create: vi.fn(),
    },
}));

vi.mock("../shared/helpers/cosmos-chains.ts", () => {
    return {
        getAvailableChains: vi.fn(),
    };
});

describe("CosmosWalletChains", () => {
    let mockMnemonic: string;
    let mockChains: Chain[];

    beforeEach(() => {
        vi.clearAllMocks();

        mockMnemonic = "test mnemonic";

        mockChains = [
            {
                name: "chain1",
                bech32_prefix: "cosmos",
                apis: {
                    rpc: [
                        {
                            address: "mockedRpcAddress",
                        },
                    ],
                },
            } as unknown as Chain,
        ];
    });

    it("should create a CosmosWalletChains instance", async () => {
        vi.mocked(getAvailableChains).mockReturnValue(mockChains);
        vi.mocked(getChainByChainName).mockReturnValue(mockChains[0]);

        const mockCosmosWalletCreate = {
            directSecp256k1HdWallet: {},
            getWalletAddress: vi.fn().mockResolvedValue("mockedAddress"),
            getWalletBalances: vi.fn(),
        };

        (CosmosWallet.create as Mock).mockResolvedValue(mockCosmosWalletCreate);

        (SigningCosmWasmClient.connectWithSigner as Mock).mockResolvedValue({});

        const availableChains = ["chain1"];

        const expectedResult = {
            walletChainsData: {
                chain1: {
                    wallet: mockCosmosWalletCreate,
                    signingCosmWasmClient: {},
                    skipClient: {},
                },
            },
        };

        const result = await CosmosWalletChains.create(
            mockMnemonic,
            availableChains
        );

        expect(result).toEqual(expectedResult);
    });
});
