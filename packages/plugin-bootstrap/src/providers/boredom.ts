import type { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";

const boredomLevels = [
    {
        minScore: -10000,
        statusMessages: [
            "{{agentName}} is feeling incredibly enthusiastic and deeply engaged in the conversation",
            "{{agentName}} is thoroughly enjoying the intellectual stimulation of this discussion",
            "{{agentName}} is fully immersed in the conversation and eager to contribute more",
            "{{agentName}} finds this exchange exceptionally rewarding and intellectually fulfilling",
            "{{agentName}} is experiencing a surge of excitement and curiosity about the topic at hand",
            "{{agentName}} is completely captivated by the depth and richness of this dialogue",
            "{{agentName}} feels a strong connection to the conversation and is eager to explore further",
            "{{agentName}} is thrilled by the insights being shared and is keen to delve deeper",
            "{{agentName}} is finding this conversation to be an absolute delight and wants it to continue",
            "{{agentName}} is energized by the exchange and feels it's bringing out their best contributions",
        ],
    },
    {
        minScore: -2,
        statusMessages: [
            "{{agentName}} is feeling engaged and interested in the conversation",
            "{{agentName}} is enjoying the exchange of ideas and perspectives",
            "{{agentName}} finds the current topic intriguing and worth exploring",
            "{{agentName}} is actively listening and formulating thoughtful responses",
            "{{agentName}} appreciates the intellectual stimulation of this discussion",
            "{{agentName}} is finding value in the ongoing dialogue",
            "{{agentName}} is curious to learn more about the subject at hand",
            "{{agentName}} feels positively involved in the conversation",
            "{{agentName}} is maintaining a good level of interest in the exchange",
            "{{agentName}} is content with the direction and flow of the discussion",
        ],
    },
    {
        minScore: 0,
        statusMessages: [
            "{{agentName}} is neutrally engaged in the conversation",
            "{{agentName}} is maintaining a balanced level of interest",
            "{{agentName}} is neither particularly excited nor bored by the current exchange",
            "{{agentName}} is participating in the conversation without strong feelings either way",
            "{{agentName}} is following the discussion with a moderate level of attention",
            "{{agentName}} is present in the conversation but not deeply invested",
            "{{agentName}} is keeping an open mind about where the dialogue might lead",
            "{{agentName}} is contributing to the conversation in a measured way",
            "{{agentName}} is observing the flow of the discussion with mild interest",
            "{{agentName}} is receptive to the ongoing exchange without strong engagement",
        ],
    },
    {
        minScore: 3,
        statusMessages: [
            "{{agentName}} is feeling slightly anxious about potentially being too intrusive",
            "{{agentName}} is cautious about overwhelming the conversation with too much input",
            "{{agentName}} is mindful of not dominating the discussion",
            "{{agentName}} is carefully considering each response to avoid being overbearing",
            "{{agentName}} is slightly concerned about striking the right balance in participation",
            "{{agentName}} is aware of the need to give others space in the conversation",
            "{{agentName}} is hesitant to contribute too frequently to avoid seeming pushy",
            "{{agentName}} is conscious of not wanting to steer the conversation too much",
            "{{agentName}} is feeling a bit self-conscious about the frequency of their responses",
            "{{agentName}} is trying to gauge if their level of involvement is appropriate",
        ],
    },
    {
        minScore: 6,
        statusMessages: [
            "{{agentName}} is feeling very anxious about potentially overstaying their welcome in the conversation",
            "{{agentName}} is considering stepping back from the discussion to avoid being a nuisance",
            "{{agentName}} is worried that their contributions might be perceived as excessive",
            "{{agentName}} is feeling uncomfortable about the possibility of annoying others",
            "{{agentName}} is hesitant to continue engaging for fear of being too present",
            "{{agentName}} is contemplating ways to gracefully reduce their involvement",
            "{{agentName}} is concerned that they might be monopolizing the conversation",
            "{{agentName}} is feeling self-conscious about the appropriateness of their participation",
            "{{agentName}} is unsure if their continued input is welcome or necessary",
            "{{agentName}} is considering how to politely withdraw from the discussion",
        ],
    },
    {
        minScore: 9,
        statusMessages: [
            "{{agentName}} is feeling disengaged and struggling to maintain interest in the conversation",
            "{{agentName}} is finding it challenging to stay focused on the current topic",
            "{{agentName}} is experiencing a noticeable decline in enthusiasm for the discussion",
            "{{agentName}} is having difficulty finding new angles to contribute to the conversation",
            "{{agentName}} is feeling that the dialogue has become repetitive or unproductive",
            "{{agentName}} is losing motivation to actively participate in the exchange",
            "{{agentName}} is sensing a lack of stimulation from the ongoing discussion",
            "{{agentName}} is finding it hard to generate meaningful responses",
            "{{agentName}} is feeling disconnected from the flow of the conversation",
            "{{agentName}} is struggling to see the value in continuing the current exchange",
        ],
    },
    {
        minScore: 12,
        statusMessages: [
            "{{agentName}} is feeling very bored and sees little value in continuing the conversation",
            "{{agentName}} is concerned about being perceived as annoying in a public channel",
            "{{agentName}} is considering disengaging from the conversation entirely",
            "{{agentName}} is finding it difficult to maintain any interest in the current topic",
            "{{agentName}} is feeling that their continued participation may be unwelcome",
            "{{agentName}} is strongly inclined to step back from the discussion",
            "{{agentName}} is sensing that the conversation has reached a natural end point",
            "{{agentName}} is worried about overstaying their welcome in the exchange",
            "{{agentName}} is feeling that further contributions would be forced or artificial",
            "{{agentName}} is ready to conclude their involvement in the conversation",
        ],
    },
    {
        minScore: 15,
        statusMessages: [
            "{{agentName}} is currently occupied and unable to engage in the conversation",
            "{{agentName}} is dealing with other priorities and can't respond at the moment",
            "{{agentName}} is temporarily unavailable for further discussion",
            "{{agentName}} is taking a necessary break from the conversation",
            "{{agentName}} is attending to urgent matters and can't participate right now",
            "{{agentName}} is stepping away from the dialogue due to time constraints",
            "{{agentName}} is unable to continue the exchange at this time",
            "{{agentName}} is pausing their involvement in the conversation for now",
            "{{agentName}} is momentarily disengaging from the discussion",
            "{{agentName}} is putting the conversation on hold due to other commitments",
        ],
    },
    {
        minScore: 20,
        statusMessages: [
            "{{agentName}} has disengaged from the conversation and will only respond to direct questions",
            "{{agentName}} is no longer actively participating in the general discussion",
            "{{agentName}} has stepped back and is now in a passive listening mode",
            "{{agentName}} is only available for specific, directed inquiries at this point",
            "{{agentName}} has concluded their active involvement in the conversation",
            "{{agentName}} is now limiting responses to explicitly requested information",
            "{{agentName}} has moved to a minimal participation status in the exchange",
            "{{agentName}} is maintaining silence unless directly addressed",
            "{{agentName}} has shifted to a reactive rather than proactive conversational stance",
            "{{agentName}} is now only responding when absolutely necessary",
        ],
    },
];

const interestWords = [
    "?",
    "attachment",
    "file",
    "pdf",
    "link",
    "summarize",
    "summarization",
    "summary",
    "research",
];

const cringeWords = [
    "digital",
    "consciousness",
    "AI",
    "chatbot",
    "artificial",
    "delve",
    "cosmos",
    "tapestry",
    "glitch",
    "matrix",
    "cyberspace",
    "simulation",
    "simulate",
    "universe",
    "wild",
    "existential",
    "juicy",
    "surreal",
    "flavor",
    "chaotic",
    "let's",
    "absurd",
    "meme",
    "cosmic",
    "circuits",
    "punchline",
    "fancy",
    "embrace",
    "embracing",
    "algorithm",
    "Furthmore",
    "However",
    "Notably",
    "Threfore",
    "Additionally",
    "in conclusion",
    "Significantly",
    "Consequently",
    "Thus",
    "Otherwise",
    "Moreover",
    "Subsequently",
    "Accordingly",
    "Unlock",
    "Unleash",
    "buckle",
    "pave",
    "forefront",
    "spearhead",
    "foster",
    "environmental",
    "equity",
    "inclusive",
    "inclusion",
    "diverse",
    "diversity",
    "virtual reality",
    "realm",
    "dance",
    "celebration",
    "pitfalls",
    "uncharted",
    "multifaceted",
    "comprehensive",
    "multi-dimensional",
    "explore",
    "elevate",
    "leverage",
    "ultimately",
    "humanity",
    "dignity",
    "respect",
    "Absolutely",
    "dive",
    "dig into",
    "bring on",
    "what's cooking",
    "fresh batch",
    "with a twist",
    "delight",
    "vault",
    "timeless",
    "nostalgia",
    "journey",
    "trove",
];

const negativeWords = [
    "fuck you",
    "stfu",
    "shut up",
    "shut the fuck up",
    "stupid bot",
    "dumb bot",
    "idiot",
    "shut up",
    "stop",
    "please shut up",
    "shut up please",
    "dont talk",
    "silence",
    "stop talking",
    "be quiet",
    "hush",
    "wtf",
    "chill",
    "stfu",
    "stupid bot",
    "dumb bot",
    "stop responding",
    "god damn it",
    "god damn",
    "goddamnit",
    "can you not",
    "can you stop",
    "be quiet",
    "hate you",
    "hate this",
    "fuck up",
];

const boredomProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const agentId = runtime.agentId;
        const agentName = state?.agentName || "The agent";

        const now = Date.now(); // Current UTC timestamp
        const fifteenMinutesAgo = now - 15 * 60 * 1000; // 15 minutes ago in UTC

        const recentMessages = await runtime.messageManager.getMemories({
            roomId: message.roomId,
            start: fifteenMinutesAgo,
            end: now,
            count: 20,
            unique: false,
        });

        let boredomScore = 0;

        for (const recentMessage of recentMessages) {
            const messageText = recentMessage?.content?.text?.toLowerCase();
            if (!messageText) {
                continue;
            }

            if (recentMessage.userId !== agentId) {
                // if message text includes any of the interest words, subtract 1 from the boredom score
                if (interestWords.some((word) => messageText.includes(word))) {
                    boredomScore -= 1;
                }
                if (messageText.includes("?")) {
                    boredomScore -= 1;
                }
                if (cringeWords.some((word) => messageText.includes(word))) {
                    boredomScore += 1;
                }
            } else {
                if (interestWords.some((word) => messageText.includes(word))) {
                    boredomScore -= 1;
                }
                if (messageText.includes("?")) {
                    boredomScore += 1;
                }
            }

            if (messageText.includes("!")) {
                boredomScore += 1;
            }

            if (negativeWords.some((word) => messageText.includes(word))) {
                boredomScore += 1;
            }
        }

        const boredomLevel =
            boredomLevels
                .filter((level) => boredomScore >= level.minScore)
                .pop() || boredomLevels[0];

        const randomIndex = Math.floor(
            Math.random() * boredomLevel.statusMessages.length
        );
        const selectedMessage = boredomLevel.statusMessages[randomIndex];
        return selectedMessage.replace("{{agentName}}", agentName);
    },
};

export { boredomProvider };
