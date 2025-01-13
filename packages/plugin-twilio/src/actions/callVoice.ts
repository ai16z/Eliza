import { Action, IAgentRuntime, Memory } from '@elizaos/core';
import { twilioService } from '../services/twilio.js';
import { SafeLogger } from '../utils/logger.js';

export const callVoiceAction: Action = {
    name: 'CALL_VOICE',
    similes: ['MAKE_CALL', 'PHONE_CALL', 'DIAL'],
    description: 'Initiates a voice call to a specified phone number',

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Check if message contains a phone number
        const text = (message.content as { text: string }).text;
        const phoneRegex = /\+?\d{10,15}/;  // Basic phone number validation
        return phoneRegex.test(text);
    },

    handler: async (runtime: IAgentRuntime, message: Memory) => {
        try {
            const text = (message.content as { text: string }).text;

            // Extract phone number from message
            const phoneMatch = text.match(/\+?\d{10,15}/);
            if (!phoneMatch) {
                throw new Error('No valid phone number found in message');
            }

            const phoneNumber = phoneMatch[0];

            // Extract message content after the phone number and any surrounding text
            let messageContent = text;

            // Remove "Call <phone>" or similar prefixes
            messageContent = messageContent.replace(/^.*?\+?\d{10,15}/, '');

            // Remove "and say" or similar phrases
            messageContent = messageContent.replace(/(?:and say|saying|say|speak|tell them)[:']*/i, '');

            // Clean up any remaining whitespace and quotes
            messageContent = messageContent.replace(/^['"\s]+|['"\s]+$/g, '').trim();

            // Initiate call using Twilio service
            await twilioService.makeCall({
                to: phoneNumber,
                message: messageContent
            });

            SafeLogger.info(`📞 Voice call initiated to ${phoneNumber}`);
            return true;
        } catch (error) {
            SafeLogger.error('❌ Failed to initiate voice call:', error);
            throw error;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Call +1234567890 and say: Hello from Eliza!"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Initiating voice call to +1234567890",
                    action: "CALL_VOICE"
                }
            }
        ]
    ]
};