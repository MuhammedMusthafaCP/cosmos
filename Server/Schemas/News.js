const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    // Stable id from the upstream provider ("snapi:12345"); makes syncing idempotent.
    externalId: { type: String, required: true, unique: true },
    source: { type: String, default: "spaceflightnews" },
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: "", trim: true },
    url: { type: String, required: true },
    imageUrl: { type: String }, // image, or the poster/thumbnail when `video` is set
    // Present for video stories. "file" = direct .mp4/.webm, "embed" = hosted player (YouTube...).
    video: {
      kind: { type: String, enum: ["file", "embed"] },
      url: { type: String },
      _id: false,
    },
    newsSite: { type: String },
    authors: [{ type: String }],
    topic: {
      type: String,
      enum: ["solar system", "earth", "stars", "galaxies", "nebulas", "black holes"],
      default: "earth",
      index: true,
    },
    publishedAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// Shape returned to the client. `description`/`datePosted` keep the field names the UI already uses.
newsSchema.methods.toPublic = function toPublic() {
  return toPublic(this.toObject());
};

function toPublic(doc) {
  return {
    _id: doc._id,
    title: doc.title,
    description: doc.summary,
    imageUrl: doc.imageUrl || null,
    video: doc.video?.url ? { kind: doc.video.kind, url: doc.video.url } : null,
    url: doc.url,
    newsSite: doc.newsSite || null,
    authors: doc.authors || [],
    topic: doc.topic,
    publishedAt: doc.publishedAt,
  };
}

const News = mongoose.model("News", newsSchema);
News.toPublic = toPublic;

module.exports = News;
