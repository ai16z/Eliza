// /packages/plugin-twilio/src/services/twilio.ts

import twilio, { Twilio } from 'twilio';
import type { Service } from '@elizaos/core';
import { ServiceType } from '@elizaos/core';
import { SafeLogger } from '../utils/logger.js';

interface SendSmsOptions {
    to: string;
    body: string;
}

interface MakeCallOptions {
    to: string;
    message: string;
}

export class TwilioService implements Service {
    readonly serviceType = ServiceType.TEXT_GENERATION;
    private client: Twilio | null = null;
    private initialized = false;

    async initialize(runtime?: any): Promise<void> {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        if (!accountSid || !authToken) {
            throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set');
        }

        this.client = twilio(accountSid, authToken);
        this.initialized = true;
        SafeLogger.info('✅ Twilio client initialized successfully');
    }

    isInitialized(): boolean {
        return this.initialized;
    }

    getClient(): Twilio | null {
        return this.client;
    }

    async sendSms({ to, body }: SendSmsOptions): Promise<void> {
        if (!this.client) {
            throw new Error('Twilio client not initialized');
        }

        const fromNumber = process.env.TWILIO_PHONE_NUMBER;
        if (!fromNumber) {
            throw new Error('TWILIO_PHONE_NUMBER not set');
        }

        try {
            const message = await this.client.messages.create({
                body,
                to,
                from: fromNumber
            });

            SafeLogger.info(`📱 Message sent successfully, SID: ${message.sid}`);
        } catch (error) {
            SafeLogger.error('❌ Failed to send SMS:', error);
            throw error;
        }
    }

    async makeCall({ to, message }: MakeCallOptions): Promise<void> {
        if (!this.client) {
            throw new Error('Twilio client not initialized');
        }

        const fromNumber = process.env.TWILIO_PHONE_NUMBER;
        if (!fromNumber) {
            throw new Error('TWILIO_PHONE_NUMBER not set');
        }

        try {
            const call = await this.client.calls.create({
                twiml: `<Response><Say>${message}</Say></Response>`,
                to,
                from: fromNumber
            });

            SafeLogger.info(`📞 Call initiated successfully, SID: ${call.sid}`);
        } catch (error) {
            SafeLogger.error('❌ Failed to initiate call:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const twilioService = new TwilioService();