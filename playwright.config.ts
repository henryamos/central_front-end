import { defineConfig, devices } from "@playwright/test";
const baseURL = "http://127.0.0.1:3200";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/foundation.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "http", testMatch: "**/routing.spec.ts" },
    {
      name: "design-system",
      testMatch: [
        "**/design-system.spec.ts",
        "**/navigation.spec.ts",
        "**/home.spec.ts",
      ],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "design-system-firefox",
      testMatch: [
        "**/design-system.spec.ts",
        "**/navigation.spec.ts",
        "**/home.spec.ts",
      ],
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "design-system-webkit",
      testMatch: [
        "**/design-system.spec.ts",
        "**/navigation.spec.ts",
        "**/home.spec.ts",
      ],
      use: { ...devices["Desktop Safari"] },
    },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 320, height: 740 },
      },
    },
  ],
  webServer: {
    command: "pnpm start --hostname 127.0.0.1 --port 3200",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120000,
  },
});
