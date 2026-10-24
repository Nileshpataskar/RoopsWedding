/**
 * Symmetrical formal garden: hedges, cypress topiaries, stone plinths with
 * flower urns, a tiered fountain on the central axis, and rose bushes framing
 * the foreground.
 */

const STONE = "#e9dfcf";
const STONE_SHADE = "#cdbfa8";
const STONE_LINE = "#b6a68c";

type Rose = { x: number; y: number; r: number; color: string };

const ROSE_COLORS = ["#e7bfb4", "#dca39a", "#f3e4d6", "#e9c6bb", "#d9988f"];

// Deterministic rose positions for the left bush; the right bush mirrors them.
const LEFT_ROSES: Rose[] = [
  { x: 14, y: 248, r: 9 },
  { x: 34, y: 238, r: 8 },
  { x: 52, y: 252, r: 9.5 },
  { x: 22, y: 266, r: 10 },
  { x: 46, y: 272, r: 8.5 },
  { x: 68, y: 266, r: 8 },
  { x: 8, y: 284, r: 9 },
  { x: 32, y: 288, r: 10 },
  { x: 60, y: 290, r: 9 },
  { x: 84, y: 284, r: 7.5 },
  { x: 76, y: 248, r: 6.5 },
].map((r, i) => ({ ...r, color: ROSE_COLORS[i % ROSE_COLORS.length] }));

const LEFT_LEAVES = [
  { x: 4, y: 236, a: -30 },
  { x: 24, y: 228, a: -60 },
  { x: 48, y: 232, a: -120 },
  { x: 66, y: 240, a: -20 },
  { x: 86, y: 260, a: 10 },
  { x: 96, y: 278, a: 20 },
  { x: 40, y: 258, a: 30 },
  { x: 2, y: 268, a: 200 },
  { x: 72, y: 280, a: 60 },
];

function RoseBloom({ x, y, r, color }: Rose) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} stroke="#b9877d" strokeWidth="0.4" />
      <path
        d={`M${x} ${y} m ${-r * 0.15} 0 a ${r * 0.2} ${r * 0.2} 0 1 1 ${r * 0.3} 0 a ${r * 0.4} ${r * 0.4} 0 1 1 ${-r * 0.7} 0 a ${r * 0.6} ${r * 0.6} 0 1 1 ${r * 1.15} ${r * 0.05}`}
        fill="none"
        stroke="#b58075"
        strokeOpacity="0.65"
        strokeWidth="0.6"
      />
    </g>
  );
}

function Leaf({ x, y, a }: { x: number; y: number; a: number }) {
  return (
    <path
      d="M0 0 C 5 -6, 13 -6, 18 0 C 13 6, 5 6, 0 0 Z"
      transform={`translate(${x} ${y}) rotate(${a})`}
      fill="#7c8b5e"
      stroke="#5d6b45"
      strokeWidth="0.4"
    />
  );
}

function RoseBush() {
  return (
    <g>
      <ellipse cx="44" cy="276" rx="56" ry="34" fill="#6b7b51" />
      {LEFT_LEAVES.map((l) => (
        <Leaf key={`${l.x}-${l.y}`} {...l} />
      ))}
      {LEFT_ROSES.map((r) => (
        <RoseBloom key={`${r.x}-${r.y}`} {...r} />
      ))}
    </g>
  );
}

function Cypress({ x, base, h, w }: { x: number; base: number; h: number; w: number }) {
  const top = base - h;
  const shape = (s: number) =>
    `M${x} ${top} C ${x + (w * s) / 2} ${top + h * 0.35}, ${x + (w * s) / 2} ${base - h * 0.12}, ${x} ${base} C ${x - (w * s) / 2} ${base - h * 0.12}, ${x - (w * s) / 2} ${top + h * 0.35}, ${x} ${top} Z`;
  return (
    <g>
      <path d={shape(1)} fill="#4f5f40" />
      <path d={shape(0.55)} transform={`translate(${-w * 0.12} 2)`} fill="#66774f" opacity="0.7" />
    </g>
  );
}

function Plinth({ x }: { x: number }) {
  return (
    <g>
      {/* flowers in the urn */}
      <ellipse cx={x} cy={196} rx="17" ry="11" fill="#6f7f55" />
      {[-11, -4, 4, 11, -7, 7, 0].map((dx, i) => (
        <circle
          key={dx}
          cx={x + dx}
          cy={i > 3 ? 188 : 196 - (i % 2) * 3}
          r={i === 6 ? 5 : 4.2}
          fill={ROSE_COLORS[i % ROSE_COLORS.length]}
          stroke="#b9877d"
          strokeWidth="0.35"
        />
      ))}
      {/* urn */}
      <path d={`M${x - 14} 203 H${x + 14} C ${x + 13} 214, ${x + 6} 218, ${x + 4} 220 H${x - 4} C ${x - 6} 218, ${x - 13} 214, ${x - 14} 203 Z`} fill={STONE} stroke={STONE_LINE} strokeWidth="0.6" />
      <rect x={x - 7} y={220} width="14" height="5" fill={STONE_SHADE} />
      {/* pillar */}
      <rect x={x - 20} y={225} width="40" height="7" fill={STONE} stroke={STONE_LINE} strokeWidth="0.6" />
      <rect x={x - 15} y={232} width="30" height="40" fill={STONE} stroke={STONE_LINE} strokeWidth="0.6" />
      <rect x={x - 10} y={238} width="20" height="28" fill="none" stroke={STONE_LINE} strokeWidth="0.5" />
      <rect x={x - 19} y={272} width="38" height="7" fill={STONE_SHADE} stroke={STONE_LINE} strokeWidth="0.6" />
    </g>
  );
}

