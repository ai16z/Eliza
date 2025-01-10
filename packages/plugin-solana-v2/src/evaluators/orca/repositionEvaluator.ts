import {
    composeContext,
    elizaLogger,
    generateObjectArray,
    Evaluator,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
    ModelClass,
    ActionExample,
} from "@elizaos/core";
import { FetchedPositionStatistics } from "../../providers/orca/positionProvider";

interface RebalanceAction {
    name: string;
    params: {
        positionMint: string;
        positionWidthBps: number;
    };
}

interface RepositionEvaluatorParams {
    positions: FetchedPositionStatistics[];
}

function isRepositionEvaluatorParams(
    content: any
): content is RepositionEvaluatorParams {
    return (
        content &&
        Array.isArray(content.positions) &&
        content.positions.every(
            (position) =>
                position &&
                typeof position.whirlpoolAddress === "string" &&
                typeof position.positionMint === "string" &&
                typeof position.inRange === "boolean" &&
                typeof position.distanceCenterPositionFromPoolPriceBps === "number" &&
                typeof position.positionWidthBps === "number"
        )
    );
}

export const repositionEvaluator: Evaluator = {
    name: "EVALUATE_POSITIONS",
    similes: ["CHECK_POSITIONS", "REPOSITION_EVALUATOR"],
    alwaysRun: true,
    description: "Evaluates positions and triggers rebalancing if necessary.",

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        // Validate if there is data to evaluate
        return true;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Evaluating positions for rebalancing...");

        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const evaluatePositionsContext = composeContext({
            state,
            template: `Respond with a JSON markdown block containing only the extracted values for each position. Use null for any values that cannot be determined.

            Example response:
            \`\`\`json
            [
                {
                    "whirlpoolAddress": "BieefG47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8pump",
                    "positionMint": "FieefH47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8swim",
                    "inRange": true,
                    "distanceCenterPositionFromPoolPriceBps": 250,
                    "positionWidthBps": 500
                },
                {
                    "whirlpoolAddress": "CeefG47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8current",
                    "positionMint": "WieefH47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8wave",
                    "inRange": false,
                    "distanceCenterPositionFromPoolPriceBps": 10000,
                    "positionWidthBps": 300
                }
            ]
            \`\`\`

            {{recentMessages}}

            {{recentMessagesData}}

            Some positions may have been closed already. Do some checks on the timestamps to ensure you have the most recent data.
            `,
        });

        const content = await generateObjectArray({
            runtime,
            context: evaluatePositionsContext,
            modelClass: ModelClass.LARGE,
        });

        if(!isRepositionEvaluatorParams(content)) {
            if (callback) {
                callback({
                    text: "Unable to repositino liquidity positions. Invalid content provided.",
                    content: { error: "Invalid close position content" },
                });
            }
            return false;
        }

        const positions = content.positions;
        const repositionThresholdBps = (state.repositionThresholdBps || 100) as number;

        const rebalanceActions: RebalanceAction[] = [];
        for (const position of positions) {
            const { positionMint, inRange, distanceCenterPositionFromPoolPriceBps, positionWidthBps } = position;

            if (!inRange || distanceCenterPositionFromPoolPriceBps > repositionThresholdBps) {
                elizaLogger.log(
                    `Position ${positionMint} out of range.`                );
                const rebalanceAction: RebalanceAction = {
                    name: "rebalance_position",
                    params: {
                        positionMint: positionMint,
                        positionWidthBps: positionWidthBps,
                    },
                };
                rebalanceActions.push(rebalanceAction);
            }
        }

        if (positions.every((pos) => pos.inRange || pos.distanceCenterPositionFromPoolPriceBps <= repositionThresholdBps)) {
            elizaLogger.log("No positions require rebalancing at this time.");
        }

        if (callback) {
            callback({
                text: `The following positions require rebalancing: ${rebalanceActions.map((action) => action.params.positionMint).join(", ")}`,
                content: rebalanceActions,
            });
        }

        return true;
    },

    examples: [
        {
            context: `Actors in the scene:
    {{user1}}: Experienced liquidity provider. Optimizes positions frequently.
    {{user2}}: New liquidity provider. Learning to manage pool positions.

    Recommendations about the actors:
    None`,
            messages: [
                {
                    user: "{{user1}}",
                    content: {
                        text: "My positions are drifting a bit. Can you check if any need rebalancing?",
                    },
                },
                {
                    user: "{{user2}}",
                    content: {
                        text: "Sure, I’ll evaluate your positions and let you know if rebalancing is required.",
                    },
                },
                {
                    user: "{{user2}}",
                    content: {
                        text: "Evaluating positions...",
                    },
                },
            ] as ActionExample[],
            outcome: `\`\`\`json
    [
      {
        "whirlpoolAddress": "FCweoTfJ128jGgNEXgdfTXdEZVk58Bz9trCemr6sXNx9",
        "positionMint": "BieefG47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8swim",
        "inRange": false,
        "distanceCenterPositionFromPoolPriceBps": 1200,
        "positionWidthBps": 500
      },
      {
        "whirlpoolAddress": "7tRzKud6FBVFEhYqZS3CuQ2orLRM21bdisGykL5Sr4Dx",
        "positionMint": "WieefH47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8wave",
        "inRange": true,
        "distanceCenterPositionFromPoolPriceBps": 800,
        "positionWidthBps": 300
      }
    ]
    \`\`\``,
        },
        {
            context: `Actors in the scene:
    {{user1}}: Optimistic liquidity provider. Expects most positions to be stable.
    {{user2}}: Methodical analyst. Evaluates position data carefully.

    Recommendations about the actors:
    None`,
            messages: [
                {
                    user: "{{user1}}",
                    content: {
                        text: "Can you check if my liquidity positions are still in range? I don’t think they need rebalancing yet.",
                    },
                },
                {
                    user: "{{user2}}",
                    content: {
                        text: "Let me evaluate them for you.",
                    },
                },
                {
                    user: "{{user2}}",
                    content: {
                        text: "Analyzing positions...",
                    },
                },
            ] as ActionExample[],
            outcome: `\`\`\`json
    [
      {
        "whirlpoolAddress": "CeefG47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8current",
        "positionMint": "FieefH47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8swim",
        "inRange": true,
        "distanceCenterPositionFromPoolPriceBps": 300,
        "positionWidthBps": 500
      }
    ]
    \`\`\``,
        },
        {
            context: `Actors in the scene:
    {{user1}}: Conservative liquidity manager. Prefers avoiding unnecessary rebalancing.
    {{user2}}: Analytical assistant. Identifies positions for rebalancing.

    Recommendations about the actors:
    None`,
            messages: [
                {
                    user: "{{user1}}",
                    content: {
                        text: "Check if any positions need to be rebalanced. I don’t want to waste gas unnecessarily.",
                    },
                },
                {
                    user: "{{user2}}",
                    content: {
                        text: "Got it, I’ll evaluate your positions.",
                    },
                },
                {
                    user: "{{user2}}",
                    content: {
                        text: "Evaluating positions...",
                    },
                },
            ] as ActionExample[],
            outcome: `\`\`\`json
    [
      {
        "whirlpoolAddress": "BieefG47jAHCGZBxi2q87RDuHyGZyYC3vAzxpyu8pump",
        "positionMint": "FCweoTfJ128jGgNEXgdfTXdEZVk58Bz9trCemr6sXNx9",
        "inRange": false,
        "distanceCenterPositionFromPoolPriceBps": 1500,
        "positionWidthBps": 400
      }
    ]
    \`\`\``,
        },
    ],
};