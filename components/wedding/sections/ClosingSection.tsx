import { formatNumericDate } from "@/lib/format";
import { wedding } from "@/lib/wedding-config";
import { BotanicalSprig } from "../ui/BotanicalSprig";
import { Heart } from "../ui/Heart";
import { HeartDivider } from "../ui/HeartDivider";
import { Reveal } from "../ui/Reveal";

export function ClosingSection() {
  const { groom, bride, closing } = wedding;
  return (
    <footer aria-label="Closing message" className="paper px-8 pt-20 pb-16 text-center">
      <Reveal y={0}>
        <BotanicalSprig className="opacity-70" />
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-script mx-auto mt-6 max-w-xs text-[clamp(2.5rem,11vw,3.2rem)] leading-tight text-ink">
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
        <p className="font-script mt-6 text-[2.4rem] leading-none text-ink">
          {groom.name} <span className="text-antique">&amp;</span> {bride.name}
        </p>
        <p className="mt-3 font-sans text-[0.68rem] tracking-[0.3em] text-muted">
          {formatNumericDate(wedding.date.start)}
        </p>
        <Heart className="mx-auto mt-8 h-3 w-3 text-sage" />
      </Reveal>
    </footer>
  );
}
