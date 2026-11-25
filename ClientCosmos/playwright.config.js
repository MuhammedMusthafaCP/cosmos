import { defineConfig } from "@playwright/test";

// Runs against the locally running Docker stack (client :5173, API :3000).
const use = { baseURL: "http://localhost:5173", channel: "chrome", screenshot: "only-on-failure", trace: "retain-on-failure" };
const vp = (width, height) => ({ viewport: { width, height } });

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.js",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  workers: 2,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use,
  projects: [
    { name: "desktop-1440", testMatch: /pages\.spec\.js/, use: { ...use, ...vp(1440, 900) } },
    { name: "laptop-1366", testMatch: /pages\.spec\.js/, use: { ...use, ...vp(1366, 768) } },
    { name: "tablet-768", testMatch: /pages\.spec\.js/, use: { ...use, ...vp(768, 1024) } },
    { name: "mobile-390", testMatch: /(pages|mobile)\.spec\.js/, use: { ...use, ...vp(390, 844) } },
    { name: "workflows", testMatch: /workflows\.spec\.js/, fullyParallel: false, workers: 1, use: { ...use, ...vp(1440, 900) } },
  ],
});
