//  /packages/plugin-twilio/src/services/webhook.ts

import { Service, ServiceType, IAgentRuntime, KnowledgeItem, HandlerCallback, Content, Memory, State } from '@elizaos/core';
import express from 'express';
import { twilioService } from './twilio.js';
import twilio from 'twilio';
import { Anthropic } from '@anthropic-ai/sdk';
import { SafeLogger } from '../utils/logger.js';
import path from 'path';
import fs from 'fs/promises';
import type { Server } from 'http';
import type { Say } from 'twilio/lib/twiml/VoiceResponse';
import type { Gather } from 'twilio/lib/twiml/VoiceResponse';
import { v4 as uuidv4 } from 'uuid';
import { elevenLabsService } from './elevenlabs.js';

// Add UUID type at the top
type UUID = string;

// Add proper typing for Anthropic response
interface AnthropicMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface AnthropicResponse {
    content: Array<{
        type: string;
        text: string;
    }>;
}

// Add types for router stack
interface RouteInfo {
    route?: {
        path: string;
        methods: { [key: string]: boolean };
    };
}

// Add type for Gather input
type GatherInput = 'speech' | 'dtmf';

// API key validation helper
const validateApiKey = (apiKey: string | undefined): string => {
    if (!apiKey?.trim()) {
        throw new Error('ANTHROPIC_API_KEY is not set');
    }
    const cleanKey = apiKey.trim();
    if (!cleanKey.startsWith('sk-ant-')) {
        throw new Error('Invalid API key format - must start with sk-ant-');
    }
    if (cleanKey.length < 40) {
        throw new Error('API key appears too short');
    }
    return cleanKey;
};

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

export class WebhookService implements Service {
    readonly serviceType = ServiceType.TEXT_GENERATION;
    private app: express.Application;
    private server: Server | null = null;
    private runtime: IAgentRuntime | null = null;
    private static readonly BASE_PORT = 3003;
    private static readonly MAX_PORT = 3010;
    private static readonly DEFAULT_PORT = 3004;
    private anthropic: Anthropic;
    private knowledge: KnowledgeItem[] = [];
    private static instance: WebhookService | null = null;
    private initialized = false;
    private audioHandler: { addAudio: (buffer: Buffer) => string };
    private conversations = new Map<string, ConversationMemory>();
    private readonly CONVERSATION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

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

