import type { Plugin } from '@elizaos/core';
import type { WebhookConfig } from './types/webhook.js';
import type { WebhookHandler } from './types/webhook.js';
import { webhookService } from './services/webhook.js';
import { twilioService } from './services/twilio.js';
import { webhookConfig } from './config/webhookConfig.js';
import { webhookHandler } from './services/webhookHandler.js';
import { SafeLogger } from './utils/logger.js';
import { actions } from './actions/index.js';
import { elevenLabsService } from './services/elevenlabs.js';

export interface TwilioPlugin extends Plugin {
  webhooks?: {
    config: WebhookConfig;
    handler: WebhookHandler;
  };
  initialize?: (runtime: any) => Promise<void>;
  version?: string;
  services: any[];
  actions: any[];
}

export const plugin: TwilioPlugin = {
  name: 'twilio',
  description: 'Twilio plugin for SMS and voice calls',
  version: '0.1.0',
  services: [webhookService, twilioService, elevenLabsService],
  actions,
  webhooks: {
    config: webhookConfig,
    handler: webhookHandler
  },
  initialize: async (runtime) => {
    try {
      SafeLogger.info('🔌 Initializing Twilio plugin...');
      SafeLogger.info('Plugin configuration:', {
        name: plugin.name,
        version: plugin.version,
        services: Array.isArray(plugin.services) ? plugin.services.length : 0
      });

      await webhookService.initialize(runtime);
      await twilioService.initialize();

      try {
        await elevenLabsService.initialize();
      } catch (error) {
        SafeLogger.warn('ElevenLabs initialization failed - will use default TTS:', error);
      }

      const baseUrl = process.env.WEBHOOK_BASE_URL;
      if (!baseUrl) {
        throw new Error('WEBHOOK_BASE_URL not set in environment');
      }

      const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
      if (!phoneNumber) {
        throw new Error('TWILIO_PHONE_NUMBER not set in environment');
      }

      const client = twilioService.getClient();
      if (!client) {
        throw new Error('Twilio client not initialized');
      }

      await client.incomingPhoneNumbers(phoneNumber)
        .update({
          smsUrl: `${baseUrl}/webhook/sms`,
          voiceUrl: `${baseUrl}/webhook/voice`
        });

      SafeLogger.info('✅ Twilio webhooks configured successfully');
      SafeLogger.info(`📱 SMS webhook URL: ${baseUrl}/webhook/sms`);
      SafeLogger.info(`🗣️ Voice webhook URL: ${baseUrl}/webhook/voice`);
    } catch (error) {
      SafeLogger.error('❌ Plugin initialization failed:', error);
      throw error;
    }
  }
};