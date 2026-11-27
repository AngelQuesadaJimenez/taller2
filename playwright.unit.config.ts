import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/unit",
  testMatch: "**/*.unit.ts",
  outputDir: "./test-results/unit",
  workers: 1,
  reporter: "list",
});
