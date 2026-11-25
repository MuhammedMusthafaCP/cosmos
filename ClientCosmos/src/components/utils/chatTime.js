import { format, isToday, isYesterday, differenceInCalendarDays } from "date-fns";

const valid = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Conversation list: "14:05", "Yesterday", "Tue", "12 Mar". */
export function formatListTime(value) {
  const date = valid(value);
  if (!date) return "";
  if (isToday(date)) return format(date, "p");
  if (isYesterday(date)) return "Yesterday";
  if (differenceInCalendarDays(new Date(), date) < 7) return format(date, "EEE");
  return format(date, "d MMM");
}

/** Time inside a message bubble. */
export const formatMessageTime = (value) => {
  const date = valid(value);
  return date ? format(date, "p") : "";
};

/** Day divider between messages: "Today", "Yesterday", "Tuesday, 12 March". */
export function formatDayLabel(value) {
  const date = valid(value);
  if (!date) return "";
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, differenceInCalendarDays(new Date(), date) > 300 ? "d MMMM yyyy" : "EEEE, d MMMM");
}

export const dayKey = (value) => {
  const date = valid(value);
  return date ? format(date, "yyyy-MM-dd") : "";
};
