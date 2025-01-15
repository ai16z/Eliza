# Eliza OS - Twilio Plugin

A plugin for Eliza OS that enables SMS and voice call interactions using Twilio, with support for ElevenLabs and Amazon Polly voice synthesis.

## Setup

### 1. Environment Configuration

Create a `.env` file in your project root or copy from `.env.example`:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_CHARACTER=your-character.json

# Webhook Configuration
WEBHOOK_PORT=3004
WEBHOOK_BASE_URL=your_webhook_url  # See webhook URL configuration below

# ElevenLabs Configuration (Optional)
ELEVENLABS_XI_API_KEY=your_elevenlabs_api_key
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVENLABS_VOICE_STABILITY=0.5
ELEVENLABS_VOICE_SIMILARITY_BOOST=0.9
ELEVENLABS_VOICE_STYLE=0.66
ELEVENLABS_VOICE_USE_SPEAKER_BOOST=false
ELEVENLABS_OPTIMIZE_STREAMING_LATENCY=4
ELEVENLABS_OUTPUT_FORMAT=pcm_16000
```

### Webhook URL Configuration

The `WEBHOOK_BASE_URL` needs to be a publicly accessible URL that Twilio can reach. You have two options:

#### Local Development
For local development, use ngrok to create a secure tunnel:
1. Install ngrok: `npm install -g ngrok` or download from [ngrok.com](https://ngrok.com)
2. Start ngrok: `ngrok http 3004`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Set in your .env:
```env
WEBHOOK_BASE_URL=https://abc123.ngrok.io  # Replace with your ngrok URL
```

#### Production Server
If running on a server with a domain:
1. Use your domain name with HTTPS
2. Make sure port 3004 is accessible
3. Set in your .env:
```env
WEBHOOK_BASE_URL=https://your-domain.com  # Your production domain
```

> **Important**: Always use HTTPS URLs. Twilio requires secure webhooks for production.

### 2. Character Configuration

Create or update your character file (e.g., `characters/your-character.json`) with voice settings:

#### Using ElevenLabs (Premium Voice Quality)
```json
{
    "name": "Your Character",
    "settings": {
        "voice": {
            "useElevenLabs": true,
            "elevenLabsVoiceId": "your-voice-id",
            "elevenLabsSettings": {
                "stability": 0.5,
                "similarityBoost": 0.9,
                "style": 0.66,
                "useSpeakerBoost": false
            }
        }
    }
}
```

#### Using Amazon Polly (Default)
```json
{
    "name": "Your Character",
    "settings": {
        "voice": {
            "language": "en",  // Available: en, zh, fr, de, es, ja, ko
            "gender": "male"   // Available: male, female
        }
    }
}
```

#### Using Custom Polly Voice
```json
{
    "name": "Your Character",
    "settings": {
        "voice": {
            "custom": "Polly.Aria-Neural"  // Use any Polly voice ID
        }
    }
}
```

### Voice Configuration Options

#### ElevenLabs Settings
- `useElevenLabs`: Enable/disable ElevenLabs (defaults to false)
- `elevenLabsVoiceId`: Your ElevenLabs voice ID
- `elevenLabsSettings`:
  - `stability`: Voice stability (0.0 to 1.0)
  - `similarityBoost`: Voice similarity boost (0.0 to 1.0)
  - `style`: Speaking style (0.0 to 1.0)
  - `useSpeakerBoost`: Enable speaker boost

#### Amazon Polly Voice Combinations
Standard voices by language:
- English: male (Matthew) or female (Joanna)
- Chinese: male/female (Zhiyu)
- French: male (Mathieu) or female (Lea)
- German: male (Hans) or female (Marlene)
- Spanish: male (Miguel) or female (Lucia)
- Japanese: male (Takumi) or female (Mizuki)
- Korean: male/female (Seoyeon)

#### Custom Neural Voices
Available Neural Voices:
- US English: Aria, Ivy, Joanna, Kendra, Ruth
- British English: Amy, Emma, Brian
- Australian English: Olivia
- Indian English: Kajal, Raveena
- And many more...

See [Amazon Polly's voice list](https://docs.aws.amazon.com/polly/latest/dg/voicelist.html) for all available voices.

## Voice Selection Priority

The plugin selects the voice in this order:
1. ElevenLabs (if configured and enabled)
2. Custom Polly voice (if specified)
3. Standard language/gender combination
4. Default fallback (English/Matthew)

## Webhook Setup

1. Start your Eliza agent:
```bash
pnpm start --character="characters/your-character.json"
```

2. Set up your webhook URL:
   - **Local**: Start ngrok as described above
   - **Production**: Ensure your domain is configured correctly

3. Configure Twilio webhooks in [Twilio Console](https://console.twilio.com/):
   - Voice webhook: `${WEBHOOK_BASE_URL}/webhook/voice`
   - SMS webhook: `${WEBHOOK_BASE_URL}/webhook/sms`

> **Note**: If using ngrok, you'll need to update the webhook URLs in Twilio Console whenever you restart ngrok as it generates a new URL each time. For production, the URLs will remain stable.

## Testing

1. Voice call test:
```bash
curl -X POST http://localhost:3004/webhook/voice \
  -d "From=+1234567890" \
  -d "CallSid=test123"
```

2. SMS test:
```bash
curl -X POST http://localhost:3004/webhook/sms \
  -d "From=+1234567890" \
  -d "Body=Hello"
```

## Troubleshooting

### Common Issues

1. Voice not working:
   - Check ELEVENLABS_XI_API_KEY if using ElevenLabs
   - Verify character file voice settings
   - Check webhook logs for errors

2. Webhook errors:
   - Verify WEBHOOK_PORT is available
   - Check ngrok tunnel is running (for local development)
   - Ensure WEBHOOK_BASE_URL matches your ngrok URL or domain
   - Verify Twilio webhook URLs in console match WEBHOOK_BASE_URL
   - Check SSL certificate is valid (for production domains)

3. SMS not working:
   - Verify TWILIO_PHONE_NUMBER format
   - Check Twilio account balance
   - Verify webhook URLs in Twilio console
   - Test webhook endpoints using curl commands below

### Logs

View webhook logs:
```bash
tail -f eliza.log | grep "Twilio Plugin"
```

## Support

For issues or questions:
1. Check the [documentation](https://www.boolkeys.com/eliza/plugin-twilio/)
2. Open an issue on GitHub
3. Contact: [arwen@boolkeys.com](mailto:arwen@boolkeys.com)

## License

MIT

© 2025 Boolkeys. All rights reserved.