function Fountain() {
  return (
    <g>
      {/* lower basin */}
      <path d="M100 252 V268 A100 20 0 0 0 300 268 V252 Z" fill="url(#basin-side)" stroke={STONE_LINE} strokeWidth="0.6" />
      <ellipse cx="200" cy="252" rx="100" ry="20" fill={STONE} stroke={STONE_LINE} strokeWidth="0.6" />
      <ellipse cx="200" cy="252" rx="91" ry="15" fill="url(#water)" />
      <ellipse cx="200" cy="254" rx="60" ry="8" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="0.6" />
      <ellipse cx="200" cy="255" rx="35" ry="4.5" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.6" />

      {/* falling water from the upper bowl */}
      <g fill="none" stroke="#9fc2b8" strokeWidth="1.3" strokeLinecap="round" opacity="0.85">
        <path className="water-flow" d="M160 188 C 148 196, 140 220, 136 250" />
        <path className="water-flow" d="M168 192 C 160 204, 155 226, 154 252" />
        <path className="water-flow" d="M240 188 C 252 196, 260 220, 264 250" />
        <path className="water-flow" d="M232 192 C 240 204, 245 226, 246 252" />
      </g>

      {/* pedestal */}
      <path d="M188 252 C 191 232, 184 214, 193 194 H207 C 216 214, 209 232, 212 252 Z" fill={STONE} stroke={STONE_LINE} strokeWidth="0.6" />
      <path d="M195 200 C 192 216, 197 232, 195 250" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="1" />

      {/* upper bowl */}
      <path d="M157 186 Q 200 214 243 186 Z" fill={STONE_SHADE} stroke={STONE_LINE} strokeWidth="0.6" />
      <ellipse cx="200" cy="186" rx="43" ry="7" fill={STONE} stroke={STONE_LINE} strokeWidth="0.6" />
      <ellipse cx="200" cy="186" rx="37" ry="4.6" fill="url(#water)" />

      {/* top tier and jet */}
      <path d="M196 186 C 197 176, 195 168, 197 160 H203 C 205 168, 203 176, 204 186 Z" fill={STONE} stroke={STONE_LINE} strokeWidth="0.5" />
      <path d="M185 158 Q 200 170 215 158 Z" fill={STONE_SHADE} stroke={STONE_LINE} strokeWidth="0.5" />
      <ellipse cx="200" cy="158" rx="15" ry="3.2" fill={STONE} stroke={STONE_LINE} strokeWidth="0.5" />
      <g fill="none" stroke="#a9cbc1" strokeWidth="1.1" strokeLinecap="round">
        <path d="M200 158 V132" />
        <path className="water-flow" d="M200 134 C 192 128, 182 136, 178 160 C 177 168, 172 178, 166 186" />
        <path className="water-flow" d="M200 134 C 208 128, 218 136, 222 160 C 223 168, 228 178, 234 186" />
      </g>
      <circle cx="200" cy="131" r="1.6" fill="#a9cbc1" />
    </g>
  );
}

export function GardenScene({ className = "" }: { className?: string }) {
  const hedgeTop = Array.from({ length: 11 }, (_, i) => i * 40)
    .map((x) => `Q ${x + 20} 132 ${x + 40} 146`)
    .join(" ");

  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c3dad3" />
          <stop offset="1" stopColor="#8fb3a9" />
        </linearGradient>
        <linearGradient id="basin-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ddd1be" />
          <stop offset="1" stopColor="#c4b59d" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7dccb" />
          <stop offset="1" stopColor="#f2eadd" />
        </linearGradient>
        <linearGradient id="hedge-wall" x1="0" y1="128" x2="0" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7d8c62" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7d8c62" />
        </linearGradient>
      </defs>

      {/* distant hedge wall, faded into the paper at its top */}
      <path d={`M0 146 ${hedgeTop} V205 H0 Z`} fill="url(#hedge-wall)" />

      <Cypress x={34} base={206} h={120} w={34} />
      <Cypress x={366} base={206} h={120} w={34} />
      <Cypress x={104} base={206} h={78} w={26} />
      <Cypress x={296} base={206} h={78} w={26} />

      {/* stone floor and walkway */}
      <rect x="0" y="202" width="400" height="98" fill="url(#floor)" />
      <path d="M172 202 H228 L310 300 H90 Z" fill="#f6efe4" />
      <g stroke="#d8cbb6" strokeWidth="0.5">
        {[216, 234, 258, 288].map((y) => {
          const t = (y - 202) / 98;
          return <line key={y} x1={172 - 82 * t} y1={y} x2={228 + 82 * t} y2={y} />;
        })}
        <line x1="190" y1="202" x2="163" y2="300" />
        <line x1="210" y1="202" x2="237" y2="300" />
      </g>

      {/* low hedges with blossoms */}
      <rect x="-6" y="198" width="156" height="22" rx="10" fill="#6c7c52" />
      <rect x="250" y="198" width="156" height="22" rx="10" fill="#6c7c52" />
      {[14, 38, 62, 86, 110, 134, 266, 290, 314, 338, 362, 386].map((x, i) => (
        <circle key={x} cx={x} cy={200} r="2.6" fill={ROSE_COLORS[i % ROSE_COLORS.length]} />
      ))}

      {/* clipped boxwood balls behind the basin */}
      {[140, 260].map((x) => (
        <g key={x}>
          <rect x={x - 6} y={222} width="12" height="10" fill={STONE_SHADE} />
          <circle cx={x} cy={210} r="14" fill="#5e6e47" />
          <circle cx={x - 4} cy={205} r="6" fill="#738456" opacity="0.7" />
        </g>
      ))}

      <Plinth x={52} />
      <Plinth x={348} />
      <Fountain />

      <RoseBush />
      <g transform="translate(400 0) scale(-1 1)">
        <RoseBush />
      </g>
    </svg>
  );
}
