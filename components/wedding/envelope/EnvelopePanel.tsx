import { LeafPattern } from "./LeafPattern";

type EnvelopePanelProps = {
  side: "left" | "right";
};

function CornerOrnament({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={`absolute h-9 w-9 ${className}`}>
      <path
        d="M2 38 V10 a8 8 0 0 1 8 -8 H38 M8 30 c0 -12 10 -22 22 -22 M14 14 c4 -1 6 1 5 5 c-3 1 -5 -1 -5 -5z"
        fill="none"
        stroke="#d6ad5c"
        strokeWidth="1"
        strokeOpacity="0.85"
      />
    </svg>
  );
}

/** One half of the gatefold envelope. Static — the parent animates it. */
export function EnvelopePanel({ side }: EnvelopePanelProps) {
  const isLeft = side === "left";
  return (
    <div
      className="envelope-surface relative h-full w-full overflow-hidden"
      style={{
        boxShadow: isLeft
          ? "inset -10px 0 14px -10px rgba(20,6,26,.6)"
          : "inset 10px 0 14px -10px rgba(20,6,26,.6)",
      }}
    >
      <LeafPattern id={`leaf-${side}`} />
      {/* fine gold frame */}
      <div className="absolute inset-3 rounded-[2px] border border-champagne/70" />
      <div className="absolute inset-[19px] rounded-[2px] border border-champagne/35" />
      <CornerOrnament className="top-4 left-4" />
      <CornerOrnament className="bottom-4 left-4 -scale-y-100" />
      <CornerOrnament className="top-4 right-4 -scale-x-100" />
      <CornerOrnament className="right-4 bottom-4 -scale-100" />
      {/* the edge along the seam catches a little light */}
      <div
        className={`absolute inset-y-0 w-px bg-[#f0cf8a]/30 ${isLeft ? "right-[3px]" : "left-[3px]"}`}
      />
    </div>
  );
}
