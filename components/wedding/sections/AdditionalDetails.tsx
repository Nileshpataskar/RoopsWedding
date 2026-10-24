import { Fragment } from "react";
import { wedding } from "@/lib/wedding-config";
import { BotanicalSprig } from "../ui/BotanicalSprig";
import { HeartDivider } from "../ui/HeartDivider";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

/** Supplementary information; renders nothing when no details are configured. */
export function AdditionalDetails() {
  const details = wedding.details;
  if (details.length === 0) return null;

  return (
    <section aria-labelledby="details-title" className="paper px-8 py-20">
      <SectionHeading id="details-title">Good to Know</SectionHeading>

      <div className="mx-auto mt-10 max-w-sm text-center">
        {details.map((detail, index) => (
          <Fragment key={detail.id}>
            {index > 0 && <HeartDivider width="w-16" className="my-8 opacity-70" />}
            <Reveal delay={0.08}>
              <h3 className="text-[1.35rem] font-semibold text-ink">{detail.title}</h3>
              <p className="mt-2 text-[1.06rem] leading-relaxed text-muted">{detail.description}</p>
            </Reveal>
          </Fragment>
        ))}
      </div>

      <BotanicalSprig className="mt-12 opacity-60" />
    </section>
  );
}
