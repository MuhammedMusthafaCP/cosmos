// Official NASA APOD API (https://api.nasa.gov). Preferred source, but it has been
// observed returning the NASA logo with placeholder text for every date, so every
// response is validated before it is trusted.
const http = require("../../utils/http");
const config = require("../../config/env");

const URL = "https://api.nasa.gov/planetary/apod";

function isValidApod(apod) {
  if (!apod || !apod.date || !apod.title || !apod.url) return false;
  if (!["image", "video"].includes(apod.media_type)) return false;
  if (!/^https?:\/\//.test(apod.url)) return false;
  // Known failure mode: site chrome instead of the picture.
  if (/nasa-logo|\/themes\//i.test(apod.url) || /nasa-logo/i.test(apod.hdurl || "")) return false;
  if (/^NASA Science$/i.test(apod.title)) return false;
  if (/^To view this video please enable JavaScript/i.test(apod.explanation || "")) return false;
  return true;
}

// Returns only the valid entries for [startDate, endDate] (YYYY-MM-DD).
async function fetchApodRange(startDate, endDate) {
  const { data } = await http.get(URL, {
    params: { api_key: config.nasaApiKey, thumbs: true, start_date: startDate, end_date: endDate },
  });
  return (Array.isArray(data) ? data : [data]).filter(isValidApod).map(toDocument);
}

function toDocument(apod) {
  return {
    date: apod.date,
    title: apod.title.trim(),
    explanation: (apod.explanation || "").trim(),
    url: apod.url,
    hdurl: apod.hdurl || apod.url,
    media_type: apod.media_type,
    thumbnail_url: apod.thumbnail_url,
    copyright: apod.copyright ? apod.copyright.replace(/\s+/g, " ").trim() : undefined,
    service_version: apod.service_version,
  };
}

module.exports = { fetchApodRange, isValidApod };
