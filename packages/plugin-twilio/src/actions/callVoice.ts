import type { Action, IAgentRuntime, Memory } from '@elizaos/core';
import { twilioService } from '../services/twilio.js';
import { elevenLabsService } from '../services/elevenlabs.js';
import { SafeLogger } from '../utils/logger.js';
import { audioHandler } from '../utils/audioHandler.js';
import { parseVoiceSettings } from '../utils/voiceSettingsParser';
import twilio from 'twilio';
import type { VoiceConversationMemory } from '../types/voice.js';
import type { ActionResult, CallVoiceParams } from '../types/actions.js';

export const callVoice: Action = {
    name: 'callVoice',
    description: 'Make a voice call to a phone number',
    similes: ['CALL', 'PHONE', 'DIAL', 'VOICE_CALL'],
    examples: [
        [
            {
                user: "user1",
                content: {
                    text: "Call +1234567890 and tell them about the meeting",
                    action: "callVoice"
                }
            }
        ],
        [
            {
                user: "user1",
                content: {
                    text: "Make a phone call to +1234567890 and say hello",
                    action: "callVoice"
                }
            }
        ],
        [
            {
                user: "user1",
                content: {
                    text: "Call this number +1234567890 and explain the project",
                    action: "callVoice"
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

            // Truncate message if too long
            const MAX_LENGTH = 300;
            let truncatedMessage = input.message;
            if (input.message.length > MAX_LENGTH) {
                SafeLogger.info('Text length (' + input.message.length + ') exceeds 300 characters, truncating...');
                truncatedMessage = input.message.substring(0, MAX_LENGTH) + '...';
            }

            // Log initial message
            SafeLogger.info('🤖 Agent message:', {
                text: truncatedMessage
            });

            SafeLogger.info('🗣️ Converting message to speech');

            // Create TwiML for the call
            const twiml = new twilio.twiml.VoiceResponse();

            // Create a gather that starts listening immediately
            const gather = twiml.gather({
                input: ['speech'],
                timeout: 5,
                action: `${webhookBaseUrl}/webhook/voice/gather`,
                method: 'POST',
                speechTimeout: 'auto',
                language: 'en-US'
            });

            // Convert message to speech and play it inside gather
            const voiceSettings = parseVoiceSettings(runtime);
            const messageBuffer = await elevenLabsService.textToSpeech(truncatedMessage, voiceSettings);

            if (messageBuffer) {
                // Store audio and get ID
                const messageId = audioHandler.addAudio(messageBuffer);
                // Use the webhook URL to serve the audio
                gather.play({}, `${webhookBaseUrl}/audio/${messageId}`);
            } else {
                // Fallback to TTS
                gather.say(truncatedMessage);
            }

            // Add goodbye message
            const goodbyeMessage = "I haven't heard anything. Please call back if you'd like to talk.";
            const goodbyeBuffer = await elevenLabsService.textToSpeech(goodbyeMessage, voiceSettings);

            if (goodbyeBuffer) {
                const goodbyeId = audioHandler.addAudio(goodbyeBuffer);
                twiml.play({}, `${webhookBaseUrl}/audio/${goodbyeId}`);
            } else {
                twiml.say(goodbyeMessage);
            }

            twiml.hangup();

            // Make the call using the TwiML
            const call = await twilioService.client.calls.create({
                to: input.phoneNumber,
                from: phoneNumber,
                twiml: twiml.toString()
            });

            // Initialize conversation memory
            const conversation: VoiceConversationMemory = {
                messages: [{
                    role: 'assistant',
                    content: truncatedMessage,
                    timestamp: new Date().toISOString()
                }],
                lastActivity: Date.now(),
                characterName: runtime.character?.name || 'AI Assistant'
            };

            // Store conversation in service
            twilioService.voiceConversations.set(call.sid, conversation);

            SafeLogger.info('📞 Call initiated successfully:', {
                text: `Started voice call with ${input.phoneNumber}`
            });

            return {
                success: true,
                callSid: call.sid
            };

        } catch (error) {
            SafeLogger.error('Error in callVoice:', error);
            throw error;
        }
    }
};