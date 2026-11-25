import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** Full-screen image viewer. Esc, backdrop click or the close button dismiss it. */
export default function Lightbox({ src, alt, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image"}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <X className="h-6 w-6" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
