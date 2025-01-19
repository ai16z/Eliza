import {
    elizaLogger,
    type IAgentRuntime,
    type Memory,
    type Provider,
    type State, type UUID,
} from "@elizaos/core";
import {validateAsteraiConfig} from "../environment.ts";
import {getInitAsteraiClient} from "../index.ts";

const asteraiProvider: Provider = {
    get: async (
        runtime: IAgentRuntime,
        message: Memory,
        _state?: State
    ): Promise<string | null> => {
        const hasConfiguredEnv =
          !!runtime.getSetting("ASTERAI_AGENT_ID") &&
          !!runtime.getSetting("ASTERAI_PUBLIC_QUERY_KEY");
        if (!hasConfiguredEnv) {
            elizaLogger.error(
                "ASTERAI_AGENT_ID or ASTERAI_PUBLIC_QUERY_KEY " +
                "not configured, skipping provider"
            );
            return null;
        }
        const config = await validateAsteraiConfig(runtime);
        const asteraiClient = getInitAsteraiClient(
          config.ASTERAI_AGENT_ID,
          config.ASTERAI_PUBLIC_QUERY_KEY
        );
        if (!asteraiClient) {
            elizaLogger.error("asteraiClient is not initialised");
            return null;
        }
        const agentId = runtime.getSetting("ASTERAI_AGENT_ID") as UUID;
        let agentSummaryMemory = await runtime.knowledgeManager.getMemoryById(agentId);
        if (!agentSummaryMemory) {
            // Fetch & set summary memory.
            const summary = await asteraiClient.fetchSummary();
            elizaLogger.debug("asterai agent summary fetched:", summary);
            await runtime.knowledgeManager.createMemory({
                id: agentId,
                userId: message.userId,
                agentId: message.agentId,
                roomId: message.roomId,
                createdAt: Date.now(),
                content: {
                    text: summary
                }
            });
            agentSummaryMemory = await runtime.knowledgeManager.getMemoryById(agentId);
        }
        if (!agentSummaryMemory) {
            elizaLogger.error("failed to initialise agent's summary memory");
            return null;
        }
        return agentSummaryMemory.content.text;
    },
};

// Module exports
export { asteraiProvider };
