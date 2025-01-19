import { type Action, elizaLogger } from "@elizaos/core";
import type { IAgentRuntime, Memory, State, HandlerCallback, Content, ActionExample } from "@elizaos/core";
import { SDL } from "@akashnetwork/akashjs/build/sdl";
import { validateAkashConfig } from "../environment";
import { AkashError, AkashErrorCode } from "../error/error";
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
// import { getAkashTypeRegistry } from "@akashnetwork/akashjs/build/stargate";
import { getDefaultSDLPath } from "../utils/paths";

interface GetManifestContent extends Content {
    sdl?: string;
    sdlFile?: string;
}

// elizaLogger.info("Default SDL path initialized", { DEFAULT_SDL_PATH });
// elizaLogger.info("Loading SDL from file", { filePath });
// elizaLogger.info("Resolved SDL file path", { resolvedPath });
// elizaLogger.error("SDL file not found", { resolvedPath });
// elizaLogger.info("SDL file loaded successfully", { content });
// elizaLogger.error("Failed to read SDL file", { error });
// elizaLogger.error("SDL validation failed", { error });
// elizaLogger.info("Using provided SDL content");
// elizaLogger.info("Loading SDL from file", { path: params.sdlFile });
// elizaLogger.info("Loading default SDL", { path: DEFAULT_SDL_PATH });
// elizaLogger.debug("Parsing SDL content and generating manifest");

const DEFAULT_SDL_PATH = (() => {
    const currentFileUrl = import.meta.url;
    const sdlPath = getDefaultSDLPath(currentFileUrl);

    // Only log if file doesn't exist
    if (!fs.existsSync(sdlPath)) {
        elizaLogger.warn("Default SDL path not found", {
            sdlPath,
            exists: false
        });
    }

    return sdlPath;
})();

const loadSDLFromFile = (filePath: string): string => {
    try {
        // If path doesn't contain plugin-akash and it's not the default path, adjust it
        if (!filePath.includes('plugin-akash') && filePath !== DEFAULT_SDL_PATH) {
            const adjustedPath = path.join(path.dirname(DEFAULT_SDL_PATH), path.basename(filePath));
            filePath = adjustedPath;
        }

        // Try multiple possible locations
        const possiblePaths = [
            filePath,
            path.join(process.cwd(), filePath),
            path.join(process.cwd(), 'packages', 'plugin-akash', filePath),
            path.join(process.cwd(), 'packages', 'plugin-akash', 'src', filePath),
            path.join(path.dirname(DEFAULT_SDL_PATH), filePath)
        ];

        for (const tryPath of possiblePaths) {
            if (fs.existsSync(tryPath)) {
                const content = fs.readFileSync(tryPath, "utf8");
                elizaLogger.info("SDL file loaded successfully from", {
                    path: tryPath
                });
                return content;
            }
        }

        // If we get here, none of the paths worked
        throw new AkashError(
            `SDL file not found in any of the possible locations`,
            AkashErrorCode.VALIDATION_SDL_FAILED,
            {
                filePath,
                triedPaths: possiblePaths
            }
        );
    } catch (error) {
        elizaLogger.error("Failed to read SDL file", {
            filePath,
            error: error instanceof Error ? error.message : String(error)
        });
        throw new AkashError(
            `Failed to read SDL file: ${error instanceof Error ? error.message : String(error)}`,
            AkashErrorCode.VALIDATION_SDL_FAILED,
            { filePath }
        );
    }
};

const validateSDL = (sdlContent: string, validationLevel = "strict"): boolean => {
    try {
        // First try to parse as YAML
        const parsed = yaml.load(sdlContent);
        if (!parsed || typeof parsed !== 'object') {
            throw new Error('Invalid SDL format: not a valid YAML object');
        }

        if (validationLevel === "none") {
            // elizaLogger.debug("Skipping SDL validation (validation level: none)");
            return true;
        }

        // Required sections based on validation level
        const requiredSections = ['version', 'services'];
        const sectionsToCheck = validationLevel === "strict" ?
            [...requiredSections, 'profiles', 'deployment'] :
            requiredSections;

        for (const section of sectionsToCheck) {
            if (!(section in parsed)) {
                throw new Error(`Invalid SDL format: missing required section '${section}'`);
            }
        }

        // elizaLogger.debug("SDL validation successful", {
        //     validationLevel,
        //     checkedSections: sectionsToCheck
        // });
        return true;
    } catch (error) {
        elizaLogger.error("SDL validation failed", {
            error: error instanceof Error ? error.message : String(error),
            validationLevel
        });
        return false;
    }
};

