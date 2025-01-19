import { Content } from '@ai16z/eliza';

export interface dadJokeConfig {
    provider: {
        apiKey: string;
        baseUrl?: string;
        options?: string;
    };
}

export interface dadJokeData {
    joke: string;
    //image?: ;
}

export interface dadJokeActionContent extends Content {
    text: string;
}

export interface dadJokeEvalContent extends Content {
    text: string;
}       

export interface dadJokeEvalResponse {
    success: boolean;
    response: string;
}

export interface dadJokeProviderResponse {
    success: boolean;
    data?: dadJokeData;
    error?: string;
}