import { sendSms } from './sendSms.js';
import { callVoice } from './callVoice.js';

// Export individual actions
export {
    sendSms,
    callVoice
};

// Export actions array
export const actions = [
    sendSms,
    callVoice
];