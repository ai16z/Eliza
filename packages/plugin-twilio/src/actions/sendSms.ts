import { Action, IAgentRuntime, Memory } from '@elizaos/core';
import { twilioService } from '../services/twilio.js';
import { SafeLogger } from '../utils/logger.js';

export const sendSmsAction: Action = {
    name: 'SEND_SMS',
    similes: ['SEND_MESSAGE', 'TEXT', 'SMS'],
    description: 'Sends an SMS message to a specified phone number',

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

            // Remove "Send SMS to <phone>" or similar prefixes
            messageContent = messageContent.replace(/^.*?\+?\d{10,15}/, '');

            // Remove common separators
            messageContent = messageContent.replace(/^[:\s]*/, '');

            // Clean up any remaining whitespace
            messageContent = messageContent.trim();

            // Send SMS using Twilio service
            await twilioService.sendSms({
                to: phoneNumber,
                body: messageContent
            });

            SafeLogger.info(`📱 SMS sent successfully to ${phoneNumber}`);
            return true;
        } catch (error) {
            SafeLogger.error('❌ Failed to send SMS:', error);
            throw error;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send SMS to +1234567890: Hello from Eliza!"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sending SMS to +1234567890",
                    action: "SEND_SMS"
                }
            }
        ]
    ]
};