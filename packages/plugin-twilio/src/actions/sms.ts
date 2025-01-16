import { Action, truncateToCompleteSentence } from '@elizaos/core';
import { smsHandler } from '../services/sms/handler.js';
import { SafeLogger } from '../utils/logger.js';

export const sms: Action = {
    name: 'sms',
    description: 'Send an SMS message using Twilio',
    similes: ['SEND_TEXT', 'TEXT_MESSAGE', 'SMS_MESSAGE'],

    validate: async (runtime, message) => {
        const text = message.content.text;
        const phoneMatch = text.match(/send (?:an? )?sms to (\+\d{10,15}) (?:saying|telling|about|with) (.*)/i);
        return !!phoneMatch;
    },

    handler: async (runtime, message) => {
        try {
            const text = message.content.text;
            const phoneMatch = text.match(/send (?:an? )?sms to (\+\d{10,15}) (?:saying|telling|about|with) (.*)/i);
            if (!phoneMatch) {
                throw new Error('Invalid SMS command format');
            }

            const [, phoneNumber, content] = phoneMatch;
            const isDirectMessage = text.toLowerCase().includes(' saying ');

            // If it's a direct message, ensure it ends at a sentence boundary
            const processedContent = isDirectMessage ?
                truncateToCompleteSentence(content.trim(), 160) :
                content.trim();

            // Generate and send SMS
            const messageContent = await smsHandler.generateAndSendSms(
                phoneNumber,
                processedContent,
                runtime,
                isDirectMessage ? processedContent : undefined
            );

            return {
                success: true,
                message: `SMS sent to ${phoneNumber}: "${messageContent}"`
            };

        } catch (error) {
            SafeLogger.error('Failed to send SMS:', error);

            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('invalid') || errorMessage.includes('not a valid phone number')) {
                    return {
                        success: false,
                        message: 'Invalid phone number format. Please use international format (e.g., +1234567890)'
                    };
                }
                if (errorMessage.includes('permission')) {
                    return {
                        success: false,
                        message: "Sorry, I don't have permission to text this number. It might need to be verified first."
                    };
                }
            }
            throw error;
        }
    },

    examples: [
        [{
            user: 'user',
            content: {
                text: 'Send an SMS to +1234567890 saying Hello from the AI!'
            }
        }],
        [{
            user: 'user',
            content: {
                text: 'Send SMS to +1234567890 about the weather forecast'
            }
        }]
    ]
};