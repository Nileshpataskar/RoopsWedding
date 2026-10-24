"use client";

import { getTimeParts } from "@/lib/countdown";
import { useNow } from "@/lib/use-now";
import { wedding } from "@/lib/wedding-config";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const TARGET = new Date(wedding.date.start).getTime();
const UNITS = ["days", "hours", "minutes", "seconds"] as const;

export function WeddingCountdown() {
  const now = useNow();
  const parts = now === null ? null : getTimeParts(TARGET, now);

  return (
    <section aria-labelledby="countdown-title" className="paper px-5 py-20">
      <SectionHeading id="countdown-title">Counting Down to Forever</SectionHeading>

      <Reveal delay={0.15} className="mt-10">
        {parts?.done ? (
          <p className="text-center text-xl italic text-ink">
            The day has arrived — thank you for celebrating with us.
          </p>
        ) : (
          <div className="mx-auto grid max-w-[22rem] grid-cols-4 gap-2.5" role="timer" aria-live="off">
            {UNITS.map((unit) => (
              <div key={unit} className="text-center">
                <div className="flex aspect-[4/4.4] items-center justify-center rounded-md border border-line bg-cream/70">
                  <span className="font-serif text-[clamp(1.7rem,8vw,2.2rem)] font-medium tabular-nums text-ink">
                    {parts ? String(parts[unit]).padStart(2, "0") : "--"}
                  </span>
                </div>
                <span className="mt-2 block font-sans text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
