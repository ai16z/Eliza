// /packages/plugin-twilio/src/index.ts

import { Plugin } from '@elizaos/core';
import { WebhookService } from './services/webhook';
import { actions } from './actions';

const plugin: Plugin = {
    name: "@elizaos/plugin-twilio",
    description: "Twilio integration for voice and SMS interactions",
    actions,
    evaluators: [],
    providers: [],
    services: [WebhookService.getInstance()]
};

// Make sure we're exporting as default
export default plugin;

// Named exports for additional functionality
export * from './services/webhook.js';
export * from './services/twilio.js';
export * from './types/webhook.js';
export * from './actions/callVoice.js';
export * from './actions/sendSms.js';
