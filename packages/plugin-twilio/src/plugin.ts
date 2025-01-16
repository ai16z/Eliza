import { Plugin, Service } from '@elizaos/core';
import { webhookService } from './services/webhook.js';
import { twilioService } from './services/twilio.js';
import { actions } from './actions/index.js';
import { SafeLogger } from './utils/logger.js';

const plugin: Plugin = {
    name: '@elizaos/plugin-twilio',
    description: 'Twilio integration for voice and SMS interactions',
    actions,
    evaluators: [],
    providers: [],
    services: [webhookService]
};

// Initialize services when plugin is loaded
(async () => {
    try {
        // Check if Twilio is initialized
        if (!twilioService.isInitialized()) {
            SafeLogger.error('Failed to initialize Twilio service - check your credentials');
            return;
        }

        // Add debug logging
        SafeLogger.info('Available actions:', actions.map(a => a.name));
        SafeLogger.info('Plugin initialized with services:', {
            webhook: true, // WebhookService is always initialized when loaded
            twilio: twilioService.isInitialized()
        });

    } catch (error) {
        SafeLogger.error('Error initializing Twilio plugin:', error);
    }
})();

export default plugin;