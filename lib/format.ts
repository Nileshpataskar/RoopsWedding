import { wedding } from "./wedding-config";

const tz = wedding.date.timeZone;

// An explicit locale and time zone keep server and client output identical,
// which avoids hydration mismatches.
export function formatLongDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatWeekday(iso: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long" }).format(
    new Date(iso),
  );
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatEventDateTime(iso: string) {
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
  return `${date}, ${formatTime(iso)}`;
}

/** Month, day and year as separate strings, e.g. for stacked typography. */
export function getDateParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return { month: get("month"), day: get("day"), year: get("year") };
}

export function formatNumericDate(iso: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
  return parts.replaceAll("/", " · ");
}
