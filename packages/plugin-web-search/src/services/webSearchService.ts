import { Service, IAgentRuntime } from "@elizaos/core";
import { tavily } from "@tavily/core";
import { IWebSearchService, SearchOptions, SearchResponse } from "../types";

export type TavilyClient = ReturnType<typeof tavily>; // declaring manually because orginal package does not export its types

const WEB_SEARCH_SERVICE_TYPE = "web_search";

export class WebSearchService extends Service implements IWebSearchService {
    public tavilyClient: TavilyClient;

    async initialize(_runtime: IAgentRuntime): Promise<void> {
        const apiKey = _runtime.getSetting("TAVILY_API_KEY") as string;
        if (!apiKey) {
            throw new Error("TAVILY_API_KEY is not set");
        }
        this.tavilyClient = tavily({ apiKey });
    }

    getInstance(): IWebSearchService {
        return WebSearchService.getInstance();
    }

    getMethods() {
        return {
            search: this.search.bind(this),
        };
    }

    static get serviceType(): string {
        return WEB_SEARCH_SERVICE_TYPE;
    }

    async search(
        query: string,
        options?: SearchOptions
    ): Promise<SearchResponse> {
        try {
            const response = await this.tavilyClient.search(query, {
                includeAnswer: options?.includeAnswer || true,
                maxResults: options?.limit || 3,
                topic: options?.type || "general",
                searchDepth: options?.searchDepth || "basic",
                includeImages: options?.includeImages || false,
                days: options?.days || 3,
            });

            return response;
        } catch (error) {
            console.error("Web search error:", error);
            throw error;
        }
    }
}
