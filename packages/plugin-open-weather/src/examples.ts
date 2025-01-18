import type { ActionExample } from "@elizaos/core";

export const getCurrentWeatherExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "What's the weather like right now?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "In what city?",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Tokyo",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me check the current weather in Tokyo for you.",
                action: "GET_CURRENT_WEATHER",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "It's currently 22°C, feels like 29°C, and is sunny in Tokyo.",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What's the weather in Toronto?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll check the current weather in Toronto for you.",
                action: "GET_CURRENT_WEATHER",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "It's currently 22°C and cloudy in Toronto.",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Is it raining in Paris?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll check the current weather conditions in Paris.",
                action: "GET_CURRENT_WEATHER",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "In Paris, it's currently cloudy with light rain. The temperature is 15°C.",
            },
        },
    ],
];
