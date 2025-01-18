import {
    elizaLogger,
    type IAgentRuntime,
    type Memory,
    type Provider,
    type State,
} from "@elizaos/core";
import NodeCache from "node-cache";
import { AlloraAPIClient, type AlloraTopic, type ChainSlug } from "@alloralabs/allora-sdk";

export class TopicsProvider implements Provider {
    private cache: NodeCache;

    constructor() {
        this.cache = new NodeCache({ stdTTL: 30 * 60 }); // Cache TTL set to 30 minutes
    }

    async get(
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string | null> {
        const alloraTopics = await this.getAlloraTopics(runtime);

        // Format the topics into a string to be added to the prompt context
        let output = `Allora Network Topics: \n`;
        for (const topic of alloraTopics) {
            output += `Topic Name: ${topic.topic_name}\n`;
            output += `Topic Description: ${topic.description}\n`;
            output += `Topic ID: ${topic.topic_id}\n`;
            output += `Topic is Active: ${topic.is_active}\n`;
            output += `Topic Updated At: ${topic.updated_at}\n`;
            output += `\n`;
        }

        return output;
    }

    private async getAlloraTopics(
        runtime: IAgentRuntime
    ): Promise<AlloraTopic[]> {
        const cacheKey = "allora-topics";
        const cachedValue = this.cache.get<AlloraTopic[]>(cacheKey);

        // If the topics are aready cached, return them
        if (cachedValue) {
            elizaLogger.info("Retrieving Allora topics from cache");
            return cachedValue;
        }

        // If the topics are not cached, retrieve them from the Allora API
        const alloraApiKey = runtime.getSetting("ALLORA_API_KEY");
        const alloraChainSlug = runtime.getSetting("ALLORA_CHAIN_SLUG");

        const alloraApiClient = new AlloraAPIClient({
            chainSlug: alloraChainSlug as ChainSlug,
            apiKey: alloraApiKey as string,
        });
        const alloraTopics = await alloraApiClient.getAllTopics();

        // Cache the retrieved topics
        this.cache.set(cacheKey, alloraTopics);

        return alloraTopics;
    }
}

export const topicsProvider = new TopicsProvider();
