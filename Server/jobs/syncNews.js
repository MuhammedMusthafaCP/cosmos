const News = require("../Schemas/News");
const config = require("../config/env");
const { fetchArticlesSince } = require("../services/news/spaceflightNews");
const { fetchVideosSince } = require("../services/news/youtubeFeeds");

const DAY_MS = 24 * 60 * 60 * 1000;

// Pulls articles from the retention window and upserts them. Idempotent: running it
// twice, or overlapping with a previous run, never creates duplicates.
async function syncNews() {
  const since = new Date(Date.now() - config.retentionDays * DAY_MS);
  // Independent sources: one being down must not block the other.
  const [articleResult, videoResult] = await Promise.allSettled([
    fetchArticlesSince(since),
    fetchVideosSince(since),
  ]);
  if (articleResult.status === "rejected" && videoResult.status === "rejected") {
    throw articleResult.reason;
  }
  const articles = [
    ...(articleResult.status === "fulfilled" ? articleResult.value : []),
    ...(videoResult.status === "fulfilled" ? videoResult.value : []),
  ];
  const warnings = [articleResult, videoResult]
    .filter((r) => r.status === "rejected")
    .map((r) => r.reason.message);

  if (articles.length === 0) return { fetched: 0, inserted: 0, updated: 0 };

  const result = await News.bulkWrite(
    articles.map((article) => ({
      updateOne: {
        filter: { externalId: article.externalId },
        update: { $set: article },
        upsert: true,
      },
    })),
    { ordered: false }
  );

  return {
    ...(warnings.length && { warnings }),
    videos: articles.filter((a) => a.video).length,
    fetched: articles.length,
    inserted: result.upsertedCount,
    updated: result.modifiedCount,
  };
}

module.exports = syncNews;
