import { useState } from "react";

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-24 w-24 text-3xl",
};

/** Round avatar that falls back to initials when the image is missing or fails to load. */
function AvatarImage({ src, name, size, className }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const box = `${SIZES[size] || SIZES.md} shrink-0 rounded-full ${className}`;

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`${box} inline-flex items-center justify-center bg-indigo-600 font-semibold text-white`}
      >
        {initial}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={name ? `${name}'s avatar` : ""}
      className={`${box} object-cover`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

export default function Avatar({ src, name, size = "md", className = "" }) {
  // key resets the failed state when the image URL changes
  return <AvatarImage key={src} src={src} name={name} size={size} className={className} />;
}
