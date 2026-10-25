/** Scalloped theatre swags with gold trim, beads and tassels across the top. */

const GOLD = "#d6ad5c";

function bezier(p0: number, p1: number, p2: number, p3: number, t: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

type Swag = { a: number; b: number; depth: number };

function swagPath({ a, b, depth }: Swag, top = 12) {
  const w = b - a;
  return `M${a} ${top} C ${a + w * 0.22} ${depth}, ${b - w * 0.22} ${depth}, ${b} ${top} C ${b - w * 0.3} ${depth * 0.52}, ${a + w * 0.3} ${depth * 0.52}, ${a} ${top} Z`;
}

/** The lower (outer) edge of a swag, where the gold trim runs. */
function trimPath({ a, b, depth }: Swag, top = 12) {
  const w = b - a;
  return `M${a} ${top} C ${a + w * 0.22} ${depth}, ${b - w * 0.22} ${depth}, ${b} ${top}`;
}

function foldPath({ a, b }: Swag, depth: number, top = 12) {
  const w = b - a;
  return `M${a + 4} ${top + 2} C ${a + w * 0.25} ${depth}, ${b - w * 0.25} ${depth}, ${b - 4} ${top + 2}`;
}

function beads({ a, b, depth }: Swag, top = 12) {
  const w = b - a;
  return Array.from({ length: 17 }, (_, i) => {
    const t = 0.06 + (i / 16) * 0.88;
    return {
      x: +bezier(a, a + w * 0.22, b - w * 0.22, b, t).toFixed(2),
      y: +(bezier(top, depth, depth, top, t) + 2.6).toFixed(2),
    };
  });
}

const FRONT: Swag[] = [0, 1, 2, 3].map((i) => ({ a: i * 100 - 6, b: (i + 1) * 100 + 6, depth: 98 }));
const BACK: Swag[] = [0, 1, 2, 3, 4].map((i) => ({ a: i * 100 - 56, b: i * 100 + 56, depth: 84 }));
const JUNCTIONS = [0, 100, 200, 300, 400];

function Tassel({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 18 C ${x - 2} 28, ${x + 2} 34, ${x} 42`} stroke={GOLD} strokeWidth="1.1" fill="none" />
      <circle cx={x} cy={43} r="2.6" fill="#d9bf94" stroke="#a88a5c" strokeWidth="0.5" />
      <path d={`M${x - 2.6} 45 L ${x - 5} 60 Q ${x} 62 ${x + 5} 60 L ${x + 2.6} 45 Z`} fill="#d6ba8c" stroke="#a88a5c" strokeWidth="0.5" />
      {[-3, -1.5, 0, 1.5, 3].map((dx) => (
        <line key={dx} x1={x + dx * 0.6} y1={47} x2={x + dx} y2={60} stroke="#a88a5c" strokeWidth="0.35" />
      ))}
      <circle cx={x} cy={14} r="7.5" fill="#e3cfae" stroke="#a88a5c" strokeWidth="0.6" />
      <circle cx={x} cy={14} r="4.5" fill="none" stroke="#a88a5c" strokeWidth="0.5" strokeDasharray="1 1.2" />
      <circle cx={x} cy={14} r="1.8" fill="#a88a5c" />
    </g>
  );
}

export function CurtainSwags({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 130" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="swag-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4e2259" />
          <stop offset="55%" stopColor="#66307a" />
          <stop offset="100%" stopColor="#7d4290" />
        </linearGradient>
        <linearGradient id="swag-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a1844" />
          <stop offset="100%" stopColor="#532663" />
        </linearGradient>
        <filter id="swag-shadow" x="-5%" y="-5%" width="110%" height="130%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" floodColor="#1e0a24" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#swag-shadow)">
        {BACK.map((s) => (
          <g key={`back-${s.a}`}>
            <path d={swagPath(s)} fill="url(#swag-back)" />
            <path d={foldPath(s, 62)} fill="none" stroke="#1e0a24" strokeOpacity="0.45" strokeWidth="0.7" />
            <path d={trimPath(s)} fill="none" stroke={GOLD} strokeWidth="0.8" />
          </g>
        ))}
      </g>

      {/* valance band */}
      <rect x="0" y="0" width="400" height="14" fill="#3a1844" />
      <line x1="0" y1="14" x2="400" y2="14" stroke={GOLD} strokeWidth="1" />
      <line x1="0" y1="10" x2="400" y2="10" stroke={GOLD} strokeWidth="0.4" strokeDasharray="2 2" />

      <g filter="url(#swag-shadow)">
        {FRONT.map((s) => (
          <g key={`front-${s.a}`}>
            <path d={swagPath(s)} fill="url(#swag-front)" />
            {[60, 70, 80].map((d) => (
              <path key={d} d={foldPath(s, d)} fill="none" stroke="#24102b" strokeOpacity="0.45" strokeWidth="0.8" />
            ))}
            {beads(s).map((p) => (
              <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="1.25" fill="#d8bd92" stroke="#a88a5c" strokeWidth="0.3" />
            ))}
          </g>
        ))}
      </g>
      {FRONT.map((s) => (
        <path key={`trim-${s.a}`} d={trimPath(s)} fill="none" stroke={GOLD} strokeWidth="1.1" />
      ))}

      {JUNCTIONS.map((x) => (
        <Tassel key={x} x={x} />
      ))}
    </svg>
  );
}
