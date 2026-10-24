"use client";

import { CalendarHeart } from "lucide-react";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import { PillButton } from "../ui/PillButton";

/** Downloads an .ics event (Apple/Outlook) and offers a Google Calendar link. */
export function SaveTheDateButton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <PillButton onClick={downloadIcs} aria-label="Save the date — download a calendar event">
        <CalendarHeart className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
        Save the Date
      </PillButton>
      <a
        href={googleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-muted underline decoration-line underline-offset-4 transition hover:text-ink"
      >
        or add to Google Calendar
      </a>
    </div>
  );
}
