import type { Plugin } from "@elizaos/core";
import { createResourceAction } from "../actions/sampleAction";
import { sampleProvider } from "../providers/sampleProvider";
import { sampleEvaluator } from "../evaluators/sampleEvalutor";
import SampleService from "../services/sampleService";

export const samplePlugin: Plugin = {
    name: "sample",
    description: "Enables creation and management of generic resources",
    actions: [createResourceAction],
    providers: [sampleProvider],
    evaluators: [sampleEvaluator],
    // separate examples will be added for services and clients
    services: [new SampleService()],
    clients: [],
};
