import { Play } from "lucide-react";
import NewsImage from "./NewsPlaceholder";
import SafeImage from "./SafeImage";

const VIDEO_FILE = /\.(mp4|webm|ogv|mov)(\?|$)/i;

/** Normalised media for a picture-of-the-day record: { kind: "image"|"file"|"embed", src, poster }. */
export function apodMedia(apod) {
  if (apod.media_type === "video") {
    return {
      kind: VIDEO_FILE.test(apod.url) ? "file" : "embed",
      src: apod.url,
      poster: apod.thumbnail_url || apod.hdurl,
    };
  }
  return { kind: "image", src: apod.hdurl || apod.url };
}

/** Normalised media for a news story. Video stories keep their thumbnail as the poster. */
export function newsMedia(item) {
  if (item.video?.url) return { kind: item.video.kind, src: item.video.url, poster: item.imageUrl };
  return { kind: "image", src: item.imageUrl, item };
}

/** Small "Video" tag for cards that only show a thumbnail. */
export function VideoTag({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-sky-400/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-sky-300 ${className}`}
    >
      <Play className="h-3 w-3 fill-current" aria-hidden="true" /> Video
    </span>
  );
}

/**
 * Renders an image, a direct video file (native player) or an embedded player (YouTube...).
 * `className` is applied to the media element itself so callers control size and shape.
 */
export default function MediaView({ media, alt = "", className = "", loading = "lazy" }) {
  if (media.kind === "file") {
    return (
      <video
        className={`bg-black ${className}`}
        src={media.src}
        poster={media.poster}
        controls
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }
  if (media.kind === "embed") {
    return (
      <iframe
        className={`aspect-video bg-black ${className}`}
        src={media.src}
        title={alt}
        loading={loading}
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }
  if (media.item) return <NewsImage item={media.item} alt={alt} loading={loading} className={className} />;
  return <SafeImage src={media.src} alt={alt} loading={loading} className={className} />;
}
