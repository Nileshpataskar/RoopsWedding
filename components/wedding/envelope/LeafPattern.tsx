/** Embossed botanical pattern printed on the envelope panels. */

function leafPath(len: number) {
  const w = len * 0.3;
  return `M0 0 C ${len * 0.3} ${-w}, ${len * 0.72} ${-w}, ${len} 0 C ${len * 0.72} ${w}, ${len * 0.3} ${w}, 0 0 Z M0 0 L ${len * 0.85} 0`;
}

const SPRIG_LEAVES = [
  { y: 74, angle: -140, len: 15 },
  { y: 66, angle: -40, len: 15 },
  { y: 54, angle: -145, len: 14 },
  { y: 46, angle: -35, len: 14 },
  { y: 34, angle: -150, len: 12 },
  { y: 27, angle: -30, len: 12 },
  { y: 18, angle: -90, len: 10 },
];

function Sprig({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 84 C -3 60, 3 40, 0 18" fill="none" />
      {SPRIG_LEAVES.map((leaf) => (
        <path
          key={`${leaf.y}-${leaf.angle}`}
          d={leafPath(leaf.len)}
          transform={`translate(0 ${leaf.y}) rotate(${leaf.angle})`}
        />
      ))}
      <circle cx="-9" cy="88" r="1.4" />
      <circle cx="9" cy="88" r="1.4" />
    </g>
  );
}

function Tile() {
  return (
    <>
      <Sprig x={16} y={4} />
      <Sprig x={48} y={52} />
      <Sprig x={48} y={-44} />
    </>
  );
}

export function LeafPattern({ id }: { id: string }) {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
      <defs>
        <pattern id={id} width="64" height="96" patternUnits="userSpaceOnUse">
          {/* shadow, highlight and face layers create a debossed look */}
          <g transform="translate(0.9 0.9)" fill="none" stroke="#3a432d" strokeOpacity="0.45" strokeWidth="1">
            <Tile />
          </g>
          <g transform="translate(-0.6 -0.6)" fill="none" stroke="#c9cfab" strokeOpacity="0.4" strokeWidth="0.9">
            <Tile />
          </g>
          <g fill="#8c9570" fillOpacity="0.55" stroke="#7c8560" strokeWidth="0.6">
            <Tile />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
