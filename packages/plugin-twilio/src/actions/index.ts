import { sendSms } from './sendSms.js';
import { callVoice } from './callVoice.js';
import { smsConversation } from './smsConversation.js';
import { voiceConversation } from './voiceConversation.js';

// Export individual actions
export {
    sendSms,
    callVoice,
    smsConversation,
    voiceConversation
};

// Export actions array
export const actions = [
    sendSms,
    callVoice,
    smsConversation,
    voiceConversation
];