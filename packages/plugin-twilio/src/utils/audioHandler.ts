// /packages/plugin-twilio/src/utils/audioHandler.ts

import { v4 as uuidv4 } from 'uuid';
import { SafeLogger } from './logger.js';
import type { Application } from 'express';

export class AudioHandler {
    private audioStore = new Map<string, Buffer>();

    addAudio(buffer: Buffer): string {
        const id = uuidv4();
        this.audioStore.set(id, buffer);
        return id;
    }

    getAudio(id: string): Buffer | undefined {
        return this.audioStore.get(id);
    }

    setupRoutes(app: Application): void {
        app.get('/audio/:id', (req, res) => {
            const audioBuffer = this.getAudio(req.params.id);

            if (!audioBuffer) {
                SafeLogger.warn('❌ Audio not found:', { id: req.params.id });
                return res.status(404).send('Audio not found');
            }

            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(audioBuffer);
        });
    }
}

// Export singleton instance
export const audioHandler = new AudioHandler();