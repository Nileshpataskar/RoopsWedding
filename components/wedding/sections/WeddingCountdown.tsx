"use client";

import { AnimatePresence, motion } from "framer-motion";
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
            {UNITS.map((unit) => {
              const value = parts ? String(parts[unit]).padStart(2, "0") : "--";
              return (
                <div key={unit} className="text-center">
                  <div className="relative flex aspect-[4/4.4] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-plum to-royal shadow-[0_6px_16px_rgba(63,29,74,.25),inset_0_0_0_1px_rgba(214,173,92,.6)]">
                    {/* fold line across the middle of the tile */}
                    <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-black/20" />
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={value}
                        className="font-serif text-[clamp(1.7rem,8vw,2.2rem)] font-medium tabular-nums text-[#f6dca0]"
                        initial={{ y: "-70%", opacity: 0, rotateX: 70 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: "70%", opacity: 0, rotateX: -70 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {value}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="mt-2 block font-sans text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                    {unit}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Reveal>
    </section>
  );
}
