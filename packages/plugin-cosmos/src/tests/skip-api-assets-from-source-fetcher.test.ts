import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { SkipApiAssetsFromSourceFetcher } from "../shared/services/skip-api/assets-from-source-fetcher/skip-api-assets-from-source-fetcher";

vi.mock("axios");

describe("SkipApiAssetsFromSourceFetcher", () => {
    let fetcher: SkipApiAssetsFromSourceFetcher;

    beforeEach(() => {
        fetcher = SkipApiAssetsFromSourceFetcher.getInstance();
        vi.clearAllMocks();
    });

    it("should return the same instance from getInstance", () => {
        const fetcher1 = SkipApiAssetsFromSourceFetcher.getInstance();
        const fetcher2 = SkipApiAssetsFromSourceFetcher.getInstance();
        expect(fetcher1).toBe(fetcher2);
    });

    it("should use cache when data is already fetched", async () => {
        const mockResponse = {
            dest_assets: {
                someKey: {
                    assets: [
                        {
                            denom: "atom",
                            chain_id: "cosmos",
                            origin_denom: "atom",
                            origin_chain_id: "cosmos",
                            trace: "someTrace",
                            symbol: "ATOM",
                            name: "Cosmos Atom",
                            logo_uri: "http://someurl.com/logo.png",
                            decimals: 6,
                            recommended_symbol: "ATOM",
                        },
                    ],
                },
            },
        };

        // @ts-expect-error -- ...
        axios.post.mockResolvedValueOnce({ data: mockResponse });

        const sourceAssetDenom = "atom";
        const sourceAssetChainId = "cosmos";

        await fetcher.fetch(sourceAssetDenom, sourceAssetChainId);

        expect(axios.post).toHaveBeenCalledTimes(1);

        await fetcher.fetch(sourceAssetDenom, sourceAssetChainId);
        expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it("should fetch and cache data correctly", async () => {
        const mockResponse = {
            dest_assets: {
                someKey: {
                    assets: [
                        {
                            denom: "atom",
                            chain_id: "cosmos",
                            origin_denom: "atom",
                            origin_chain_id: "cosmos",
                            trace: "someTrace",
                            symbol: "ATOM",
                            name: "Cosmos Atom",
                            logo_uri: "http://someurl.com/logo.png",
                            decimals: 6,
                            recommended_symbol: "ATOM",
                        },
                    ],
                },
            },
        };

        // @ts-expect-error -- ...
        axios.post.mockResolvedValueOnce({ data: mockResponse });

        const sourceAssetDenom = "atom";
        const sourceAssetChainId = "cosmos";

        const result = await fetcher.fetch(
            sourceAssetDenom,
            sourceAssetChainId
        );

        expect(result).toEqual(mockResponse);

        const cacheKey = `${sourceAssetDenom}_${sourceAssetChainId}`;
        expect(fetcher["cache"].has(cacheKey)).toBe(true);

        const cachedResult = await fetcher.fetch(
            sourceAssetDenom,
            sourceAssetChainId
        );
        expect(cachedResult).toEqual(mockResponse);
    });
});
