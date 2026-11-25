import fs from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { test, expect, asAda } from "./fixtures.js";

const PUBLIC = ["/", "/login", "/signup"];
const AUTHED = ["/HomePage", "/news", "/about", "/galaxies", "/nebulas", "/stars", "/blackholes", "/solarsystem", "/userPosts", "/profile", "/settings", "/chats", "/communitychats", "/selenews", "/this-route-does-not-exist"];

// A visible landmark each route must render (guards against blank pages).
const LANDMARK = {
  "/": /the cosmos/i, "/login": /login/i, "/signup": /create an account/i, "/HomePage": /explore topics/i,
  "/news": /news/i, "/about": /about|review/i, "/galaxies": /galaxies/i, "/nebulas": /nebul/i, "/stars": /stars/i,
  "/blackholes": /black hole/i, "/solarsystem": /solar system/i, "/userPosts": /user posts/i, "/profile": /your posts|my bio/i,
  "/settings": /settings/i, "/chats": /search people|select a user/i, "/communitychats": /communit/i,
  "/selenews": /no article selected/i, "/this-route-does-not-exist": /lost in space/i,
};

async function inspect(page, route, project) {
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(route);
  await expect(page.getByText(LANDMARK[route]).first()).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1800);

  const dir = `e2e/screenshots/${project}`;
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: `${dir}/${route === "/" ? "landing" : route.replace(/\W+/g, "_")}.png`, fullPage: true });

  const m = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    cls: window.__cls || 0,
    brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.offsetParent).map((i) => i.src.slice(0, 90)),
    h1: document.querySelectorAll("h1").length,
  }));
  return m;
}

for (const route of [...PUBLIC, ...AUTHED]) {
  test.describe(route, () => {
    if (PUBLIC.includes(route)) test.use({ storageState: { cookies: [], origins: [] } });
    else test.use(asAda);

    test(`renders cleanly`, async ({ page }, info) => {
      const m = await inspect(page, route, info.project.name);
      expect.soft(page.problems.pageErrors, "uncaught page errors").toEqual([]);
      expect.soft(page.problems.console, "console errors").toEqual([]);
      expect.soft(m.overflow, "horizontal overflow (px)").toBeLessThanOrEqual(0);
      expect.soft(m.brokenImgs, "broken <img> elements").toEqual([]);
      expect.soft(m.cls, "cumulative layout shift").toBeLessThan(0.25);
      expect.soft(m.h1, "page should have exactly one h1").toBe(1);
      // Network: only unexpected failures (external image hosts are reported separately by the image check)
      const net = page.problems.requests;
      if (page.problems.externalImages.length) info.annotations.push({ type: "external-images-failed", description: [...new Set(page.problems.externalImages)].join(" | ") });
      expect.soft(net, "failed/4xx/5xx requests").toEqual([]);
    });

    test(`has no serious accessibility violations`, async ({ page }, info) => {
      await inspect(page, route, info.project.name);
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).exclude("iframe").analyze();
      const bad = res.violations.filter((v) => ["serious", "critical"].includes(v.impact));
      expect.soft(bad.map((v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes[0].target.join(" ")}`), "axe violations").toEqual([]);
    });
  });
}
