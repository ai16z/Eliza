import axios from 'axios';
import { Song } from '../../types';
import { CreateSongContent } from './types';

export function createSongService(apiKey: string) {
    return {
        createSong: async (content: CreateSongContent): Promise<Song> => {
            try {
                const response = await axios.post(
                    'https://www.beatsfoundation.com/api/songs',
                    content,
                    {
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 300000, // 5 minutes timeout for song generation
                    }
                );
                return response.data.song;
            } catch (error: any) {
                if (error.response) {
                    throw new Error(`Beats Foundation API Error: ${error.response.data.error || error.response.status}`);
                }
                throw error;
            }
        }
    };
}