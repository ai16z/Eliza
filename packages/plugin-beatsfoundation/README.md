# @elizaos/plugin-beatsfoundation

A plugin for Eliza that enables AI music generation using the Beats Foundation API.

## Features
- AI-powered music generation from text prompts
- Support for multiple genres and moods
- Optional lyrics input
- Instrumental track generation
- Natural language processing for music generation requests
- Access to the Beats Foundation song library

## Installation
```bash
npm install @elizaos/plugin-beatsfoundation
```

## Configuration
1. Get your API key from [Beats Foundation](https://www.beatsfoundation.com)
2. Set up your environment variables:
```bash
BEATS_FOUNDATION_API_KEY=your_api_key
```
3. Register the plugin in your Eliza configuration:
```typescript
import { BeatsFoundationPlugin } from "@elizaos/plugin-beatsfoundation";
// In your Eliza configuration
plugins: [
    new BeatsFoundationPlugin(),
    // ... other plugins
];
```

## Usage
The plugin responds to natural language queries for music generation. Here are some examples:
```plaintext
"Generate a happy pop song about summer"
"Create an instrumental jazz track"
"Make me a rock song with these lyrics: [lyrics]"
"List recent AI-generated songs"
```

### Supported Parameters
The plugin supports various music generation parameters including:
- Genre (pop, rock, jazz, etc.)
- Mood (happy, sad, energetic, etc.)
- Lyrics (optional)
- Instrumental toggle (boolean, will generate instrumental track or with vocals)
- Custom prompts (up to 200 characters)

### Available Actions
#### GENERATE_SONG
Generates a new AI song based on provided parameters.
```typescript
// Example response format
{
  id: "song_123",
  title: "Summer Vibes",
  audio_url: "https://...",
  streams: 0,
  upvote_count: 0,
  song_url: "https://...",
  username: "user123"
}
```

#### LIST_SONGS
Retrieves a paginated list of generated songs.

## API Reference
For detailed API documentation, visit [docs.beatsfoundation.com](https://docs.beatsfoundation.com)

### Environment Variables
| Variable | Description | Required |
| -------- | ----------- | -------- |
| BEATS_FOUNDATION_API_KEY | Your Beats Foundation API key | Yes |

### Types
```typescript
interface GenerateSongRequest {
  prompt: string;
  lyrics?: string;
  genre?: string;
  mood?: string;
  isInstrumental?: boolean;
}

interface Song {
  id: string;
  title: string;
  audio_url: string;
  streams: number;
  upvote_count: number;
  song_url: string;
  username: string;
}
```

## Error Handling
The plugin includes comprehensive error handling for:
- Invalid API keys
- Rate limiting (2 generations per hour)
- Network timeouts
- Invalid generation parameters
- Server errors

## Rate Limits
The Beats Foundation API is currently free to use and has a rate limit of 2 song generations per hour per API key. Public endpoints like song listing and retrieval are not rate limited.

## Support
For support, please:
- Visit [docs.beatsfoundation.com](https://docs.beatsfoundation.com)
- Open an issue in the repository
- Join our Discord community

## Links
- [Beats Foundation API Documentation](https://docs.beatsfoundation.com)
- [GitHub Repository](https://github.com/elizaos/eliza/tree/main/packages/plugin-beatsfoundation)
