import { Plugin } from '@elizaos/core';
import { webhookService } from './services/webhook.js';
import { twilioService } from './services/twilio.js';
import { call } from './actions/call.js';
import { sms } from './actions/sms.js';
import { SafeLogger } from './utils/logger.js';

const plugin: Plugin = {
    name: '@elizaos/plugin-twilio',
    description: 'Twilio integration for voice and SMS interactions',
    actions: [call, sms],
    evaluators: [],
    providers: [],
    services: [webhookService]
};

// Initialize services when plugin is loaded
(async () => {
    try {
        // Initialize webhook service first
        await webhookService.init();
        SafeLogger.info('✅ Webhook service initialized');

        // Check if Twilio is initialized
        if (!twilioService.isInitialized()) {
            SafeLogger.error('Failed to initialize Twilio service - check your credentials');
            return;
        }

        SafeLogger.info('Available actions:', [call.name, sms.name]);
        SafeLogger.info('Plugin initialized with services:', {
            webhook: webhookService.isInitialized(),
            twilio: twilioService.isInitialized()
        });

    } catch (error) {
        SafeLogger.error('Error initializing Twilio plugin:', error);
    }
})();

export default plugin;