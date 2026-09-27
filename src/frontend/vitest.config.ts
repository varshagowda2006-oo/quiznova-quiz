import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for the QuizNova frontend suite.
 *
 * Kept separate from `vite.config.js` so the test run does not depend on the
 * build-time environment plugin, while still resolving the same `@` and
 * `declarations` aliases the application source uses.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@icp-sdk/core"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    // Pin the pool explicitly: the inherited environment can set conflicting
    // min/max thread counts, which makes Vitest 3.1.4 throw before any test
    // runs. A single fork is enough for this suite and avoids the conflict.
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
