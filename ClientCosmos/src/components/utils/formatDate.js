import { format, formatDistanceToNowStrict } from "date-fns";

// "25 Nov 2026" for anything older than a week, "3 hours ago" for fresh stories.
export function formatNewsDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "";
  const ageMs = Date.now() - date.getTime();
  if (ageMs >= 0 && ageMs < 7 * 24 * 60 * 60 * 1000) {
    return `${formatDistanceToNowStrict(date)} ago`;
  }
  return format(date, "d MMM yyyy");
}
