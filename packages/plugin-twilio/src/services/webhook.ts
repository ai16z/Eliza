//  /packages/plugin-twilio/src/services/webhook.ts

import { Service, ServiceType, IAgentRuntime, KnowledgeItem, Content } from '@elizaos/core';
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

export class WebhookService implements Service {
    readonly serviceType = ServiceType.TEXT_GENERATION;
    private app: express.Express;
    private server: Server | null = null;
    private runtime: IAgentRuntime | null = null;
    private static readonly BASE_PORT = 3003;
    private static readonly MAX_PORT = 3010;
    private static readonly DEFAULT_PORT = 3004;
    private anthropic: Anthropic;
    private knowledge: KnowledgeItem[] = [];
    private static instance: WebhookService | null = null;
    private initialized = false;

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
        // English voices
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

    // Make constructor private for singleton pattern
    private constructor() {
        this.app = express();
        this.anthropic = new Anthropic({
            apiKey: validateApiKey(process.env.ANTHROPIC_API_KEY)
        });
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
                SafeLogger.info('🌐 Twilio Webhook Server Status');
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

    private setupVoiceWebhook() {
        this.app.post('/webhook/voice',
            express.urlencoded({ extended: true }),
            async (req, res) => {
                try {
                    this.ensureTwilioInitialized();
                    const { CallSid, From: fromNumber } = req.body;
                    SafeLogger.info(`Received voice call from ${fromNumber}, CallSid: ${CallSid}`);

                    const characterConfig = await this.loadCharacterConfig();
                    const characterName = characterConfig.name || 'AI Assistant';

                    // Get voice config from character config or use default
                    const voiceConfig = this.getVoiceConfig(characterConfig);

                    const greeting = `Hello! I'm ${characterName}. How may I assist you today?`;
                    SafeLogger.info(`Sending greeting for call ${CallSid}: "${greeting}"`);

                    const twiml = new twilio.twiml.VoiceResponse();
                    twiml.say({
                        voice: voiceConfig.voice,
                        language: voiceConfig.language
                    }, greeting);

                    twiml.gather({
                        input: ['speech'],
                        action: '/webhook/voice/transcribe',
                        method: 'POST',
                        language: voiceConfig.recognitionLanguage
                    });

                    res.type('text/xml');
                    res.send(twiml.toString());
                } catch (error) {
                    SafeLogger.error(`Error handling voice call ${req.body?.CallSid}:`, error);
                    const twiml = new twilio.twiml.VoiceResponse();
                    twiml.say('Sorry, I had trouble understanding that. Let\'s try again!');
                    twiml.redirect('/webhook/voice');
                    res.type('text/xml');
                    res.send(twiml.toString());
                }
            }
        );

        this.app.post('/webhook/voice/transcribe',
            express.urlencoded({ extended: true }),
            async (req, res) => {
                try {
                    this.ensureTwilioInitialized();
                    const { CallSid, SpeechResult: transcription } = req.body;
                    SafeLogger.info(`Received transcription for call ${CallSid}: "${transcription}"`);

                    if (!transcription) {
                        throw new Error('No transcription received');
                    }

                    const characterConfig = await this.loadCharacterConfig();
                    const characterName = characterConfig.name || 'AI Assistant';
                    SafeLogger.info(`Using character: ${characterName} for transcription ${CallSid}`);

                    const voiceSystemPrompt = `${characterConfig.config.systemPrompt}

CRITICAL VOICE RESPONSE RULES (MUST FOLLOW):
1. NEVER START WITH PHRASES LIKE:
   - "Here is a response from..."
   - "From my perspective..."
   - "Let me tell you..."
   - "I would say that..."
   - "Here's what I think..."
2. START YOUR RESPONSE DIRECTLY WITH THE CONTENT
3. KEEP RESPONSES SHORT AND CONCISE (30-60 WORDS)
4. NO META-COMMENTARY OR ROLEPLAY
5. NO ACTION DESCRIPTIONS
6. NO LENGTHY INTRODUCTIONS
7. GET STRAIGHT TO THE POINT
8. USE SIMPLE, CLEAR LANGUAGE

Example good responses:
✅ "The economy grew 6.3% last quarter, showing strong momentum."
✅ "Our initiative has connected 140 partner organizations worldwide."

Example bad responses:
❌ "Here is my response about the economy..."
❌ "Let me share my thoughts on this topic..."
❌ "From my perspective as a leader..."
❌ "I would say that our progress..."`;

                    const response = await this.anthropic.messages.create({
                        model: characterConfig.config.model,
                        max_tokens: 1024,
                        temperature: characterConfig.config.temperature,
                        system: voiceSystemPrompt,
                        messages: [{
                            role: 'user',
                            content: transcription
                        }]
                    });

                    const aiResponse = response.content[0]?.type === 'text' ? response.content[0].text : '';
                    SafeLogger.info(`AI response for call ${CallSid}: "${aiResponse}"`);

                    const voiceConfig = this.getVoiceConfig(characterConfig);

                    const twiml = new twilio.twiml.VoiceResponse();
                    twiml.say({
                        voice: voiceConfig.voice,
                        language: voiceConfig.language
                    }, aiResponse);

                    twiml.gather({
                        input: ['speech'],
                        action: '/webhook/voice/transcribe',
                        method: 'POST',
                        language: voiceConfig.recognitionLanguage
                    });

                    res.type('text/xml');
                    res.send(twiml.toString());
                    SafeLogger.info(`Successfully processed transcription for call ${CallSid}`);

                } catch (error) {
                    SafeLogger.error(`Error processing transcription for call ${req.body?.CallSid}:`, error);
                    try {
                        // Get character config and voice config for error response
                        const characterConfig = await this.loadCharacterConfig();
                        const voiceConfig = this.getVoiceConfig(characterConfig);

                        const twiml = new twilio.twiml.VoiceResponse();
                        twiml.say({
                            voice: voiceConfig.voice,
                            language: voiceConfig.language
                        }, 'I apologize, but I had trouble understanding that. Could you please repeat?');

                        twiml.gather({
                            input: ['speech'],
                            action: '/webhook/voice/transcribe',
                            method: 'POST',
                            language: voiceConfig.recognitionLanguage
                        });

                        res.type('text/xml');
                        res.send(twiml.toString());
                    } catch (configError) {
                        // Fallback to default response if we can't load voice config
                        const twiml = new twilio.twiml.VoiceResponse();
                        twiml.say('I apologize, but I had trouble understanding that. Could you please repeat?');
                        twiml.gather({
                            input: ['speech'],
                            action: '/webhook/voice/transcribe',
                            method: 'POST'
                        });
                        res.type('text/xml');
                        res.send(twiml.toString());
                    }
                }
            }
        );
    }

    private async loadCharacterConfig() {
        const characterFile = process.env.TWILIO_CHARACTER ||
            (this.runtime?.agentId ? `${this.runtime.agentId}.character.json` : null);

        if (!characterFile) {
            throw new Error('No character file specified - set TWILIO_CHARACTER in .env');
        }

        const projectRoot = path.resolve(process.cwd(), '..');
        const configPath = path.join(projectRoot, 'characters', characterFile);

        try {
            const configData = await fs.readFile(configPath, 'utf-8');
            const rawConfig = JSON.parse(configData);

            return {
                name: rawConfig.name,
                config: {
                    model: rawConfig.config?.model || rawConfig.settings?.model || 'claude-3-sonnet-20240229',
                    temperature: rawConfig.config?.temperature || 0.7,
                    systemPrompt: rawConfig.config?.systemPrompt || this.generateSystemPrompt(rawConfig)
                }
            };
        } catch (error) {
            SafeLogger.error(`Failed to load character from: ${configPath}`, error);
            throw error;
        }
    }

    private generateSystemPrompt(rawConfig: any): string {
        // Safely access properties with optional chaining and fallbacks
        const name = rawConfig.name || 'AI Assistant';
        const bio = Array.isArray(rawConfig.bio) ? rawConfig.bio.join('\n') : '';
        const knowledge = Array.isArray(rawConfig.knowledge) ? rawConfig.knowledge.join('\n') : '';
        const style = rawConfig.style?.all ? rawConfig.style.all.join('\n') : '';

        // Use the loaded knowledge items instead of trying to access ragKnowledge
        const additionalKnowledge = this.knowledge.map(k => k.content).join('\n');

        let systemPrompt = `You are ${name}`;

        if (bio) {
            systemPrompt += `, with the following characteristics:\n\n${bio}`;
        }

        if (knowledge) {
            systemPrompt += `\n\nYour knowledge includes:\n${knowledge}`;
        }

        if (style) {
            systemPrompt += `\n\nYour communication style:\n${style}`;
        }

        if (additionalKnowledge) {
            systemPrompt += `\n\nAdditional context:\n${additionalKnowledge}`;
        }

        systemPrompt += `\n\nAlways stay in character and respond as ${name} would.`;

        return systemPrompt;
    }

    private ensureTwilioInitialized() {
        if (!twilioService.isInitialized()) {
            throw new Error('Twilio service not properly initialized');
        }
    }

    private getVoiceConfig(characterConfig: any): VoiceConfig {
        // If no settings at all or no voice settings, use defaults
        if (!characterConfig.settings || !characterConfig.settings.voice) {
            const voiceKey = `${WebhookService.DEFAULT_VOICE.language}-${WebhookService.DEFAULT_VOICE.gender}`;
            return WebhookService.VOICE_CONFIG[voiceKey] || WebhookService.VOICE_CONFIG.default;
        }

        const voiceSettings = characterConfig.settings.voice;
        const language = voiceSettings.language || WebhookService.DEFAULT_VOICE.language;
        const gender = voiceSettings.gender || WebhookService.DEFAULT_VOICE.gender;

        const voiceKey = `${language}-${gender}`;
        return WebhookService.VOICE_CONFIG[voiceKey] || WebhookService.VOICE_CONFIG.default;
    }
}

// Export singleton instance
export const webhookService = WebhookService.getInstance();