import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:13000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: {
    command: "npm run start -- --port 13000",
    url: "http://127.0.0.1:13000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
