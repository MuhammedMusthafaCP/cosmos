// Display names and topic-page routes for the topic values stored on news items.
const TOPICS = {
  "solar system": { label: "Solar System", path: "/solarsystem" },
  stars: { label: "Stars", path: "/stars" },
  galaxies: { label: "Galaxies", path: "/galaxies" },
  nebulas: { label: "Nebulae", path: "/nebulas" },
  "black holes": { label: "Black Holes", path: "/blackholes" },
  earth: { label: "Earth & Orbit", path: null },
};

export const topicInfo = (topic) => TOPICS[topic] || { label: topic || "Space", path: null };