    // Add conversation cleanup
    private cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [callSid, memory] of this.conversations.entries()) {
            if (now - memory.lastActivity > this.CONVERSATION_TIMEOUT) {
                this.conversations.delete(callSid);
                SafeLogger.info(`Cleaned up inactive conversation: ${callSid}`);
            }
        }
    }, 5 * 60 * 1000); // Cleanup every 5 minutes

    // Make constructor private for singleton pattern
    private constructor() {
        this.app = express();
        this.anthropic = new Anthropic({
            apiKey: validateApiKey(process.env.ANTHROPIC_API_KEY)
        });
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
            express.urlencoded({ extended: true }),
            async (req, res) => {
                try {
                    this.ensureTwilioInitialized();
                    const { Body: message, From: fromNumber } = req.body;
                    SafeLogger.info(`Received SMS from ${fromNumber}: ${message}`);

                    const characterConfig = await this.loadCharacterConfig();
                    const characterName = characterConfig.name || 'AI Assistant';

                    const combinedSystemPrompt = `${characterConfig.config.systemPrompt}

CRITICAL SMS FORMATTING RULES (MUST FOLLOW):
1. NEVER START WITH PHRASES LIKE:
   - "Here is a response from..."
   - "From my perspective..."
   - "Let me tell you..."
   - "I would say that..."
   - "Here's what I think..."
2. START YOUR RESPONSE DIRECTLY WITH THE CONTENT
3. KEEP RESPONSES SHORT AND CONCISE (100-160 CHARACTERS)
4. NO META-COMMENTARY OR ROLEPLAY
5. NO ACTION DESCRIPTIONS
6. NO LENGTHY INTRODUCTIONS
7. GET STRAIGHT TO THE POINT
8. USE SIMPLE, CLEAR LANGUAGE

Example good responses:
✅ "The quarterly results show a 6.3% increase in overall performance."
✅ "Our new initiative has successfully connected with 140 partner organizations."

Example bad responses:
❌ "Here is my response about the results..."
❌ "Let me share my thoughts on this topic..."
❌ "From my perspective as a leader..."
❌ "I would say that the results are..."`;

                    const response = await this.anthropic.messages.create({
                        model: characterConfig.config.model,
                        max_tokens: 1024,
                        temperature: characterConfig.config.temperature,
                        system: combinedSystemPrompt,
                        messages: [{
                            role: 'user',
                            content: message
                        }]
                    });

                    let messageText = response.content[0]?.type === 'text' ? response.content[0].text : '';

                    // Handle message length
                    if (messageText.length > WebhookService.SMS_LENGTH_RULES.MAX) {
                        // Find the last complete sentence before MAX limit
                        const lastSentence = messageText.substring(0, WebhookService.SMS_LENGTH_RULES.MAX).match(/^.*?[.!?](?:\s|$)/g);
                        messageText = lastSentence ? lastSentence[lastSentence.length - 1].trim() : messageText.substring(0, WebhookService.SMS_LENGTH_RULES.IDEAL);
                    }

                    if (messageText.length > WebhookService.SMS_LENGTH_RULES.WARN) {
                        SafeLogger.warn(`Response length (${messageText.length}) exceeds recommended length of ${WebhookService.SMS_LENGTH_RULES.WARN} characters`);
                    }

                    if (messageText) {
                        SafeLogger.info(`Sending SMS to ${fromNumber}: ${messageText}`);
                        await twilioService.sendSms({
                            to: fromNumber,
                            body: messageText
                        });
                    }

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
        const audioBuffers = new Map<string, Buffer>();

        this.app.get('/audio/:id', (req, res) => {
            const buffer = audioBuffers.get(req.params.id);
            if (!buffer) {
                res.status(404).send('Audio not found');
                return;
            }
            res.type('audio/mpeg');
            res.send(buffer);
        });

        return {
            addAudio: (buffer: Buffer): string => {
                const id = uuidv4();
                audioBuffers.set(id, buffer);
                setTimeout(() => audioBuffers.delete(id), 5 * 60 * 1000);
                const baseUrl = process.env.WEBHOOK_BASE_URL || `http://localhost:${process.env.WEBHOOK_PORT || 3004}`;
                return `${baseUrl}/audio/${id}`;
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
                const { CallSid } = req.body;
                SafeLogger.info('New call received:', { CallSid });

                // Load character and generate greeting
                const config = await this.loadCharacterConfig();
                const greeting = `Hello! I'm ${config.name}. How may I assist you today?`;

                // Generate voice response with null check
                const audioBuffer = await elevenLabsService.textToSpeech(greeting, {
                    voiceId: config.settings?.voice?.elevenLabsVoiceId,
                    stability: 0.5,
                    similarityBoost: 0.8
                });

                if (!audioBuffer) {
                    throw new Error('Failed to generate audio');
                }

                // Create TwiML
                const twiml = new twilio.twiml.VoiceResponse();
                const audioUrl = this.audioHandler.addAudio(audioBuffer);
                twiml.play(audioUrl);

                // Add gather for user input
                twiml.gather({
                    input: ['speech'],
                    action: '/webhook/voice/response',
                    method: 'POST',
                    speechTimeout: 'auto',
                    language: 'en-US'
                });

                res.type('text/xml');
                res.send(twiml.toString());
            } catch (error) {
                SafeLogger.error('Voice error:', error);
                this.handleVoiceError(res);
            }
        });

        // Handle ongoing conversation
        this.app.post('/webhook/voice/response', async (req, res) => {
            try {
                const { CallSid, SpeechResult } = req.body;

                // Get or create conversation memory
                let conversation = this.conversations.get(CallSid);
                if (!conversation) {
                    conversation = {
                        messages: [],
                        lastActivity: Date.now()
                    };
                    this.conversations.set(CallSid, conversation);
                }

                // Update conversation with user message
                conversation.messages.push({
                    role: 'user',
                    content: SpeechResult
                });
                conversation.lastActivity = Date.now();

                // Get response from Anthropic with conversation history
                const config = await this.loadCharacterConfig();
                const response = await this.anthropic.messages.create({
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: 150,
                    messages: [
                        { role: 'assistant', content: `You are ${config.name}. Keep responses under 50 words.` },
                        ...conversation.messages // Now the types match
                    ]
                });

                const responseText = response.content[0].text;

                // Update conversation with assistant response
                conversation.messages.push({
                    role: 'assistant',
                    content: responseText
                });

                // Generate voice response with null check
                const audioBuffer = await elevenLabsService.textToSpeech(responseText, {
                    voiceId: config.settings?.voice?.elevenLabsVoiceId,
                    stability: 0.5,
                    similarityBoost: 0.8
                });

                if (!audioBuffer) {
                    throw new Error('Failed to generate audio');
                }

                const audioUrl = this.audioHandler.addAudio(audioBuffer);

                // Create TwiML
                const twiml = new twilio.twiml.VoiceResponse();
                twiml.play(audioUrl);

                // Add gather for next input
                twiml.gather({
                    input: ['speech'],
                    action: '/webhook/voice/response',
                    method: 'POST',
                    speechTimeout: 'auto',
                    language: 'en-US'
                });

                res.type('text/xml');
                res.send(twiml.toString());
            } catch (error) {
                SafeLogger.error('Voice response error:', error);
                this.handleVoiceError(res);
            }
        });
    }

    // Simple error handler
    private handleVoiceError(res: express.Response) {
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say("I'm sorry, I encountered an error. Please try again.");
        twiml.gather({
            input: ['speech'],
            action: '/webhook/voice/response',
            method: 'POST',
            speechTimeout: 'auto'
        });
        res.type('text/xml');
        res.send(twiml.toString());
    }

    private async loadCharacterConfig(): Promise<any> {
        try {
            const characterFile = process.env.TWILIO_CHARACTER;
            if (!characterFile) {
                throw new Error('TWILIO_CHARACTER not set in environment');
            }

            // Get the project root directory (one level up from 'agent')
            const projectRoot = process.cwd().replace(/\/agent$/, '');

            // Log the character loading process
            SafeLogger.info('Loading character configuration:', {
                characterFile,
                projectRoot,
                expectedPath: path.join(projectRoot, 'characters', characterFile)
            });

            const characterPath = path.join(projectRoot, 'characters', characterFile);
            const characterData = await fs.readFile(characterPath, 'utf-8');
            const config = JSON.parse(characterData);

            // Validate voice settings
            SafeLogger.info('Character configuration loaded:', {
                name: config.name,
                hasSettings: !!config.settings,
                hasVoice: !!config.settings?.voice,
                voiceSettings: config.settings?.voice,
                useElevenLabs: config.settings?.voice?.useElevenLabs,
                voiceId: config.settings?.voice?.elevenLabsVoiceId
            });

            return config;
        } catch (error) {
            SafeLogger.error('Failed to load character configuration:', error);
            // Return a default configuration
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
        // Safely access properties with optional chaining and fallbacks
        const name = rawConfig.name || 'AI Assistant';
        const bio = Array.isArray(rawConfig.bio) ? rawConfig.bio.join('\n') : '';
        const knowledge = Array.isArray(rawConfig.knowledge) ? rawConfig.knowledge.join('\n') : '';
        const style = rawConfig.style?.all ? rawConfig.style.all.join('\n') : '';
        const additionalKnowledge = this.knowledge.map(k => k.content).join('\n');

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

        if (additionalKnowledge) {
            systemPrompt += `\n\nAdditional context:\n${additionalKnowledge}`;
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
            const defaultUUID = '00000000-0000-0000-0000-000000000000' as const;
            const message: Memory = {
                content: {
                    text: transcription,
                    type: 'text',
                    action: 'CONTINUE',
                    role: 'user',
                    metadata: { source: 'twilio', timestamp: Date.now() }
                },
                userId: defaultUUID,
                agentId: this.runtime.agentId || defaultUUID,
                roomId: defaultUUID
            };

            const characterConfig = await this.loadCharacterConfig();
            const systemPrompt = this.generateSystemPrompt(characterConfig);

            const state: State = {
                bio: characterConfig.bio || [],
                lore: characterConfig.lore || [],
                messageDirections: characterConfig.messageDirections || [],
                postDirections: characterConfig.postDirections || [],
                systemPrompt,
                character: characterConfig,
                settings: characterConfig.settings || {},
                roomId: defaultUUID,
                actors: JSON.stringify([{
                    id: this.runtime.agentId || defaultUUID,
                    name: characterConfig.name,
                    role: 'assistant'
                }]),
                recentMessages: JSON.stringify([message]),
                recentMessagesData: [message],
                metadata: { source: 'twilio', timestamp: Date.now() }
            };

            return new Promise<string>((resolve) => {
                const messageQueue: Memory[] = [];
                let hasResolved = false;
                const TIMEOUT = 30000; // Reduce to 30 seconds

                // Add early response check
                const earlyCheck = setTimeout(() => {
                    if (!hasResolved && messageQueue.length > 0) {
                        const lastMessage = messageQueue[messageQueue.length - 1];
                        if (lastMessage?.content?.text) {
                            hasResolved = true;
                            resolve(lastMessage.content.text);
                            return;
                        }
                    }
                }, 5000); // Check after 5 seconds

                const timeout = setTimeout(() => {
                    if (!hasResolved) {
                        SafeLogger.warn('ProcessActions timeout reached, falling back to Anthropic');
                        hasResolved = true;
                        clearTimeout(earlyCheck);

                        // Fallback to Anthropic
                        this.anthropic.messages.create({
                            model: 'claude-3-sonnet-20240229',
                            max_tokens: 1024,
                            messages: [
                                { role: 'assistant', content: systemPrompt },
                                { role: 'user', content: transcription }
                            ]
                        }).then(response => {
                            resolve(response.content[0].text);
                        }).catch(error => {
                            SafeLogger.error('Anthropic fallback failed:', error);
                            resolve("I'm having trouble processing that. Could you please try again?");
                        });
                    }
                }, TIMEOUT);

                this.runtime!.processActions(
                    message,
                    messageQueue,
                    state,
                    async (response: Content): Promise<Memory[]> => {
                        if (!hasResolved && response?.text) {
                            hasResolved = true;
                            clearTimeout(timeout);
                            clearTimeout(earlyCheck);
                            resolve(response.text);
                        }

                        const memoryResponse: Memory = {
                            userId: defaultUUID,
                            agentId: this.runtime?.agentId || defaultUUID,
                            content: {
                                text: response?.text || '',
                                type: response?.type || 'text',
                                action: response?.action || 'CONTINUE',
                                role: 'assistant',
                                metadata: {
                                    source: 'twilio',
                                    timestamp: Date.now(),
                                    processId: this.runtime?.agentId
                                }
                            },
                            roomId: defaultUUID
                        };

                        messageQueue.push(memoryResponse);
                        return [memoryResponse];
                    }
                ).catch(error => {
                    SafeLogger.error('ProcessActions error:', error);
                    clearTimeout(timeout);
                    resolve("I apologize, but I encountered an error processing your request.");
                });
            });

        } catch (error) {
            SafeLogger.error('Processing error:', error);
            return "I apologize, but I encountered an error. Could you please try again?";
        }
    }
}

// Export singleton instance
export const webhookService = WebhookService.getInstance();