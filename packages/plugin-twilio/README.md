# @elizaos/plugin-twilio

A plugin for Twilio integration, providing automated phone call and text message processing capabilities.

## Overview

This plugin provides functionality to:

- Process phone calls and text messages
- Generate automated responses

## Installation

```bash
npm install @elizaos/plugin-twilio
```

## Configuration

The plugin requires the following environment variables:

```env
NGROK_DOMAIN=domain.ngrok.app # Your ngrok domain
NGROK_AUTHTOKEN=your_ngrok_auth_token # Your ngrok auth token
ELEVENLABS_XI_API_KEY=your_elevenlabs_api_key # ElevenLabs API key for text-to-speech
ELEVENLABS_MODEL_ID=your_elevenlabs_model_id # ElevenLabs model ID for text-to-speech
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id # ElevenLabs voice ID for text-to-speech
```

## Usage

1. Create an ElevenLabs account and get an API key
2. Create an ngrok account and get an auth token
3. Provision a static domain on ngrok and get the domain name

Twilio communicates with API clients using webhooks. In order for this to happen, a web server needs to be exposed to the internet. This plugin uses ngrok to acheive this.

Once you have a static domain on ngrok, set the `NGROK_DOMAIN` environment variable to your ngrok domain and configure Twilio to send voice call webhooks requests to `${NGROK_DOMAIN}/call` and text message webhooks requests to `${NGROK_DOMAIN}/message`.

Provide your ElevenLabs API key, model ID, and voice ID to the plugin by setting the `ELEVENLABS_XI_API_KEY`, `ELEVENLABS_MODEL_ID`, and `ELEVENLABS_VOICE_ID` environment variables.

You should now be ready to go!

Import and register the plugin in your Eliza configuration:

```typescript
import { twilioPlugin } from "@elizaos/plugin-twilio";

export default {
    plugins: [twilioPlugin],
    // ... other configuration
};
```
## Dependencies

- `@elizaos/core`: Core Eliza functionality
- `hono`: Hono server to create the webhook server
- `@hono/node-server`: Hono node server to create a node compatible server
- `@ngrok/ngrok`: Ngrok to expose the webhook server
- `twilio`: Twilio SDK for TwiML generation
- `tsup`: Build tool
- Other standard dependencies listed in package.json

## License

This plugin is part of the Eliza project. See the main project repository for license information.
