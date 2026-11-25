import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { dayKey, formatDayLabel } from "../utils/chatTime";

const GROUP_GAP_MS = 5 * 60 * 1000;

// Day dividers + grouping: consecutive messages from one sender within 5 minutes form a group.
function buildRows(messages) {
  const rows = [];
  messages.forEach((message, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const newDay = !prev || dayKey(prev.date) !== dayKey(message.date);
    if (newDay) rows.push({ type: "day", key: `day-${dayKey(message.date)}`, label: formatDayLabel(message.date) });
    const joinsPrev = !newDay && prev.senderKey === message.senderKey && message.date - prev.date < GROUP_GAP_MS;
    const joinsNext =
      next &&
      dayKey(next.date) === dayKey(message.date) &&
      next.senderKey === message.senderKey &&
      next.date - message.date < GROUP_GAP_MS;
    rows.push({ type: "message", key: message.id, message, first: !joinsPrev, last: !joinsNext });
  });
  return rows;
}

/**
 * Scrollable message log. Stays pinned to the newest message unless the reader scrolled up,
 * keeps their place when older messages are loaded above, and offers a "latest" jump button.
 */
export default function MessageList({
  messages,
  status,
  hasMore,
  loadingEarlier,
  onLoadEarlier,
  onRetry,
  emptyTitle,
  emptyHint,
  showNames = false,
}) {
  const scroller = useRef(null);
  const pinned = useRef(true);
  const last = useRef({ firstId: null, lastId: null, height: 0 });
  const [away, setAway] = useState(false);
  const rows = useMemo(() => buildRows(messages), [messages]);

  const onScroll = () => {
    const el = scroller.current;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    pinned.current = nearBottom;
    setAway(!nearBottom);
  };

  const scrollToBottom = (behavior = "smooth") =>
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior });

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const firstId = messages[0]?.id ?? null;
    const lastId = messages[messages.length - 1]?.id ?? null;
    const before = last.current;

    if (before.firstId === null) {
      scrollToBottom("auto"); // first load of a conversation
    } else if (firstId !== before.firstId && lastId === before.lastId) {
      el.scrollTop += el.scrollHeight - before.height; // older messages added above: hold position
    } else if (lastId !== before.lastId && (pinned.current || messages[messages.length - 1].own)) {
      scrollToBottom();
    }
    last.current = { firstId, lastId, height: el.scrollHeight };
  }, [messages]);

  let body;
  if (status === "loading") {
    body = (
      <div className="space-y-3 p-4" aria-busy="true" aria-label="Loading messages">
        {[false, true, false, true].map((own, i) => (
          <div key={i} className={`flex animate-pulse ${own ? "justify-end" : ""}`}>
            <div className={`h-10 rounded-2xl ${own ? "w-1/3 bg-sky-600/30" : "w-1/2 bg-white/10"}`} />
          </div>
        ))}
      </div>
    );
  } else if (status === "error") {
    body = (
      <div role="alert" className="m-auto text-center">
        <p className="text-sm text-gray-300">We couldn&apos;t load the messages.</p>
        <button type="button" onClick={onRetry} className="d-btn mt-3">
          Try again
        </button>
      </div>
    );
  } else if (messages.length === 0) {
    body = (
      <div className="m-auto max-w-xs text-center">
        <p className="font-medium text-gray-200">{emptyTitle}</p>
        {emptyHint && <p className="mt-1 text-sm text-gray-500">{emptyHint}</p>}
      </div>
    );
  } else {
    body = (
      <>
        {hasMore && (
          <div className="flex justify-center pb-2">
            <button type="button" onClick={onLoadEarlier} disabled={loadingEarlier} className="d-btn !py-1.5 text-xs">
              {loadingEarlier ? "Loading…" : "Load earlier messages"}
            </button>
          </div>
        )}
        <ul role="log" aria-live="polite" aria-label="Messages">
          {rows.map((row) =>
            row.type === "day" ? (
              <li key={row.key} className="my-4 flex justify-center">
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  {row.label}
                </span>
              </li>
            ) : (
              <MessageBubble
                key={row.key}
                message={row.message}
                first={row.first}
                showName={showNames && row.first}
                showAvatar={row.last}
              />
            )
          )}
        </ul>
      </>
    );
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={scroller} onScroll={onScroll} className="flex h-full flex-col overflow-y-auto px-3 py-4 sm:px-5">
        {body}
      </div>
      {away && messages.length > 0 && (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          className="d-btn-primary absolute bottom-3 right-4 !px-3 !py-1.5 shadow-lg"
        >
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
          Latest
        </button>
      )}
    </div>
  );
}
