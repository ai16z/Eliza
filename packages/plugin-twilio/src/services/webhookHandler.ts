import type { WebhookHandler, WebhookRequest, WebhookResponse } from '../types/webhook.js';
import { twilioService } from './twilio.js';
import { SafeLogger } from '../utils/logger.js';
import twilio from 'twilio';

export class TwilioWebhookHandler implements WebhookHandler {
  async handleSmsWebhook(req: WebhookRequest): Promise<WebhookResponse> {
    try {
      SafeLogger.info('Received SMS webhook request:', {
        headers: req.headers,
        body: req.body,
        method: req.method
      });

      const { Body: message, From: fromNumber } = req.body;
      SafeLogger.info(`Processing SMS from ${fromNumber}: ${message}`);

      // Your existing SMS handling logic here...

      return {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
        body: '<Response></Response>'
      };
    } catch (error) {
      SafeLogger.error('Error handling SMS webhook:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'text/xml' },
        body: '<Response></Response>'
      };
    }
  }

  async handleVoiceWebhook(req: WebhookRequest): Promise<WebhookResponse> {
    try {
      const { CallSid, From: fromNumber } = req.body;
      SafeLogger.info(`Received voice call from ${fromNumber}, CallSid: ${CallSid}`);

      const twiml = new twilio.twiml.VoiceResponse();
      // Add your TwiML response here...

      return {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
        body: twiml.toString()
      };
    } catch (error) {
      SafeLogger.error('Error handling voice webhook:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'text/xml' },
        body: '<Response><Say>An error occurred</Say></Response>'
      };
    }
  }

  async handleTranscribeWebhook(req: WebhookRequest): Promise<WebhookResponse> {
    try {
      const { CallSid, SpeechResult: transcription } = req.body;
      SafeLogger.info(`Received transcription for call ${CallSid}: "${transcription}"`);

      const twiml = new twilio.twiml.VoiceResponse();
      // Add your TwiML response here...

      return {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
        body: twiml.toString()
      };
    } catch (error) {
      SafeLogger.error('Error handling transcribe webhook:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'text/xml' },
        body: '<Response><Say>An error occurred</Say></Response>'
      };
    }
  }
}

export const webhookHandler = new TwilioWebhookHandler();