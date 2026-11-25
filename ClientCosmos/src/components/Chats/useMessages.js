import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Message history for the open conversation: loads the newest page, "load earlier" prepends
 * older pages, and live messages are appended. Messages are de-duplicated by `_id`, so the
 * socket echo and the send acknowledgement can both call `append` safely.
 *
 * fetchPage({ before }) -> Promise<{ messages, hasMore }>; `conversationKey` resets everything.
 */
export default function useMessages({ conversationKey, fetchPage, getTime }) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const fetchRef = useRef(fetchPage);
  const timeRef = useRef(getTime);
  useEffect(() => {
    fetchRef.current = fetchPage;
    timeRef.current = getTime;
  });

  const load = useCallback(() => {
    let cancelled = false;
    setItems([]);
    setHasMore(false);
    if (!conversationKey) {
      setStatus("idle");
      return () => {};
    }
    setStatus("loading");
    fetchRef
      .current({})
      .then((page) => {
        if (cancelled) return;
        setItems(page.messages);
        setHasMore(page.hasMore);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [conversationKey]);

  useEffect(() => load(), [load]);

  const append = useCallback((message) => {
    setItems((current) => (current.some((m) => m._id === message._id) ? current : [...current, message]));
  }, []);

  const loadEarlier = useCallback(async () => {
    if (!items.length || loadingEarlier) return;
    setLoadingEarlier(true);
    try {
      const page = await fetchRef.current({ before: timeRef.current(items[0]) });
      setItems((current) => {
        const seen = new Set(current.map((m) => m._id));
        return [...page.messages.filter((m) => !seen.has(m._id)), ...current];
      });
      setHasMore(page.hasMore);
    } catch {
      /* keep the button so the user can retry */
    } finally {
      setLoadingEarlier(false);
    }
  }, [items, loadingEarlier]);

  return { items, hasMore, status, loadingEarlier, loadEarlier, append, retry: load };
}
