export interface VoiceSettings {
    language?: string;
    gender?: 'male' | 'female';
    custom?: string;  // Add support for custom Polly voice IDs
}

export interface VoiceConfig {
    voice: string;
    language: string;
    recognitionLanguage: string;
}