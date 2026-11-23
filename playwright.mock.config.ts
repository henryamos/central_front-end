import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({
  ...base,
  timeout: 60000,
  use: { ...base.use, baseURL: "http://127.0.0.1:3100" },
  projects: [
    {
      name: "development-mocks",
      testMatch: "**/mocks.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120000,
    env: { NEXT_PUBLIC_API_MOCKING: "enabled" },
  },
});