export const getManifestAction: Action = {
    name: "GET_MANIFEST",
    similes: ["LOAD_MANIFEST", "READ_MANIFEST", "PARSE_MANIFEST"],
    description: "Load and validate SDL to generate a manifest for Akash deployments",
    examples: [[
        {
            user: "user",
            content: {
                text: "Get manifest from SDL file",
                sdlFile: "deployment.yml"
            } as GetManifestContent
        } as ActionExample
    ]],

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        elizaLogger.debug("Validating manifest request", { message });
        try {
            const params = message.content as Partial<GetManifestContent>;
            const config = await validateAkashConfig(runtime);

            // Either SDL content or file path must be provided
            if (!params.sdl && !params.sdlFile && !config.AKASH_SDL) {
                throw new AkashError(
                    "Either SDL content, file path, or AKASH_SDL environment variable must be provided",
                    AkashErrorCode.VALIDATION_PARAMETER_MISSING,
                    { parameters: ["sdl", "sdlFile", "AKASH_SDL"] }
                );
            }

            // If SDL content is provided, validate it
            if (params.sdl) {
                const validationLevel = config.AKASH_MANIFEST_VALIDATION_LEVEL || "strict";
                if (!validateSDL(params.sdl, validationLevel)) {
                    throw new AkashError(
                        "Invalid SDL format",
                        AkashErrorCode.VALIDATION_SDL_FAILED
                    );
                }
            }

            return true;
        } catch (error) {
            elizaLogger.error("Manifest validation failed", {
                error: error instanceof AkashError ? {
                    code: error.code,
                    message: error.message,
                    details: error.details
                } : String(error)
            });
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        _options: { [key: string]: unknown; } = {},
        callback?: HandlerCallback
    ): Promise<boolean> => {
        const actionId = Date.now().toString();
        elizaLogger.info("Starting manifest operation", { actionId });

        try {
            const config = await validateAkashConfig(runtime);
            const params = message.content as Partial<GetManifestContent>;

            let sdlContent: string;
            try {
                // Load SDL content based on priority: params.sdl > params.sdlFile > config.AKASH_SDL
                if (params.sdl) {
                    sdlContent = params.sdl;
                    elizaLogger.info("Using provided SDL content");
                } else if (params.sdlFile) {
                    sdlContent = loadSDLFromFile(params.sdlFile);
                    elizaLogger.info("Loaded SDL from file", { path: params.sdlFile });
                } else {
                    const sdlPath = config.AKASH_SDL || DEFAULT_SDL_PATH;
                    sdlContent = loadSDLFromFile(sdlPath);
                    elizaLogger.info("Using SDL from environment", { path: sdlPath });
                }

                // Validate based on environment settings
                const validationLevel = config.AKASH_MANIFEST_VALIDATION_LEVEL || "strict";
                const isValid = validateSDL(sdlContent, validationLevel);

                if (!isValid) {
                    throw new AkashError(
                        "SDL validation failed",
                        AkashErrorCode.VALIDATION_SDL_FAILED
                    );
                }

                // Check manifest mode
                const manifestMode = config.AKASH_MANIFEST_MODE || "auto";
                if (manifestMode === "validate_only") {
                    elizaLogger.info("Validation successful (validate_only mode)");
                    if (callback) {
                        const callbackResponse = {
                            text: "SDL validation successful",
                            content: {
                                success: true,
                                data: {
                                    validationLevel,
                                    mode: manifestMode
                                },
                                metadata: {
                                    timestamp: new Date().toISOString(),
                                    source: 'akash-plugin',
                                    action: 'getManifest',
                                    version: '1.0.0',
                                    actionId
                                }
                            }
                        };
                        callback(callbackResponse);
                    }
                    return true;
                }

                // Generate manifest
                const sdl = new SDL(yaml.load(sdlContent) as any);
                const manifest = sdl.manifest();

                // Save manifest if path is specified
                if (config.AKASH_MANIFEST_PATH) {
                    const manifestPath = path.join(
                        config.AKASH_MANIFEST_PATH,
                        `manifest-${Date.now()}.yaml`
                    );
                    fs.writeFileSync(manifestPath, yaml.dump(manifest), 'utf8');
                    elizaLogger.info("Manifest saved", { path: manifestPath });
                }

                if (callback) {
                    const callbackResponse = {
                        text: "Manifest generated successfully",
                        content: {
                            success: true,
                            data: {
                                manifest,
                                settings: {
                                    mode: manifestMode,
                                    validationLevel,
                                    outputPath: config.AKASH_MANIFEST_PATH
                                }
                            },
                            metadata: {
                                timestamp: new Date().toISOString(),
                                source: 'akash-plugin',
                                action: 'getManifest',
                                version: '1.0.0',
                                actionId
                            }
                        }
                    };
                    callback(callbackResponse);
                }

                return true;
            } catch (error) {
                const formattedError = error instanceof Error ? error.message : String(error);
                elizaLogger.error("Manifest operation failed", {
                    error: formattedError,
                    settings: {
                        mode: config.AKASH_MANIFEST_MODE || "auto",
                        validationLevel: config.AKASH_MANIFEST_VALIDATION_LEVEL || "strict",
                        outputPath: config.AKASH_MANIFEST_PATH
                    }
                });

                if (callback) {
                    const errorResponse = {
                        text: "Failed to process manifest",
                        content: {
                            success: false,
                            error: error instanceof AkashError ? {
                                code: error.code,
                                message: error.message,
                                details: error.details
                            } : {
                                code: AkashErrorCode.MANIFEST_PARSING_FAILED,
                                message: formattedError
                            },
                            metadata: {
                                timestamp: new Date().toISOString(),
                                source: 'akash-plugin',
                                action: 'getManifest',
                                version: '1.0.0',
                                actionId
                            }
                        }
                    };
                    callback(errorResponse);
                }
                return false;
            }
        } catch (error) {
            elizaLogger.error("Manifest operation failed", {
                error: error instanceof Error ? error.message : String(error),
                actionId
            });

            if (callback) {
                const errorResponse = {
                    text: "Manifest operation failed",
                    content: {
                        success: false,
                        error: {
                            code: AkashErrorCode.MANIFEST_PARSING_FAILED,
                            message: error instanceof Error ? error.message : String(error)
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: 'akash-plugin',
                            action: 'getManifest',
                            version: '1.0.0',
                            actionId
                        }
                    }
                };
                callback(errorResponse);
            }

            return false;
        }
    }
};

export default getManifestAction;
