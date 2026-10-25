import { wedding } from "@/lib/wedding-config";
import { GownIcon, SuitIcon } from "../illustrations/DressCodeIcons";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const GROUPS = [
  { id: "women", title: "For Women", text: wedding.dressCode.women, Icon: GownIcon },
  { id: "men", title: "For Men", text: wedding.dressCode.men, Icon: SuitIcon },
];

export function DressCodeSection() {
  return (
    <section aria-labelledby="dress-title" className="paper-warm px-8 py-20">
      <SectionHeading id="dress-title">Dress Code</SectionHeading>

      <div className="mx-auto mt-10 grid max-w-md gap-10 sm:grid-cols-2 sm:gap-8">
        {GROUPS.map(({ id, title, text, Icon }, index) => (
          <Reveal key={id} delay={0.1 + index * 0.12} className="text-center">
            <Icon className="mx-auto h-14 w-10 text-plum" />
            <h3 className="mt-3 font-sans text-[0.72rem] uppercase tracking-[0.25em] text-antique">
              {title}
            </h3>
            <p className="mx-auto mt-2 max-w-[17rem] text-[1.08rem] leading-relaxed text-ink">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
