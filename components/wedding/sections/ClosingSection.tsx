import { formatNumericDate } from "@/lib/format";
import { wedding } from "@/lib/wedding-config";
import { Diya } from "../illustrations/Diya";
import { BotanicalSprig } from "../ui/BotanicalSprig";
import { Heart } from "../ui/Heart";
import { HeartDivider } from "../ui/HeartDivider";
import { Reveal } from "../ui/Reveal";

export function ClosingSection() {
  const { groom, bride, closing } = wedding;
  return (
    <footer aria-label="Closing message" className="paper px-8 pt-20 pb-16 text-center">
      <Reveal y={0}>
        <BotanicalSprig className="opacity-80" />
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-script mx-auto mt-6 max-w-xs text-[clamp(2.5rem,11vw,3.2rem)] leading-tight text-royal">
          {closing.heading}
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mx-auto mt-5 max-w-[18rem] text-[1.1rem] leading-relaxed text-muted">
          {closing.message}
        </p>
      </Reveal>
      <Reveal y={0} delay={0.3}>
        <HeartDivider className="mt-10" />
        <p className="font-script mt-6 text-[2.4rem] leading-none text-royal">
          {groom.name} <span className="gold-shimmer px-1">&amp;</span> {bride.name}
        </p>
        <div className="mt-3 flex items-end justify-center gap-4">
          <Diya id="closing-diya-left" className="h-8 w-8 shrink-0" />
          <p className="pb-1 font-sans text-[0.68rem] tracking-[0.3em] text-muted">
            {formatNumericDate(wedding.date.start)}
          </p>
          <Diya id="closing-diya-right" className="h-8 w-8 shrink-0" />
        </div>
        <Heart className="mx-auto mt-8 h-3 w-3 text-plum" />
      </Reveal>
    </footer>
  );
}
