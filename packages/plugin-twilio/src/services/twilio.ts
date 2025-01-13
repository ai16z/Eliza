// /packages/plugin-twilio/src/services/twilio.ts

import pkg from 'twilio';
const { Twilio } = pkg;
import type { Twilio as TwilioInstance } from 'twilio';
import type { Service } from '@elizaos/core';
import { ServiceType } from '@elizaos/core';
import { SafeLogger } from '../utils/logger.js';

export class TwilioService implements Service {
  readonly serviceType = ServiceType.TEXT_GENERATION;
  private client: pkg.Twilio | null = null;

  constructor() {
    this.initializeClient();
  }

  public async initialize(): Promise<void> {
    await this.initializeClient();
  }

  private initializeClient() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials are not set');
    }

    try {
      this.client = pkg(accountSid, authToken);
      SafeLogger.info('✅ Twilio client initialized successfully');
    } catch (error) {
      SafeLogger.error('❌ Failed to initialize Twilio client:', error);
      throw error;
    }
  }

  public isInitialized(): boolean {
    return this.client !== null;
  }

  public getClient(): TwilioInstance | null {
    return this.client;
  }

  async sendMessage(to: string, body: string) {
    if (!this.client) {
      throw new Error('Twilio service not initialized');
    }

    try {
      const message = await this.client.messages.create({
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
        body
      });
      SafeLogger.info(`📱 Message sent successfully to ${to}`);
      return message;
    } catch (error) {
      SafeLogger.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    this.client = null;
    SafeLogger.info('✅ Twilio service shut down');
  }
}

export const twilioService = new TwilioService();