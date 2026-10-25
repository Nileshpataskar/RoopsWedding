import { wedding } from "@/lib/wedding-config";
import { formatTime, formatWeekday, getDateParts } from "@/lib/format";
import { HEART_PATH } from "../ui/Heart";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { SaveTheDateButton } from "./SaveTheDateButton";
import { ScratchHeart } from "./ScratchHeart";

const date = getDateParts(wedding.date.start);

/** Thin outlined heart carrying the day and time — a quiet companion detail. */
function OutlineHeartDetail() {
  return (
    <div className="relative mx-auto w-44" style={{ aspectRatio: "22.8 / 17.5" }}>
      <svg viewBox="0.6 3.8 22.8 17.5" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <path d={HEART_PATH} fill="none" stroke="#a97b2c" strokeWidth="0.18" />
      </svg>
      <p className="absolute inset-0 flex flex-col items-center justify-center pb-[10%] text-center leading-tight text-ink">
        <span className="font-sans text-[0.58rem] uppercase tracking-[0.25em] text-muted">
          {formatWeekday(wedding.date.start)}
        </span>
        <span className="text-lg">{formatTime(wedding.date.start)}</span>
      </p>
    </div>
  );
}

export function ScratchSection() {
  return (
    <section aria-labelledby="scratch-title" className="paper px-6 py-20">
      <SectionHeading id="scratch-title">Scratch to Reveal</SectionHeading>

      <Reveal delay={0.15} className="mt-10">
        <ScratchHeart>
          <p className="text-center leading-none">
            <span className="block font-sans text-[0.62rem] uppercase tracking-[0.35em] text-muted">
              Save our date
            </span>
            <span className="fleck-text mt-2 block font-serif text-[clamp(1.05rem,5vw,1.35rem)] font-semibold uppercase tracking-[0.18em]">
              {date.month}
            </span>
            <span className="font-script block text-[clamp(3.2rem,15vw,4.2rem)] leading-[1.1] text-royal">
              {date.day}
            </span>
            <span className="block font-serif text-lg tracking-[0.3em] text-ink">{date.year}</span>
          </p>
        </ScratchHeart>
      </Reveal>

      <Reveal delay={0.1} className="mt-6">
        <SaveTheDateButton />
      </Reveal>

      <Reveal delay={0.15} className="mt-12">
        <OutlineHeartDetail />
      </Reveal>
    </section>
  );
}
