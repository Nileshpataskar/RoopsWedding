"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatEventDateTime } from "@/lib/format";
import { wedding, type ProgramEvent } from "@/lib/wedding-config";
import { SectionHeading } from "../ui/SectionHeading";

const events: readonly ProgramEvent[] = wedding.events;

export function ProgramTimeline() {
  return (
    <section aria-labelledby="timeline-title" className="paper-warm px-8 py-20">
      <SectionHeading id="timeline-title" icon={<Clock className="h-5 w-5" strokeWidth={1.3} />}>
        Program Timeline
      </SectionHeading>

      <div className="relative mx-auto mt-12 max-w-xs">
        <motion.span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-sage/60"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <ol className="space-y-9">
          {events.map((event, index) => (
            <motion.li
              key={event.id}
              className="relative pl-9"
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.55, delay: 0.1 + index * 0.1, ease: "easeOut" }}
            >
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full border-2 border-paper bg-olive ring-1 ring-sage"
              />
              <h3 className="text-[1.3rem] font-semibold leading-tight text-ink">{event.title}</h3>
              <p className="mt-1 font-sans text-[0.68rem] uppercase tracking-[0.15em] text-antique">
                <time dateTime={event.start}>{formatEventDateTime(event.start)}</time>
              </p>
              <p className="mt-1 text-[1.05rem] italic text-muted">&ldquo;{event.description}&rdquo;</p>
              {event.location && (
                <p className="mt-0.5 text-sm text-muted">{event.location}</p>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
