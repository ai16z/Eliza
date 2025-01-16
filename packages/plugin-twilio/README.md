# @elizaos/plugin-twilio

A Twilio plugin for ElizaOS that enables SMS and voice call capabilities.

## Features

- 📱 SMS Messaging
  - Send SMS messages
  - Receive and respond to SMS messages
  - Natural conversation handling

- 📞 Voice Calls
  - Make outgoing calls
  - Receive incoming calls
  - Natural voice conversations using ElevenLabs
  - Speech recognition and response

## Installation

```bash
npm install @elizaos/plugin-twilio
```

## Configuration

1. Set up environment variables in your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_CHARACTER=character.json

# Webhook Configuration
WEBHOOK_PORT=3004
WEBHOOK_BASE_URL=your_webhook_url

# ElevenLabs (for voice synthesis)
ELEVENLABS_XI_API_KEY=your_elevenlabs_api_key
```

2. Configure your character file to enable Twilio actions:

```json
{
    "settings": {
        "actions": {
            "enabled": ["sms", "call"]
        },
        "voice": {
            "elevenlabs": {
                "voiceId": "your_voice_id",
                "stability": 0.3,
                "similarityBoost": 0.5,
                "style": 0.5,
                "useSpeakerBoost": false
            }
        }
    }
}
```

## Usage

### SMS Commands

```
Send an SMS to +1234567890 saying Hello world!
Send SMS to +1234567890 about the weather forecast
```

### Voice Call Commands

```
Call +1234567890 and tell them about the latest updates
Call +1234567890 to say that we need to schedule a meeting
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the plugin
npm run build
```

## Webhook Setup

For local development, use ngrok or similar to expose your webhook:

```bash
ngrok http 3004
```

Then update your `WEBHOOK_BASE_URL` in `.env` with the ngrok URL.

## Notes

- Voice calls require ElevenLabs API key for text-to-speech
- Messages are limited to 160 characters for SMS
- Voice responses are optimized for natural conversation flow
- All phone numbers must be in international format (+1234567890)

## License

MIT

