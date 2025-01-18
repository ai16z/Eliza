import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["esm"],  // Using ES Modules format
    external: [
        "dotenv", // Externalize dotenv to prevent bundling
        "fs", // Externalize fs to use Node.js built-in module
        "path", // Externalize other built-ins if necessary
        "https",
        "http",
        "agentkeepalive",
        "safe-buffer",
        // Add other modules you want to externalize
        "inversify",
        "reflect-metadata",
        "zod",
        "uuid",
    ],
});
