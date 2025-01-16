// /packages/plugin-twilio/src/services/twilio.ts

import twilio from 'twilio';
import { SafeLogger } from '../utils/logger.js';
import { VoiceConversationMemory } from '../types/voice.js';

// Export the interfaces so they can be used elsewhere
export interface SendSmsOptions {
    to: string;
    body: string;
}

export interface MakeCallOptions {
    to: string;
    message?: string;
    twiml?: string;
}

export class TwilioService {
    private _client: twilio.Twilio | null = null;
    private _phoneNumber: string | null = null;
    public voiceConversations = new Map<string, VoiceConversationMemory>();

    constructor() {
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            this._client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            this._phoneNumber = process.env.TWILIO_PHONE_NUMBER || null;
        }
    }

    get client() {
        if (!this._client) {
            throw new Error('Twilio client not initialized');
        }
        return this._client;
    }

    get phoneNumber() {
        if (!this._phoneNumber) {
            throw new Error('Twilio phone number not set');
        }
        return this._phoneNumber;
    }

    public isInitialized(): boolean {
        return this._client !== null;
    }

    public async sendSms({ to, body }: SendSmsOptions) {
        if (!this.isInitialized()) {
            SafeLogger.error('Twilio not initialized');
            throw new Error('Twilio client not initialized');
        }

        try {
            SafeLogger.info('Attempting to send SMS:', {
                from: this.phoneNumber,
                to,
                bodyLength: body.length
            });

            const message = await this.client.messages.create({
                body,
                to,
                from: this.phoneNumber
            });

            SafeLogger.info('SMS sent successfully:', {
                sid: message.sid,
                status: message.status,
                from: message.from,
                to: message.to
            });
            return message;
        } catch (error) {
            SafeLogger.error('Failed to send SMS:', {
                error: error instanceof Error ? error.message : error,
                errorDetails: error,
                to,
                from: this.phoneNumber
            });
            throw error;
        }
    }

    public async makeCall({ to, message, twiml }: MakeCallOptions) {
        if (!this.isInitialized()) {
            throw new Error('Twilio client not initialized');
        }

        try {
            const call = await this.client.calls.create({
                to,
                from: this.phoneNumber,
                twiml: twiml || `<Response><Say>${message}</Say></Response>`
            });

            SafeLogger.info(`Call initiated successfully. SID: ${call.sid}`);
            return call;
        } catch (error) {
            SafeLogger.error('Failed to initiate call:', error);
            throw error;
        }
    }
}

export const twilioService = new TwilioService();