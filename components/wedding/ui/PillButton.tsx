import type { ComponentPropsWithoutRef } from "react";

/** Shared look for the dark forest-green, pill-shaped buttons and links. */
export const pillClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-forest px-7 py-2.5 font-sans text-[0.72rem] font-medium uppercase tracking-[0.2em] text-paper transition duration-200 hover:bg-[#1f2f21] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-olive disabled:cursor-not-allowed disabled:opacity-60";

export function PillButton({ className = "", ...props }: ComponentPropsWithoutRef<"button">) {
  return <button type="button" className={`${pillClass} ${className}`} {...props} />;
}
