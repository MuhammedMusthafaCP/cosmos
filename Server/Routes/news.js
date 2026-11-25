const express = require("express");
const router = express.Router();
const News = require("../Schemas/News");
const Apod = require("../Schemas/APOD");
const JobRun = require("../Schemas/JobRun");
const syncApod = require("../jobs/syncApod");
const { JOB_NAME } = require("../jobs/dailyJob");

// Data only changes once a day, so let browsers and CDNs reuse responses briefly.
router.use((req, res, next) => {
  res.set("Cache-Control", "public, max-age=300");
  next();
});

const TOPICS = News.schema.path("topic").enumValues;
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const clamp = (value, min, max, fallback) => {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? fallback : Math.min(Math.max(number, min), max);
};

// GET /news?page=1&limit=24&q=webb&topic=stars
// Newest first, server-side search and pagination.
router.get("/", async (req, res) => {
  try {
    const page = clamp(req.query.page, 1, 10000, 1);
    const limit = clamp(req.query.limit, 1, 60, 24);
    const filter = {};

    if (req.query.topic) {
      if (!TOPICS.includes(req.query.topic)) return res.status(400).json({ message: "Unknown topic" });
      filter.topic = req.query.topic;
    }
    const q = String(req.query.q || "").trim().slice(0, 100);
    if (q) {
      const pattern = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: pattern }, { summary: pattern }];
    }

    const [items, total] = await Promise.all([
      News.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      News.countDocuments(filter),
    ]);

    res.json({
      items: items.map(News.toPublic),
      page,
      limit,
      total,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Error fetching news" });
  }
});

// GET /news/latest?limit=4  (home page)
router.get("/latest", async (req, res) => {
  try {
    const limit = clamp(req.query.limit, 1, 20, 4);
    const items = await News.find().sort({ publishedAt: -1 }).limit(limit).lean();
    res.json(items.map(News.toPublic));
  } catch (error) {
    console.error("Error fetching latest news:", error);
    res.status(500).json({ message: "Error fetching latest news" });
  }
});

// GET /news/related/:topic?limit=4&exclude=<newsId>  (topic pages and the article sidebar)
router.get("/related/:topic", async (req, res) => {
  try {
    const { topic } = req.params;
    if (!TOPICS.includes(topic)) return res.status(400).json({ message: "Unknown topic" });
    const limit = clamp(req.query.limit, 1, 20, 4);

    const filter = { topic };
    if (/^[a-f\d]{24}$/i.test(req.query.exclude || "")) filter._id = { $ne: req.query.exclude };

    const items = await News.find(filter).sort({ publishedAt: -1 }).limit(limit).lean();
    res.json(items.map(News.toPublic));
  } catch (error) {
    console.error("Error fetching related news:", error);
    res.status(500).json({ message: "Error fetching related news" });
  }
});

// Astronomy picture of the day: the newest one stored by the daily job.
router.get("/apod", async (req, res) => {
  try {
    let apod = await Apod.findOne().sort({ date: -1 }).lean();
    if (!apod) {
      // Fresh database and the daily job has not run yet: fill it once on demand.
      await syncApod();
      apod = await Apod.findOne().sort({ date: -1 }).lean();
    }
    if (!apod) return res.status(503).json({ message: "Picture of the day is not available yet" });
    res.json(apod);
  } catch (error) {
    console.error("Error fetching APOD:", error.message);
    res.status(500).json({ message: "Error fetching APOD" });
  }
});

// Archive of stored pictures (retention window), newest first.
router.get("/apods", async (req, res) => {
  try {
    res.json(await Apod.find().sort({ date: -1 }).lean());
  } catch (error) {
    console.error("Error while fetching all APODs:", error);
    res.status(500).json({ message: "Error fetching pictures" });
  }
});

// A single story (article page, shareable and refresh-safe link).
router.get("/:id([a-fA-F0-9]{24})", async (req, res) => {
  try {
    const item = await News.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Story not found" });
    res.json(News.toPublic(item));
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({ message: "Error fetching story" });
  }
});

// Health of the daily sync, for monitoring.
router.get("/status", async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const [lastRun, news, apod] = await Promise.all([
      JobRun.findOne({ name: JOB_NAME }).sort({ startedAt: -1 }).select("-_id -__v").lean(),
      News.estimatedDocumentCount(),
      Apod.estimatedDocumentCount(),
    ]);
    res.json({ lastRun, counts: { news, apod } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching status" });
  }
});

module.exports = router;
