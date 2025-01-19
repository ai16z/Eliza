// utils/voiceSettingsParser.ts
import type { IAgentRuntime } from '@elizaos/core';

export function parseVoiceSettings(runtime: IAgentRuntime) {
    return {
        voiceId: runtime.character?.settings?.voice?.elevenlabs?.voiceId || 'default',
        modelId: 'eleven_multilingual_v2',
        stability: Number(runtime.character?.settings?.voice?.elevenlabs?.stability) || 0.5,
        similarityBoost: Number(runtime.character?.settings?.voice?.elevenlabs?.similarityBoost) || 0.8,
        style: Number(runtime.character?.settings?.voice?.elevenlabs?.style) || 0.5,
        useSpeakerBoost: Boolean(runtime.character?.settings?.voice?.elevenlabs?.useSpeakerBoost) || false
    };
}