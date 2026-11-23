import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";
const baseURL = "http://localhost:3000";
export default defineConfig({
  ...base,
  timeout: 60000,
  use: { ...base.use, baseURL },
  projects: [
    {
      name: "development-mocks",
      testMatch: "**/mocks.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "primitives-chromium",
      testMatch: "**/primitives.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "primitives-firefox",
      testMatch: "**/primitives.spec.ts",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "primitives-webkit",
      testMatch: "**/primitives.spec.ts",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "pnpm dev --port 3000",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: { NEXT_PUBLIC_API_MOCKING: "enabled" },
  },
});
