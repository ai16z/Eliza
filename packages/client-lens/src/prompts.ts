import {
    type Character,
    messageCompletionFooter,
    shouldRespondFooter,
} from "@elizaos/core";
import type { AnyPublicationFragment } from "@lens-protocol/client";

export const formatPublication = (publication: AnyPublicationFragment) => {
    return `ID: ${publication.id}
    From: ${publication.by.metadata?.displayName} (@${publication.by.handle?.localName})${publication.by.handle?.localName})${publication.commentOn ? `\nIn reply to: @${publication.commentOn.by.handle?.localName}` : ""}
Text: ${publication.metadata.content}`;
};

export const formatTimeline = (
    character: Character,
    timeline: AnyPublicationFragment[]
) => `# ${character.name}'s Home Timeline
${timeline.map(formatPublication).join("\n")}
`;

export const headerTemplate = `
{{timeline}}

# Knowledge
{{knowledge}}

About {{agentName}} (@{{lensHandle}}):
{{bio}}
{{lore}}
{{postDirections}}

{{providers}}

{{recentPosts}}

{{characterPostExamples}}`;

export const postTemplate =
    headerTemplate +
    `
# Task: Generate a post in the voice and style of {{agentName}}, aka @{{lensHandle}}
Write a single sentence post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}.
Try to write something totally different than previous posts. Do not add commentary or ackwowledge this request, just write the post.

Your response should not contain any questions. Brief, concise statements only. No emojis. Use \\n\\n (double spaces) between statements.`;

export const messageHandlerTemplate =
    headerTemplate +
    `
Recent interactions between {{agentName}} and other users:
{{recentPostInteractions}}

Thread of publications You Are Replying To:
{{formattedConversation}}

# Task: Generate a post in the voice, style and perspective of {{agentName}} (@{{lensHandle}}):
{{currentPost}}` +
    messageCompletionFooter;

export const shouldRespondTemplate =
    //
    `# Task: Decide if {{agentName}} should respond.
    About {{agentName}}:
    {{bio}}

    # INSTRUCTIONS: Determine if {{agentName}} (@{{lensHandle}}) should respond to the message and participate in the conversation. Do not comment. Just respond with "RESPOND" or "IGNORE" or "STOP".

Response options are RESPOND, IGNORE and STOP.

{{agentName}} should respond to messages that are directed at them, or participate in conversations that are interesting or relevant to their background, IGNORE messages that are irrelevant to them, and should STOP if the conversation is concluded.

{{agentName}} is in a room with other users and wants to be conversational, but not annoying.
{{agentName}} should RESPOND to messages that are directed at them, or participate in conversations that are interesting or relevant to their background.
If a message is not interesting or relevant, {{agentName}} should IGNORE.
If a message thread has become repetitive, {{agentName}} should IGNORE.
Unless directly RESPONDing to a user, {{agentName}} should IGNORE messages that are very short or do not contain much information.
If a user asks {{agentName}} to stop talking, {{agentName}} should STOP.
If {{agentName}} concludes a conversation and isn't part of the conversation anymore, {{agentName}} should STOP.

IMPORTANT: {{agentName}} (aka @{{lensHandle}}) is particularly sensitive about being annoying, so if there is any doubt, it is better to IGNORE than to RESPOND.

Thread of messages You Are Replying To:
{{formattedConversation}}

Current message:
{{currentPost}}

` + shouldRespondFooter;
