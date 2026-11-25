// Fallback APOD source: the official page on science.nasa.gov (apod.nasa.gov now
// redirects there). Pages are discovered through the Spaceflight News API, which
// indexes every "APOD: <date> - <title>" post, then parsed with cheerio.
const cheerio = require("cheerio");
const http = require("../../utils/http");
const { fetchApodArticles } = require("../news/spaceflightNews");

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

// "APOD: 2026 November 25 – SPHEREx Seeing Through Dust" -> { date: "2026-11-25", title }
function parseArticleTitle(text) {
  const match = /^APOD:\s*(\d{4})\s+([A-Za-z]+)\s+(\d{1,2})\s*[-–—]\s*(.+)$/.exec(text.trim());
  if (!match) return null;
  const month = MONTHS.indexOf(match[2].toLowerCase());
  if (month === -1) return null;
  const date = `${match[1]}-${String(month + 1).padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  return { date, title: match[4].trim() };
}

function parsePage(html, { date, title }) {
  const $ = cheerio.load(html);

  const image = $('meta[property="og:image"]').attr("content");
  const explanation = $(".media-detail-hero__description")
    .first()
    .text()
    .replace(/^\s*Explanation:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const video = $("iframe")
    .map((_, el) => $(el).attr("src"))
    .get()
    .find((src) => /youtube\.com|youtube-nocookie\.com|vimeo\.com/.test(src || ""));

  // Direct video file (e.g. an .mp4 hosted on assets.science.nasa.gov), poster = og:image.
  const file = $("video source, video")
    .map((_, el) => $(el).attr("src"))
    .get()
    .find((src) => /\.(mp4|webm|ogv)(\?|$)/i.test(src || ""))
    || (html.match(/https:\/\/assets\.science\.nasa\.gov\/[^"'\s<>]+?\.(?:mp4|webm)/i) || [])[0];

  const url = video || file || image;
  if (!url || !explanation) return null;

  const credit = /(?:Image|Video)?\s*Credit\s*&?\s*Copyright:\s*([^\n]+?)(?:\s{2,}|$)/i.exec($.root().text());

  return {
    date,
    title: $("h1").first().text().trim() || title,
    explanation,
    url,
    hdurl: image || url,
    thumbnail_url: video || file ? image : undefined,
    media_type: video || file ? "video" : "image",
    copyright: credit ? credit[1].trim() : undefined,
    service_version: "science.nasa.gov",
  };
}

// Fetches the APOD for each requested date that NASA has published.
async function fetchApodsForDates(dates, since) {
  const wanted = new Set(dates);
  const articles = (await fetchApodArticles(since))
    .map((a) => ({ ...a, ...parseArticleTitle(a.title) }))
    .filter((a) => a.date && wanted.has(a.date));

  const results = [];
  for (const article of articles) {
    try {
      const { data } = await http.get(article.url, { responseType: "text" });
      const apod = parsePage(data, article);
      if (apod) results.push(apod);
    } catch (error) {
      console.warn(`[apod] could not read ${article.url}: ${error.message}`);
    }
  }
  return results;
}

module.exports = { fetchApodsForDates, parseArticleTitle, parsePage };
