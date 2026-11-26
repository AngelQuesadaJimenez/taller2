import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4317";
const channel = process.env.PLAYWRIGHT_CHANNEL;

export default defineConfig({
  testDir: "./tests",
  updateSnapshots: process.env.CI ? "none" : undefined,
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "list",
  expect: { toHaveScreenshot: { animations: "disabled", maxDiffPixelRatio: 0.005 } },
  use: {
    baseURL,
    channel,
    locale: "es-CR",
    colorScheme: "dark",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] },
  },
  projects: [
    { name: "escritorio", testIgnore: "**/visual.spec.ts", use: { ...devices["Desktop Chrome"] } },
    { name: "móvil", testIgnore: "**/visual.spec.ts", use: { ...devices["Pixel 7"] } },
    { name: "visual", testMatch: "**/visual.spec.ts", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: process.env.CI
      ? "python3 -m http.server 4317 --bind 127.0.0.1 --directory out"
      : "npm run dev -- --hostname 127.0.0.1 --port 4317",
    url: baseURL,
    timeout: 90000,
    reuseExistingServer: !process.env.CI,
  },
});
