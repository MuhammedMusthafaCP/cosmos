const mongoose = require("mongoose");

// History of every sync run, so "did it run, what did it do, why did it fail" is answerable.
const jobRunSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  trigger: { type: String, enum: ["schedule", "startup", "cli", "manual"], default: "schedule" },
  status: { type: String, enum: ["running", "success", "partial", "failed"], default: "running" },
  startedAt: { type: Date, default: Date.now },
  finishedAt: { type: Date },
  steps: { type: mongoose.Schema.Types.Mixed, default: {} },
});

// Run history expires on its own after 90 days.
jobRunSchema.index({ startedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model("JobRun", jobRunSchema);
