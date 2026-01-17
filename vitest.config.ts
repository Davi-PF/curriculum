import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.tsx",
    // evita child_process (forks) que dá EPERM no Windows
    pool: "threads",

    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",

      exclude: [
        "**/src/app/**",
        "**/node_modules/**",
        "**/.next/**",
        "**/dist/**",
        "**/*.d.ts",
        "**/types/**",
        "**/data/**",
        "**/__tests__/**",
        "**/*.test.{ts,tsx}",
      ],
    },
  },
});
