import { IgApiClient } from 'instagram-private-api';
import type { InstagramState } from '../types';

// Create a singleton for the Instagram API client
let igClient: IgApiClient | null = null;

export const getIgClient = () => {
  if (!igClient) {
    igClient = new IgApiClient();
  }
  return igClient;
};

// Create initial state
export const createInitialState = (): InstagramState => ({
  accessToken: null,
  longLivedToken: null,
  profile: null,
  isInitialized: false,
  lastCheckedMediaId: null,
});