const Apod = require("../Schemas/APOD");
const config = require("../config/env");
const nasaApi = require("../services/apod/nasaApi");
const { isValidApod } = nasaApi;
const nasaSciencePage = require("../services/apod/nasaSciencePage");

const DAY_MS = 24 * 60 * 60 * 1000;

// APOD dates follow US Eastern time (a new picture appears at 00:05 ET).
const easternDate = (date) => date.toLocaleDateString("en-CA", { timeZone: "America/New_York" });

function wantedDates(days) {
  const now = Date.now();
  return Array.from({ length: days }, (_, i) => easternDate(new Date(now - i * DAY_MS)));
}

async function upsertAll(apods) {
  if (apods.length === 0) return 0;
  const result = await Apod.bulkWrite(
    apods.map((apod) => ({
      updateOne: { filter: { date: apod.date }, update: { $set: apod }, upsert: true },
    })),
    { ordered: false }
  );
  return result.upsertedCount + result.modifiedCount;
}

// Makes sure every day in the backfill window has a picture. Source order:
//   1. NASA APOD API (validated)   2. NASA Science APOD page
async function syncApod() {
  const wanted = wantedDates(config.apodBackfillDays);
  // Placeholder entries stored by older versions must not count as "already have it".
  const stored = await Apod.find({ date: { $in: wanted } })
    .select("date title url hdurl media_type explanation")
    .lean();
  const existing = new Set(stored.filter(isValidApod).map((apod) => apod.date));
  let missing = wanted.filter((date) => !existing.has(date));

  const stats = { wanted: wanted.length, alreadyStored: existing.size, fromApi: 0, fromPage: 0, stillMissing: 0 };
  if (missing.length === 0) return stats;

  const sorted = [...missing].sort();
  try {
    const apods = (await nasaApi.fetchApodRange(sorted[0], sorted[sorted.length - 1])).filter((a) =>
      missing.includes(a.date)
    );
    stats.fromApi = await upsertAll(apods);
    const got = new Set(apods.map((a) => a.date));
    missing = missing.filter((date) => !got.has(date));
  } catch (error) {
    console.warn(`[apod] NASA API unavailable: ${error.response?.data?.error?.message || error.message}`);
  }

  if (missing.length > 0) {
    try {
      const since = new Date(`${[...missing].sort()[0]}T00:00:00Z`);
      const apods = await nasaSciencePage.fetchApodsForDates(missing, since);
      stats.fromPage = await upsertAll(apods);
      const got = new Set(apods.map((a) => a.date));
      missing = missing.filter((date) => !got.has(date));
    } catch (error) {
      console.warn(`[apod] NASA Science page fallback failed: ${error.message}`);
    }
  }

  // Today's picture may simply not be published yet; that is not an error.
  stats.stillMissing = missing.length;
  return stats;
}

module.exports = syncApod;
