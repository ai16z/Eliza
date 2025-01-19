import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        coverage: {
            reporter: ["text", "json", "html"],
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.{test,spec}.ts"],
        },
    },
});
