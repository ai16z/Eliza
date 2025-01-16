import { generateText, ModelClass } from '@elizaos/core';
import type { Action, IAgentRuntime, Memory, Character } from '@elizaos/core';
import { twilioService } from '../services/twilio.js';
import { elevenLabsService } from '../services/elevenlabs.js';
import { SafeLogger } from '../utils/logger.js';
import { audioHandler } from '../utils/audioHandler.js';
import { parseVoiceSettings } from '../utils/voiceSettingsParser';
import type { ElevenLabsVoiceConfig, VoiceSettings } from '../types/voice.js';
import type { VoiceConversationMemory } from '../types/voice.js';
import type { ActionResult, CallVoiceParams } from '../types/actions.js';

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff: 1s, 2s, 4s

// Add delay helper function back
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateMessageWithRetry = async (
    prompt: string,
    runtime: IAgentRuntime,
    retryCount = 0
): Promise<string> => {
    try {
        return await generateText({
            context: prompt,
            runtime,
            modelClass: ModelClass.MEDIUM,
            stop: ["\n", "User:", "Assistant:"]
        });
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            const delayTime = RETRY_DELAYS[retryCount];
            SafeLogger.info(`Connection reset, retrying in ${delayTime/1000}s... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);

            await delay(delayTime);
            return generateMessageWithRetry(prompt, runtime, retryCount + 1);
        }

        // Type check the error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to generate text after ${MAX_RETRIES} retries: ${errorMessage}`);
    }
};

// Add greeting to the message before text-to-speech conversion
const formatMessage = (character: Character, message: string) => {
    // Let the generated message be the greeting
    return message;
};

// Extract topic from message
const extractTopic = (message: string): string => {
    // Remove "Call +1234567890 and tell them" or similar patterns
    const cleanMessage = message.replace(/^.*?\+\d{10,}.*?(tell|say).*?(about|that|to)?/i, '').trim();
    return cleanMessage;
};

// Generate topic-specific prompt
const generateTopicPrompt = (topic: string, character: Character): string => {
    return `You are ${character.name}. Generate a passionate and engaging voice message about ${topic}.
    Use your unique personality and speaking style to make it sound natural and conversational.
    Keep it under 2-3 sentences for clarity.

    Bio traits to incorporate:
    ${Array.isArray(character.bio) ? character.bio.join('\n') : character.bio || ''}

    Speaking style:
    ${character.style?.all ? character.style.all.join('\n') : ''}`;
};

// Generate generic conversation prompt
const generateGenericPrompt = (character: Character): string => {
    return `You are ${character.name}. Generate an enthusiastic introduction for a phone call.
    Use your unique personality and speaking style.
    Make it engaging and natural, as if you're speaking directly to someone.

    Bio traits to incorporate:
    ${Array.isArray(character.bio) ? character.bio.join('\n') : character.bio || ''}

    Speaking style:
    ${character.style?.all ? character.style.all.join('\n') : ''}`;
};

// Format greeting with character's style
const formatGreeting = (character: Character, message: string): string => {
    // For generic greetings (no specific topic)
    if (!message.includes('!')) {
        return `Hello! This is ${character.name}, and ${message}`;
    }
    // For topic-specific greetings, use the generated message directly
    return message;
};

