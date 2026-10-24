/**
 * A long side curtain, gathered by a gold tieback and flaring at the floor.
 * Drawn as the left drape; the right one is mirrored by the caller. The SVG
 * stretches vertically (preserveAspectRatio="none") so it spans any hero height.
 */

const GOLD = "#c6a779";

const OUTLINE = "M0 0 H60 C 57 200, 47 420, 30 600 C 40 700, 53 860, 58 1000 H0 Z";
const INNER_EDGE = "M60 0 C 57 200, 47 420, 30 600 C 40 700, 53 860, 58 1000";
const FOLDS = [
  "M12 0 C 11 220, 8 450, 6 600 C 8 720, 10 860, 11 1000",
  "M24 0 C 23 220, 17 450, 13 600 C 18 720, 22 860, 24 1000",
  "M36 0 C 35 220, 27 450, 20 600 C 27 720, 34 860, 37 1000",
  "M48 0 C 46 220, 37 450, 26 600 C 35 720, 44 860, 49 1000",
];

export function CurtainDrape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="drape-folds" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e6cfc1" />
          <stop offset="0.12" stopColor="#f8ede4" />
          <stop offset="0.26" stopColor="#e2c7b8" />
          <stop offset="0.42" stopColor="#f6eadf" />
          <stop offset="0.58" stopColor="#e4cabc" />
          <stop offset="0.74" stopColor="#f7ece2" />
          <stop offset="0.9" stopColor="#e1c6b7" />
          <stop offset="1" stopColor="#f2e2d6" />
        </linearGradient>
      </defs>
      <path d={OUTLINE} fill="url(#drape-folds)" />
      {FOLDS.map((d) => (
        <path key={d} d={d} fill="none" stroke="#cfae9b" strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={INNER_EDGE} fill="none" stroke={GOLD} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d={INNER_EDGE} transform="translate(-3 0)" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.8" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />

      {/* gold rope tieback with tassel */}
      <path d="M0 592 C 14 586, 28 588, 36 598 C 28 610, 14 612, 0 606" fill="#d9bf94" stroke="#a88a5c" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      <path d="M33 602 C 35 615, 33 625, 34 634" fill="none" stroke="#a88a5c" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M30 634 L 38 634 L 41 660 Q 34 664 27 660 Z" fill="#d6ba8c" stroke="#a88a5c" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
