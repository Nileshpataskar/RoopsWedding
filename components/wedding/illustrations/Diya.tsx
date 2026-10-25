/**
 * A clay oil lamp with a flickering flame. `DiyaDefs` must be placed in the
 * host SVG's <defs> once, with the same `id` prefix passed to each `DiyaGlyph`.
 */

export function DiyaDefs({ id }: { id: string }) {
  return (
    <>
      <radialGradient id={`${id}-glow`}>
        <stop offset="0" stopColor="#ffd77a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-flame`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff3c4" />
        <stop offset="0.55" stopColor="#ffc24a" />
        <stop offset="1" stopColor="#e8662a" />
      </linearGradient>
    </>
  );
}

type DiyaGlyphProps = {
  id: string;
  x: number;
  y: number;
  scale?: number;
};

/** Drawn with its base at (x, y). */
export function DiyaGlyph({ id, x, y, scale = 1 }: DiyaGlyphProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse className="flame-glow" cx="0" cy="-12" rx="11" ry="12" fill={`url(#${id}-glow)`} />
      <path
        className="flame"
        d="M0 -19 C 3 -14, 3.6 -9.5, 0 -6.5 C -3.6 -9.5, -3 -14, 0 -19 Z"
        fill={`url(#${id}-flame)`}
      />
      <path
        d="M-10 -6 H10 C 9.5 -1, 5 2, 0 2 C -5 2, -9.5 -1, -10 -6 Z"
        fill="#b5562a"
        stroke="#8a3a17"
        strokeWidth="0.5"
      />
      <path d="M-10 -6 H10" stroke="#e6c06e" strokeWidth="1" strokeLinecap="round" />
      {[-5, 0, 5].map((dx) => (
        <circle key={dx} cx={dx} cy="-2.2" r="0.8" fill="#e6c06e" />
      ))}
    </g>
  );
}

/** A standalone diya icon. */
export function Diya({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg viewBox="-13 -24 26 28" aria-hidden="true" className={className}>
      <defs>
        <DiyaDefs id={id} />
      </defs>
      <DiyaGlyph id={id} x={0} y={0} />
    </svg>
  );
}
