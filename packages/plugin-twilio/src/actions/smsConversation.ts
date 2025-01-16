import { Action, generateText, ModelClass } from '@elizaos/core';
import { twilioService } from '../services/twilio.js';
import { SafeLogger } from '../utils/logger.js';

const isValidPhoneNumber = (phoneNumber: string): boolean => {
    const e164Regex = /^\+[1-9]\d{10,14}$/;
    return e164Regex.test(phoneNumber);
};

export const smsConversation: Action = {
    name: 'SMS_CONVERSATION',
    description: 'Start an SMS conversation with a specified phone number',
    similes: ['START_SMS_CHAT', 'BEGIN_SMS', 'TEXT_CHAT', 'SMS_CHAT'],

    validate: async (runtime, message) => {
        const text = (message.content as { text: string }).text;
        const phoneRegex = /\+?\d{10,15}/;
        return phoneRegex.test(text);
    },

    handler: async (runtime, message) => {
        try {
            const text = (message.content as { text: string }).text;
            const phoneMatch = text.match(/\+?\d{10,15}/);

            if (!phoneMatch) {
                return {
                    success: false,
                    message: "I couldn't find a valid phone number. Please include a number in international format (e.g., +1234567890)"
                };
            }

            const phoneNumber = phoneMatch[0];

            if (!isValidPhoneNumber(phoneNumber)) {
                return {
                    success: false,
                    message: `The phone number ${phoneNumber} is not valid. Please use international format (e.g., +1234567890)`
                };
            }

            // Get character name from runtime
            const characterName = runtime.character?.name || 'AI Assistant';

            // Generate engaging introduction with a question
            const introMessage = await generateText({
                context: `As ${characterName}, write a brief SMS introduction (max 160 chars) that:
                         1. Introduces yourself
                         2. Shows enthusiasm to chat
                         3. Ends with an engaging question that prompts a response
                         Keep it casual and friendly!`,
                runtime,
                modelClass: ModelClass.MEDIUM,
                stop: ["\n", "User:", "Assistant:"]
            });

            try {
                await twilioService.sendSms({
                    to: phoneNumber,
                    body: introMessage
                });

                return {
                    success: true,
                    message: `Started SMS conversation with ${phoneNumber}: "${introMessage}"`
                };
            } catch (error) {
                // Handle Twilio errors...
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                if (errorMessage.includes('not valid')) {
                    return {
                        success: false,
                        message: `Sorry, I couldn't start the conversation. The phone number ${phoneNumber} appears to be invalid or not supported by Twilio.`
                    };
                }
                // ... other error handling
            }
        } catch (error) {
            SafeLogger.error('Failed to start SMS conversation:', error);
            return {
                success: false,
                message: "I encountered an error while trying to start the conversation. Please try again."
            };
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Start SMS conversation with +1234567890"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Started SMS conversation with +1234567890: 'Hi! I'm AIgyver, your tech-savvy AI assistant. I love finding creative solutions to problems! What kind of tech challenges are you working on these days?'",
                    action: "SMS_CONVERSATION"
                }
            }
        ]
    ]
};