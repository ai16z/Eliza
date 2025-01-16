// /packages/plugin-twilio/src/types/voice.ts

export interface ElevenLabsVoiceConfig {
    voiceId: string;
    modelId?: string;
    stability?: number;
    similarityBoost?: number;
    style?: number;
    useSpeakerBoost?: boolean;
}

export interface VoiceConversationMemory {
    messages: Array<{
        role: 'assistant' | 'user';
        content: string;
        timestamp: string;
    }>;
    lastActivity: number;
    characterName: string;
}

export interface VoiceSettings {
    elevenlabs?: Partial<ElevenLabsVoiceConfig>;
    polly?: {
        voiceId: string;
        engine?: 'neural' | 'standard';
    };
}