// /packages/plugin-twilio/src/index.ts

import { plugin } from './plugin.js';

// Default export should be the plugin itself
export default plugin;

// Named exports for additional functionality
export * from './services/webhook.js';
export * from './services/twilio.js';
export * from './types/webhook.js';
