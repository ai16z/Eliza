import {
    Action,
    composeContext,
    elizaLogger,
    generateMessageResponse,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
} from "@ai16z/eliza";
import { validateRaggraphConfig } from "./environment";
import { RAGGraphProvider } from "./provider";

export const searchTemplate = `Respond with a JSON object containing the information that you want to search with.

Example response:
\`\`\`json
{
    "reasoning": "Why you selected this query",
    "query": "The query you want to search with"
}
\`\`\`
{{recentMessages}}
Respond with a JSON markdown block containing both city and country.`;

export const searchAction: Action = {
    name: "SEARCH_RAGGRAPH",
    description: "Search for information in the RAG graph",
    similes: [
        "SEARCH",
        "SEARCH_RAGGRAPH",
        "SEARCH_RAG",
        "SEARCH_GRAPH",
        "REMEMBER",
        "RECALL",
        "REMEMBER_RAGGRAPH",
        "RECALL_RAGGRAPH",
        "RECALL_RAG",
        "RECALL_GRAPH",
    ],
    examples: [],
    validate: async (runtime: IAgentRuntime) => {
        await validateRaggraphConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        if (!state) {
            state = await runtime.composeState(message);
        }
        state = await runtime.updateRecentMessageState(state);

        const queryContext = composeContext({
            state,
            template: searchTemplate,
        });

        const content = await generateMessageResponse({
            runtime,
            context: queryContext,
            modelClass: ModelClass.SMALL,
        });
        const hasQuery = content?.query && content?.reasoning;

        if (!hasQuery) {
            return;
        }

        const config = await validateRaggraphConfig(runtime);
        const provider = new RAGGraphProvider(
            config.NEO4J_URI,
            config.NEO4J_USER,
            config.NEO4J_PASSWORD,
            runtime.cacheManager
        );
        const result = await provider.query(content.query as string);
        elizaLogger.success(
            `Successfully fetched weather for ${content.city}, ${content.country}`
        );

        if (callback) {
            callback({
                text: `The answer to your query is: ${result.fullContext}`,
                content: result.fullContext,
            });
        }
    },
};
