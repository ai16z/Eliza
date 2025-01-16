import type { Action, IAgentRuntime, Memory } from '@elizaos/core';
import { twilioService } from '../services/twilio.js';
import { elevenLabsService } from '../services/elevenlabs.js';
import { audioHandler } from '../utils/audioHandler.js';
import { parseVoiceSettings } from '../utils/voiceSettingsParser';
import { SafeLogger } from '../utils/logger.js';
import twilio from 'twilio';
import type { VoiceConversationMemory } from '../types/voice.js';
import type { ActionResult, VoiceConversationParams } from '../types/actions.js';

export const voiceConversation: Action = {
    name: 'voiceConversation',
    description: 'Start a voice call with a specified phone number',
    similes: ['START_CALL', 'BEGIN_CALL', 'VOICE_CALL', 'PHONE_CHAT', 'TALK_TO'],
    examples: [
        [
            {
                user: "user1",
                content: {
                    text: "Call +1234567890 and teach them about origami",
                    action: "VOICE_CONVERSATION"
                }
            }
        ],
        [
            {
                user: "user1",
                content: {
                    text: "Start a voice conversation with +1234567890 about AI",
                    action: "VOICE_CONVERSATION"
                }
            }
        ],
        [
            {
                user: "user1",
                content: {
                    text: "Call +1234567890 and talk about programming",
                    action: "VOICE_CONVERSATION"
                }
            }
        ]
    ],
    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        // Extract phone number and message from text
        const text = message.content.text;
        const phoneMatch = text.match(/\+\d{10,}/);
        if (!phoneMatch) return false;

        const hasCallKeywords = /(call|dial|phone)/i.test(text);
        if (!hasCallKeywords) return false;

        // Store extracted values in runtime for handler
        (runtime as any).phoneNumber = phoneMatch[0];

        return true;
    },
    handler: async (runtime: IAgentRuntime): Promise<ActionResult> => {
        try {
            // Get webhook base URL from environment
            const webhookBaseUrl = process.env.WEBHOOK_BASE_URL?.replace(/\/$/, '');
            if (!webhookBaseUrl) {
                throw new Error('WEBHOOK_BASE_URL environment variable is not set');
            }

            const input = runtime as unknown as VoiceConversationParams;
            const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
            if (!phoneNumber) {
                throw new Error('TWILIO_PHONE_NUMBER environment variable is not set');
            }

            SafeLogger.info('📞 Initiating outbound call');

            const characterName = runtime.character?.name || 'AI Assistant';
            const greeting = `Hello! I'm ${characterName}. How may I assist you today?`;

            SafeLogger.info('🤖 Agent greeting:', {
                text: greeting
            });

            // Create TwiML for the call
            const twiml = new twilio.twiml.VoiceResponse();
            const gather = twiml.gather({
                input: ['speech'],
                timeout: 5,
                action: `${webhookBaseUrl}/webhook/voice/gather`,
                method: 'POST',
                speechTimeout: 'auto',
                language: 'en-US'
            });

            SafeLogger.info('🗣️ Converting greeting to speech');

            const voiceSettings = parseVoiceSettings(runtime);
            const messageBuffer = await elevenLabsService.textToSpeech(greeting, voiceSettings);

            if (messageBuffer) {
                const audioId = audioHandler.addAudio(messageBuffer);
                gather.play({}, `${webhookBaseUrl}/audio/${audioId}`);
            } else {
                gather.say(greeting);
            }

            const goodbyeMessage = "I haven't heard anything. Please call back if you'd like to talk.";
            const goodbyeBuffer = await elevenLabsService.textToSpeech(goodbyeMessage, voiceSettings);

            if (goodbyeBuffer) {
                const goodbyeId = audioHandler.addAudio(goodbyeBuffer);
                twiml.play({}, `${webhookBaseUrl}/audio/${goodbyeId}`);
            } else {
                twiml.say(goodbyeMessage);
            }

            twiml.hangup();

            const call = await twilioService.client.calls.create({
                to: input.phoneNumber,
                from: phoneNumber,
                twiml: twiml.toString()
            });

            const conversation: VoiceConversationMemory = {
                messages: [{
                    role: 'assistant',
                    content: greeting,
                    timestamp: new Date().toISOString()
                }],
                lastActivity: Date.now(),
                characterName: characterName
            };

            twilioService.voiceConversations.set(call.sid, conversation);

            SafeLogger.info('📞 Call initiated successfully:', {
                text: `Started voice conversation with ${input.phoneNumber}`
            });

            return {
                success: true,
                callSid: call.sid,
                message: `Started voice conversation with ${input.phoneNumber}`
            };

        } catch (error) {
            SafeLogger.error('Error in voice conversation:', error);
            throw error;
        }
    }
};