import { elizaLogger, type IAgentRuntime } from "@elizaos/core";
import type { InstagramConfig } from "../environment";
import type { InstagramProfile } from "../types";
import { getIgClient } from "./state";

export async function fetchProfile(
    runtime: IAgentRuntime,
    config: InstagramConfig
  ): Promise<InstagramProfile> {
    const ig = getIgClient();

    try {
      const userInfo = await ig.user.info(ig.state.cookieUserId);

      const profile: InstagramProfile = {
        id: userInfo.pk.toString(),
        username: userInfo.username,
        name: userInfo.full_name,
        biography: userInfo.biography,
        mediaCount: userInfo.media_count,
        followerCount: userInfo.follower_count,
        followingCount: userInfo.following_count
      };

      // Cache profile info
      await runtime.cacheManager.set(
        `instagram/profile/${config.INSTAGRAM_USERNAME}`,
        profile
      );

      return profile;
    } catch (error) {
      elizaLogger.error('Error fetching profile:', error);
      throw error;
    }
  }
