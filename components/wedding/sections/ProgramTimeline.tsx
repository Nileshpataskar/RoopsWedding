"use client";

import { motion } from "framer-motion";
import { Clock, Flame, Flower2, Gem, HeartHandshake, Sparkles, type LucideIcon } from "lucide-react";
import { formatEventDateTime } from "@/lib/format";
import { wedding, type ProgramEvent } from "@/lib/wedding-config";
import { SectionHeading } from "../ui/SectionHeading";

const events: readonly ProgramEvent[] = wedding.events;

// Icons for known event ids; anything else gets the sparkle.
const ICONS: Record<string, LucideIcon> = {
  engagement: Gem,
  haldi: Flower2,
  vidhi: Flame,
  ceremony: HeartHandshake,
};

export function ProgramTimeline() {
  return (
    <section aria-labelledby="timeline-title" className="paper-warm px-8 py-20">
      <SectionHeading id="timeline-title" icon={<Clock className="h-5 w-5" strokeWidth={1.3} />}>
        Program Timeline
      </SectionHeading>

      <div className="relative mx-auto mt-12 max-w-xs">
        <motion.span
          aria-hidden="true"
          className="absolute top-4 bottom-4 left-[17px] w-px origin-top bg-gradient-to-b from-champagne via-marigold to-plum"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <ol className="space-y-10">
          {events.map((event, index) => {
            const Icon = ICONS[event.id] ?? Sparkles;
            return (
              <motion.li
                key={event.id}
                className="relative pl-14"
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.12, ease: "easeOut" }}
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute top-0 left-0 flex h-[35px] w-[35px] items-center justify-center rounded-full bg-gradient-to-br from-plum to-royal text-[#f6dca0] shadow-[0_3px_10px_rgba(63,29,74,.3)] ring-2 ring-champagne/70 ring-offset-2 ring-offset-cream"
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 + index * 0.12 }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </motion.span>
                <h3 className="text-[1.35rem] font-semibold leading-tight text-royal">{event.title}</h3>
                <p className="mt-1 font-sans text-[0.68rem] uppercase tracking-[0.15em] text-antique">
                  <time dateTime={event.start}>{formatEventDateTime(event.start)}</time>
                </p>
                <p className="mt-1 text-[1.05rem] italic text-muted">&ldquo;{event.description}&rdquo;</p>
                {event.location && (
                  <p className="mt-0.5 text-sm text-muted">{event.location}</p>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
