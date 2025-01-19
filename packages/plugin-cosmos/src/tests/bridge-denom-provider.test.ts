import { vi, expect, it, beforeEach, describe } from "vitest";
import { bridgeDenomProvider } from "../actions/ibc-transfer/services/bridge-denom-provider";
import { SkipApiAssetsFromSourceFetcher } from "../shared/services/skip-api/assets-from-source-fetcher/skip-api-assets-from-source-fetcher";

vi.mock("./bridge-data-fetcher", () => ({
    BridgeDataFetcher: {
        getInstance: vi.fn().mockReturnValue({
            fetch: vi.fn(),
        }),
    },
}));

describe("bridgeDataProvider", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockFetchBridgeData: any;

    beforeEach(() => {
        mockFetchBridgeData = vi.fn();
        SkipApiAssetsFromSourceFetcher.getInstance().fetch =
            mockFetchBridgeData;
    });

    it("should return correct channelId and ibcDenom when valid data is returned", async () => {
        const mockResponse = {
            dest_assets: {
                osmos: {
                    assets: [
                        {
                            origin_denom: "atom",
                            denom: "uatom",
                            trace: "channel-123/abc",
                        },
                    ],
                },
            },
        };

        mockFetchBridgeData.mockResolvedValue(mockResponse);

        const sourceAssetDenom = "atom";
        const sourceAssetChainId = "cosmos";
        const destinationAdssetChainId = "osmos";

        const result = await bridgeDenomProvider(
            sourceAssetDenom,
            sourceAssetChainId,
            destinationAdssetChainId
        );

        expect(result).toEqual({
            denom: "uatom",
        });
    });

    it("should throw an error when ibcAssetData is not found", async () => {
        const mockResponse = {
            dest_assets: {
                osmos: {
                    assets: [
                        {
                            origin_denom: "btc",
                            denom: "ubtc",
                            trace: "channel-123/abc",
                        },
                    ],
                },
            },
        };

        mockFetchBridgeData.mockResolvedValue(mockResponse);

        const sourceAssetDenom = "atom";
        const sourceAssetChainId = "cosmos";
        const destinationAdssetChainId = "osmos";

        await expect(
            bridgeDenomProvider(
                sourceAssetDenom,
                sourceAssetChainId,
                destinationAdssetChainId
            )
        ).rejects.toThrowError();
    });
});
