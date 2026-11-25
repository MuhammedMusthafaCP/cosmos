import { Orbit, Globe, Star, Sparkles, Cloud, CircleDot } from "lucide-react";
import SafeImage from "./SafeImage";

const TOPIC_STYLES = {
  "solar system": { Icon: Orbit, gradient: "from-amber-900/60 via-gray-900 to-gray-950" },
  earth: { Icon: Globe, gradient: "from-sky-900/60 via-gray-900 to-gray-950" },
  stars: { Icon: Star, gradient: "from-yellow-900/50 via-gray-900 to-gray-950" },
  galaxies: { Icon: Sparkles, gradient: "from-violet-900/60 via-gray-900 to-gray-950" },
  nebulas: { Icon: Cloud, gradient: "from-fuchsia-900/50 via-gray-900 to-gray-950" },
  "black holes": { Icon: CircleDot, gradient: "from-indigo-900/60 via-gray-900 to-black" },
};

/** Shown instead of a story image when it is missing or the publisher blocks hotlinking. */
export function NewsPlaceholder({ topic, site, compact = false, className = "" }) {
  const { Icon, gradient } = TOPIC_STYLES[topic] || TOPIC_STYLES.earth;
  return (
    <div
      role="img"
      aria-label={site ? `${site} story` : "News story"}
      className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br text-white/50 ${gradient} ${className}`}
    >
      <Icon className="h-8 w-8" aria-hidden="true" />
      {site && !compact && (
        <span className="max-w-full truncate px-2 text-center text-xs font-medium uppercase tracking-widest">
          {site}
        </span>
      )}
    </div>
  );
}

/** <SafeImage> for a news item, with the themed placeholder as fallback. */
export default function NewsImage({ item, compact = false, className = "", ...rest }) {
  return (
    <SafeImage
      src={item.imageUrl}
      className={className}
      referrerPolicy="no-referrer"
      fallback={(cls) => <NewsPlaceholder topic={item.topic} site={item.newsSite} compact={compact} className={cls} />}
      {...rest}
    />
  );
}
