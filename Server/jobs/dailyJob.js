// Orchestrates the daily run: news sync -> picture of the day -> cleanup.
// Steps are independent (one failing never blocks the others), the whole run is
// guarded by a database lock, and every run is recorded in the JobRun collection.
const JobRun = require("../Schemas/JobRun");
const JobLock = require("../Schemas/JobLock");
const syncNews = require("./syncNews");
const syncApod = require("./syncApod");
const cleanup = require("./cleanup");

const JOB_NAME = "daily-sync";
const LOCK_TTL_MS = 30 * 60 * 1000;

const STEPS = { news: syncNews, apod: syncApod, cleanup };

/**
 * @param {{ trigger?: "schedule"|"startup"|"cli"|"manual", only?: string[] }} options
 * @returns {Promise<object|null>} the JobRun summary, or null when another run holds the lock
 */
async function runDailyJobs({ trigger = "manual", only } = {}) {
  if (!(await JobLock.acquire(JOB_NAME, LOCK_TTL_MS))) {
    console.log("[jobs] daily sync already running elsewhere, skipping");
    return null;
  }

  const run = await JobRun.create({ name: JOB_NAME, trigger });
  const names = Object.keys(STEPS).filter((name) => !only || only.includes(name));
  const steps = {};

  try {
    for (const name of names) {
      const startedAt = Date.now();
      try {
        const stats = await STEPS[name]();
        steps[name] = { ok: true, ms: Date.now() - startedAt, ...stats };
        console.log(`[jobs] ${name} ok`, stats);
      } catch (error) {
        steps[name] = { ok: false, ms: Date.now() - startedAt, error: error.message };
        console.error(`[jobs] ${name} failed:`, error.message);
      }
    }

    const failed = Object.values(steps).filter((s) => !s.ok).length;
    run.status = failed === 0 ? "success" : failed === names.length ? "failed" : "partial";
    run.steps = steps;
    run.finishedAt = new Date();
    await run.save();
    return run.toObject();
  } finally {
    await JobLock.release(JOB_NAME);
  }
}

async function lastSuccessfulRun() {
  // Only runs that actually refreshed the news count (a `--only=cleanup` run must not hide staleness).
  return JobRun.findOne({ name: JOB_NAME, "steps.news.ok": true })
    .sort({ startedAt: -1 })
    .lean();
}

module.exports = { runDailyJobs, lastSuccessfulRun, JOB_NAME };
