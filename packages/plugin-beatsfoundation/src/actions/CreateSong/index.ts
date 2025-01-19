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
import { createSongExamples } from "./examples";
import { createSongService } from "./service";
import { createSongTemplate } from "./template";
import { CreateSongContent } from "./types";
import { isCreateSongContent } from "./validation";

export default {
    name: "CREATE_SONG",
    similes: ["GENERATE_SONG", "MAKE_SONG", "COMPOSE_SONG"],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validateBeatsFoundationConfig(runtime);
        return true;
    },
    description: "Create a new song using Beats Foundation",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting Beats Foundation CREATE_SONG handler...");

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
                template: createSongTemplate,
            });

            const content = (await generateObjectDeprecated({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
            })) as unknown as CreateSongContent;

            // Validate content
            if (!isCreateSongContent(content)) {
                throw new Error("Invalid song creation content");
            }

            // Get config with validation
            const config = await validateBeatsFoundationConfig(runtime);
            const songService = createSongService(config.BEATSFOUNDATION_API_KEY);

            try {
                const song = await songService.createSong(content);
                elizaLogger.success(
                    `Song created successfully! Title: ${song.title}`
                );

                if (callback) {
                    callback({
                        text: `Created new song: ${song.title}`,
                        content: {
                            song,
                            request: content
                        },
                    });
                }

                return true;
            } catch (error: any) {
                elizaLogger.error("Error in CREATE_SONG handler:", error);
                if (callback) {
                    callback({
                        text: `Error creating song: ${error.message}`,
                        content: { error: error.message },
                    });
                }
                return false;
            }
        } catch (error: any) {
            elizaLogger.error("Error in CREATE_SONG handler:", error);
            if (callback) {
                callback({
                    text: `Error creating song: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: createSongExamples,
} as Action;