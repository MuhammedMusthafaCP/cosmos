import { test as base, expect } from "@playwright/test";
import fs from "node:fs";

// Known, expected noise from the local setup (placeholder Firebase config; dead third-party hosts).
const IGNORED = [
  /firebase|installations\.googleapis|firebaseinstallations/i,
  /google-analytics|googletagmanager|analytics/i,
];
const ignored = (s) => IGNORED.some((r) => r.test(s));

export const users = () => JSON.parse(fs.readFileSync("e2e/.auth/users.json", "utf8"));

/** `page` that records console errors, page errors and failed/4xx-5xx requests into `page.problems`. */
export const test = base.extend({
  page: async ({ page }, use) => {
    const problems = { console: [], pageErrors: [], requests: [], externalImages: [] };
    const local = (u) => /^https?:\/\/localhost[:/]/.test(u);
    page.on("console", (m) => {
      const url = m.location()?.url || "";
      if (m.type() !== "error" || ignored(m.text() + url)) return;
      if (/Failed to load resource/.test(m.text()) && url && !local(url)) return; // third-party asset, tracked below
      problems.console.push(m.text().slice(0, 200));
    });
    page.on("pageerror", (e) => problems.pageErrors.push(e.message.slice(0, 200)));
    page.on("requestfailed", (r) => {
      if (r.resourceType() === "image" && !local(r.url())) return void problems.externalImages.push(r.url().slice(0, 100));
      if (!ignored(r.url()) && r.failure()?.errorText !== "net::ERR_ABORTED") problems.requests.push(`FAILED ${r.method()} ${r.url().slice(0, 100)} ${r.failure()?.errorText}`);
    });
    page.on("response", (r) => {
      if (r.status() >= 400 && r.request().resourceType() === "image" && !local(r.url())) return void problems.externalImages.push(r.url().slice(0, 100));
      if (r.status() >= 400 && !ignored(r.url())) problems.requests.push(`${r.status()} ${r.request().method()} ${r.url().slice(0, 100)}`);
    });
    page.problems = problems;
    await use(page);
  },
});

export { expect };
export const asAda = { storageState: "e2e/.auth/ada.json" };
export const asBen = { storageState: "e2e/.auth/ben.json" };
