import { Evaluator, IAgentRuntime, Memory, State } from "@ai16z/eliza";
import { dadJokeEvalContent, dadJokeEvalResponse } from "./types.ts";

//the evaluator for dad jokes
//validates the response to ensure it is a dad joke
export const dadJokeEvaluator: Evaluator = {
    name: "DAD_JOKE_EVALUATOR",
    description: "Validates dad joke responses",
    similes: [
        "DAD_JOKE_CHECKER",
        "JOKE_VALIDATOR",
        "DAD_JOKE_RESPONSE_VALIDATOR",
    ],
    examples: [
        {
          context: "Validating complete dad joke response",
          messages: [
            {
              user: "{{user1}}",
              content: {
                text: "When does a joke become a dad joke? When the punchline becomes apparent.",
              },
            },
          ],
          outcome: "When it becomes a groan-up.",
        },
    ],
    validate: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
    ): Promise<boolean> => {
        try {
            const content = message.content as dadJokeEvalContent;
            return typeof content.text === "string";
        } catch {
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
    ): Promise<dadJokeEvalResponse> => {
        try {
            const content = message.content as dadJokeEvalContent;
            const text = content.text.toLowerCase();
            
            //checks for the word "joke" in the response
            if (!text.includes("joke")) {
                return {
                    success: false,
                    response: "Response does not contain the word 'joke'",
                };
            }

            return {
                success: true,
                response: "Dad joke response is valid",
            };

        } catch {
            return {
                success: false,
                response: "Failed to validate dad joke response",
            };
        }
    },
    alwaysRun: true,
}