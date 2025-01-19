// src/lib/actions.ts
import { elizaLogger } from "@elizaos/core";
import type { Comment } from "../types";
import { getIgClient } from "./state";

/**
 * Fetches comments for a specific media post
 */
export async function fetchComments(
  mediaId: string,
  count = 20
): Promise<Comment[]> {
  const ig = getIgClient();

  try {
    const feed = ig.feed.mediaComments(mediaId);
    const comments = await feed.items();

    return comments.slice(0, count).map(comment => ({
      id: comment.pk.toString(),
      text: comment.text,
      timestamp: new Date(comment.created_at * 1000).toISOString(),
      username: comment.user.username,
      replies: [] // Instagram API doesn't provide replies in the same call
    }));
  } catch (error) {
    elizaLogger.error('Error fetching comments:', error);
    throw error;
  }
}

/**
 * Posts a comment on a media post
 */
export async function postComment(
  mediaId: string,
  text: string
): Promise<Comment> {
  const ig = getIgClient();

  try {
    const result = await ig.media.comment({
      mediaId,
      text: text.slice(0, 2200) // Instagram comment length limit
    });

    return {
      id: result.pk.toString(),
      text: result.text,
      timestamp: new Date(result.created_at * 1000).toISOString(),
      username: result.user.username,
      replies: []
    };
  } catch (error) {
    elizaLogger.error('Error posting comment:', error);
    throw error;
  }
}

/**
 * Likes a media post
 */
export async function likeMedia(mediaId: string): Promise<void> {
  const ig = getIgClient();

  try {
    await ig.media.like({
      mediaId,
      moduleInfo: {
        module_name: 'profile',
        user_id: ig.state.cookieUserId,
        username: ig.state.cookieUsername
      }
    });
    elizaLogger.log(`Liked media: ${mediaId}`);
  } catch (error) {
    elizaLogger.error('Error liking media:', error);
    throw error;
  }
}

/**
 * Unlikes a media post
 */
export async function unlikeMedia(mediaId: string): Promise<void> {
  const ig = getIgClient();

  try {
    await ig.media.unlike({
      mediaId,
      moduleInfo: {
        module_name: 'profile',
        user_id: ig.state.cookieUserId,
        username: ig.state.cookieUsername
      }
    });
    elizaLogger.log(`Unliked media: ${mediaId}`);
  } catch (error) {
    elizaLogger.error('Error unliking media:', error);
    throw error;
  }
}

/**
 * Replies to a comment
 */
export async function replyToComment(
  mediaId: string,
  commentId: string,
  text: string
): Promise<Comment> {
  const ig = getIgClient();

  try {
    const result = await ig.media.comment({
      mediaId,
      text: text.slice(0, 2200), // Instagram comment length limit
      replyToCommentId: commentId
    });

    return {
      id: result.pk.toString(),
      text: result.text,
      timestamp: new Date(result.created_at * 1000).toISOString(),
      username: result.user.username,
      replies: []
    };
  } catch (error) {
    elizaLogger.error('Error replying to comment:', error);
    throw error;
  }
}

/**
 * Deletes a comment
 */
export async function deleteComment(
  mediaId: string,
  commentId: string
): Promise<void> {
  const ig = getIgClient();

  try {
    await ig.media.deleteComment({
      mediaId,
      commentId
    });
    elizaLogger.log(`Deleted comment: ${commentId} from media: ${mediaId}`);
  } catch (error) {
    elizaLogger.error('Error deleting comment:', error);
    throw error;
  }
}

/**
 * Checks if current user has liked a media post
 */
export async function hasLikedMedia(mediaId: string): Promise<boolean> {
  const ig = getIgClient();

  try {
    const info = await ig.media.info(mediaId);
    return info.items[0].has_liked ?? false;
  } catch (error) {
    elizaLogger.error('Error checking if media is liked:', error);
    throw error;
  }
}