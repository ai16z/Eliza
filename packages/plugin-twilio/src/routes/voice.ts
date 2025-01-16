import express, { Router } from 'express';
import twilio from 'twilio';
import { twilioService } from '../services/twilio.js';
import type { Request, Response } from 'express';
import { SafeLogger } from '../utils/logger.js';

const router: Router = express.Router();

router.post('/webhook/voice', async (req: Request, res: Response) => {
    try {
        const audioId = req.query.audioId as string;
        const callSid = req.body.CallSid;

        // Get the stored conversation
        const conversation = twilioService.voiceConversations.get(callSid);

        // Create TwiML response
        const twiml = new twilio.twiml.VoiceResponse();
        const gather = twiml.gather({
            input: ['speech'],
            timeout: 5,
            action: '/webhook/voice/gather',
            method: 'POST',
            speechTimeout: 'auto',
            language: 'en-US'
        });

        // Always use the stored audio if available
        if (audioId) {
            SafeLogger.info('🎵 Playing personalized audio message');
            gather.play({}, `${process.env.WEBHOOK_BASE_URL}/audio/${audioId}`);
        } else if (conversation?.messages[0]?.content) {
            SafeLogger.info('🗣️ Using personalized greeting:', {
                content: conversation.messages[0].content
            });
            gather.say(conversation.messages[0].content);
        } else {
            // This fallback should rarely happen
            const fallbackGreeting = `Hello! This is ${conversation?.characterName || 'your assistant'}. How may I assist you today?`;
            SafeLogger.warn('⚠️ Using fallback greeting - no stored message found');
            gather.say(fallbackGreeting);
        }

        res.type('text/xml');
        res.send(twiml.toString());

    } catch (error) {
        SafeLogger.error('Error in voice webhook:', error);
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say("I'm sorry, I encountered an error. Please try again later.");
        twiml.hangup();
        res.type('text/xml').send(twiml.toString());
    }
});

export default router;