const lineProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Line-art gown. */
export function GownIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 64" aria-hidden="true" className={className} {...lineProps}>
      <path d="M19 4 c1 4 1 8 -1 12 M29 4 c-1 4 -1 8 1 12" />
      <path d="M18 16 c3 2 9 2 12 0 l1 8 c-4 2 -10 2 -14 0 z" />
      <path d="M17 24 C 12 36, 6 50, 4 60 C 16 63, 32 63, 44 60 C 42 50, 36 36, 31 24" />
      <path d="M24 26 C 22 38, 18 50, 16 61 M24 26 C 26 38, 30 50, 32 61" opacity="0.5" />
      <circle cx="24" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

/** Line-art suit jacket with bow tie. */
export function SuitIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 64" aria-hidden="true" className={className} {...lineProps}>
      <path d="M16 6 L24 14 L32 6 M20 10 l4 4 l4 -4" />
      <path d="M21 13 l3 2 l3 -2 l-1 3 l1 3 l-3 -2 l-3 2 l1 -3 z" />
      <path d="M16 6 C 10 8, 6 10, 5 14 L4 58 H44 L43 14 C 42 10, 38 8, 32 6" />
      <path d="M16 6 L20 30 L24 44 L28 30 L32 6" />
      <path d="M24 44 V58 M24 48 h0.1 M24 53 h0.1" strokeWidth="2" />
      <path d="M9 30 h7 M32 30 h7" opacity="0.5" />
    </svg>
  );
}
