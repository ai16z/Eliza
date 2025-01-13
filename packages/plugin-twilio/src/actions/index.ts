import { sendSmsAction } from './sendSms.js';
import { callVoiceAction } from './callVoice.js';

export const actions = [
    sendSmsAction,
    callVoiceAction
];

export { sendSmsAction, callVoiceAction };