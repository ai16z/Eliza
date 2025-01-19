import {
    composeContext,
    generateText,
    parseJSONObjectFromText,
} from "@elizaos/core";
import {
    type Action,
    type ActionExample,
    type Content,
    type HandlerCallback,
    type Handler,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
} from "@elizaos/core";

export const transcriptionTemplate = `# Transcription of media file
{{mediaTranscript}}

# Instructions: Return only the full transcript of the media file without any additional context or commentary.`;

export const mediaAttachmentIdTemplate = `# Messages we are transcribing
{{recentMessages}}

# Instructions: {{senderName}} is requesting a transcription of a specific media file (audio or video). Your goal is to determine the ID of the attachment they want transcribed.
The "attachmentId" is the ID of the media file attachment that the user wants transcribed. If not specified, return null.

Your response must be formatted as a JSON block with this structure:
\`\`\`json
{
  "attachmentId": "<Attachment ID>"
}
\`\`\`
`;

const getMediaAttachmentId = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<string | null> => {
    const context = composeContext({
        state,
        template: mediaAttachmentIdTemplate,
    });

    for (let i = 0; i < 5; i++) {
        const response = await generateText({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
        });

        const parsedResponse = parseJSONObjectFromText(response) as {
            attachmentId: string;
        } | null;

        if (parsedResponse?.attachmentId) {
            return parsedResponse.attachmentId;
        }
    }
    return null;
};

const transcribeMediaAction: Action = {
    name: "TRANSCRIBE_MEDIA",
    similes: [
        "TRANSCRIBE_AUDIO",
        "TRANSCRIBE_VIDEO",
        "MEDIA_TRANSCRIPT",
        "VIDEO_TRANSCRIPT",
        "AUDIO_TRANSCRIPT",
    ],
    description:
        "Transcribe the full text of an audio or video file that the user has attached.",
    validate: async (
        _runtime: IAgentRuntime,
        message: Memory,
        _state: State | undefined
    ): Promise<boolean> => {
        if (message.content.source !== "slack") {
            return false;
        }

        const keywords: string[] = [
            "transcribe",
            "transcript",
            "audio",
            "video",
            "media",
            "youtube",
            "meeting",
            "recording",
            "podcast",
            "call",
            "conference",
            "interview",
            "speech",
            "lecture",
            "presentation",
        ];
        return keywords.some((keyword) =>
            message.content.text.toLowerCase().includes(keyword.toLowerCase())
        );
    },
    handler: (async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        _options: any,
        callback: HandlerCallback
    ): Promise<Content> => {
        const currentState = (await runtime.composeState(message)) as State;

        const callbackData: Content = {
            text: "",
            action: "TRANSCRIBE_MEDIA_RESPONSE",
            source: message.content.source,
            attachments: [],
        };

        const attachmentId = await getMediaAttachmentId(
            runtime,
            message,
            currentState
        );
        if (!attachmentId) {
            console.error("Couldn't get media attachment ID from message");
            await callback(callbackData);
            return callbackData;
        }

        const attachment = currentState.recentMessagesData
            .filter(
                (msg) =>
                    msg.content.attachments &&
                    msg.content.attachments.length > 0
            )
            .flatMap((msg) => msg.content.attachments)
            .find((attachment) => {
                if (!attachment) return false;
                return (
                    attachment.id.toLowerCase() === attachmentId.toLowerCase()
                );
            });

        if (!attachment) {
            console.error(`Couldn't find attachment with ID ${attachmentId}`);
            await callback(callbackData);
            return callbackData;
        }

        const mediaTranscript = attachment.text || "";
        callbackData.text = mediaTranscript.trim();

        if (
            callbackData.text &&
            (callbackData.text?.split("\n").length < 4 ||
                callbackData.text?.split(" ").length < 100)
        ) {
            callbackData.text = `Here is the transcript:
\`\`\`md
${mediaTranscript.trim()}
\`\`\`
`;
            await callback(callbackData);
        } else if (callbackData.text) {
            const transcriptFilename = `content/transcript_${Date.now()}`;
            await runtime.cacheManager.set(
                transcriptFilename,
                callbackData.text
            );

            callbackData.text = `I've attached the transcript as a text file.`;
            await callback(callbackData, [transcriptFilename]);
        } else {
            console.warn("Empty response from transcribe media action");
            await callback(callbackData);
        }

        return callbackData;
    }) as Handler,
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Please transcribe the audio file I just shared.",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll transcribe the audio file for you.",
                    action: "TRANSCRIBE_MEDIA",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you get me a transcript of this meeting recording?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll generate a transcript of the meeting recording for you.",
                    action: "TRANSCRIBE_MEDIA",
                },
            },
        ],
    ] as ActionExample[][],
};

export default transcribeMediaAction;
