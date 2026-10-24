import { wedding } from "./wedding-config";

function toIcsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

const title = `Wedding of ${wedding.groom.name} & ${wedding.bride.name}`;
const location = `${wedding.venue.name}, ${wedding.venue.address}`;

export function buildIcs(stamp: Date) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RoopsWedding//Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${toIcsDate(wedding.date.start)}-${wedding.groom.name}-${wedding.bride.name}@roopswedding`,
    `DTSTAMP:${toIcsDate(stamp.toISOString())}`,
    `DTSTART:${toIcsDate(wedding.date.start)}`,
    `DTEND:${toIcsDate(wedding.date.end)}`,
    `SUMMARY:${escapeIcs(title)}`,
    `LOCATION:${escapeIcs(location)}`,
    `DESCRIPTION:${escapeIcs(wedding.welcome)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

/** Downloads an .ics file; call only from a user event handler. */
export function downloadIcs() {
  const blob = new Blob([buildIcs(new Date())], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${wedding.groom.name}-${wedding.bride.name}-wedding.ics`.toLowerCase();
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toIcsDate(wedding.date.start)}/${toIcsDate(wedding.date.end)}`,
    location,
    details: wedding.welcome,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
