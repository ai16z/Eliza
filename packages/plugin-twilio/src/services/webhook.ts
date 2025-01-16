//  /packages/plugin-twilio/src/services/webhook.ts

import { Service, ServiceType, IAgentRuntime, KnowledgeItem, HandlerCallback, Content, Memory, State, generateText, ModelClass } from '@elizaos/core';
import express, { Application } from 'express';
import { twilioService } from './twilio.js';
import twilio from 'twilio';
import { SafeLogger } from '../utils/logger.js';
import path from 'path';
import fs from 'fs/promises';
import type { Server } from 'http';
import type { Say } from 'twilio/lib/twiml/VoiceResponse';
import type { Gather } from 'twilio/lib/twiml/VoiceResponse';
import { v4 as uuidv4 } from 'uuid';
import { elevenLabsService } from './elevenlabs.js';
import { audioHandler } from '../utils/audioHandler.js';

// Add UUID type at the top
type UUID = string;

// Add types for router stack
interface RouteInfo {
    route?: {
        path: string;
        methods: { [key: string]: boolean };
    };
}

// Add type for Gather input
type GatherInput = 'speech' | 'dtmf';

// Add voice configuration
interface VoiceConfig {
    voice: Say['voice'];
    language: Say['language'];
    recognitionLanguage: Gather['language'];
}

// Add at the top with other interfaces
interface RuntimeResponse extends Memory {
    content: {
        text: string;
        type: string;
        action: string;
    };
}

// Add these interfaces at the top of the file
interface TextResponse {
    text: string;
    type?: string;
    action?: string;
}

interface ContentResponse {
    content: {
        text: string;
        type?: string;
        action?: string;
    };
}

// Add at the top with other interfaces
interface TwilioMemory extends Memory {
    metadata?: {
        source: string;
        timestamp: number;
    };
}

// Add this interface at the top of the file
interface ActionResponse {
    content?: {
        text?: string;
    } | string;
    text?: string;
}

// Add conversation memory interface
interface ConversationMemory {
    messages: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    lastActivity: number;
}

// Update the VoiceConversationMemory interface at the top
interface VoiceMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface VoiceConversationMemory {
    messages: VoiceMessage[];
    lastActivity: number;
    characterName: string;
}

// Add interface for processing result
interface ProcessingResult {
    response: string;
    responseBuffer: Buffer | null;
    goodbyeBuffer: Buffer | null;
    conversation: VoiceConversationMemory;
}

export class WebhookService implements Service {
    readonly serviceType = ServiceType.TEXT_GENERATION;
    private app: Application;
    private server: Server | null = null;
    private runtime: IAgentRuntime | null = null;
    private initialized = false;
    private static instance: WebhookService | null = null;

    private static readonly BASE_PORT = 3003;
    private static readonly MAX_PORT = 3010;
    private static readonly DEFAULT_PORT = 3004;
    private audioHandler: { addAudio: (buffer: Buffer) => string };
    private conversations = new Map<string, ConversationMemory>();
    private voiceConversations = new Map<string, VoiceConversationMemory>();
    private readonly CONVERSATION_TIMEOUT = 30 * 60 * 1000;

    private static readonly SMS_LENGTH_RULES = {
        IDEAL: 160,
        MAX: 500,
        WARN: 300
    } as const;

    private static readonly DEFAULT_VOICE = {
        language: 'en',
        gender: 'male'
    } as const;

    // Add voice configuration
    private static readonly VOICE_CONFIG: { [key: string]: VoiceConfig } = {
        // Standard voices
        'en-male': {
            voice: 'Polly.Matthew-Neural',
            language: 'en-US',
            recognitionLanguage: 'en-US'
        },
        'en-female': {
            voice: 'Polly.Joanna-Neural',
            language: 'en-US',
            recognitionLanguage: 'en-US'
        },

        // Chinese voices
        'zh-male': {
            voice: 'Polly.Zhiyu-Neural',
            language: 'cmn-CN',
            recognitionLanguage: 'zh-CN'
        },
        'zh-female': {
            voice: 'Polly.Zhiyu-Neural',
            language: 'cmn-CN',
            recognitionLanguage: 'zh-CN'
        },

        // French voices
        'fr-male': {
            voice: 'Polly.Mathieu-Neural',
            language: 'fr-FR',
            recognitionLanguage: 'fr-FR'
        },
        'fr-female': {
            voice: 'Polly.Lea-Neural',
            language: 'fr-FR',
            recognitionLanguage: 'fr-FR'
        },

        // Default fallback
        'default': {
            voice: 'Polly.Matthew-Neural',
            language: 'en-US',
            recognitionLanguage: 'en-US'
        }
    };

