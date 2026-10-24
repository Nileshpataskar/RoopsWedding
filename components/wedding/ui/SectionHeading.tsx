import type { ReactNode } from "react";
import { HeartDivider } from "./HeartDivider";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  id?: string;
  children: ReactNode;
  icon?: ReactNode;
};

/** Script heading with an optional line-art icon above and a heart divider below. */
export function SectionHeading({ id, children, icon }: SectionHeadingProps) {
  return (
    <div className="text-center">
      {icon && (
        <Reveal y={8} className="mb-2 flex justify-center text-olive">
          {icon}
        </Reveal>
      )}
      <Reveal y={12}>
        <h2
          id={id}
          className="font-script text-[clamp(2.6rem,11vw,3.4rem)] leading-tight text-ink"
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
