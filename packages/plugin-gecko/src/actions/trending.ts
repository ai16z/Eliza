import {
    Action,
    elizaLogger,
    IAgentRuntime,
    Memory,
    HandlerCallback,
    State,
    getEmbeddingZeroVector,
} from "@elizaos/core";

function getBaseUrl(runtime: IAgentRuntime): string {
    const isPro =
        (runtime.getSetting("COINGECKO_PRO") ?? process.env.COINGECKO_PRO) ===
        "TRUE";
    return isPro
        ? "https://pro-api.coingecko.com/api/v3"
        : "https://api.coingecko.com/api/v3";
}

const createTokenMemory = async (
    runtime: IAgentRuntime,
    state: State,
    formattedOutput: string
): Promise<Memory> => {
    const memory: Memory = {
        userId: runtime.agentId,
        agentId: runtime.agentId,
        roomId: state.roomId,
        content: {
            text: formattedOutput,
        },
        createdAt: Date.now(),
        embedding: getEmbeddingZeroVector(),
    };
    await runtime.messageManager.createMemory(memory);
    return memory;
};

export const getTrendingAction: Action = {
    name: "GET_TRENDING_COINS",
    description:
        "Get the current trending cryptocurrencies from CoinGecko API.",
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.log("Validating runtime for GET_TRENDING_COINS...");
        return !!(
            runtime.getSetting("COINGECKO_API_KEY") ||
            process.env.COINGECKO_API_KEY
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Starting GET_TRENDING_COINS handler...");

        try {
            const apiKey =
                runtime.getSetting("COINGECKO_API_KEY") ??
                process.env.COINGECKO_API_KEY;
            const isPro =
                (runtime.getSetting("COINGECKO_PRO") ??
                    process.env.COINGECKO_PRO) === "TRUE";
            const baseUrl = getBaseUrl(runtime);

            // Update the state with current inputs
            if (!state) {
                state = (await runtime.composeState(_message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }

            // Fetch trending coins
            const url = `${baseUrl}/search/trending`;
            const trendingResponse = await fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    ...(isPro
                        ? { "x-cg-pro-api-key": apiKey }
                        : { "x-cg-demo-api-key": apiKey }),
                },
            });

            if (!trendingResponse.ok) {
                throw new Error(
                    `HTTP error! status: ${trendingResponse.status}`
                );
            }

            const trendingData = await trendingResponse.json();

            if (!trendingData.coins || trendingData.coins.length === 0) {
                callback(
                    {
                        text: "No trending coins found.",
                    },
                    []
                );
                return;
            }

            // Format the output for each trending coin
            const trendingCoinsOutput = trendingData.coins
                .map((coinData: any, index: number) => {
                    const coin = coinData.item;
                    const price = coin.data.price;
                    const marketCap = coin.data.market_cap
                        .replace("$", "")
                        .replace(",", "");
                    const volume = coin.data.total_volume
                        .replace("$", "")
                        .replace(",", "");

                    return `${index + 1}. ${coin.name} (${coin.symbol.toUpperCase()})
   Price: $${parseFloat(price).toFixed(6)} USD
   Market Cap: ${coin.data.market_cap}
   Volume: ${coin.data.total_volume}`;
                })
                .join("\n\n");

            const formattedOutput = `🔥 Trending Cryptocurrencies:\n\n${trendingCoinsOutput}`;

            // Update state using createTokenMemory
            state = (await runtime.composeState(
                await createTokenMemory(runtime, state, formattedOutput)
            )) as State;

            // Make the callback with the formatted output
            callback(
                {
                    text: formattedOutput,
                },
                []
            );
        } catch (error) {
            elizaLogger.error("Error fetching trending coins:", error);
            callback(
                {
                    text: "Failed to fetch trending coins. Please check the logs for more details.",
                },
                []
            );
        }
    },
    examples: [],
    similes: [
        "GET_TRENDING_COINS",
        "FETCH_TRENDING_CRYPTO",
        "CHECK_TRENDING_TOKENS",
        "LOOKUP_TRENDING_COINS",
        "GET_HOT_COINS",
        "CHECK_POPULAR_CRYPTO",
        "FETCH_TOP_TRENDING",
    ],
};
