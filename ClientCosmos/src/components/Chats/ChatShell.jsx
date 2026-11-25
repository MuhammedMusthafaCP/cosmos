import { WifiOff } from "lucide-react";
import SiteLayout from "../layout/SiteLayout";

const BANNERS = {
  connecting: "Connecting…",
  disconnected: "You're offline. Trying to reconnect…",
  unauthorized: "Your session has expired. Please log in again to send messages.",
};

/**
 * Frame shared by the personal and community chat pages: the site header, then a two-pane card
 * (conversation list + open conversation). On phones only one pane shows at a time.
 */
export default function ChatShell({ valid, userData, title, hasSelection, connection, sidebar, children }) {
  const banner = BANNERS[connection];
  return (
    <SiteLayout valid={valid} userData={userData} footer={false}>
      <h1 className="sr-only">{title}</h1>
      <div className="d-card flex h-[calc(100dvh-8rem)] min-h-[30rem] flex-col overflow-hidden !rounded-2xl">
        {banner && (
          <div
            role="status"
            className="flex shrink-0 items-center justify-center gap-2 border-b border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-200"
          >
            <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
            {banner}
          </div>
        )}
        <div className="flex min-h-0 flex-1">
          <aside
            aria-label="Conversations"
            className={`${
              hasSelection ? "hidden md:flex" : "flex"
            } min-h-0 w-full shrink-0 flex-col border-r border-white/10 md:w-80 lg:w-96`}
          >
            {sidebar}
          </aside>
          <section
            aria-label="Conversation"
            className={`${hasSelection ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-1 flex-col`}
          >
            {children}
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
