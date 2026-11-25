// Dev-only: fills the database with realistic demo users and posts so the UI has something to show.
//   docker compose -f docker-compose.dev.yml exec server node scripts/seed.js
// Safe to re-run: it removes the posts/users it created before inserting them again.
// Also removes leftover "[e2e]" test posts (pass --keep-e2e to leave them).
// Pass --reset-posts to delete ALL existing posts first, so only the demo posts remain.
// Also replaces any cached picture-of-the-day that points at a website asset instead of a photo.
// Images live in ClientCosmos/public/seed-images and are referenced by relative path.
const mongoose = require("mongoose");
const { mongoUri } = require("../config/env");
const User = require("../Schemas/Users");
const Profile = require("../Schemas/Profile");
const Post = require("../Schemas/Posts");
const Apod = require("../Schemas/APOD");

const SEED_DOMAIN = "@seed.cosmos.dev";

const PEOPLE = [
  { name: "Aarav Menon", slug: "aarav", bio: "Backyard astrophotographer from Kochi. Chasing deep-sky objects one stack at a time." },
  { name: "Elena Petrova", slug: "elena", bio: "Planetary imaging nerd. Webcam, barlow, patience." },
  { name: "Marcus Webb", slug: "marcus", bio: "Amateur astronomer, Bortle 3 skies, Dobsonian enthusiast." },
  { name: "Sofia Alvarez", slug: "sofia", bio: "Astrophysics student. I read arXiv so you don't have to." },
  { name: "Kenji Watanabe", slug: "kenji", bio: "Wide-field Milky Way and night sky timelapses." },
  { name: "Priya Nair", slug: "priya", bio: "Space educator. Making the universe less intimidating." },
];

const img = (f) => `/seed-images/${f}`;

// [personSlug, topic, image, caption, likedBy count, comments[[personSlug, text]]]
const POSTS = [
  ["aarav", "nebula", "orion-nebula.jpg",
    "Orion Nebula (M42) from my balcony in Kochi. 60 x 30s subs on a small refractor, stacked in Siril. The core blows out fast, so I blended in a short exposure for the Trapezium.",
    24, [["marcus", "The Trapezium detail is excellent. Did you use a separate short stack for it?"], ["priya", "Still amazes me that this is a stellar nursery you can spot with your naked eye."], ["elena", "Great colour balance. Not oversaturated, which is rare."]]],
  ["elena", "solarsystem", "jupiter.jpg",
    "Jupiter near opposition last night. Seeing was steady for about ten minutes, so I grabbed 4,000 frames and kept the best 15%. The Great Red Spot and two festoons are clear.",
    31, [["kenji", "That belt detail is sharp. What barlow were you running?"], ["aarav", "Opposition season is the best time of year. Saving this for reference."]]],
  ["marcus", "galaxies", "andromeda.jpg",
    "Andromeda (M31) in an evening of hydrogen-alpha plus RGB. 2.5 million light years away, and the dust lanes are still obvious. Two hours total integration.",
    18, [["sofia", "Fun fact: it is heading toward us at ~110 km/s. Merger with the Milky Way in about 4–5 billion years."], ["priya", "Sharing this with my class tomorrow. The dust lanes really sell the scale."]]],
  ["kenji", "galaxies", "milky-way.jpg",
    "Milky Way arch over a dark site, 12-panel panorama at 14mm. The galactic core was low on the horizon, but the dust structure is clear even in a single frame.",
    42, [["aarav", "Dark skies like this are a dream from where I live. Beautiful."], ["marcus", "Which site was this? Bortle 2?"], ["kenji", "Bortle 2, about three hours from the nearest city."]]],
  ["sofia", "nebula", "pillars.jpg",
    "Revisiting the Pillars of Creation in the Eagle Nebula. Each pillar is several light years tall and the tips are where new stars are forming inside dense gas globules.",
    27, [["priya", "Perfect explainer image. The pillars' scale is hard to grasp."], ["elena", "I love how much structure there is in the dust."]]],
  ["priya", "solarsystem", "saturn.jpg",
    "Saturn at equinox: the rings turn edge-on and almost vanish. Happens about every 15 years, and the moons line up in a neat row.",
    15, [["sofia", "The thin rings make it easier to spot Titan and the small inner moons."]]],
  ["marcus", "star", "pleiades.jpg",
    "The Pleiades (M45) with the blue reflection nebulosity around the brightest stars. Not leftover birth cloud, just a dust cloud the cluster is passing through.",
    20, [["kenji", "Naked-eye object that rewards a telescope. Great capture."], ["aarav", "The blue haze is so subtle. How long did you integrate?"]]],
  ["aarav", "supernova", "crab-nebula.jpg",
    "The Crab Nebula, remnant of the supernova recorded by astronomers in 1054 AD. At its heart is a pulsar spinning about 30 times per second.",
    33, [["sofia", "Visible in daylight for weeks in 1054. Imagine seeing that."], ["priya", "A pulsar spinning 30 times a second. Wild."]]],
  ["elena", "home", "moon.jpg",
    "Full Moon, 200-panel mosaic stitched from video frames. The ray system around Tycho in the south is the standout feature at full phase.",
    38, [["marcus", "Sharp across the whole disk. The mosaic stitching is seamless."], ["kenji", "Tycho's rays always steal the show at full moon."]]],
  ["sofia", "solarsystem", "mars.jpg",
    "Valles Marineris on Mars: a canyon system over 4,000 km long, roughly the width of the continental US. Earth's Grand Canyon would fit inside a side branch.",
    22, [["priya", "That comparison always lands with students."], ["aarav", "Olympus Mons next, please."]]],
  ["kenji", "solarsystem", "eclipse.jpg",
    "Totality during a total solar eclipse. The corona's streamers reached far beyond the Sun's disk for about two minutes. Nothing prepares you for how it feels.",
    47, [["elena", "Total eclipse is on my bucket list. Where was this taken?"], ["sofia", "The corona structure follows the magnetic field. Gorgeous."]]],
  ["priya", "star", "orion-nebula.jpg",
    "Beginner tip: find Orion's belt, look just below it, and the fuzzy 'star' in the sword is a nebula 1,300 light years away. Binoculars are enough to see it.",
    29, [["aarav", "This is how I got into the hobby. Binoculars first, always."], ["marcus", "Great beginner pointer."]]],
];

