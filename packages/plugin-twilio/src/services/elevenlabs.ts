import { Service, ServiceType } from '@elizaos/core';
import { SafeLogger } from '../utils/logger.js';

interface ElevenLabsVoiceConfig {
    voiceId: string;
    modelId: string;
    stability: number;
    similarityBoost: number;
    style: number;
    useSpeakerBoost: boolean;
    optimizeStreamingLatency?: number;
    output_format?: {
        type: string;
    };
}

interface AudioQualityMetrics {
    sampleRate: number;
    bitDepth: number;
    channels: number;
}

interface AudioValidationResult {
    isValid: boolean;
    issues: string[];
}

interface ElevenLabsSubscription {
    character_count: number;
    character_limit: number;
    can_extend_character_limit: boolean;
    allowed_to_extend_character_limit: boolean;
    next_character_count_reset_unix: number;
    voice_limit: number;
    can_extend_voice_limit: boolean;
    can_use_instant_voice_cloning: boolean;
    currency: string;
    status: string;
    next_invoice: {
        amount: number;
        currency: string;
    };
    has_open_invoices: boolean;
}

export class ElevenLabsService implements Service {
    readonly serviceType = ServiceType.TEXT_GENERATION;
    private apiKey: string | null = null;
    private initialized = false;
    private baseUrl = 'https://api.elevenlabs.io/v1';
    private quotaExceeded = false;
    private isReinitializing = false;
    private initializationPromise: Promise<void> | null = null;

    constructor() {
        this.apiKey = null;
    }

    async reinitialize(): Promise<void> {
        if (this.isReinitializing && this.initializationPromise) {
            await this.initializationPromise;
            return;
        }

        try {
            this.isReinitializing = true;
            this.initializationPromise = this.initialize();
            await this.initializationPromise;
        } finally {
            this.isReinitializing = false;
            this.initializationPromise = null;
        }
    }

    async initialize(): Promise<void> {
        const apiKey = process.env.ELEVENLABS_XI_API_KEY;
        if (!apiKey) {
            SafeLogger.warn('ELEVENLABS_XI_API_KEY not set - ElevenLabs features will be disabled');
            return;
        }

        // If we already have this API key and we're initialized, skip
        if (this.apiKey === apiKey && this.initialized) {
            return;
        }

        try {
            // Test the API key and check quota
            const response = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
                headers: {
                    'xi-api-key': apiKey,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API error: ${response.statusText}`);
            }

            const subscriptionData = await response.json() as ElevenLabsSubscription;
            const availableCharacters = subscriptionData.character_limit - subscriptionData.character_count;

            if (availableCharacters <= 0) {
                SafeLogger.warn('ElevenLabs quota exceeded - falling back to Twilio TTS');
                this.quotaExceeded = true;
                return;
            }

            SafeLogger.info(`✅ ElevenLabs service initialized (Characters available: ${availableCharacters})`);
            this.apiKey = apiKey;
            this.initialized = true;
            this.quotaExceeded = false;

        } catch (error) {
            SafeLogger.error('Failed to initialize ElevenLabs service:', error);
            this.initialized = false;
            this.apiKey = null;
        }
    }

    isInitialized(): boolean {
        return this.initialized && !this.quotaExceeded;
    }

    private getDefaultConfig(): ElevenLabsVoiceConfig {
        return {
            voiceId: process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM',
            modelId: 'eleven_monolingual_v1',
            stability: 0.3,
            similarityBoost: 0.5,
            style: 0.5,
            useSpeakerBoost: false,
            optimizeStreamingLatency: 4,
            output_format: {
                type: "mp3_44100_64"
            }
        };
    }

    private validateAudioQuality(metrics: AudioQualityMetrics): AudioValidationResult {
        const issues: string[] = [];

        if (metrics.sampleRate < 44100) {
            issues.push('Sample rate should be at least 44.1 kHz');
        }

        if (metrics.bitDepth < 16) {
            issues.push('Bit depth should be at least 16-bit');
        }

        if (metrics.channels !== 1) {
            issues.push('Audio should be mono');
        }

        return {
            isValid: issues.length === 0,
            issues
        };
    }

    async textToSpeech(text: string, config?: Partial<ElevenLabsVoiceConfig>): Promise<Buffer | null> {
        try {
            // Check if we need to reinitialize (new API key)
            const currentApiKey = process.env.ELEVENLABS_XI_API_KEY;
            if (currentApiKey && currentApiKey !== this.apiKey && !this.isReinitializing) {
                await this.reinitialize();
            }

            // Wait for any pending initialization to complete
            if (this.initializationPromise) {
                await this.initializationPromise;
            }

            if (!this.initialized || !this.apiKey || this.quotaExceeded) {
                return null;
            }

            const finalConfig = { ...this.getDefaultConfig(), ...config };

            // Optimize text length to save characters
            const MAX_CHARS = 300;
            if (text.length > MAX_CHARS) {
                SafeLogger.warn(`Text length (${text.length}) exceeds ${MAX_CHARS} characters, truncating...`);
                text = text.substring(0, MAX_CHARS) + '...';
            }

            // Use the optimized streaming endpoint with Twilio-compatible format
            const response = await fetch(`${this.baseUrl}/text-to-speech/${finalConfig.voiceId}/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey,
                    'Accept': 'audio/mpeg'
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_monolingual_v1',
                    optimize_streaming_latency: 4,
                    output_format: {
                        type: "mp3_44100_128"  // Using MP3 format for better Twilio compatibility
                    },
                    voice_settings: {
                        stability: finalConfig.stability || 0.5,
                        similarity_boost: finalConfig.similarityBoost || 0.8,
                        style: finalConfig.style || 0.5,
                        use_speaker_boost: finalConfig.useSpeakerBoost || false
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);

                    // Check for quota exceeded error
                    if (errorData?.detail?.status === 'quota_exceeded') {
                        SafeLogger.warn('ElevenLabs quota exceeded during generation - disabling service');
                        this.quotaExceeded = true;
                        return null;
                    }

                    throw new Error(`ElevenLabs API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
                } catch (e) {
                    throw new Error(`ElevenLabs API error: ${response.statusText} - ${errorText}`);
                }
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Validate buffer
            if (!buffer || buffer.length === 0) {
                throw new Error('Received empty audio buffer from ElevenLabs');
            }

            // Log only at the end if successful
            //SafeLogger.info('✅ Audio generated successfully');
            return buffer;

        } catch (error) {
            SafeLogger.error('❌ Audio generation failed:', error);
            return null;
        }
    }
}

export const elevenLabsService = new ElevenLabsService();