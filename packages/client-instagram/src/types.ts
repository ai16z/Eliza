
export interface InstagramState {
  accessToken: string | null;
  longLivedToken: string | null;
  profile: InstagramProfile | null;
  isInitialized: boolean;
  lastCheckedMediaId: string | null;
}

export interface InstagramProfile {
  id: string;
  username: string;
  name: string;
  biography: string;
  mediaCount: number;
  followerCount: number;
  followingCount: number;
}

export interface MediaItem {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  children?: MediaItem[];
}

export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  username: string;
  replies?: Comment[];
}