import type { Request, Response } from 'express';
import type { IAgentRuntime, Character } from '@elizaos/core';
import type { VoiceSettings } from '../../types/voice.js';
import twilio from 'twilio';
import { TextToSpeechService } from './tts.js';
import { ConversationMemory } from './memory.js';
import { TwilioService } from '../twilio.js';
import { SafeLogger } from '../../utils/logger.js';
import { audioHandler } from '../../utils/audioHandler.js';
import { generateText, ModelClass, truncateToCompleteSentence } from '@elizaos/core';
import { elevenLabsService } from '../elevenlabs.js';
import { twilioService } from '../twilio.js';

export class VoiceHandler {
    private callRuntimes = new Map<string, IAgentRuntime>();
    private defaultRuntime: IAgentRuntime | null = null;
    private audioCache = new Map<string, string>();  // Cache audio IDs

    constructor(
        private tts: TextToSpeechService,
        private memory: ConversationMemory,
        private twilio: TwilioService
    ) {}

    // Add method to pre-generate common responses
    private async preGenerateCommonResponses(runtime: IAgentRuntime) {
        const commonPhrases = [
            "I didn't catch that. Could you please repeat?",
            "Could you say that again?",
            "I'm having trouble hearing you. One more time?"
        ];

        for (const phrase of commonPhrases) {
            const voiceSettings = this.convertVoiceSettings(runtime.character?.settings?.voice?.elevenlabs);
            const audioBuffer = await this.tts.convertToSpeech(phrase, voiceSettings);
            const audioId = audioHandler.addAudio(audioBuffer);
            this.audioCache.set(phrase, audioId);
        }
    }

    async init(runtime: IAgentRuntime) {
        this.defaultRuntime = runtime;
        await this.preGenerateCommonResponses(runtime);
        SafeLogger.info('Voice handler initialized with runtime');
    }

    private generatePrompt(topic: string, character: Character): string {
        return `You are ${character.name}. Generate a VERY BRIEF voice response about ${topic}.
        IMPORTANT: Keep response under 100 characters. Use ONE short statement and ONE question.
        Example: "The border is WEAK. What's your plan to FIX IT?"

        Bio traits to incorporate:
        ${Array.isArray(character.bio) ? character.bio.join('\n') : character.bio || ''}

        Speaking style:
        ${character.style?.all ? character.style.all.join('\n') : ''}`;
    }

    private convertVoiceSettings(settings: any): Partial<VoiceSettings> | undefined {
        if (!settings) return undefined;
        return {
            voiceId: settings.voiceId,
            model: settings.model,
            stability: Number(settings.stability),
            similarityBoost: Number(settings.similarityBoost),
            style: Number(settings.style),
            useSpeakerBoost: Boolean(settings.useSpeakerBoost)
        };
    }

    private async handleNewCall(callSid: string, runtime: IAgentRuntime, twiml: twilio.twiml.VoiceResponse) {
        SafeLogger.info('🆕 Handling new call:', { callSid });

        // Generate greeting
        const greeting = await generateText({
            context: this.generatePrompt('greeting', runtime.character),
            runtime,
            modelClass: ModelClass.SMALL,
            stop: ["\n", "User:", "Assistant:"]
        });

        // Ensure we have complete sentences within a reasonable length
        const processedGreeting = truncateToCompleteSentence(greeting, 250);
        SafeLogger.info('Generated greeting:', {
            originalLength: greeting.length,
            processedLength: processedGreeting.length,
            text: processedGreeting
        });

        // Convert to speech
        const voiceSettings = this.convertVoiceSettings(runtime.character?.settings?.voice?.elevenlabs);
        const audioBuffer = await this.tts.convertToSpeech(processedGreeting, voiceSettings);
        const audioId = audioHandler.addAudio(audioBuffer);

        // Initialize conversation
        this.memory.createConversation(callSid, runtime.character?.name || 'AI Assistant');
        this.memory.addMessage(callSid, 'assistant', processedGreeting);

        // Play greeting
        twiml.play(`${process.env.WEBHOOK_BASE_URL}/audio/${audioId}`);
        SafeLogger.info('✅ New call handled successfully');
    }

    // Use cached audio for no-speech responses
    private async handleUserSpeech(callSid: string, speech: string | undefined, runtime: IAgentRuntime, twiml: twilio.twiml.VoiceResponse) {
        if (!speech) {
            const noSpeechMessage = "I didn't catch that. Could you please repeat?";
            const cachedAudioId = this.audioCache.get(noSpeechMessage);

            if (cachedAudioId) {
                twiml.play(`${process.env.WEBHOOK_BASE_URL}/audio/${cachedAudioId}`);
            } else {
                // Fallback to generating audio if not cached
                const voiceSettings = this.convertVoiceSettings(runtime.character?.settings?.voice?.elevenlabs);
                const audioBuffer = await this.tts.convertToSpeech(noSpeechMessage, voiceSettings);
                const audioId = audioHandler.addAudio(audioBuffer);
                twiml.play(`${process.env.WEBHOOK_BASE_URL}/audio/${audioId}`);
            }
            return;
        }

        SafeLogger.info('🗣️ Processing user speech:', { speech });

        // Generate response with faster model
        const response = await generateText({
            context: this.generatePrompt(speech, runtime.character),
            runtime,
            modelClass: ModelClass.SMALL,
            stop: ["\n", "User:", "Assistant:"]
        });

        // Process response to ensure complete sentences
        const processedResponse = truncateToCompleteSentence(response, 250);
        SafeLogger.info('Generated response:', {
            originalLength: response.length,
            processedLength: processedResponse.length,
            text: processedResponse
        });

        // Convert to speech
        const voiceSettings = this.convertVoiceSettings(runtime.character?.settings?.voice?.elevenlabs);
        const audioBuffer = await this.tts.convertToSpeech(processedResponse, voiceSettings);
        const audioId = audioHandler.addAudio(audioBuffer);

        // Update conversation
        this.memory.addMessage(callSid, 'user', speech);
        this.memory.addMessage(callSid, 'assistant', processedResponse);

        // Play response
        twiml.play(`${process.env.WEBHOOK_BASE_URL}/audio/${audioId}`);
        SafeLogger.info('✅ User speech handled successfully');
    }

