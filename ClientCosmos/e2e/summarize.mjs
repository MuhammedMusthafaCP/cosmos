import fs from "node:fs";
const r = JSON.parse(fs.readFileSync("test-results/results.json", "utf8"));
const strip = (s) => s.replace(/\u001b\[[0-9;]*m/g, "");
const rows = [];
const walk = (s, path = []) => {
  (s.specs || []).forEach((sp) => sp.tests.forEach((t) => {
    const res = t.results.at(-1);
    if (res.status === "passed" || res.status === "skipped") return;
    const msgs = (res.errors || []).map((e) => strip(e.message).split("\n").slice(0, 14).join(" ").replace(/\s+/g, " ").slice(0, 420));
    rows.push(`[${t.projectName}] ${sp.title} (${path.join(" > ")})\n   ${[...new Set(msgs)].join("\n   ")}`);
  }));
  (s.suites || []).forEach((c) => walk(c, [...path, c.title]));
};
r.suites.forEach((s) => walk(s));
console.log(rows.join("\n\n"));
console.log("\nstats:", JSON.stringify(r.stats));
