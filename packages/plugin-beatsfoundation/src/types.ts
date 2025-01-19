export interface GenerateSongRequest {
  prompt: string;
  lyrics?: string;
  genre?: string;
  mood?: string;
  isInstrumental?: boolean;
}

export interface Song {
  id: string;
  title: string;
  audio_url: string;
  streams: number;
  upvote_count: number;
  song_url: string;
  username: string;
}