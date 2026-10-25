import type { ReactNode } from "react";
import { Mandala } from "../illustrations/Mandala";
import { HeartDivider } from "./HeartDivider";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  id?: string;
  children: ReactNode;
  icon?: ReactNode;
};

/**
 * Script heading with an optional line-art icon above, a heart divider below,
 * and a faint, slowly turning rangoli behind it.
 */
export function SectionHeading({ id, children, icon }: SectionHeadingProps) {
  return (
    <div className="relative isolate text-center">
      <Reveal
        y={0}
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-56 -translate-x-1/2 -translate-y-1/2 text-champagne/30"
      >
        <Mandala className="spin-slow block w-full" />
      </Reveal>
      {icon && (
        <Reveal y={8} className="mb-2 flex justify-center text-plum">
          {icon}
        </Reveal>
      )}
      <Reveal y={12}>
        <h2
          id={id}
          className="font-script text-[clamp(2.6rem,11vw,3.4rem)] leading-tight text-royal"
        >
          {children}
        </h2>
      </Reveal>
      <Reveal delay={0.12} y={0}>
        <HeartDivider className="mt-2" />
      </Reveal>
    </div>
  );
}
