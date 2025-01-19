import { Plugin } from "@ai16z/eliza";
import { dadJokeProvider, initializeDadJokeProvider } from "./provider.ts";
import { dadJokeEvaluator } from "./evaluator.ts";
import { dadJokeConfig } from "./types.ts";
import { getDadJokeAction } from "./action.ts";

export const dadJokePlugin: Plugin = {
    name: "Dad Joke",
    description: "Dad Joke Plugin for Eliza",
    actions: [
        getDadJokeAction
    ],
    providers: [dadJokeProvider],
    evaluators: [dadJokeEvaluator],
    //rest of the plugin
}

export const initializeDadJoke = (config: dadJokeConfig): void => {
    initializeDadJokeProvider(config);
}