(async () => {
  await mongoose.connect(mongoUri);
  const keepE2E = process.argv.includes("--keep-e2e");

  // 1. remove earlier seed data
  const old = await Profile.find({ email: { $regex: `${SEED_DOMAIN}$` } }).select("_id");
  const oldIds = old.map((p) => p._id);
  const removedPosts = await Post.deleteMany({ createdBy: { $in: oldIds } });
  await Profile.deleteMany({ _id: { $in: oldIds } });
  await User.deleteMany({ email: { $regex: `${SEED_DOMAIN}$` } });

  if (!keepE2E) {
    const e2e = await Post.deleteMany({ caption: /^\[e2e\]/i });
    console.log(`Removed ${e2e.deletedCount} leftover [e2e] test posts`);
  }

  if (process.argv.includes("--reset-posts")) {
    const all = await Post.deleteMany({});
    console.log(`Removed ${all.deletedCount} existing posts (--reset-posts)`);
  }

  // Picture of the day: the server falls back to the latest stored one when NASA is unreachable.
  await Apod.deleteMany({ $or: [{ url: /wp-content\/themes|logo/i }, { title: "NASA Science" }] });
  await Apod.deleteMany({ date: "2026-01-01" });
  await Apod.create({
    date: "2026-01-01",
    title: "The Orion Nebula in Visible and Infrared Light",
    copyright: "NASA, ESA, M. Robberto (STScI/ESA)",
    media_type: "image",
    service_version: "v1",
    url: "/seed-images/orion-nebula.jpg",
    hdurl: "/seed-images/orion-nebula.jpg",
    explanation:
      "The Orion Nebula is the closest large star-forming region to Earth, about 1,350 light years away. Visible to the naked eye as the fuzzy middle star in Orion's sword, it is a stellar nursery where gas and dust collapse into new stars. At its centre sit the four bright Trapezium stars, whose intense ultraviolet light carves out the glowing cavity around them. Sample entry for development: the server replaces it with the real picture of the day whenever NASA is reachable.",
  });

  // 2. people
  const people = {};
  for (const p of PEOPLE) {
    const email = `${p.slug}${SEED_DOMAIN}`;
    const user = await User.create({ name: p.name, email });
    people[p.slug] = await Profile.create({ name: p.name, email, bio: p.bio, user_id: user._id });
  }
  const everyone = Object.values(people);

  // 3. posts
  let n = 0;
  for (const [slug, topic, file, caption, likeCount, comments] of POSTS) {
    const author = people[slug];
    const likes = Array.from({ length: likeCount }, () => new mongoose.Types.ObjectId());
    const post = await Post.create({
      name: author.name,
      caption,
      image: img(file),
      topic,
      likes,
      comments: comments.map(([who, comment]) => ({ name: people[who].name, comment })),
      createdBy: author._id,
    });
    author.posts.push(post._id);
    n += 1;
  }
  await Promise.all(everyone.map((p) => p.save()));

  console.log(`Replaced ${removedPosts.deletedCount} old seed posts. Created ${everyone.length} users and ${n} posts.`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
