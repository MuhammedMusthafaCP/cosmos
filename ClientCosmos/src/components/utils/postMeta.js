import { formatNewsDate } from "./formatDate";

// Reader-friendly names for the topic values stored on posts (see Forms/topics.js).
export const POST_TOPICS = [
  { value: "home", label: "Earth" },
  { value: "solarsystem", label: "Solar System" },
  { value: "star", label: "Stars" },
  { value: "galaxies", label: "Galaxies" },
  { value: "nebula", label: "Nebulae" },
  { value: "supernova", label: "Supernovae" },
  { value: "blackHole", label: "Black Holes" },
];

export const postTopicLabel = (value) => POST_TOPICS.find((t) => t.value === value)?.label || null;

// Posts carry no createdAt, but a MongoDB ObjectId starts with its creation time (seconds, hex).
export function postDate(post) {
  if (post.createdAt) return new Date(post.createdAt);
  const seconds = parseInt(String(post._id).slice(0, 8), 16);
  return Number.isNaN(seconds) ? null : new Date(seconds * 1000);
}

export const postAge = (post) => {
  const date = postDate(post);
  return date ? formatNewsDate(date) : "";
};
