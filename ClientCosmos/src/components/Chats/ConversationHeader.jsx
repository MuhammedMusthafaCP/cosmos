import { ArrowLeft, Info } from "lucide-react";
import Avatar from "../ui/Avatar";

/** Header of the open conversation: back button (phones), avatar, name, subtitle and a details button. */
export default function ConversationHeader({ name, avatar, subtitle, onBack, onDetails, detailsLabel }) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-white/[0.02] px-3 py-3 sm:px-5">
      <button
        type="button"
        onClick={onBack}
        title="Back to list"
        aria-label="Back to list"
        className="d-btn h-9 w-9 shrink-0 !p-0 md:hidden"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <Avatar src={avatar} name={name} size="md" />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold text-white sm:text-base">{name}</h2>
        {subtitle && <p className="truncate text-xs text-gray-400">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={onDetails}
        title={detailsLabel}
        aria-label={detailsLabel}
        className="d-btn h-9 w-9 shrink-0 !p-0"
      >
        <Info className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
