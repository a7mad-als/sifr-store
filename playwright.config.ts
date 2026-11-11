import { defineConfig } from "@playwright/test";
import { execFileSync } from "node:child_process";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  outputDir: "./generated-artifacts/test-results",
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: "http://localhost:80",
    headless: true,
    launchOptions: { executablePath: execFileSync("which", ["chromium"]).toString().trim() },
  },
  reporter: [["list"]],
});
