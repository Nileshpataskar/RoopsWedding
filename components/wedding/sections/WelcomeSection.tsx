import { wedding } from "@/lib/wedding-config";
import { BotanicalSprig } from "../ui/BotanicalSprig";
import { HeartDivider } from "../ui/HeartDivider";
import { Reveal } from "../ui/Reveal";

export function WelcomeSection() {
  return (
    <section id="welcome" aria-label="Welcome message" className="paper-warm px-8 py-20">
      <Reveal y={0}>
        <BotanicalSprig className="mb-8 opacity-70" />
      </Reveal>
      <Reveal y={0} delay={0.1}>
        <HeartDivider />
      </Reveal>
      <Reveal delay={0.22}>
        <p className="mx-auto my-8 max-w-[19rem] text-center text-[1.2rem] leading-relaxed text-ink">
          {wedding.welcome}
        </p>
      </Reveal>
      <Reveal y={0} delay={0.34}>
        <HeartDivider />
      </Reveal>
    </section>
  );
}
