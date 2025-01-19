import {
    composeContext,
    elizaLogger,
    generateObjectDeprecated,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    type Action,
} from "@elizaos/core";
import { validateBeatsFoundationConfig } from "../../environment";
import { getSongByIdExamples } from "./examples";
import { createSongService } from "./service";
import { getSongByIdTemplate } from "./template";
import { GetSongByIdContent } from "./types";
import { isGetSongByIdContent } from "./validation";

export default {
    name: "GET_SONG_BY_ID",
    similes: ["FETCH_SONG", "GET_SONG", "RETRIEVE_SONG"],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validateBeatsFoundationConfig(runtime);
        return true;
    },
    description: "Get a song by its ID from Beats Foundation",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting Beats Foundation GET_SONG_BY_ID handler...");

        // Initialize or update state
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        try {
            // Compose and generate content
            const context = composeContext({
                state,
                template: getSongByIdTemplate,
            });

            const content = (await generateObjectDeprecated({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
            })) as unknown as GetSongByIdContent;

            // Validate content
            if (!isGetSongByIdContent(content)) {
                throw new Error("Invalid song ID content");
            }

            // Get config with validation
            const config = await validateBeatsFoundationConfig(runtime);
            const songService = createSongService(config.BEATSFOUNDATION_API_KEY);

            try {
                const song = await songService.getSongById(content.songId);
                elizaLogger.success(
                    `Song retrieved successfully! ID: ${content.songId}, Title: ${song.title}`
                );

                if (callback) {
                    callback({
                        text: `Retrieved song: ${song.title}`,
                        content: song,
                    });
                }

                return true;
            } catch (error: any) {
                elizaLogger.error("Error in GET_SONG_BY_ID handler:", error);
                if (callback) {
                    callback({
                        text: `Error fetching song: ${error.message}`,
                        content: { error: error.message },
                    });
                }
                return false;
            }
        } catch (error: any) {
            elizaLogger.error("Error in GET_SONG_BY_ID handler:", error);
            if (callback) {
                callback({
                    text: `Error fetching song: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: getSongByIdExamples,
} as Action;