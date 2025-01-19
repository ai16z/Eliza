import {
    composeContext,
    elizaLogger,
    generateText,
    getEmbeddingZeroVector,
    type IAgentRuntime,
    ModelClass,
    stringToUuid,
    type UUID
} from "@elizaos/core";
import { fetchComments, likeMedia, postComment } from "../lib/actions";
import { getIgClient } from "../lib/state";
import type { InstagramState } from "../types";

  // Templates
  const instagramCommentTemplate = `
  # Areas of Expertise
  {{knowledge}}

  # About {{agentName}} (@{{instagramUsername}}):
  {{bio}}
  {{lore}}
  {{topics}}

  {{providers}}

  {{characterPostExamples}}

  {{postDirections}}

  # Task: Generate a response to the following Instagram comment in the voice and style of {{agentName}}.
  Original Comment (@{{commentUsername}}): {{commentText}}

  Your response should be friendly, engaging, and natural. Keep it brief (1-2 sentences).
  Do not use hashtags in comment responses. Be conversational and authentic.`;

  const shouldInteractTemplate = `
  # About {{agentName}} (@{{instagramUsername}}):
  {{bio}}
  {{lore}}
  {{topics}}

  {{postDirections}}

  # Task: Determine if {{agentName}} should interact with this content:
  Interaction Type: {{interactionType}}
  User: @{{username}}
  Content: {{content}}

  Consider:
  1. Is this user's content relevant to {{agentName}}'s interests?
  2. Would interaction be authentic and meaningful?
  3. Is there potential for valuable engagement?

  Respond with one of:
  [INTERACT] - Content is highly relevant and engagement would be valuable
  [SKIP] - Content is not relevant enough or engagement wouldn't be authentic

  Choose [INTERACT] only if very confident about relevance and value.`;

  export class InstagramInteractionService {
    private runtime: IAgentRuntime;
    private state: InstagramState;
    private isProcessing = false;
    private stopProcessing = false;

    constructor(runtime: IAgentRuntime, state: InstagramState) {
      this.runtime = runtime;
      this.state = state;
    }

    async start() {
      const handleInteractionsLoop = () => {
        this.handleInteractions();
        if (!this.stopProcessing) {
          setTimeout(
            handleInteractionsLoop,
            Number.parseInt(this.runtime.getSetting('ACTION_INTERVAL') || '300', 10) * 1000
          );
        }
      };

      handleInteractionsLoop();
    }

    async stop() {
      this.stopProcessing = true;
    }

    private async generateResponse(
      text: string,
      username: string,
      action: string
    ) {
      const state = await this.runtime.composeState(
        {
          userId: this.runtime.agentId,
          roomId: stringToUuid(`instagram-temp-${Date.now()}-${this.runtime.agentId}`),
          agentId: this.runtime.agentId,
          content: {
            text,
            action,
          },
        },
        {
          instagramUsername: this.state.profile?.username,
          commentUsername: username,
          commentText: text,
        }
      );

      const context = composeContext({
        state,
        template: instagramCommentTemplate,
      });

      const response = await generateText({
        runtime: this.runtime,
        context,
        modelClass: ModelClass.SMALL,
      });

      return this.cleanResponse(response);
    }

    private cleanResponse(response: string): string {
      return response
        .replace(/^\s*{?\s*"text":\s*"|"\s*}?\s*$/g, "")
        .replace(/^['"](.*)['"]$/g, "$1")
        .replace(/\\"/g, '"')
        .trim();
    }

    private async handleInteractions() {
      if (this.isProcessing) {
        elizaLogger.log("Already processing interactions, skipping");
        return;
      }

      try {
        this.isProcessing = true;
        elizaLogger.log("Checking Instagram interactions");

        const ig = getIgClient();
        const activity = await ig.feed.news().items();

        for (const item of activity) {
          const activityId = `instagram-activity-${item.pk}`;
          if (await this.runtime.cacheManager.get(activityId)) continue;

          switch (item.type) {
            case 2: // Comment on your post
              await this.handleComment(item);
              break;
            case 3: // Like on your post
              await this.handleLike(item);
              break;
            case 12: // Mention in comment
              await this.handleMention(item);
              break;
          }

          await this.runtime.cacheManager.set(activityId, true);
        }
      } catch (error) {
        elizaLogger.error("Error handling Instagram interactions:", error);
      } finally {
        this.isProcessing = false;
      }
    }

    private async handleComment(item: any) {
      try {
        const comments = await fetchComments(item.media_id);
        const comment = comments.find(c => c.id === item.pk.toString());
        if (!comment) return;

        const roomId = stringToUuid(`instagram-comment-${item.media_id}-${this.runtime.agentId}`);
        const commentId = stringToUuid(`instagram-comment-${comment.id}-${this.runtime.agentId}`);
        const userId = stringToUuid(`instagram-user-${item.user_id}-${this.runtime.agentId}`);

        const cleanedResponse = await this.generateResponse(
          comment.text,
          comment.username,
          "COMMENT"
        );

        if (!cleanedResponse) {
          elizaLogger.error("Failed to generate valid comment response");
          return;
        }

        await this.ensureEntities(roomId, userId, comment.username);
        await this.createInteractionMemories(
          commentId,
          userId,
          roomId,
          comment,
          cleanedResponse,
          item.media_id
        );

      } catch (error) {
        elizaLogger.error("Error handling comment:", error);
      }
    }

    private async handleLike(item: any) {
      try {
        const state = await this.runtime.composeState(
          {
            userId: this.runtime.agentId,
            roomId: stringToUuid(`instagram-like-${item.media_id}-${this.runtime.agentId}`),
            agentId: this.runtime.agentId,
            content: { text: "", action: "DECIDE_INTERACTION" },
          },
          {
            instagramUsername: this.state.profile?.username,
            interactionType: "like",
            username: item.user?.username,
            content: item.text || "",
          }
        );

        const context = composeContext({ state, template: shouldInteractTemplate });
        const decision = await generateText({
          runtime: this.runtime,
          context,
          modelClass: ModelClass.SMALL,
        });

        if (decision.includes("[INTERACT]")) {
          const userFeed = await getIgClient().feed.user(item.user_id).items();
          if (userFeed.length > 0) {
            await likeMedia(userFeed[0].id);
            elizaLogger.log(`Liked post from user: ${item.user?.username}`);
          }
        }
      } catch (error) {
        elizaLogger.error("Error handling like:", error);
      }
    }

    private async handleMention(item: any) {
      try {
        const roomId = stringToUuid(`instagram-mention-${item.media_id}-${this.runtime.agentId}`);
        const mentionId = stringToUuid(`instagram-mention-${item.pk}-${this.runtime.agentId}`);
        const userId = stringToUuid(`instagram-user-${item.user.pk}-${this.runtime.agentId}`);

        const cleanedResponse = await this.generateResponse(
          item.text,
          item.user.username,
          "MENTION"
        );

        if (!cleanedResponse) {
          elizaLogger.error("Failed to generate valid mention response");
          return;
        }

        await this.ensureEntities(roomId, userId, item.user.username);
        await this.createInteractionMemories(
          mentionId,
          userId,
          roomId,
          item,
          cleanedResponse,
          item.media_id
        );

      } catch (error) {
        elizaLogger.error("Error handling mention:", error);
      }
    }

    private async ensureEntities(roomId: UUID, userId: UUID, username: string) {
      await this.runtime.ensureRoomExists(roomId);
      await this.runtime.ensureUserExists(userId, username, username, "instagram");
      await this.runtime.ensureParticipantInRoom(this.runtime.agentId, roomId);
    }

    private async createInteractionMemories(
      originalId: UUID,
      userId: UUID,
      roomId: UUID,
      originalItem: any,
      response: string,
      mediaId: string
    ) {
      // Create memory of original interaction
      await this.runtime.messageManager.createMemory({
        id: originalId,
        userId,
        agentId: this.runtime.agentId,
        content: {
          text: originalItem.text,
          source: "instagram",
        },
        roomId,
        embedding: getEmbeddingZeroVector(),
        createdAt: new Date(originalItem.timestamp || originalItem.created_at * 1000).getTime(),
      });

      // Post response
      const postedComment = await postComment(mediaId, response);

      // Create memory of our response
      await this.runtime.messageManager.createMemory({
        id: stringToUuid(`instagram-reply-${postedComment.id}-${this.runtime.agentId}`),
        userId: this.runtime.agentId,
        agentId: this.runtime.agentId,
        content: {
          text: response,
          source: "instagram",
          inReplyTo: originalId
        },
        roomId,
        embedding: getEmbeddingZeroVector(),
        createdAt: Date.now(),
      });
    }
  }