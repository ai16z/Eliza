// /packages/plugin-twilio/src/services/twilio.ts

import type { IAgentRuntime } from '@elizaos/core';
import twilio from 'twilio';
import { SafeLogger } from '../utils/logger.js';
import { VoiceConversationMemory } from '../types/voice.js';

// Declare global runtime type
declare global {
    var defaultRuntime: IAgentRuntime | undefined;
}

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
    private static instance: TwilioService;
    public client: twilio.Twilio;
    public voiceConversations: Map<string, VoiceConversationMemory>;
    private callRuntimes: Map<string, IAgentRuntime>;
    private initialized: boolean = false;

    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        if (!accountSid || !authToken) {
            throw new Error('Missing required Twilio credentials');
        }

        try {
            this.client = twilio(accountSid, authToken);
            this.voiceConversations = new Map();
            this.callRuntimes = new Map();
            this.initialized = true;
        } catch (error) {
            SafeLogger.error('Failed to initialize Twilio client:', error);
            this.initialized = false;
            throw error;
        }
    }

    static getInstance(): TwilioService {
        if (!this.instance) {
            this.instance = new TwilioService();
        }
        return this.instance;
    }

    public isInitialized(): boolean {
        return this.initialized && !!process.env.TWILIO_PHONE_NUMBER;
    }

    async initializeCallRuntime(callSid: string): Promise<IAgentRuntime> {
        if (!this.isInitialized()) {
            throw new Error('Twilio service not properly initialized');
        }

        try {
            const runtime = global.defaultRuntime;
            if (!runtime) {
                throw new Error('Default runtime not found');
            }

            this.callRuntimes.set(callSid, runtime);
            SafeLogger.info(`Runtime initialized for call ${callSid}`);

            return runtime;
        } catch (error) {
            SafeLogger.error('Failed to initialize call runtime:', error);
            throw error;
        }
    }

    getRuntimeForCall(callSid: string): IAgentRuntime | undefined {
        if (!this.isInitialized()) {
            throw new Error('Twilio service not properly initialized');
        }
        return this.callRuntimes.get(callSid);
    }

    async sendSms(params: { to: string; body: string }) {
        if (!this.isInitialized()) {
            throw new Error('Twilio service not properly initialized');
        }

        return this.client.messages.create({
            to: params.to,
            from: process.env.TWILIO_PHONE_NUMBER,
            body: params.body
        });
    }
}

export const twilioService = TwilioService.getInstance();