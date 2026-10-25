/** Fine-line rangoli mandala, drawn in `currentColor`. */

const OUTER_PETALS = Array.from({ length: 16 }, (_, i) => i * 22.5);
const INNER_PETALS = Array.from({ length: 12 }, (_, i) => i * 30);
const CORE_PETALS = Array.from({ length: 8 }, (_, i) => i * 45);
const DOTS = Array.from({ length: 32 }, (_, i) => i * 11.25);

export function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
    >
      <circle r="97" />
      <circle r="90" strokeDasharray="1.5 3" />
      {DOTS.map((a) => (
        <circle key={a} cy="-94" r="1.2" fill="currentColor" stroke="none" transform={`rotate(${a})`} />
      ))}
      {OUTER_PETALS.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 -58 C 12 -66, 12 -80, 0 -88 C -12 -80, -12 -66, 0 -58 Z" />
          <path d="M0 -64 C 5 -70, 5 -78, 0 -82 C -5 -78, -5 -70, 0 -64 Z" />
        </g>
      ))}
      <circle r="56" />
      {INNER_PETALS.map((a) => (
        <path
          key={a}
          transform={`rotate(${a})`}
          d="M0 -28 C 10 -36, 10 -48, 0 -54 C -10 -48, -10 -36, 0 -28 Z"
        />
      ))}
      <circle r="26" strokeDasharray="2 2.5" />
      {CORE_PETALS.map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M0 -6 C 5 -11, 5 -18, 0 -22 C -5 -18, -5 -11, 0 -6 Z" />
      ))}
      <circle r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}
