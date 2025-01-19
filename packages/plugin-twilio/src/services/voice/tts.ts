import type { ElevenLabsAPI, VoiceSettings } from '../../types/voice.js';
import { SafeLogger } from '../../utils/logger.js';

export class TextToSpeechService {
    constructor(private elevenlabs: ElevenLabsAPI) {}

    async convertToSpeech(text: string, voiceSettings?: Partial<VoiceSettings>): Promise<Buffer> {
        try {
            const audioBuffer = await this.elevenlabs.textToSpeech(text, voiceSettings);
            if (!audioBuffer) {
                throw new Error('Failed to convert text to speech');
            }
            return audioBuffer;
        } catch (error) {
            SafeLogger.error('TTS conversion failed:', error);
            throw error;
        }
    }
}