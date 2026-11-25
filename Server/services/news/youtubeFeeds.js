// Space video news from the official YouTube channel feeds (public Atom, no API key,
// the 15 most recent uploads per channel). Videos play through the privacy-friendly
// youtube-nocookie embed.
const cheerio = require("cheerio");
const http = require("../../utils/http");
const { classifyTopic } = require("./topics");

const CHANNELS = [
  { id: "UCLA_DiR1FfKNvjuUpBHmylQ", name: "NASA" },
  { id: "UCIBaDdAbGlFDeS33shmlD0A", name: "ESA" },
  { id: "UCtI0Hodo5o5dUb67FeUjDeA", name: "SpaceX" },
];

const clean = (text) => String(text || "").replace(/\s+/g, " ").trim();

function parseFeed(xml, channel) {
  const $ = cheerio.load(xml, { xmlMode: true });
  return $("entry")
    .map((_, el) => {
      const entry = $(el);
      const videoId = entry.find("yt\\:videoId").first().text();
      const publishedAt = new Date(entry.find("published").first().text());
      const title = clean(entry.find("title").first().text());
      if (!videoId || !title || Number.isNaN(publishedAt.getTime())) return null;

      const description = clean(entry.find("media\\:description").first().text());
      const summary = description.length > 400 ? `${description.slice(0, 397)}…` : description;

      return {
        externalId: `yt:${videoId}`,
        source: "youtube",
        title,
        summary,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        imageUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        video: { kind: "embed", url: `https://www.youtube-nocookie.com/embed/${videoId}` },
        newsSite: channel.name,
        authors: [channel.name],
        topic: classifyTopic({ title, summary }),
        publishedAt,
      };
    })
    .get();
}

// Videos published since `since`, from every channel. A channel that fails is skipped.
async function fetchVideosSince(since) {
  const results = await Promise.allSettled(
    CHANNELS.map(async (channel) => {
      const { data } = await http.get("https://www.youtube.com/feeds/videos.xml", {
        params: { channel_id: channel.id },
        responseType: "text",
      });
      return parseFeed(data, channel);
    })
  );

  const videos = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") videos.push(...result.value);
    else console.warn(`[news] ${CHANNELS[i].name} video feed failed: ${result.reason.message}`);
  });
  if (videos.length === 0 && results.every((r) => r.status === "rejected")) {
    throw new Error("all video feeds failed");
  }
  return videos.filter((video) => video.publishedAt >= since);
}

module.exports = { fetchVideosSince, parseFeed };
