import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["esm"], // Ensure you're targeting CommonJS
    external: [
        "dotenv",
        "fs",
        "path",
        "@reflink/reflink",
        "@node-llama-cpp",
        "https",
        "http",
        "agentkeepalive",
        "@phala/dstack-sdk",
        "safe-buffer",
        "base-x",
        "bs58",
        "borsh",
        "@solana/buffer-layout",
        "stream",
        "buffer",
        "undici",
    ],
});
