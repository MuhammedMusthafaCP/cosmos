import Avatar from "../ui/Avatar";

/** One row in a conversation list: avatar, name, last-message preview, time and unread badge. */
export default function ChatListItem({ name, avatar, preview, meta, time, unread = 0, selected, onClick }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-current={selected ? "true" : undefined}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
          selected ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        <Avatar src={avatar} name={name} size="md" />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className={`truncate text-sm ${unread ? "font-bold text-white" : "font-semibold text-gray-100"}`}>
              {name}
            </span>
            {time && (
              <time className={`shrink-0 text-[11px] ${unread ? "text-sky-300" : "text-gray-500"}`}>{time}</time>
            )}
          </span>
          <span className="flex items-center justify-between gap-2">
            <span className={`block truncate text-xs ${unread ? "text-gray-200" : "text-gray-500"}`}>
              {preview || meta}
            </span>
            {unread > 0 && (
              <span
                aria-label={`${unread} unread`}
                className="grid h-5 min-w-[1.25rem] shrink-0 place-items-center rounded-full bg-sky-500 px-1.5 text-[11px] font-bold text-white"
              >
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </span>
          {preview && meta && <span className="block truncate text-[11px] text-gray-600">{meta}</span>}
        </span>
      </button>
    </li>
  );
}
