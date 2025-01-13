import type { WebhookConfig } from '../types/webhook.js';

export const webhookConfig: WebhookConfig = {
  routes: {
    sms: {
      path: '/webhook/sms',
      method: 'POST',
      handler: 'handleSmsWebhook'
    },
    voice: {
      path: '/webhook/voice',
      method: 'POST',
      handler: 'handleVoiceWebhook'
    },
    transcribe: {
      path: '/webhook/voice/transcribe',
      method: 'POST',
      handler: 'handleTranscribeWebhook'
    }
  },
  security: {
    validateSignature: true,
    authToken: process.env.TWILIO_AUTH_TOKEN
  }
};