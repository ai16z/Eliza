export interface VoiceSettings {
    language?: string;
    gender?: 'male' | 'female';
    custom?: string;
    useElevenLabs?: boolean;
    elevenLabsVoiceId?: string;
    elevenLabsSettings?: {
        stability?: number;
        similarityBoost?: number;
        style?: number;
        useSpeakerBoost?: boolean;
    };
}

export interface VoiceConfig {
    voice: string;
    language: string;
    recognitionLanguage: string;
}