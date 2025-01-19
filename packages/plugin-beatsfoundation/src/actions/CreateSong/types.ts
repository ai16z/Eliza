import { Content } from "@elizaos/core";

export interface CreateSongContent extends Content {
    prompt: string;
    lyrics?: string;
    genre?: string;
    mood?: string;
    isInstrumental?: boolean;
}