import { SlackClientProvider } from "../providers/slack-client.provider";
import type { SlackConfig } from "../types/slack-types";
import { config } from "dotenv";
import { resolve } from "path";
import { elizaLogger } from "@elizaos/core";

// Load environment variables from root .env
const envPath = resolve(__dirname, "../../../../.env");
elizaLogger.log("Loading environment from:", envPath);
config({ path: envPath });

function validateEnvironment() {
    const requiredEnvVars = [
        "SLACK_APP_ID",
        "SLACK_CLIENT_ID",
        "SLACK_CLIENT_SECRET",
        "SLACK_SIGNING_SECRET",
        "SLACK_VERIFICATION_TOKEN",
        "SLACK_BOT_TOKEN",
        "SLACK_CHANNEL_ID",
    ];

    const missing = requiredEnvVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        console.error("Missing required environment variables:", missing);
        return false;
    }

    elizaLogger.log("Environment variables loaded successfully");
    return true;
}

async function main() {
    elizaLogger.log("\n=== Starting Summarize Conversation Example ===\n");

    if (!validateEnvironment()) {
        throw new Error("Environment validation failed");
    }

    // Initialize the client with Slack credentials
    const slackConfig: SlackConfig = {
        appId: process.env.SLACK_APP_ID || "",
        clientId: process.env.SLACK_CLIENT_ID || "",
        clientSecret: process.env.SLACK_CLIENT_SECRET || "",
        signingSecret: process.env.SLACK_SIGNING_SECRET || "",
        verificationToken: process.env.SLACK_VERIFICATION_TOKEN || "",
        botToken: process.env.SLACK_BOT_TOKEN || "",
        botId: process.env.SLACK_BOT_ID || "",
    };

    const slackProvider = new SlackClientProvider(slackConfig);

    // Validate the connection
    const isConnected = await slackProvider.validateConnection();
    if (!isConnected) {
        throw new Error("Failed to connect to Slack");
    }
    elizaLogger.log("✓ Successfully connected to Slack");

    const channel = process.env.SLACK_CHANNEL_ID!;
    elizaLogger.log(`\nSending messages to channel: ${channel}`);

    // First, send some test messages
    await slackProvider.sendMessage(
        channel,
        "Hello! Let's test the conversation summarization."
    );

    // Send message with attachment using WebClient directly
    await slackProvider.getContext().client.chat.postMessage({
        channel,
        text: "Here's an important document to discuss.",
        attachments: [
            {
                title: "Test Document",
                text: "This is a test document with some important information.",
            },
        ],
    });

    await slackProvider.sendMessage(
        channel,
        "What do you think about the document?"
    );

    // Wait a bit for messages to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Request a summary
    await slackProvider.sendMessage(
        channel,
        "Can you summarize our conversation so far?"
    );

    // Keep the process running
    await new Promise((resolve) => setTimeout(resolve, 10000));
    elizaLogger.log("\n✓ Example completed successfully");
    process.exit(0);
}

main().catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
});
