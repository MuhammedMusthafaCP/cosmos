const cron = require("node-cron");
const config = require("../config/env");
const { runDailyJobs, lastSuccessfulRun } = require("./dailyJob");

const safeRun = (trigger) =>
  runDailyJobs({ trigger }).catch((error) => console.error(`[jobs] ${trigger} run crashed:`, error));

// Schedules the daily sync and, if the last good run is stale (fresh deploy, host
// that was asleep at the scheduled time), runs it once right away in the background.
async function startScheduler() {
  const { enabled, cron: expression, timezone, staleAfterHours } = config.scheduler;
  if (!enabled) {
    console.log("[jobs] scheduler disabled (ENABLE_SCHEDULER=false)");
    return null;
  }
  if (!cron.validate(expression)) {
    console.error(`[jobs] invalid SYNC_CRON "${expression}", scheduler not started`);
    return null;
  }

  const task = cron.schedule(expression, () => safeRun("schedule"), { timezone });
  console.log(`[jobs] daily sync scheduled "${expression}" (${timezone})`);

  const last = await lastSuccessfulRun();
  const ageMs = last ? Date.now() - new Date(last.startedAt).getTime() : Infinity;
  if (ageMs > staleAfterHours * 60 * 60 * 1000) {
    console.log("[jobs] last sync is stale or missing, running catch-up sync");
    setImmediate(() => safeRun("startup"));
  }
  return task;
}

module.exports = { startScheduler };
