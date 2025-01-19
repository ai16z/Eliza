import { Content } from "@elizaos/core";

export interface GetSongsContent extends Content {
    limit?: number;
    offset?: number;
}