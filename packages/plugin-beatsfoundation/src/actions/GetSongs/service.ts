import axios from 'axios';
import { Song } from '../../types';

export function createSongsService(apiKey: string) {
    return {
        getSongs: async (limit?: number, offset?: number): Promise<Song[]> => {
            try {
                const params: Record<string, any> = {};
                if (limit !== undefined) params.limit = limit;
                if (offset !== undefined) params.offset = offset;

                const response = await axios.get(
                    'https://www.beatsfoundation.com/api/songs',
                    {
                        params,
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                return response.data.songs;
            } catch (error: any) {
                if (error.response) {
                    throw new Error(`Beats Foundation API Error: ${error.response.data.error || error.response.status}`);
                }
                throw error;
            }
        }
    };
}