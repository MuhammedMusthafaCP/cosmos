const News = require("../Schemas/News");
const Apod = require("../Schemas/APOD");
const config = require("../config/env");
const { isValidApod } = require("../services/apod/nasaApi");

const DAY_MS = 24 * 60 * 60 * 1000;

// Never let cleanup empty a section: if syncing has been broken for weeks, the
// newest `minKeep` records survive even when they are past the retention window.
async function safeCutoff(Model, field, cutoff, minKeep) {
  const floor = await Model.find().sort({ [field]: -1 }).skip(minKeep - 1).limit(1).select(field).lean();
  if (floor.length === 0) return null; // fewer than minKeep records: delete nothing
  const floorValue = floor[0][field];
  return floorValue < cutoff ? floorValue : cutoff;
}

async function cleanup() {
  const cutoff = new Date(Date.now() - config.retentionDays * DAY_MS);
  const stats = { newsDeleted: 0, apodDeleted: 0, invalidApodDeleted: 0 };

  const newsCutoff = await safeCutoff(News, "publishedAt", cutoff, 20);
  if (newsCutoff) {
    stats.newsDeleted = (await News.deleteMany({ publishedAt: { $lt: newsCutoff } })).deletedCount;
  }

  // APOD dates are YYYY-MM-DD strings, which sort correctly as text.
  const apodCutoff = await safeCutoff(Apod, "date", cutoff.toISOString().slice(0, 10), 7);
  if (apodCutoff) {
    stats.apodDeleted = (await Apod.deleteMany({ date: { $lt: apodCutoff } })).deletedCount;
  }

  // Remove placeholder entries stored by earlier versions (NASA logo instead of a photo).
  const stored = await Apod.find().select("date title url hdurl media_type explanation").lean();
  const invalidDates = stored.filter((apod) => !isValidApod(apod)).map((apod) => apod.date);
  if (invalidDates.length) {
    stats.invalidApodDeleted = (await Apod.deleteMany({ date: { $in: invalidDates } })).deletedCount;
  }

  return stats;
}

module.exports = cleanup;
