import { useState } from "react";
import { ImageOff } from "lucide-react";

function Img({ src, alt, className, fallback, ...rest }) {
  const [failed, setFailed] = useState(false);
  if ((!src || failed) && fallback) return fallback(className);
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || "Image unavailable"}
        className={`flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-500 ${className}`}
      >
        <ImageOff className="h-8 w-8" />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />;
}

/**
 * <img> that shows a neutral placeholder instead of a broken-image glyph. Size it via className.
 * Pass `fallback={(className) => node}` to replace the default placeholder.
 */
export default function SafeImage({ src, alt = "", className = "", ...rest }) {
  return <Img key={src} src={src} alt={alt} className={className} {...rest} />;
}
