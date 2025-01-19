import { elizaLogger, type IAgentRuntime } from "@elizaos/core";
import type { InstagramConfig } from "../environment";
import type { MediaItem } from "../types";
import { getIgClient } from "./state";

export async function fetchRecentMedia(
    runtime: IAgentRuntime,
    config: InstagramConfig,
    count = 10
  ): Promise<MediaItem[]> {
    const ig = getIgClient();

    try {
      const feed = ig.feed.user(ig.state.cookieUserId);
      const items = await feed.items();

      return items.slice(0, count).map((item: any) => ({
        id: item.id,
        mediaType: item.media_type as MediaItem['mediaType'],
        mediaUrl: item.media_url,
        thumbnailUrl: item.thumbnail_url || null,
        permalink: item.permalink,
        caption: item.caption?.text || null,
        timestamp: item.timestamp,
        children: item.children?.map((child: any) => ({
          id: child.id,
          mediaType: child.media_type as MediaItem['mediaType'],
          mediaUrl: child.media_url,
          thumbnailUrl: child.thumbnail_url || null,
          permalink: child.permalink,
          timestamp: child.timestamp
        })) || null
      }));
    } catch (error) {
      elizaLogger.error('Error fetching recent media:', error);
      throw error;
    }
  }