    async handleIncomingCall(req: Request, res: Response) {
        try {
            const callSid = req.body.CallSid;
            const isGatherCallback = req.query.gatherCallback === 'true';
            const userSpeech = req.body.SpeechResult;

            SafeLogger.info('📞 Incoming call webhook:', { callSid, isGatherCallback, hasSpeech: !!userSpeech });

            const twiml = new twilio.twiml.VoiceResponse();

            // Use stored runtime for this call or fall back to default runtime
            let runtime = this.callRuntimes.get(callSid) || this.defaultRuntime;

            if (!runtime) {
                throw new Error('No runtime found for call');
            }

            // Store runtime for this incoming call if not already stored
            if (!this.callRuntimes.has(callSid)) {
                this.callRuntimes.set(callSid, runtime);
            }

            // Handle the call based on the state
            if (isGatherCallback && userSpeech) {
                await this.handleUserSpeech(callSid, userSpeech, runtime, twiml);
            } else {
                // For new calls or no speech, play greeting
                await this.handleNewCall(callSid, runtime, twiml);
            }

            // Always add gather for next input
            this.addGatherToTwiml(twiml);

            res.type('text/xml').send(twiml.toString());

        } catch (error) {
            SafeLogger.error('Error in voice webhook:', error);
            this.sendErrorResponse(res);
        }
    }

    private addGatherToTwiml(twiml: twilio.twiml.VoiceResponse) {
        return twiml.gather({
            input: ['speech'],
            timeout: 4,
            action: '/webhook/voice?gatherCallback=true',
            method: 'POST',
            language: 'en-US'
        });
    }

    private sendErrorResponse(res: Response) {
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say("I'm sorry, I encountered an error. Please try again later.");
        twiml.hangup();
        res.type('text/xml').send(twiml.toString());
    }

    async handleOutgoingCall(req: Request, res: Response) {
        try {
            const callSid = req.body.CallSid;
            const audioId = req.query.audioId as string;
            const isGatherCallback = req.query.gatherCallback === 'true';
            const userSpeech = req.body.SpeechResult;

            SafeLogger.info('📞 Outgoing call webhook:', {
                callSid,
                audioId,
                isGatherCallback,
                hasSpeech: !!userSpeech
            });

            // Get the stored runtime for this call
            const runtime = this.callRuntimes.get(callSid);
            if (!runtime) {
                throw new Error('No runtime found for outgoing call');
            }

            const twiml = new twilio.twiml.VoiceResponse();

            // For initial outgoing call, play the pre-recorded message
            if (!isGatherCallback && audioId) {
                twiml.play(`${process.env.WEBHOOK_BASE_URL}/audio/${audioId}`);
                SafeLogger.info('🎵 Playing initial outgoing message');
            }
            // For subsequent interactions, handle like a normal conversation
            else if (isGatherCallback) {
                await this.handleUserSpeech(callSid, userSpeech, runtime, twiml);
            } else {
                throw new Error('Missing audioId for initial outgoing call');
            }

            // Add gather for next input
            this.addGatherToTwiml(twiml);

            res.type('text/xml').send(twiml.toString());

        } catch (error) {
            SafeLogger.error('Error in outgoing call webhook:', error);
            this.sendErrorResponse(res);
        }
    }

    async initiateCall(to: string, message: string, runtime: IAgentRuntime): Promise<string> {
        try {
            SafeLogger.info('📞 Initiating outgoing call:', { to });

            const voiceSettings = this.convertVoiceSettings(runtime.character?.settings?.voice?.elevenlabs);
            const audioBuffer = await this.tts.convertToSpeech(message, voiceSettings);
            const audioId = audioHandler.addAudio(audioBuffer);

            if (!process.env.TWILIO_PHONE_NUMBER) {
                throw new Error('TWILIO_PHONE_NUMBER not set in environment');
            }

            // Initialize conversation memory
            const call = await this.twilio.client.calls.create({
                to,
                from: process.env.TWILIO_PHONE_NUMBER,
                url: `${process.env.WEBHOOK_BASE_URL}/webhook/voice/outgoing?audioId=${audioId}`
            });

            // Store runtime for this call
            this.callRuntimes.set(call.sid, runtime);

            // Store runtime and initialize conversation
            this.memory.createConversation(call.sid, runtime.character?.name || 'AI Assistant');
            this.memory.addMessage(call.sid, 'assistant', message);

            SafeLogger.info('✅ Outgoing call initiated:', { callSid: call.sid });
            return call.sid;

        } catch (error) {
            SafeLogger.error('Failed to initiate outgoing call:', error);
            throw error;
        }
    }

    // Clean up runtime when call ends
    private cleanupCall(callSid: string) {
        this.callRuntimes.delete(callSid);
        this.memory.clearConversation(callSid);
    }
}

// Create and export the handler instance
const tts = new TextToSpeechService(elevenLabsService);
const memory = new ConversationMemory();
export const voiceHandler = new VoiceHandler(tts, memory, twilioService);