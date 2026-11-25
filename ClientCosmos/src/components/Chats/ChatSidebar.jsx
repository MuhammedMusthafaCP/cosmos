import { Link } from "react-router-dom";
import { MessageCircle, Search, Users, X } from "lucide-react";

const TABS = [
  { key: "personal", label: "Direct", to: "/chats", Icon: MessageCircle },
  { key: "community", label: "Communities", to: "/communitychats", Icon: Users },
];

/** Left pane: Direct/Communities switch, search box, optional sub-filter and action, then the list. */
export default function ChatSidebar({ active, search, onSearch, searchPlaceholder, subFilter, action, children }) {
  return (
    <>
      <div className="shrink-0 space-y-3 border-b border-white/10 p-3">
        <nav aria-label="Chat type" className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {TABS.map(({ key, label, to, Icon }) => {
            const selected = key === active;
            return (
              <Link
                key={key}
                to={to}
                aria-current={selected ? "page" : undefined}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  selected ? "bg-white text-black" : "text-gray-300 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <label className="relative block">
          <span className="sr-only">{searchPlaceholder}</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="d-input !rounded-full pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </label>

        {subFilter}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">{children}</div>

      {action && <div className="shrink-0 border-t border-white/10 p-3">{action}</div>}
    </>
  );
}

/** Small section label inside the list ("Recent", "People"). */
export function ListHeading({ children }) {
  return <h2 className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-widest text-gray-500">{children}</h2>;
}

/** Skeleton rows while a list loads. */
export function ListSkeleton({ rows = 6 }) {
  return (
    <ul aria-busy="true" aria-label="Loading" className="space-y-1 p-1">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex animate-pulse items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="h-10 w-10 rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 rounded bg-white/10" />
            <div className="h-3 w-3/4 rounded bg-white/5" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ListMessage({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      {Icon && <Icon className="h-8 w-8 text-gray-500" aria-hidden="true" />}
      <p className="font-medium text-gray-200">{title}</p>
      {children && <p className="text-sm text-gray-500">{children}</p>}
    </div>
  );
}
