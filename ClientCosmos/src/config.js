// Single place for runtime configuration. Values come from Vite env vars
// (VITE_*), which are inlined at build time and are PUBLIC: never put secrets here.
// See .env.example.
const env = import.meta.env;

// Backend base URL. Falls back to the local API during `npm run dev` only.
const apiUrl = env.VITE_API_URL || (env.DEV ? "http://localhost:3000" : "");

if (!apiUrl) {
  throw new Error("VITE_API_URL is not set. Add it to your environment (see .env.example).");
}

export const API_URL = apiUrl.replace(/\/$/, "");

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};
