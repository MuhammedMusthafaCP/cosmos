// Single source of truth for configuration. Loads .env once, validates it, and
// fails fast at boot with a clear message. Import this instead of reading
// process.env directly anywhere else in the server.
require("dotenv").config();

const env = process.env;
const isProduction = env.NODE_ENV === "production";
const missing = [];

// Required in every environment.
const required = (name, legacyName) => {
  const value = env[name] || (legacyName && env[legacyName]);
  if (!value) missing.push(name);
  return value;
};

// Required in production, falls back to a local-dev default otherwise.
const requiredInProd = (name, devDefault) => {
  if (env[name]) return env[name];
  if (isProduction) missing.push(name);
  return devDefault;
};

const port = Number(env.PORT) || 3000;

// Positive integer from the environment, or `fallback` when unset/invalid.
const positiveInt = (name, fallback) => {
  const value = Number(env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
};

const flag = (name, fallback) => {
  if (env[name] === undefined || env[name] === "") return fallback;
  return ["1", "true", "yes", "on"].includes(env[name].toLowerCase());
};

const config = {
  nodeEnv: env.NODE_ENV || "development",
  isProduction,
  port,

  // MongoDB. `URI` is the legacy name and is still accepted.
  mongoUri: required("MONGODB_URI", "URI"),

  // Secrets
  jwtSecret: required("JWT_SECRET"),
  sessionSecret: required("SESSION_SECRET"),

  // Frontend origin(s) allowed by CORS / Socket.IO. Comma-separate for several.
  clientOrigins: requiredInProd("CLIENT_ORIGIN", "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean),

  // Public URL of this server, used to build the Google OAuth callback.
  serverUrl: requiredInProd("SERVER_URL", `http://localhost:${port}`).replace(/\/$/, ""),

  google: {
    clientId: required("GOOGLE_CLIENT_ID"),
    clientSecret: required("GOOGLE_CLIENT_SECRET"),
  },

  // https://api.nasa.gov, DEMO_KEY is heavily rate limited.
  nasaApiKey: env.NASA_API_KEY || "DEMO_KEY",

  // How long news and pictures of the day are kept before the daily cleanup deletes them.
  retentionDays: positiveInt("DATA_RETENTION_DAYS", 60),

  // Daily sync (news + picture of the day + cleanup). See Server/jobs.
  scheduler: {
    // Set ENABLE_SCHEDULER=false when an external cron runs `npm run jobs:daily` instead.
    enabled: flag("ENABLE_SCHEDULER", true),
    // NASA publishes the picture of the day at 00:05 US Eastern (~05:05 UTC), so run after that.
    cron: env.SYNC_CRON || "30 6 * * *",
    timezone: env.SYNC_TIMEZONE || "UTC",
    // Run once at boot when the last successful sync is older than this (covers sleeping hosts).
    staleAfterHours: positiveInt("SYNC_STALE_AFTER_HOURS", 26),
  },

  // How many days of pictures of the day to backfill when they are missing.
  apodBackfillDays: positiveInt("APOD_BACKFILL_DAYS", 14),

  // Avatar assigned to new users. Point this at an image in your own storage.
  defaultProfilePicUrl:
    env.DEFAULT_PROFILE_PIC_URL ||
    "https://firebasestorage.googleapis.com/v0/b/cosmos-16de1.appspot.com/o/dp%2FScreenshot%202024-06-27%20011730.png?alt=media&token=46546fec-441e-4fe6-835a-5a39bda65c8a",
};

if (missing.length) {
  console.error(
    `Missing required environment variable(s): ${missing.join(", ")}.\n` +
      "Copy Server/.env.example to Server/.env and fill in the values."
  );
  process.exit(1);
}

config.googleCallbackUrl = `${config.serverUrl}/auth/google/callback`;

module.exports = Object.freeze(config);
