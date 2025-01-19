import { GetSongsContent } from "./types";

export function isGetSongsContent(content: unknown): content is GetSongsContent {
    if (!content || typeof content !== "object") return false;
    const c = content as GetSongsContent;

    if (c.limit !== undefined && (typeof c.limit !== "number" || c.limit < 0)) return false;
    if (c.offset !== undefined && (typeof c.offset !== "number" || c.offset < 0)) return false;

    return true;
}