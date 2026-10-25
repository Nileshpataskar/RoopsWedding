/**
 * A hanging string of marigolds (genda phool ladi) ending in a small bell.
 * The whole string sways from its top; `delay` desynchronises neighbours.
 */

const SPACING = 12;
const PETALS = Array.from({ length: 10 }, (_, i) => {
  const t = (i / 10) * Math.PI * 2;
  return { dx: +(4.6 * Math.cos(t)).toFixed(2), dy: +(4.6 * Math.sin(t)).toFixed(2) };
});
const COLORS = [
  { outer: "#e8892a", inner: "#f6b04a" },
  { outer: "#f2b233", inner: "#fbd36a" },
];

function Marigold({ cy, index }: { cy: number; index: number }) {
  const { outer, inner } = COLORS[index % COLORS.length];
  return (
    <g>
      {PETALS.map((p) => (
        <circle key={`${p.dx}-${p.dy}`} cx={12 + p.dx} cy={cy + p.dy} r="2.6" fill={outer} />
      ))}
      <circle cx="12" cy={cy} r="4.6" fill={outer} stroke="#c56a1c" strokeWidth="0.4" />
      <circle cx="12" cy={cy} r="2.6" fill={inner} />
      <circle cx="12" cy={cy} r="0.9" fill="#c56a1c" />
    </g>
  );
}

type MarigoldStringProps = {
  count: number;
  className?: string;
  /** Seconds to offset the sway animation. */
  delay?: number;
};

export function MarigoldString({ count, className = "", delay = 0 }: MarigoldStringProps) {
  const last = 8 + (count - 1) * SPACING;
  const height = last + 30;
  return (
    <svg
      viewBox={`0 0 24 ${height}`}
      aria-hidden="true"
      className={`sway ${className}`}
      style={{ animationDelay: `${-delay}s` }}
    >
      <line x1="12" y1="0" x2="12" y2={last + 8} stroke="#a97b2c" strokeWidth="0.6" />
      {Array.from({ length: count }, (_, i) => (
        <Marigold key={i} cy={8 + i * SPACING} index={i} />
      ))}
      {/* mango-leaf pair and a small brass bell */}
      <path d={`M12 ${last + 6} c -5 1 -9 5 -9 9 c 4 -1 8 -4 9 -9z`} fill="#4f6b3a" />
      <path d={`M12 ${last + 6} c 5 1 9 5 9 9 c -4 -1 -8 -4 -9 -9z`} fill="#5f7d46" />
      <path
        d={`M9 ${last + 22} C 9 ${last + 14}, 15 ${last + 14}, 15 ${last + 22} Z`}
        fill="#d6ad5c"
        stroke="#a97b2c"
        strokeWidth="0.5"
      />
      <circle cx="12" cy={last + 23.5} r="1.3" fill="#a97b2c" />
    </svg>
  );
}
