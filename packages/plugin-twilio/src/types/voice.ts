// /packages/plugin-twilio/src/types/voice.ts

import type { Character } from '@elizaos/core';

export interface VoiceConversationMemory {
    messages: Array<{
        role: 'user' | 'assistant';
        content: string;
        timestamp: string;
    }>;
    lastActivity: number;
    characterName: string;
}

export interface VoiceSettings {
    voiceId: string;
    model?: string;
    stability?: number;
    similarityBoost?: number;
    style?: number;
    useSpeakerBoost?: boolean;
}

export interface ElevenLabsAPI {
    textToSpeech(text: string, settings?: Partial<VoiceSettings>): Promise<Buffer | null>;
}