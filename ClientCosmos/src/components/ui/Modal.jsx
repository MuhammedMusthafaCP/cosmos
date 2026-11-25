import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

const WIDTHS = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

/**
 * Accessible modal: backdrop click / Esc / close button dismiss, body scroll is locked,
 * and the panel never exceeds the viewport height (body scrolls internally).
 * `footer` is pinned below the scrolling body.
 */
export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => onClose?.()} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex max-h-[90vh] w-full ${WIDTHS[size] || WIDTHS.md} flex-col rounded-xl border border-white/10 bg-neutral-950 text-white shadow-2xl focus:outline-none`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <h2 id={titleId} className="font-poppins text-lg font-bold uppercase tracking-wide">
            {title}
          </h2>
          <button type="button" onClick={() => onClose?.()} aria-label="Close" className="d-btn !p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-white/10 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
