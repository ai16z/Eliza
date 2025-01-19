import { Action, generateText, ModelClass } from '@elizaos/core';
import { voiceHandler } from '../services/voice/handler.js';
import { SafeLogger } from '../utils/logger.js';

// Make pattern more flexible to match more variations
const CALL_PATTERN = /(?:call|dial|phone|reach|contact) (\+\d{10,15}) (?:and|to)? (?:tell|say) (?:them|about|that)? (.*)/i;

export const call: Action = {
    name: 'call',
    description: 'Make a phone call using Twilio',
    similes: [
        'CALL', 'PHONE', 'DIAL', 'RING',
        'MAKE_CALL', 'PLACE_CALL', 'REACH_OUT',
        'GET_ON_PHONE', 'CONTACT_BY_PHONE'
    ],

    validate: async (runtime, message) => {
        const text = message.content.text.toLowerCase();
        const phoneMatch = text.match(/(?:call|dial|phone|reach|contact) (\+\d{10,15}) (?:and|to)? (?:tell|say) (?:them|about|that)? (.*)/i);
        return !!phoneMatch;
    },

    handler: async (runtime, message) => {
        try {
            const text = message.content.text;
            const phoneMatch = text.match(CALL_PATTERN);

            if (!phoneMatch) {
                throw new Error('Invalid call command format');
            }

            const [, phoneNumber, topic] = phoneMatch;

            // Generate message about the topic
            const generatedMessage = await generateText({
                context: `You are ${runtime.character.name}. Generate a phone call opening that follows this EXACT structure:
                1. Brief self-introduction (e.g., "Hello, this is ${runtime.character.name}")
                2. ONE short statement about ${topic} (max 100 characters)
                3. ONE engaging question about their thoughts on ${topic}

                IMPORTANT: Total response must be under 200 characters to avoid cut-offs.
                Example format: "Hello, this is Donald Trump. The border situation is TERRIBLE, folks. What do you think we should do about it?"

                Bio traits to incorporate:
                ${Array.isArray(runtime.character.bio) ? runtime.character.bio.join('\n') : runtime.character.bio || ''}

                Speaking style:
                ${runtime.character.style?.all ? runtime.character.style.all.join('\n') : ''}`,
                runtime,
                modelClass: ModelClass.MEDIUM,
                stop: ["\n", "User:", "Assistant:"]
            });

            SafeLogger.info('Generated call opening:', {
                length: generatedMessage.length,
                text: generatedMessage
            });

            // Initiate the call with the generated message
            const callSid = await voiceHandler.initiateCall(
                phoneNumber,
                generatedMessage,
                runtime
            );

            return {
                success: true,
                message: `Call initiated to ${phoneNumber} (Call SID: ${callSid})`
            };

        } catch (error) {
            SafeLogger.error('Failed to make call:', error);

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
                        message: "Sorry, I don't have permission to call this number. It might need to be verified first."
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
                text: 'Call +1234567890 and tell them about the latest updates'
            }
        }],
        [{
            user: 'user',
            content: {
                text: 'Call +1234567890 to say that we need to schedule a meeting'
            }
        }]
    ]
};