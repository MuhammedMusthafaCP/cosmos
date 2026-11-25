import Avatar from "../ui/Avatar";
import { formatMessageTime } from "../utils/chatTime";

/**
 * One chat message. Own messages sit right in sky blue, others left in a dark card.
 * In a run of messages from the same person the name shows on the first and the avatar on the last.
 */
export default function MessageBubble({ message, showName, showAvatar, first }) {
  const { own, senderName, avatar, text, date } = message;
  return (
    <li className={`flex items-end gap-2 ${own ? "flex-row-reverse" : "flex-row"} ${first ? "mt-3" : "mt-0.5"}`}>
      <div className="w-8 shrink-0">
        {showAvatar && !own && <Avatar src={avatar} name={senderName} size="sm" />}
      </div>
      <div
        className={`min-w-0 max-w-[80%] rounded-2xl px-3.5 py-2 sm:max-w-md ${
          own ? "bg-sky-600 text-white" : "border border-white/10 bg-white/[0.06] text-gray-100"
        } ${own ? (showAvatar ? "rounded-br-md" : "") : showAvatar ? "rounded-bl-md" : ""}`}
      >
        {showName && !own && <p className="mb-0.5 text-xs font-semibold text-sky-300">{senderName}</p>}
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed [overflow-wrap:anywhere]">{text}</p>
        <time
          dateTime={date.toISOString()}
          className={`mt-0.5 block text-right text-[11px] ${own ? "text-sky-100/80" : "text-gray-500"}`}
        >
          {formatMessageTime(date)}
        </time>
      </div>
    </li>
  );
}
