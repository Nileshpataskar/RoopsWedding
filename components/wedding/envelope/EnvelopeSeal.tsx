/** The scalloped ivory plaque that sits over the envelope seam. */

const CX = 80;
const CY = 120;
const RX = 66;
const RY = 104;
const SCALLOPS = Array.from({ length: 34 }, (_, i) => {
  const t = (i / 34) * Math.PI * 2;
  return { x: +(CX + RX * Math.cos(t)).toFixed(2), y: +(CY + RY * Math.sin(t)).toFixed(2) };
});

const GOLD = "#b8976a";

function Flourish({ y, flip = false }: { y: number; flip?: boolean }) {
  const half = "M80 0 c -5 -7 -16 -8 -21 -2 c -4 5 1 11 6 8 c 3 -2 2 -6 -1 -6 M59 -2 c -6 3 -12 3 -17 0";
  return (
    <g transform={`translate(0 ${y}) ${flip ? "scale(1 -1)" : ""}`} fill="none" stroke={GOLD} strokeWidth="0.9">
      <path d={half} />
      <path d={half} transform="translate(160 0) scale(-1 1)" />
      <circle cx="80" cy="0" r="1.6" fill={GOLD} />
    </g>
  );
}

export function EnvelopeSeal() {
  return (
    <svg viewBox="0 0 160 240" aria-hidden="true" className="h-full w-full">
      <defs>
        <radialGradient id="seal-face" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fbf3ec" />
          <stop offset="70%" stopColor="#f3e3d9" />
          <stop offset="100%" stopColor="#e9d3c6" />
        </radialGradient>
      </defs>

      {/* scalloped edge: gold-outlined circles, then the face covers their inner halves */}
      <g fill="#f1e0d5" stroke={GOLD} strokeWidth="1">
        {SCALLOPS.map((p) => (
          <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="8.5" />
        ))}
      </g>
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="url(#seal-face)" />

      <ellipse cx={CX} cy={CY} rx={57} ry={94} fill="none" stroke={GOLD} strokeWidth="0.9" />
      <ellipse cx={CX} cy={CY} rx={53} ry={90} fill="none" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1.5 2.5" />

      <Flourish y={62} />
      <path
        d="M80 76 s -4 -3.4 -4 -6 a 2.2 2.2 0 0 1 4 -1.2 a 2.2 2.2 0 0 1 4 1.2 c 0 2.6 -4 6 -4 6z"
        fill="#c59a8c"
      />

      <text
        x="80"
        y="113"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="15"
        letterSpacing="4"
        fill="#6f5a42"
      >
        TAP TO
      </text>
      <text
        x="81"
        y="136"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="17"
        letterSpacing="5"
        fill="#6f5a42"
      >
        OPEN
      </text>

      {/* small botanical ornament under the text */}
      <g fill="#8a916f" stroke="#6f7856" strokeWidth="0.5">
        <path d="M80 168 C 80 160, 80 154, 80 148" fill="none" />
        <path d="M80 160 c -4 -4 -10 -4 -13 -1 c 4 2 9 3 13 1z" />
        <path d="M80 160 c 4 -4 10 -4 13 -1 c -4 2 -9 3 -13 1z" />
        <path d="M80 153 c -3 -3 -8 -4 -10 -2 c 3 2 7 3 10 2z" />
        <path d="M80 153 c 3 -3 8 -4 10 -2 c -3 2 -7 3 -10 2z" />
        <circle cx="80" cy="146" r="2.2" fill="#e3b9ad" stroke={GOLD} />
      </g>

      <Flourish y={182} flip />
    </svg>
  );
}
