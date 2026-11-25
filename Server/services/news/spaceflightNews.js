// Spaceflight News API (https://api.spaceflightnewsapi.net/v4/docs).
// Free, no API key, aggregates 30+ outlets (NASA, SpaceNews, Space.com, ESA, Spaceflight Now...).
const http = require("../../utils/http");
const { classifyTopic } = require("./topics");

const BASE_URL = "https://api.spaceflightnewsapi.net/v4";
const PAGE_SIZE = 100;
const MAX_PAGES = 15;

// Some outlets send their site logo as the article image; treat it as "no image".
const PLACEHOLDER_IMAGE = /nasa-logo|logo[-_]?(web|rgb)|placeholder/i;

const clean = (text) =>
  String(text || "")
    .replace(/\s+/g, " ")
    // WordPress feed boilerplate: "The post <title> appeared first on <Site>."
    .replace(/\s*The post .{3,300}? appeared first on [^.]{2,60}(\.[a-z]{2,4})?\.?\s*$/i, "")
    .replace(/\s*\[…\]\s*$|\s*\[\.\.\.\]\s*$/, "…")
    .trim();

function normalize(article) {
  if (!article?.id || !article.title || !article.url || !article.published_at) return null;
  // The APOD posts are handled by the dedicated picture-of-the-day job.
  if (/^APOD:/i.test(article.title)) return null;

  const publishedAt = new Date(article.published_at);
  if (Number.isNaN(publishedAt.getTime())) return null;

  const summary = clean(article.summary);
  const title = clean(article.title);
  const image = article.image_url && !PLACEHOLDER_IMAGE.test(article.image_url) ? article.image_url : null;

  return {
    externalId: `snapi:${article.id}`,
    source: "spaceflightnews",
    title,
    summary,
    url: article.url,
    imageUrl: image,
    newsSite: article.news_site || null,
    authors: (article.authors || []).map((a) => a.name).filter(Boolean),
    topic: classifyTopic({ title, summary }),
    publishedAt,
  };
}

// Newest-first articles published since `since`. Stops at the last page or MAX_PAGES.
async function fetchArticlesSince(since) {
  const articles = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const { data } = await http.get(`${BASE_URL}/articles/`, {
      params: {
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        ordering: "-published_at",
        published_at_gte: since.toISOString(),
      },
    });
    const results = data.results || [];
    for (const raw of results) {
      const article = normalize(raw);
      if (article) articles.push(article);
    }
    if (!data.next || results.length < PAGE_SIZE) break;
  }
  return articles;
}

// Used to locate the APOD pages on science.nasa.gov (see services/apod).
async function fetchApodArticles(since) {
  const { data } = await http.get(`${BASE_URL}/articles/`, {
    params: {
      limit: 100,
      news_site: "NASA",
      search: "APOD",
      ordering: "-published_at",
      published_at_gte: since.toISOString(),
    },
  });
  return (data.results || [])
    .filter((a) => /^APOD:/i.test(a.title || "") && a.url)
    .map((a) => ({ title: a.title, url: a.url }));
}

module.exports = { fetchArticlesSince, fetchApodArticles, normalize };
