import { CreateSongContent } from "./types";

export function isCreateSongContent(content: unknown): content is CreateSongContent {
    if (!content || typeof content !== "object") return false;
    const c = content as CreateSongContent;

    if (typeof c.prompt !== "string" || c.prompt.length === 0) return false;
    if (c.lyrics !== undefined && typeof c.lyrics !== "string") return false;
    if (c.genre !== undefined && typeof c.genre !== "string") return false;
    if (c.mood !== undefined && typeof c.mood !== "string") return false;
    if (c.isInstrumental !== undefined && typeof c.isInstrumental !== "boolean") return false;

    return true;
}