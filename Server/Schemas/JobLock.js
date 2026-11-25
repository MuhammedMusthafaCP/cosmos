const mongoose = require("mongoose");

// One document per job name. Acquired atomically so that two server instances
// (or a server and a CLI run) never execute the same job at the same time.
const jobLockSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  lockedUntil: { type: Date },
});

const JobLock = mongoose.model("JobLock", jobLockSchema);

JobLock.acquire = async function acquire(name, ttlMs) {
  const now = new Date();
  try {
    const lock = await this.findOneAndUpdate(
      { name, $or: [{ lockedUntil: null }, { lockedUntil: { $lt: now } }] },
      { $set: { lockedUntil: new Date(now.getTime() + ttlMs) } },
      { upsert: true, new: true }
    );
    return Boolean(lock);
  } catch (error) {
    // Upsert collided with the existing, still-locked document.
    if (error.code === 11000) return false;
    throw error;
  }
};

JobLock.release = function release(name) {
  return this.updateOne({ name }, { $set: { lockedUntil: null } });
};

module.exports = JobLock;