    // Single cleanup interval for both types of conversations
    private cleanupInterval = setInterval(() => {
        const now = Date.now();

        // Cleanup SMS conversations
        for (const [phoneNumber, memory] of this.conversations.entries()) {
            if (now - memory.lastActivity > this.CONVERSATION_TIMEOUT) {
                this.conversations.delete(phoneNumber);
                SafeLogger.info(`💬 Cleaned up inactive SMS conversation: ${phoneNumber}`);
            }
        }

        // Cleanup voice conversations
        for (const [callSid, memory] of this.voiceConversations.entries()) {
            if (now - memory.lastActivity > this.CONVERSATION_TIMEOUT) {
                this.voiceConversations.delete(callSid);
                SafeLogger.info(`📞 Cleaned up inactive voice conversation: ${callSid}`);
            }
        }
    }, 5 * 60 * 1000); // Cleanup every 5 minutes

    // Add at the top of the file with other constants
    private static readonly DEFAULT_BASE_URL = 'http://localhost:3004';

    // Make constructor private for singleton pattern
    private constructor() {
        this.app = express();
        this.audioHandler = this.setupAudioRoute();
        this.setupMiddleware();
    }

    // Add static getInstance method
    public static getInstance(): WebhookService {
        if (!WebhookService.instance) {
            WebhookService.instance = new WebhookService();
        }
        return WebhookService.instance;
    }

