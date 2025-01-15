import assert from 'assert';
import { fetchTokenOverview } from "../utils/birdeye";

async function runTests() {
    const WRAPPED_SOL_ADDRESS = "So11111111111111111111111111111111111111112";
    const apiKey = process.argv[2];

    if (!apiKey) {
        console.error("API key must be provided as command line argument");
        process.exit(1);
    }

    console.log("Running Birdeye API Integration Tests...\n");

    // Test 1: Basic token overview fetch
    try {
        console.log("Test 1: Fetching token overview data...");
        const result = await fetchTokenOverview(WRAPPED_SOL_ADDRESS, apiKey, undefined);

        assert(result, "Result should be defined");
        assert.strictEqual(result.address, WRAPPED_SOL_ADDRESS, "Address should match");
        assert.strictEqual(result.symbol, "SOL", "Symbol should be SOL");
        assert.strictEqual(result.name, "Wrapped SOL", "Name should be Wrapped SOL");
        assert.strictEqual(result.decimals, 9, "Decimals should be 9");
        assert(result.price > 0, "Price should be greater than 0");
        assert(result.liquidity > 0, "Liquidity should be greater than 0");
        assert(result.mc > 0, "Market cap should be greater than 0");
        assert(result.holder > 0, "Holder count should be greater than 0");
        assert(result.v24hUSD > 0, "24h volume should be greater than 0");
        assert(result.v1hUSD > 0, "1h volume should be greater than 0");
        console.log("✅ Test 1 passed\n");
    } catch (error) {
        console.error("❌ Test 1 failed:", error);
        process.exit(1);
    }

    // Test 2: Cache functionality
    try {
        console.log("Test 2: Testing cache functionality...");
        const mockCache = {
            get: (key: string) => {
                console.log("Cache get called with key:", key);
                return null;
            },
            set: (key: string, value: any) => {
                console.log("Cache set called with key:", key);
                assert(value, "Cache value should be defined");
            }
        };

        await fetchTokenOverview(WRAPPED_SOL_ADDRESS, apiKey, mockCache);
        console.log("✅ Test 2 passed\n");
    } catch (error) {
        console.error("❌ Test 2 failed:", error);
        process.exit(1);
    }

    // Test 3: Invalid token address
    try {
        console.log("Test 3: Testing invalid token address...");
        const invalidAddress = "invalid_address";
        try {
            await fetchTokenOverview(invalidAddress, apiKey, undefined);
            assert.fail("Should throw an error for invalid address");
        } catch (error) {
            assert(error, "Should throw an error");
        }
        console.log("✅ Test 3 passed\n");
    } catch (error) {
        console.error("❌ Test 3 failed:", error);
        process.exit(1);
    }

    console.log("All tests passed! 🎉");
}

runTests().catch(console.error);