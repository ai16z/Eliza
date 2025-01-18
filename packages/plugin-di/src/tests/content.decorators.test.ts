import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
    property,
    createZodSchema,
    loadPropertyDescriptions,
} from "../../src/decorators/content.decorators";

describe("Content Decorators", () => {
    class TestClass {
        @property({
            description: "Test description",
            examples: ["example1", "example2"],
            schema: z.string(),
        })
        testProperty!: string;

        @property({
            description: "Number property",
            examples: ["example3", "example4"],
            schema: z.number().optional(),
        })
        numberProperty?: number;
    }

    describe("createZodSchema", () => {
        it("should create a zod schema from decorated properties", () => {
            const schema = createZodSchema(TestClass);
            expect(
                schema.safeParse({ testProperty: "valid", numberProperty: 123 })
                    .success
            ).toBe(true);
            expect(
                schema.safeParse({
                    testProperty: 123,
                    numberProperty: "invalid",
                }).success
            ).toBe(false);
        });
    });

    describe("loadPropertyDescriptions", () => {
        it("should load property descriptions correctly", () => {
            const descriptions = loadPropertyDescriptions(TestClass);
            expect(descriptions).toEqual({
                testProperty: {
                    description: "Test description",
                    examples: ["example1", "example2"],
                },
                numberProperty: {
                    description: "Number property",
                    examples: ["example3", "example4"],
                },
            });
        });
    });

    describe("property decorator", () => {
        it("should store metadata correctly", () => {
            const instance = new TestClass();
            expect(instance.testProperty).toBeUndefined();
            expect(instance.numberProperty).toBeUndefined();
        });
    });
});
