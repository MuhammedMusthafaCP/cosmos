import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../../config";

/**
 * One authenticated Socket.IO connection for a chat page. The server identifies the user from
 * the login cookie, so nothing about identity is sent from here.
 *
 * status: "connecting" | "connected" | "disconnected" | "unauthorized"
 * send(event, payload) resolves with the server's ack ({ ok, message?, error? }).
 */
export default function useChatSocket(enabled) {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    if (!enabled) return undefined;
    const s = io(API_URL, { withCredentials: true, transports: ["websocket", "polling"] });
    s.on("connect", () => setStatus("connected"));
    s.on("disconnect", () => setStatus("disconnected"));
    s.on("connect_error", (error) => setStatus(error.message === "unauthorized" ? "unauthorized" : "disconnected"));
    setSocket(s);
    return () => {
      s.close();
      setSocket(null);
    };
  }, [enabled]);

  const send = useCallback(
    (event, payload) =>
      new Promise((resolve) => {
        if (!socket?.connected) return resolve({ ok: false, error: "You're offline. Reconnecting…" });
        return socket.timeout(8000).emit(event, payload, (timedOut, response) => {
          resolve(timedOut ? { ok: false, error: "The server didn't respond. Please try again." } : response);
        });
      }),
    [socket]
  );

  return { socket, status, send };
}
