import { useEffect } from "react";

/** Accessible confirm modal: Esc / backdrop click cancels, body scroll is locked while open. */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-950 p-6 text-center text-white shadow-2xl"
      >
        <h2 id="confirm-title" className="font-poppins text-lg font-semibold text-white">
          {title}
        </h2>
        {message && <p className="mt-2 text-sm text-gray-400">{message}</p>}
        <div className="mt-6 flex justify-center gap-3">
          <button
            autoFocus
            onClick={onConfirm}
            className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-gray-900 hover:bg-black"
            }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
