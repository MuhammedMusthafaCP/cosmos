// Maps an article to one of the topic pages on the site. First match wins, so the
// most specific topics come first. Anything unmatched (launches, satellites, ISS,
// rockets, agencies) lands in "earth", the catch-all for near-Earth space news.
const RULES = [
  ["black holes", /\bblack[- ]holes?\b|\bevent horizon\b|\bquasars?\b/i],
  ["nebulas", /\bnebul(a|ae|as)\b|\bsupernova remnant\b/i],
  ["galaxies", /\bgalax(y|ies)\b|\bmilky way\b|\bandromeda\b|\bcosmic web\b/i],
  [
    "stars",
    /\bstars?\b|\bstellar\b|\bsupernovae?\b|\bpulsars?\b|\bmagnetars?\b|\bwhite dwarfs?\b|\bred giants?\b|\bexoplanets?\b|\bbinary system\b/i,
  ],
  [
    "solar system",
    /\b(mars|martian|jupiter|saturn|venus|mercury|uranus|neptune|pluto|europa|titan|enceladus|ganymede|io)\b|\bmoon\b|\blunar\b|\bartemis\b|\bapollo\b|\basteroids?\b|\bcomets?\b|\bmeteor(s|ites?)?\b|\bsolar (system|flare|storm|wind|eclipse)\b|\bthe sun\b|\bsolar orbiter\b|\bparker solar\b|\bplanets?\b/i,
  ],
];

function classifyTopic({ title = "", summary = "" }) {
  // Title is the strongest signal; fall back to the summary only if the title says nothing.
  for (const text of [title, `${title} ${summary}`]) {
    for (const [topic, pattern] of RULES) {
      if (pattern.test(text)) return topic;
    }
  }
  return "earth";
}

module.exports = { classifyTopic };
