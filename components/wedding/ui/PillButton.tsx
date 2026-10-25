import type { ComponentPropsWithoutRef } from "react";

/**
 * Shared look for the royal-purple, gold-rimmed pill buttons and links. A band of
 * light sweeps across on hover (the `before:` utilities).
 */
export const pillClass =
  "relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-plum to-royal px-7 py-2.5 font-sans text-[0.72rem] font-medium uppercase tracking-[0.2em] text-paper shadow-[0_4px_14px_rgba(63,29,74,.28),inset_0_0_0_1px_rgba(214,173,92,.65)] transition duration-200 before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-[left] before:duration-700 hover:shadow-[0_6px_20px_rgba(63,29,74,.38),inset_0_0_0_1px_rgba(214,173,92,.9)] hover:before:left-[120%] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-plum disabled:cursor-not-allowed disabled:opacity-60";

export function PillButton({ className = "", ...props }: ComponentPropsWithoutRef<"button">) {
  return <button type="button" className={`${pillClass} ${className}`} {...props} />;
}
