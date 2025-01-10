import { Action, composeContext, elizaLogger, generateObjectArray, HandlerCallback, IAgentRuntime, Memory, ModelClass, State } from "@elizaos/core";

interface ManagePositionsParams {
    repositionThresholdBps: number;
}

function isManagePositionsParams(
    content: any
) : content is ManagePositionsParams {
    return (
        typeof content.repositionThresholdBps === "number"
    );
}

export const managePositions: Action = {
    name: 'manage_positions',
    similes: ["AUTOMATE_REBALANCING", "AUTOMATE_POSITIONS", "START_MANAGING_POSITIONS"],
    description: "Automatically manage positions by rebalancing them when they drift too far from the pool price",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
      return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Start managing positions");

        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const repositionLiquidityPositionsContext = composeContext({
            state,
            template: `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined. If you notice bps, you can assume that's repositionThresholdBps.
            You may also notice that the input uses a percentage value. You should convert this to bps (basis points) by multiplying by 100.

            Example response:
            \`\`\`json
            {
                "repositionThresholdBps": 100,
            }
            \`\`\`
            `,
        });

        const content = await generateObjectArray({
            runtime,
            context: repositionLiquidityPositionsContext,
            modelClass: ModelClass.LARGE,
        });

        if(!isManagePositionsParams(content)) {
            if (callback) {
                callback({
                    text: "Unable to reposition liquidity positions. Invalid content provided.",
                    content: { error: "Invalid close position content" },
                });
            }
            return false;
        }

        const memoryContent = {
            repositionThresholdBps: content.repositionThresholdBps,
            success: true,
            timestamp: Date.now()
        };

        if (callback) {
            callback({
                text: `Position management initialized with ${content.repositionThresholdBps} bps threshold.`,
                content: memoryContent,
                action: "MANAGE_POSITIONS"
            });
        }

        return true;;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Please automate repositioning my positions when the center price of the position drifts more than 2% away from the current pool price."
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll set up automated rebalancing for your positions...",
                    action: "MANAGE_POSITIONS",
                    parameters: {
                        repositionThresholdBps: "200"
                    }
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Automated rebalancing has been configured. I'll monitor the positions and rebalance whenever the drift exceeds 2% from the pool price."
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Set up position management with 1.5% threshold please"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Setting up automated position management...",
                    action: "MANAGE_POSITIONS",
                    parameters: {
                        repositionThresholdBps: "150"
                    }
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Position management initialized with 150 bps threshold. I'll monitor and rebalance your positions automatically."
                }
            }
        ]
    ]
  };