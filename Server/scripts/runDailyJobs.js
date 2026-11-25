// Run the daily sync once from the command line / an external scheduler:
//   npm run jobs:daily                  news + picture of the day + cleanup
//   npm run jobs:daily -- --only=news   one or more steps: news, apod, cleanup
//   npm run jobs:daily -- --only=news,apod
// Exit code is 1 when every step failed or the database is unreachable.
const mongoose = require("mongoose");
const { mongoUri } = require("../config/env");
const { runDailyJobs } = require("../jobs/dailyJob");

const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
const only = onlyArg ? onlyArg.slice("--only=".length).split(",").filter(Boolean) : undefined;

(async () => {
  let exitCode = 0;
  try {
    await mongoose.connect(mongoUri);
    const run = await runDailyJobs({ trigger: "cli", only });
    if (run) console.log(JSON.stringify({ status: run.status, steps: run.steps }, null, 2));
    if (run?.status === "failed") exitCode = 1;
  } catch (error) {
    console.error(error);
    exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
  process.exit(exitCode);
})();
