// Shared HTTP client for third-party APIs: timeout, identifying User-Agent and
// retry with exponential backoff on network errors, 429 and 5xx.
const axios = require("axios");

const client = axios.create({
  timeout: 20000,
  headers: { "User-Agent": "CosmosBot/1.0 (space news aggregator)" },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryable = (error) => {
  if (!error.response) return true; // timeout, DNS, connection reset
  const { status } = error.response;
  return status === 429 || status >= 500;
};

async function request(config, { retries = 3, baseDelayMs = 1000 } = {}) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await client.request(config);
    } catch (error) {
      if (attempt >= retries || !isRetryable(error)) throw error;
      const retryAfter = Number(error.response?.headers?.["retry-after"]);
      const delay = retryAfter > 0 ? Math.min(retryAfter * 1000, 30000) : baseDelayMs * 2 ** attempt;
      await sleep(delay);
    }
  }
}

const get = (url, config, retryOptions) => request({ ...config, url, method: "GET" }, retryOptions);

module.exports = { get, request };