    private setupMiddleware() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());

        // Add health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });
    }

    private async findAvailablePort(): Promise<number> {
        // First try the port from env var if specified
        const envPort = process.env.WEBHOOK_PORT ? parseInt(process.env.WEBHOOK_PORT, 10) : null;

        if (envPort) {
            try {
                await new Promise((resolve, reject) => {
                    const testServer = this.app.listen(envPort, () => {
                        testServer.close();
                        resolve(envPort);
                    });
                    testServer.on('error', reject);
                });
                return envPort;
            } catch (err) {
                console.warn(`Port ${envPort} from WEBHOOK_PORT is in use, trying alternative ports`);
            }
        }

        // Try ports in range if env port failed or wasn't specified
        for (let port = WebhookService.BASE_PORT; port <= WebhookService.MAX_PORT; port++) {
            try {
                await new Promise((resolve, reject) => {
                    const testServer = this.app.listen(port, () => {
                        testServer.close();
                        resolve(port);
                    });
                    testServer.on('error', reject);
                });
                return port;
            } catch (err) {
                if (port === WebhookService.MAX_PORT) {
                    throw new Error(`No available ports between ${WebhookService.BASE_PORT} and ${WebhookService.MAX_PORT}`);
                }
                continue;
            }
        }
        throw new Error('No available ports found');
    }

    async initialize(runtime?: IAgentRuntime): Promise<void> {
        // Skip if already initialized
        if (this.initialized) {
            SafeLogger.info('Webhook server already initialized, skipping...');
            return;
        }

        SafeLogger.info('🚀 Starting Twilio webhook server...');

        this.runtime = runtime || null;
        const port = process.env.WEBHOOK_PORT ? parseInt(process.env.WEBHOOK_PORT, 10) : WebhookService.DEFAULT_PORT;

        try {
            // Setup middleware and routes
            this.setupMiddleware();

            // Setup audio routes
            audioHandler.setupRoutes(this.app);

            this.setupSMSWebhook();
            this.setupVoiceWebhook();

            // Start the server
            this.server = this.app.listen(port, () => {
                SafeLogger.info('═══════════════════════════════════');
                SafeLogger.info('🌐 Twilio Webhook Server Status 🌐');
                SafeLogger.info('═══════════════════════════════════');
                SafeLogger.info(`✅ Server running on port: ${port}`);
                SafeLogger.info(`🏥 Health check: http://localhost:${port}/health`);
                SafeLogger.info(`📱 SMS webhook: http://localhost:${port}/webhook/sms`);
                SafeLogger.info(`🗣️ Voice webhook: http://localhost:${port}/webhook/voice`);
                SafeLogger.info('═══════════════════════════════════');
            });

            this.initialized = true;
        } catch (error) {
            // Add type checking for the error
            if (error && typeof error === 'object' && 'code' in error) {
                if (error.code === 'EADDRINUSE') {
                    SafeLogger.error(`❌ Port ${port} is already in use`);
                    SafeLogger.error('Please update WEBHOOK_PORT in your .env file');
                } else {
                    SafeLogger.error('❌ Server error:', error);
                }
            } else {
                SafeLogger.error('❌ Unknown server error:', error);
            }
            throw error;
        }
    }

    private setupSMSWebhook() {
        this.app.post('/webhook/sms',
            async (req, res) => {
                try {
                    const { Body: messageText, From: fromNumber } = req.body;

                    // Check runtime first
                    if (!this.runtime) {
                        throw new Error('Runtime not initialized');
                    }

                    // Get or create conversation memory
                    let conversation = this.conversations.get(fromNumber) || {
                        messages: [],
                        lastActivity: Date.now()
                    };

                    // Add user message
                    conversation.messages.push({
                        role: 'user',
                        content: messageText
                    });

                    // Get response using built-in generateText with context
                    const config = await this.loadCharacterConfig();
                    const context = conversation.messages
                        .map(m => `${m.role}: ${m.content}`)
                        .join('\n');

                    const response = await generateText({
                        context: `You are ${config.name}. Keep responses under 160 characters for SMS.
                                 DO NOT include tone markers, reactions, or contextual notes in brackets/parentheses.
                                 Speak naturally without describing how to speak.\n\n${context}`,
                        runtime: this.runtime,
                        modelClass: ModelClass.SMALL,
                        stop: ["\n", "User:", "Assistant:"]
                    });

                    // Add assistant response to memory
                    conversation.messages.push({
                        role: 'assistant',
                        content: response
                    });

                    // Trim conversation if too long (keep last 20 messages)
                    if (conversation.messages.length > 10) {
                        conversation.messages = conversation.messages.slice(-10);
                    }

                    // Update conversation
                    conversation.lastActivity = Date.now();
                    this.conversations.set(fromNumber, conversation);

                    // Send SMS response
                    const cleanResponse = this.cleanResponseText(response);
                    await twilioService.sendSms({
                        to: fromNumber,
                        body: cleanResponse
                    });

                    res.type('text/xml');
                    res.send('<Response></Response>');

                } catch (error) {
                    SafeLogger.error('Error handling SMS webhook:', error);
                    res.type('text/xml');
                    res.send('<Response></Response>');
                }
            }
        );
    }

    private setupAudioRoute() {
        this.app.get('/audio/:id', (req, res) => {
            //SafeLogger.info('🎵 Audio request received for ID:', req.params.id);
            const audioBuffer = audioHandler.getAudio(req.params.id);
            if (!audioBuffer) {
                SafeLogger.warn('❌ Audio not found:', { id: req.params.id });
                return res.status(404).send('Audio not found');
            }

            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(audioBuffer);
        });

        return {
            addAudio: (buffer: Buffer): string => {
                return audioHandler.addAudio(buffer);
            }
        };
    }

    private async generateSpeech(text: string, characterConfig: any): Promise<twilio.twiml.VoiceResponse> {
        const twiml = new twilio.twiml.VoiceResponse();

        // Increase chunk size for more natural speech flow
        const chunks = this.splitIntoChunks(text, 300); // Increased from 150 to 300

        // Add initial pause for stability
        twiml.pause({ length: 0.3 });

        for (const chunk of chunks) {
            if (characterConfig.settings?.voice?.useElevenLabs) {
                try {
                    const audioBuffer = await elevenLabsService.textToSpeech(chunk, {
                        voiceId: characterConfig.settings.voice.elevenLabsVoiceId,
                        stability: characterConfig.settings.voice.elevenLabsSettings?.stability || 0.5,
                        similarityBoost: characterConfig.settings.voice.elevenLabsSettings?.similarityBoost || 0.8,
                        style: characterConfig.settings.voice.elevenLabsSettings?.style || 0.5,
                        useSpeakerBoost: characterConfig.settings.voice.elevenLabsSettings?.useSpeakerBoost || false
                    });

                    if (audioBuffer) {
                        const audioUrl = this.audioHandler.addAudio(audioBuffer);
                        SafeLogger.info(`Generated audio URL: ${audioUrl}`);
                        twiml.play(audioUrl);
                        // Add a tiny pause between chunks for natural flow
                        twiml.pause({ length: 0.2 });
                        continue;
                    }
                } catch (error) {
                    SafeLogger.warn('ElevenLabs generation failed, falling back to Twilio TTS:', error);
                }
            }

            // Fallback to Twilio TTS
            const voiceConfig = this.getVoiceConfig(characterConfig);
            twiml.say({
                voice: voiceConfig.voice,
                language: voiceConfig.language
            }, chunk);
            twiml.pause({ length: 0.2 });
        }

        return twiml;
    }

    private splitIntoChunks(text: string, maxLength: number): string[] {
        // Split on sentence boundaries
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const chunks: string[] = [];
        let currentChunk = '';

        for (const sentence of sentences) {
            // Clean the sentence
            const cleanSentence = sentence.trim();

            // If sentence is too long, split on commas
            if (cleanSentence.length > maxLength) {
                const parts = cleanSentence.split(/,(?=\s)/);
                for (const part of parts) {
                    if (currentChunk.length + part.length > maxLength) {
                        if (currentChunk) chunks.push(currentChunk.trim());
                        currentChunk = part;
                    } else {
                        currentChunk += (currentChunk ? ', ' : '') + part;
                    }
                }
            } else {
                if (currentChunk.length + cleanSentence.length > maxLength) {
                    chunks.push(currentChunk.trim());
                    currentChunk = cleanSentence;
                } else {
                    currentChunk += (currentChunk ? ' ' : '') + cleanSentence;
                }
            }
        }

        if (currentChunk) chunks.push(currentChunk.trim());

        // Log chunk info for debugging
        SafeLogger.info(`Split text into ${chunks.length} chunks:`,
            chunks.map((chunk, i) => `Chunk ${i + 1}: ${chunk.length} chars`));

        return chunks;
    }

    private setupVoiceWebhook() {
        // Initial call handler
        this.app.post('/webhook/voice', async (req, res) => {
            try {
                const startTime = Date.now();
                const callSid = req.body.CallSid;
                const webhookBaseUrl = process.env.WEBHOOK_BASE_URL || 'http://localhost:3004';

                SafeLogger.info('📞 New call received');

                const config = await this.loadCharacterConfig();
                const greeting = `Hello! I'm ${config.name}. How may I assist you today?`;

                // Add greeting log
                SafeLogger.info('🤖 Agent greeting:', {
                    text: greeting
                });

                // Initialize conversation memory
                const conversation: VoiceConversationMemory = {
                    messages: [{
                        role: 'assistant',
                        content: greeting,
                        timestamp: new Date().toISOString()
                    }],
                    lastActivity: Date.now(),
                    characterName: config.name
                };
                this.voiceConversations.set(callSid, conversation);

                SafeLogger.info('🗣️ Converting greeting to speech');

                // Generate both greeting and goodbye buffers
                const [greetingBuffer, goodbyeBuffer] = await Promise.all([
                    elevenLabsService.textToSpeech(greeting, this.getVoiceSettings(config)),
                    elevenLabsService.textToSpeech("I haven't heard anything. Please call back if you'd like to talk.", this.getVoiceSettings(config))
                ]);

                const greetingId = this.audioHandler.addAudio(greetingBuffer!);
                const goodbyeId = this.audioHandler.addAudio(goodbyeBuffer!);

                const twiml = new twilio.twiml.VoiceResponse();

                // Create a gather that starts listening immediately
                const gather = twiml.gather({
                    input: ['speech', 'dtmf'],
                    timeout: 5,
                    action: `${webhookBaseUrl}/webhook/voice/gather`,
                    method: 'POST',
                    speechTimeout: 'auto'
                });

                // Play greeting inside gather - allows listening while playing
                gather.play({}, `${webhookBaseUrl}/audio/${greetingId}`);

                // Add a backup message in case no input is received
                twiml.play({}, `${webhookBaseUrl}/audio/${goodbyeId}`);
                twiml.hangup();

                res.type('text/xml').send(twiml.toString());

                SafeLogger.info('📞 Voice conversation:', {
                    type: 'voice',
                    duration: this.formatDuration(Date.now() - startTime),
                    exchange: { agent: greeting }
                });

            } catch (error) {
                SafeLogger.error('Error in voice webhook:', error);
                const twiml = new twilio.twiml.VoiceResponse();
                twiml.say("I'm sorry, I encountered an error. Please try again later.");
                twiml.hangup();
                res.type('text/xml').send(twiml.toString());
            }
        });

        // Handle ongoing conversation
        this.app.post('/webhook/voice/gather', async (req, res) => {
            try {
                const startTime = Date.now();
                const speechResult = req.body.SpeechResult;
                const callSid = req.body.CallSid;
                const webhookBaseUrl = process.env.WEBHOOK_BASE_URL || 'http://localhost:3004';

                // Log waiting for input
                SafeLogger.info('👂 Waiting for voice input', {
                    duration: (Date.now() - startTime) / 1000
                });

                if (speechResult) {
                    // Log received voice data immediately
                    SafeLogger.info('📥 Received voice data from Twilio');

                    // Add user message log
                    SafeLogger.info('👤 User said:', {
                        text: speechResult
                    });

                    try {
                        // Wrap all async operations in Promise.race with timeout
                        const processingPromise = (async (): Promise<ProcessingResult> => {
                            // Load config and get conversation in parallel
                            const [config, conversation] = await Promise.all([
                                this.loadCharacterConfig(),
                                this.getConversationMemory(callSid)
                            ]);

                            // Update conversation memory with user's message
                            conversation.messages.push({
                                role: 'user',
                                content: speechResult,
                                timestamp: new Date().toISOString()
                            });

                            // Generate response and audio in parallel
                            const [response, goodbyeBuffer] = await Promise.all([
                                generateText({
                                    context: `You are ${config.name}. Previous: ${conversation.messages.map(m => `${m.role}: ${m.content}`).join('\n')}\nUser: ${speechResult}\n\nRespond in 1-2 short sentences and end with a question.`,
                                    runtime: this.runtime!,
                                    modelClass: ModelClass.SMALL,
                                    stop: ["\n", "User:", "Assistant:"]
                                }),
                                elevenLabsService.textToSpeech("I haven't heard a response. Have a great day!", this.getVoiceSettings(config))
                            ]);

                            // Update conversation memory with assistant's response
                            conversation.messages.push({
                                role: 'assistant',
                                content: response,
                                timestamp: new Date().toISOString()
                            });

                            // Generate response audio
                            const responseBuffer = await elevenLabsService.textToSpeech(response, this.getVoiceSettings(config));
                            return { response, responseBuffer, goodbyeBuffer, conversation };
                        })();

                        const timeoutPromise = new Promise<never>((_, reject) => {
                            setTimeout(() => reject(new Error('Operation timed out')), 8000);
                        });

                        // Race between processing and timeout with proper typing
                        const result = await Promise.race<ProcessingResult>([
                            processingPromise,
                            timeoutPromise
                        ]);

                        const { response, responseBuffer, goodbyeBuffer } = result;

                        // Add agent response log
                        SafeLogger.info('🤖 Agent response:', {
                            text: response
                        });

                        // Create TwiML response
                        const twiml = new twilio.twiml.VoiceResponse();

                        if (responseBuffer) {
                            const responseId = this.audioHandler.addAudio(responseBuffer);
                            const goodbyeId = this.audioHandler.addAudio(goodbyeBuffer!);

                            // Create a gather that starts listening immediately while playing audio
                            const gather = twiml.gather({
                                input: ['speech'],
                                timeout: 5,
                                action: `${webhookBaseUrl}/webhook/voice/gather`,
                                method: 'POST',
                                speechTimeout: 'auto',
                                language: 'en-US'
                            });

                            // Play the response inside the gather
                            gather.play({}, `${webhookBaseUrl}/audio/${responseId}`);

                            // Add a pause before goodbye to give more time for response
                            twiml.pause({ length: 2 });
                            twiml.play({}, `${webhookBaseUrl}/audio/${goodbyeId}`);

                            // Add debug log
                            const playbackStartTime = Date.now();
                            SafeLogger.info('🔊 Starting playback and listening', {
                                duration: (Date.now() - playbackStartTime) / 1000
                            });
                        } else {
                            // Similar optimization for TTS fallback
                            const gather = twiml.gather({
                                input: ['speech'],
                                timeout: 5,
                                action: `${webhookBaseUrl}/webhook/voice/gather`,
                                method: 'POST',
                                speechTimeout: 'auto',
                                language: 'en-US'
                            });
                            gather.say(response);
                            twiml.pause({ length: 2 });
                            twiml.say("I haven't heard a response. Have a great day!");
                        }

                        // Send response immediately
                        res.type('text/xml').send(twiml.toString());

                        // Log after sending response
                        SafeLogger.info('🎤 Voice captured', {
                            duration: (Date.now() - startTime) / 1000
                        });

                    } catch (timeoutError) {
                        // Handle timeout specifically
                        SafeLogger.error('Operation timed out:', { callSid, error: timeoutError });
                        const twiml = new twilio.twiml.VoiceResponse();
                        twiml.say("I'm sorry, it's taking longer than expected. Please try again.");
                        twiml.hangup();
                        res.type('text/xml').send(twiml.toString());
                    }
                }

            } catch (error) {
                SafeLogger.error('Error in voice gather webhook:', error);
                const twiml = new twilio.twiml.VoiceResponse();
                twiml.say("I'm sorry, I encountered an error. Please try again later.");
                twiml.hangup();
                res.type('text/xml').send(twiml.toString());
            }
        });
    }

    private async loadCharacterConfig(): Promise<any> {
        try {
            const characterFile = process.env.TWILIO_CHARACTER;
            if (!characterFile) {
                throw new Error('TWILIO_CHARACTER not set in environment');
            }

            const projectRoot = process.cwd().replace(/\/agent$/, '');
            const characterPath = path.join(projectRoot, 'characters', characterFile);
            const characterData = await fs.readFile(characterPath, 'utf-8');
            const config = JSON.parse(characterData);

            // Remove verbose logging, just return config
            return config;
        } catch (error) {
            SafeLogger.error('Failed to load character configuration:', error);
            return {
                name: 'AI Assistant',
                settings: {
                    voice: {
                        language: 'en',
                        gender: 'male'
                    }
                }
            };
        }
    }

    private generateSystemPrompt(rawConfig: any): string {
        const name = rawConfig.name || 'AI Assistant';
        const bio = Array.isArray(rawConfig.bio) ? rawConfig.bio.join('\n') : '';
        const knowledge = Array.isArray(rawConfig.knowledge) ? rawConfig.knowledge.join('\n') : '';
        const style = rawConfig.style?.all ? rawConfig.style.all.join('\n') : '';

        let systemPrompt = `You are ${name}. You must provide concise responses in 1-2 short sentences. Keep your responses under 50 words.`;

        if (bio) {
            systemPrompt += `, with these key traits:\n\n${bio}`;
        }

        if (knowledge) {
            systemPrompt += `\n\nCore knowledge areas:\n${knowledge}`;
        }

        if (style) {
            systemPrompt += `\n\nCommunication style:\n${style}`;
        }

        systemPrompt += `\n\nAlways stay in character as ${name}, but keep responses brief and to the point. Never exceed 2 sentences or 50 words.`;

        return systemPrompt;
    }

    private ensureTwilioInitialized() {
        if (!twilioService.isInitialized()) {
            throw new Error('Twilio service not properly initialized');
        }
    }

    private getVoiceConfig(characterConfig: any): VoiceConfig {
        // If no settings at all, use defaults
        if (!characterConfig.settings || !characterConfig.settings.voice) {
            const voiceKey = `${WebhookService.DEFAULT_VOICE.language}-${WebhookService.DEFAULT_VOICE.gender}`;
            return WebhookService.VOICE_CONFIG[voiceKey] || WebhookService.VOICE_CONFIG.default;
        }

        const voiceSettings = characterConfig.settings.voice;

        // Check for custom voice first
        if (voiceSettings.custom) {
            return {
                voice: voiceSettings.custom,
                language: 'en-US',  // Default to US English for custom voices
                recognitionLanguage: 'en-US'
            };
        }

        // Fall back to standard voice configuration
        const language = voiceSettings.language || WebhookService.DEFAULT_VOICE.language;
        const gender = voiceSettings.gender || WebhookService.DEFAULT_VOICE.gender;

        const voiceKey = `${language}-${gender}`;
        return WebhookService.VOICE_CONFIG[voiceKey] || WebhookService.VOICE_CONFIG.default;
    }

    private async processTranscription(transcription: string): Promise<string> {
        if (!this.runtime) {
            SafeLogger.error('Runtime not initialized');
            return "I apologize, but my core processing system isn't ready.";
        }

        try {
            const config = await this.loadCharacterConfig();
            const response = await generateText({
                context: `You are ${config.name}. Keep responses under 50 words.\n\nUser: ${transcription}`,
                runtime: this.runtime,
                modelClass: config.settings?.model?.class || ModelClass.MEDIUM,
                stop: ["\n", "User:", "Assistant:"]
            });

            return response;
        } catch (error) {
            SafeLogger.error('Processing error:', error);
            return "I apologize, but I encountered an error. Could you please try again?";
        }
    }

    private logVoiceConversation(callSid: string, userSaid: string, agentResponse: string) {
        const timestamp = new Date().toISOString();
        const conversationLog = {
            timestamp,
            callSid,
            type: 'voice',
            exchange: {
                user: userSaid,
                agent: agentResponse
            }
        };

        SafeLogger.info('📞 Voice conversation:', conversationLog);
    }

    // Add at the top with other utility functions
    private cleanResponseText(text: string): string {
        // Remove [reactions] or (context) at start of response
        text = text.replace(/^\s*[\[(][^)\]]*[\])]\s*/g, '');

        // Remove any remaining [reactions] or (context)
        text = text.replace(/\s*[\[(][^)\]]*[\])]\s*/g, ' ');

        // Clean up multiple spaces and trim
        text = text.replace(/\s+/g, ' ').trim();

        return text;
    }

    // Helper function to format duration
    private formatDuration(ms: number): string {
        return ms >= 1000 ? `${(ms/1000).toFixed(1)}s` : `${ms.toFixed(2)}ms`;
    }

    private getVoiceSettings(config: any) {
        return {
            voiceId: config.settings?.voice?.elevenlabs?.voiceId,
            stability: Number(config.settings?.voice?.elevenlabs?.stability || 0.5),
            similarityBoost: Number(config.settings?.voice?.elevenlabs?.similarityBoost || 0.9),
            style: Number(config.settings?.voice?.elevenlabs?.style || 0.66),
            useSpeakerBoost: Boolean(config.settings?.voice?.elevenlabs?.useSpeakerBoost || false)
        };
    }

    // Add helper method to get conversation memory
    private async getConversationMemory(callSid: string): Promise<VoiceConversationMemory> {
        let conversation = this.voiceConversations.get(callSid);
        if (!conversation) {
            conversation = {
                messages: [],
                lastActivity: Date.now(),
                characterName: ''
            };
            this.voiceConversations.set(callSid, conversation);
        }
        return conversation;
    }
}

// Export singleton instance
export const webhookService = WebhookService.getInstance();