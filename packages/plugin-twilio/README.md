# @elizaos/plugin-twilio

A plugin for ElizaOS that enables SMS and voice call capabilities using Twilio.

## Quick Start

1. Install the plugin:
```bash
pnpm add @elizaos/plugin-twilio
```

2. Set up required environment variables in your `.env` file:
```env
# Required for core functionality
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_CHARACTER=character.json    # Name of the character file to use (must be in characters/ folder)

# Required only for voice features
WEBHOOK_BASE_URL=your_webhook_url # Required for voice conversations

# Optional - for enhanced voice quality
ELEVENLABS_API_KEY=your_elevenlabs_key # Optional, for voice synthesis
```

## Voice Configuration

The plugin supports two text-to-speech providers:

### ElevenLabs (Recommended)
For higher quality voice synthesis, configure ElevenLabs in your character file:
```json
{
  "plugins": ["@elizaos/plugin-twilio"],
  "settings": {
    "voice": {
      "elevenlabs": {
        "voiceId": "your_voice_id",
        "stability": "0.5",
        "similarityBoost": "0.8",
        "style": "0.66",
        "useSpeakerBoost": "false"
      }
    }
  }
}
```

Optional environment variables for fine-tuning:
```env
ELEVENLABS_MODEL_ID=eleven_monolingual_v1
ELEVENLABS_OPTIMIZE_STREAMING_LATENCY=4
ELEVENLABS_OUTPUT_FORMAT=mp3_44100_128
```

Get voice IDs from: https://elevenlabs.io/voice-library

### Amazon Polly (Default)
If ElevenLabs is not configured, the plugin uses Amazon Polly. Configure it in your character file:
```json
{
  "plugins": ["@elizaos/plugin-twilio"],
  "settings": {
    "voice": {
      "polly": {
        "voiceId": "Matthew",     // Name of the Polly voice
        "engine": "neural"        // Optional: "neural" or "standard"
      }
    }
  }
}
```
Full voice list: https://docs.aws.amazon.com/polly/latest/dg/voicelist.html

3. Add the plugin to your character's configuration:
```json
{
  "plugins": ["@elizaos/plugin-twilio"],
  "settings": {
    "voice": {
      "elevenlabs": {
        "voiceId": "your_voice_id",
        "stability": "0.5",
        "similarityBoost": "0.8"
      }
    }
  }
}
```

## Features

- Send SMS messages
- Make voice calls
- Handle interactive voice conversations
- Text-to-speech conversion using ElevenLabs

## Actions

### sendSms
Sends an SMS message and handles SMS conversations with the character.
```typescript
await agent.execute("Send an SMS to +1234567890 telling a fun fact about polar bears");
```

### callVoice
Makes a voice call with text-to-speech conversion and handles interactive conversations.
```typescript
await agent.execute("Call +1234567890 and tell them an interesting fact about renewable energy");
```

## Requirements

- A Twilio account with:
  - Account SID
  - Auth Token
  - A phone number with voice and SMS capabilities
- For voice features:
  - A publicly accessible webhook URL (e.g., using ngrok)
  - An ElevenLabs account (optional, for better voice quality)

## Important Notes

- Ensure your Twilio phone number is SMS-enabled and compliant with A2P 10DLC registration
  - Learn more: https://www.twilio.com/docs/messaging/a2p-10dlc
- For voice features, you'll need an ElevenLabs voice ID
  - Get voice IDs: https://elevenlabs.io/voice-library

## Troubleshooting

### SMS Not Working
1. Verify your Twilio credentials:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxx...
   TWILIO_AUTH_TOKEN=xxxxx...
   TWILIO_PHONE_NUMBER=+1234567890
   ```

2. Check webhook configuration:
   - Ensure `WEBHOOK_BASE_URL` is publicly accessible
   - Verify ngrok is running: `ngrok http 3004`
   - Configure webhooks in Twilio Console:
     1. Go to [Twilio Console](https://console.twilio.com/) > Phone Numbers > Manage > Active Numbers
     2. Click on your phone number
     3. Under "Messaging Configuration":
       - When a message comes in: `Webhook`
       - URL: `https://your-ngrok-url/webhook/sms`
     4. Under "Voice Configuration":
       - When a call comes in: `Webhook`
       - URL: `https://your-ngrok-url/webhook/voice`

> **Important**: After updating your ngrok URL in `.env`:
> 1. Stop your ElizaOS server
> 2. Update both webhook URLs in Twilio Console
> 3. Restart your ElizaOS server
>
> The new ngrok URL won't take effect until the server is restarted.

Example webhook URLs:
```
Voice Webhook: https://your-ngrok-url/webhook/voice
SMS Webhook:   https://your-ngrok-url/webhook/sms
```

3. Common Issues:
   - SMS webhook not receiving messages: Check Twilio console logs
   - A2P 10DLC registration incomplete
   - Invalid phone number format (must be E.164: +1234567890)
   - Webhook not working after URL update: Restart the server

> **Note**: Replace `your-ngrok-url` with your actual ngrok URL (e.g., `https://1234-56-78-910.ngrok-free.app`)

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build
```

## License

MIT

## Contact & Support

For questions, issues, or support:

- Discord: `.boolkeys`
- GitHub Issues: [Report a bug](https://github.com/elizalabs/eliza/issues)

Feel free to reach out for help with setup, configuration, or any other questions about the plugin.

