import type { VoiceConversationMemory } from '../../types/voice.js';
import { SafeLogger } from '../../utils/logger.js';

export class ConversationMemory {
    private conversations = new Map<string, VoiceConversationMemory>();

    getConversation(callSid: string): VoiceConversationMemory | undefined {
        return this.conversations.get(callSid);
    }

    createConversation(callSid: string, characterName: string): VoiceConversationMemory {
        const conversation: VoiceConversationMemory = {
            messages: [],
            lastActivity: Date.now(),
            characterName
        };
        this.conversations.set(callSid, conversation);
        return conversation;
    }

    addMessage(callSid: string, role: 'user' | 'assistant', content: string): void {
        const conversation = this.conversations.get(callSid);
        if (!conversation) {
            throw new Error('Conversation not found');
        }

        conversation.messages.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });
        conversation.lastActivity = Date.now();
    }

    clearConversation(callSid: string): void {
        this.conversations.delete(callSid);
    }
}