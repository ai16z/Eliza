import { describe, it, expect, beforeAll } from "vitest";

import { type Character, defaultCharacter } from "@elizaos/core";

import { normalizeCharacter } from "../../src/index";
import samplePlugin from "../../src/_examples/samplePlugin";

describe("Normalize Character", () => {
    let normalizedCharacter: Character;

    beforeAll(async () => {
        const sampleCharacter = Object.assign({}, defaultCharacter, {
            plugins: [samplePlugin],
        });
        normalizedCharacter = await normalizeCharacter(sampleCharacter);
    });

    // Add these test cases:
    it("should handle empty plugins array", async () => {
        const emptyPluginsChar = { ...defaultCharacter, plugins: [] };
        const normalized = await normalizeCharacter(emptyPluginsChar);
        expect(normalized.plugins).toEqual([]);
    });

    describe("Elements", () => {
        it("should have a valid character", () => {
            expect(normalizedCharacter).toBeTypeOf("object");
            expect(normalizedCharacter.name).toBe("Eliza");
        });

        it("should have a valid plugins array", () => {
            expect(Array.isArray(normalizedCharacter.plugins)).toBe(true);
            expect(normalizedCharacter.plugins.length).toBe(1);

            const normalizedPlugin = normalizedCharacter.plugins[0];
            expect(normalizedPlugin.name).toBe(samplePlugin.name);
            expect(normalizedPlugin.description).toBe(samplePlugin.description);
        });

        it("should have same providers as the sample plugin", () => {
            const normalizedPlugin = normalizedCharacter.plugins[0];
            expect(normalizedPlugin.providers?.length).toBe(1);
        });

        it("should have same actions as the sample plugin", () => {
            const normalizedPlugin = normalizedCharacter.plugins[0];
            expect(normalizedPlugin.actions?.length).toBe(1);
        });

        it("should have same evaluators as the sample plugin", () => {
            const normalizedPlugin = normalizedCharacter.plugins[0];
            expect(normalizedPlugin.evaluators?.length).toBe(1);
        });
    });

    describe("Normalized Plugin", () => {
        it("should be a valid plugin with sample provider", () => {
            const normalizedPlugin = normalizedCharacter.plugins[0];

            const normalizedProvider = normalizedPlugin.providers[0];
            expect(normalizedProvider).toBeTypeOf("object");
            expect(normalizedProvider.get).toBeTypeOf("function");
        });

        it("should have a valid evaluator", () => {
            const normalizedPlugin = normalizedCharacter.plugins[0];

            const normalizedEvaluator = normalizedPlugin.evaluators[0];
            expect(normalizedEvaluator).toBeTypeOf("object");
            expect(normalizedEvaluator.name).toBeTypeOf("string");
            expect(normalizedEvaluator.description).toBeTypeOf("string");
            expect(Array.isArray(normalizedEvaluator.examples)).toBe(true);
            expect(normalizedEvaluator.handler).toBeTypeOf("function");
            expect(normalizedEvaluator.validate).toBeTypeOf("function");
            expect(normalizedEvaluator.alwaysRun).toBeTypeOf("boolean");
        });

        it("should have a valid action", () => {
            const normalizedPlugin = normalizedCharacter.plugins[0];

            const normalizedAction = normalizedPlugin.actions[0];
            expect(normalizedAction).toBeTypeOf("object");
            expect(normalizedAction.name).toBeTypeOf("string");
            expect(normalizedAction.description).toBeTypeOf("string");
            expect(Array.isArray(normalizedAction.examples)).toBe(true);
            expect(normalizedAction.handler).toBeTypeOf("function");
            expect(normalizedAction.validate).toBeTypeOf("function");
        });
    });
});
