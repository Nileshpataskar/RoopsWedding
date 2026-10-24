import { formatLongDate } from "@/lib/format";
import { wedding } from "@/lib/wedding-config";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { RsvpForm } from "./RsvpForm";

export function RsvpSection() {
  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="paper-warm px-7 py-20">
      <SectionHeading id="rsvp-title">Kindly Reply</SectionHeading>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-6 max-w-[19rem] text-center text-[1.12rem] leading-relaxed text-ink">
          We would be grateful if you could let us know whether you can join us, by{" "}
          <span className="whitespace-nowrap italic">{formatLongDate(wedding.rsvp.deadline)}</span>.
        </p>
      </Reveal>

      <Reveal delay={0.2} className="mt-10">
        <RsvpForm />
      </Reveal>
    </section>
  );
}
