import { useLayoutEffect, useRef } from "react";
import { Send } from "lucide-react";

export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Message composer pinned to the bottom of the pane. Enter sends, Shift+Enter adds a new line,
 * the box grows with the text, and a counter appears close to the length limit.
 */
export default function Composer({ value, onChange, onSend, disabled = false, placeholder = "Write a message…", error }) {
  const ref = useRef(null);
  const empty = value.trim() === "";

  // Auto-grow up to ~6 lines.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [value]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!empty && !disabled) onSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-white/10 bg-white/[0.02] p-3 sm:px-5">
      {error && (
        <p role="alert" className="mb-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
      <div className="flex items-end gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Message</span>
          <textarea
            ref={ref}
            rows={1}
            value={value}
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="d-input !rounded-2xl max-h-36 min-h-[2.75rem] resize-none"
          />
        </label>
        <button
          type="button"
          onClick={onSend}
          disabled={empty || disabled}
          title="Send message"
          aria-label="Send message"
          className="d-btn-primary h-11 w-11 shrink-0 !p-0"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {value.length > MAX_MESSAGE_LENGTH - 300 && (
        <p className="mt-1 text-right text-[11px] text-gray-500">
          {value.length}/{MAX_MESSAGE_LENGTH}
        </p>
      )}
    </div>
  );
}

/** Replaces the composer when the user can't write here (not a member yet, session expired…). */
export function ComposerNotice({ children }) {
  return <div className="shrink-0 border-t border-white/10 bg-white/[0.02] p-3 sm:px-5">{children}</div>;
}