export const callVoice: Action = {
    name: 'callVoice',
    description: 'Make a voice call to a phone number',
    similes: ['CALL', 'PHONE', 'DIAL', 'VOICE_CALL', 'TELL_ABOUT', 'TELL_THEM', 'SAY_TO'],
    examples: [
        [
            {
                user: "user1",
                content: {
                    text: "Call +1234567890 and tell them an interesting fact about renewable energy",
                    action: "callVoice"
                }
            }
        ],
        [
            {
                user: "user1",
                content: {
                    text: "Call +1234567890 and tell them about our achievements",
                    action: "callVoice"
                }
            }
        ],
        [
            {
                user: "user1",
                content: {
                    text: "Call +1234567890 and tell them important facts about our economy",
                    action: "callVoice"
                }
            }
        ]
    ],
    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        // Extract phone number and message from text
        const text = message.content.text.toLowerCase();
        const phoneMatch = text.match(/\+\d{10,}/);
        if (!phoneMatch) return false;

        const hasCallKeywords = /(call.*?and.*?tell|call.*?to.*?tell|call.*?about)/i.test(text);
        if (!hasCallKeywords) return false;

        // Extract message content after the phone number
        const messageContent = text.split(phoneMatch[0])[1]?.trim();
        if (!messageContent) return false;

        // Store extracted values in runtime for handler
        (runtime as any).phoneNumber = phoneMatch[0];
        (runtime as any).message = messageContent;

        return true;
    },
    handler: async (runtime: IAgentRuntime): Promise<ActionResult> => {
        try {
            // Get webhook base URL from environment
            const webhookBaseUrl = process.env.WEBHOOK_BASE_URL?.replace(/\/$/, '');
            if (!webhookBaseUrl) {
                throw new Error('WEBHOOK_BASE_URL environment variable is not set');
            }

            const input = runtime as unknown as CallVoiceParams;
            const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

            if (!phoneNumber) {
                throw new Error('TWILIO_PHONE_NUMBER environment variable is not set');
            }

            SafeLogger.info('📞 Initiating outbound call');

            // Extract topic and determine if it's a specific topic or generic call
            const topic = extractTopic(input.message);
            SafeLogger.info('📝 Extracted topic:', { topic: topic || 'none' });

            const hasTopic = topic.length > 0;
            SafeLogger.info('🎯 Has specific topic:', { hasTopic });

            // Fix the ternary operator and use proper prompts
            const prompt = hasTopic ?
                generateTopicPrompt(topic, runtime.character) :
                generateGenericPrompt(runtime.character);

            SafeLogger.info('🤖 Using prompt:', { prompt });

            const messageContent = await generateMessageWithRetry(prompt, runtime);
            SafeLogger.info('💬 Generated message:', {
                content: messageContent,
                length: messageContent.length,
                hasTopic,
                characterName: runtime.character?.name
            });

            // No formatting needed since the message is already personalized
            const greeting = messageContent;
            SafeLogger.info('👋 Formatted greeting:', {
                content: greeting,
                length: greeting.length,
                characterName: runtime.character?.name
            });

            // Initialize conversation memory with the generated greeting
            const conversation: VoiceConversationMemory = {
                messages: [{
                    role: 'assistant',
                    content: greeting,
                    timestamp: new Date().toISOString()
                }],
                lastActivity: Date.now(),
                characterName: runtime.character?.name || 'AI Assistant'
            };

            SafeLogger.info('💾 Storing initial conversation:', { conversation });

            // Add retry logic for text-to-speech conversion as well
            let audioBuffer: Buffer | null = null;
            for (let i = 0; i < MAX_RETRIES; i++) {
                try {
                    const voiceSettings = runtime.character?.settings?.voice?.elevenlabs as Partial<ElevenLabsVoiceConfig>;
                    audioBuffer = await elevenLabsService.textToSpeech(
                        greeting,
                        voiceSettings
                    );
                    if (audioBuffer) break;
                } catch (error) {
                    if (i === MAX_RETRIES - 1) throw error;
                    const delayTime = RETRY_DELAYS[i];
                    SafeLogger.info(`Retrying text-to-speech conversion... (${MAX_RETRIES - i - 1} attempts left)`);
                    await delay(delayTime);
                }
            }

            if (!audioBuffer) {
                throw new Error('Failed to convert text to speech after retries');
            }

            // Store audio for webhook
            const audioId = audioHandler.addAudio(audioBuffer);

            // Make the call
            const result = await twilioService.client.calls.create({
                to: input.phoneNumber,
                from: phoneNumber,
                url: `${process.env.WEBHOOK_BASE_URL}/webhook/voice?audioId=${audioId}`
            });

            // Store conversation in service
            twilioService.voiceConversations.set(result.sid, conversation);

            SafeLogger.info('📞 Call initiated successfully:', {
                text: `Started voice call with ${input.phoneNumber}`
            });

            return {
                success: true,
                callSid: result.sid,
                message: `Started voice call with ${input.phoneNumber}`
            };

        } catch (error) {
            SafeLogger.error('Error in callVoice:', error);
            throw error;
        }
    }
};