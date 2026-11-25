import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Modal surface used by chat screens. `side` shows a right-hand drawer, otherwise a centred dialog.
 * Esc and backdrop click close it; the content scrolls inside the panel.
 */
export default function Sheet({ open, title, onClose, side = false, children }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    panelRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCloseRef.current?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className={`fixed inset-0 z-[90] flex ${side ? "justify-end" : "items-center justify-center p-4"}`}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={panelRef}
        className={`relative flex flex-col focus:outline-none border border-white/10 bg-neutral-950 text-white shadow-2xl ${
          side
            ? "h-full w-full max-w-md"
            : "max-h-[90dvh] w-full max-w-lg rounded-xl"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
          <h2 className="min-w-0 truncate font-poppins text-lg font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            aria-label="Close"
            className="d-btn h-9 w-9 shrink-0 !p-0"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
