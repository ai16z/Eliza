# Eliza OS - Twilio Plugin

A plugin for Eliza OS that enables SMS and voice call interactions using Twilio.

## Important: A2P 10DLC Compliance

If you're sending SMS messages to US numbers, you **must** register for A2P 10DLC (Application-to-Person 10-Digit Long Code). This is a requirement from US carriers for all application-based messaging.

### What is A2P 10DLC?
- A2P: Application-to-Person messaging (any messages sent from an application)
- 10DLC: 10-Digit Long Code (standard US phone numbers)

### Who needs to register?
Anyone using this plugin to send SMS messages to US numbers must register, including:
- Businesses of any size
- Individual developers
- Hobbyists

### Benefits of Registration
- Lower message filtering
- Higher throughput rates
- Avoid additional carrier fees for unregistered traffic

### Registration Process
1. Determine your type:
   - Direct Brand (business with Tax ID)
   - Sole Proprietor (individual/hobbyist)
   - ISV (software vendor)

2. Choose your Brand type based on volume:
   - Sole Proprietor: Up to 1,000 SMS/day to T-Mobile
   - Low Volume Standard: Up to 2,000 SMS/day to T-Mobile
   - Standard: 2,000+ SMS/day to T-Mobile

3. Register through Twilio Console:
   - Create a Brand (sender verification)
   - Create a Campaign (message purpose & opt-in/out details)

For detailed registration instructions, visit [Twilio's A2P 10DLC Documentation](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc).

## Features

- SMS messaging support
- Voice call support with text-to-speech
- Configurable voice settings (language, gender)
- Message sanitization and logging
- Environment-based configuration
- Message delivery tracking
- International number support

## Available Actions

### SEND_SMS
Sends an SMS message to a specified phone number.

```typescript
// Example usage:
"Send SMS to +1234567890: Hello from Eliza!"
"Text +1234567890: How are you doing?"
"SMS +1234567890 Let's meet tomorrow"
```

- **Triggers**: `SEND_SMS`, `SEND_MESSAGE`, `TEXT`, `SMS`
- **Format**: Include a phone number (with country code) and the message
- **Validation**: Requires valid phone number in E.164 format (+XXXXXXXXXXX)
- **Response**: Confirms message delivery with message SID

### CALL_VOICE
Initiates a voice call to a specified phone number and speaks the provided message.

```typescript
// Example usage:
"Call +1234567890 and say: Hello from Eliza!"
"Make a call to +1234567890 saying Welcome aboard"
"Dial +1234567890 tell them: The meeting starts in 5 minutes"
```

- **Triggers**: `CALL_VOICE`, `MAKE_CALL`, `PHONE_CALL`, `DIAL`
- **Format**: Include a phone number and the message to speak
- **Validation**: Requires valid phone number in E.164 format (+XXXXXXXXXXX)
- **Voice Settings**: Uses the voice configuration from character file

### Voice Configuration
Configure voice settings in your character file:
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

Available voice combinations:
- English: male (Matthew) or female (Joanna)
- Chinese: male/female (Zhiyu)
- French: male (Mathieu) or female (Lea)
- German: male (Hans) or female (Marlene)
- Spanish: male (Miguel) or female (Lucia)
- Japanese: male (Takumi) or female (Mizuki)
- Korean: male/female (Seoyeon)

## Prerequisites

- Twilio account with:
  - Account SID
  - Auth Token
  - Phone number
- Anthropic API key
- Node.js 18 or higher

## Installation

```bash
pnpm add @elizaos/plugin-twilio
```

## Plugin Configuration

1. Add the plugin to your character file (e.g., characters/your-character.json):

```json
{
    "name": "Your Character",
    "settings": {
        // ... other settings ...
    },
    "plugins": [
        "@elizaos/plugin-twilio"  // Add this line to enable the plugin
    ]
}
```

For local development, you can use a relative path:
```json
{
    "plugins": [
        "../packages/plugin-twilio"
    ]
}
```

2. Add these variables to your project's root `.env` file:

```env
# Add these to your existing .env file in the project root

# Anthropic Configuration (if not already set)
ANTHROPIC_API_KEY=your_anthropic_key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_CHARACTER=your-character.json  # Must match your character file name

# Webhook Configuration
WEBHOOK_PORT=3004
WEBHOOK_BASE_URL=your_webhook_url  # Will be set after starting ngrok
```

Note: Do not create a new .env file in the plugin directory. Instead, add these variables to your existing .env file at the project root.

## Webhook Setup

### Twilio Console Configuration
1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to Phone Numbers > Manage > Active Numbers
3. Click on your phone number
4. Under "Voice & Fax" configuration:
   - Choose "Webhook" for "Configure With"
   - For "A Call Comes In", select "Webhook"
   - Set the URL to: `${WEBHOOK_BASE_URL}/webhook/voice`
5. Under "Messaging" configuration:
   - Choose "Webhook" for "Configure With"
   - For "A Message Comes In", select "Webhook"
   - Set the URL to: `${WEBHOOK_BASE_URL}/webhook/sms`

### Local Development
1. Start your Eliza agent with your configured character:
```bash
pnpm start --character="characters/your-character.json"
```

2. In a separate terminal, create a tunnel using ngrok:
```bash
ngrok http 3004
```

3. Copy the ngrok URL and update your .env:
```env
WEBHOOK_BASE_URL=https://your-ngrok-url
```

4. Update your webhook URLs in Twilio Console with the new ngrok URL
5. Test your webhooks:
   - SMS: Send a message to your Twilio number
   - Voice: Make a call to your Twilio number

### Server Installation
1. Set your server's domain in .env:
```env
WEBHOOK_BASE_URL=https://your-domain.com
```

2. Ensure your server accepts incoming traffic on the webhook port (default: 3004)

3. Configure your reverse proxy (nginx/apache) to forward requests to the webhook port:

Example nginx configuration:
```nginx
location /webhook/ {
    proxy_pass http://localhost:3004;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

4. Update your webhook URLs in Twilio Console with your domain

## Development

```bash
# Install dependencies
pnpm install

# Build the plugin
pnpm build

# Run in development mode
pnpm dev
```

## Troubleshooting

1. Check webhook server status:
```bash
curl http://localhost:3004/health
```

2. View webhook logs:
```bash
tail -f eliza.log | grep "Twilio Plugin"
```

3. Common issues:
- Port already in use: Change WEBHOOK_PORT in .env
- Webhook not receiving messages: Check ngrok/domain configuration
- Wrong character responses: Delete SQLite database and restart
- Plugin not loading: Ensure it's properly listed in character file plugins array
- Character not responding: Check TWILIO_CHARACTER in .env matches your character file name

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| ANTHROPIC_API_KEY | Your Anthropic API key | Yes |
| TWILIO_ACCOUNT_SID | Your Twilio Account SID | Yes |
| TWILIO_AUTH_TOKEN | Your Twilio Auth Token | Yes |
| TWILIO_PHONE_NUMBER | Your Twilio phone number | Yes |
| TWILIO_CHARACTER | Character file to use | Yes |
| WEBHOOK_PORT | Port for webhook server (default: 3004) | No |
| WEBHOOK_BASE_URL | Public URL for webhooks | Yes |

## Support

For issues, questions, or support:
1. Visit our [documentation](https://www.boolkeys.com/eliza/plugin-twilio/)
2. Open an issue on GitHub
3. Contact: [arwen@boolkeys.com](mailto:arwen@boolkeys.com)

## License

MIT

© 2025 Boolkeys. All rights reserved.
