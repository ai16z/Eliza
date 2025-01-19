import { type Client, type IAgentRuntime, elizaLogger } from "@elizaos/core";

export class AutoClient {
    interval: NodeJS.Timeout;
    runtime: IAgentRuntime;

    constructor(runtime: IAgentRuntime) {
        this.runtime = runtime;

        // start a loop that runs every x seconds
        this.interval = setInterval(
            async () => {
                elizaLogger.log("running auto client...");
            },
            60 * 60 * 1000
        ); // 1 hour in milliseconds
    }
}

export const AutoClientInterface: Client = {
    start: async (runtime: IAgentRuntime) => {
        const client = new AutoClient(runtime);
        return client;
    },
    stop: async (_runtime: IAgentRuntime) => {
        console.warn("Direct client does not support stopping yet");
    },
};

export default AutoClientInterface;
