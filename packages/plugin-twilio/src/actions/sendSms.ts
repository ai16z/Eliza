import { Action, generateText, ModelClass } from '@elizaos/core';
import { twilioService } from '../services/twilio.js';
import { SafeLogger } from '../utils/logger.js';
import type { Character } from '@elizaos/core';

const isValidPhoneNumber = (phoneNumber: string): boolean => {
    // E.164 format validation (e.g., +1234567890)
    const e164Regex = /^\+[1-9]\d{10,14}$/;
    return e164Regex.test(phoneNumber);
};

const generateSmsPrompt = (topic: string, character: Character): string => {
    return `You are ${character.name}. Generate a short, engaging SMS message (max 160 chars) about ${topic}.
    Use your unique personality and speaking style.

    Bio traits to incorporate:
    ${Array.isArray(character.bio) ? character.bio.join('\n') : character.bio || ''}

    Speaking style:
    ${character.style?.all ? character.style.all.join('\n') : ''}`;
};

export const sendSms: Action = {
    name: 'sendSms',
    description: 'Send an SMS message using Twilio',
    similes: ['SEND_TEXT', 'TEXT_MESSAGE', 'SMS_MESSAGE'],

    validate: async (runtime, message) => {
        const text = message.content.text;
        const phoneMatch = text.match(/send (?:an? )?sms to (\+\d{10,15}) (?:saying|telling|about|with) (.*)/i);
        if (!phoneMatch) return false;

        const messageContent = phoneMatch[2]?.trim();
        if (!messageContent) return false; // Add this check for empty messages

        return true;
    },

    handler: async (runtime, message) => {
        try {
            const text = (message.content as { text: string }).text;

            // Try both patterns
            const directPattern = /send (?:an? )?sms to (\+\d{10,15}) saying (.*)/i;
            const aiPattern = /send (?:an? )?sms to (\+\d{10,15}) (?:telling|about|with) (.*)/i;

            let match = text.match(directPattern) || text.match(aiPattern);
            if (!match) {
                throw new Error('Invalid SMS command format');
            }

            const [, phoneNumber, contentPrompt] = match;
            let messageContent: string;

            // Validate phone number format
            if (!isValidPhoneNumber(phoneNumber)) {
                return {
                    success: false,
                    message: `The phone number ${phoneNumber} is not valid. Please use international format (e.g., +1234567890)`
                };
            }

            // If it's a direct message (using "saying"), use it as is
            if (text.toLowerCase().includes(' saying ')) {
                messageContent = contentPrompt.trim();
            } else {
                // Generate content based on the prompt
                SafeLogger.info('Generating SMS content for prompt:', contentPrompt);

                messageContent = await generateText({
                    context: generateSmsPrompt(contentPrompt, runtime.character),
                    runtime,
                    modelClass: ModelClass.MEDIUM,
                    stop: ["\n", "User:", "Assistant:"]
                });
            }

            // Ensure message isn't too long
            if (messageContent.length > 160) {
                messageContent = messageContent.substring(0, 157) + '...';
            }

            SafeLogger.info('Sending SMS:', {
                to: phoneNumber,
                content: messageContent,
                length: messageContent.length
            });

            // Send the SMS
            try {
                await twilioService.sendSms({
                    to: phoneNumber,
                    body: messageContent
                });
            } catch (error) {
                // Handle Twilio-specific errors
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                if (errorMessage.includes('not valid')) {
                    return {
                        success: false,
                        message: `Sorry, I couldn't send the SMS. The phone number ${phoneNumber} appears to be invalid or not supported by Twilio.`
                    };
                }
                if (errorMessage.includes('permission')) {
                    return {
                        success: false,
                        message: "Sorry, I don't have permission to text this number. It might need to be verified first."
                    };
                }
                throw error; // Re-throw unexpected errors
            }

            SafeLogger.info('✅ SMS sent successfully:', {
                to: phoneNumber,
                content: messageContent,
                length: messageContent.length
            });

            return {
                success: true,
                message: `SMS sent to ${phoneNumber}: "${messageContent}"`
            };
        } catch (error) {
            SafeLogger.error('Failed to send SMS:', error);
            throw error;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send an SMS to +1234567890 telling a fun fact about space"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "SMS sent to +1234567890: 'Did you know that one day on Venus is longer than its year? It takes Venus 243 Earth days to rotate once but only 225 Earth days to orbit the Sun!'",
                    action: "sendSms"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send an SMS to +1234567890 with a joke about programming"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "SMS sent to +1234567890: 'Why do programmers prefer dark mode? Because light attracts bugs! 🐛'",
                    action: "sendSms"
                }
            }
        ]
    ]
};