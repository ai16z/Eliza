import express, { Router } from 'express';
import { voiceHandler } from '../services/voice/handler.js';
import { SafeLogger } from '../utils/logger.js';
import type { VoiceConversationMemory } from '../types/voice.js';

const router: Router = express.Router();

// Handle incoming calls
router.post('/webhook/voice', (req, res) => voiceHandler.handleIncomingCall(req, res));

// Handle outgoing calls
router.post('/webhook/voice/outgoing', (req, res) => voiceHandler.handleOutgoingCall(req, res));

export default router;