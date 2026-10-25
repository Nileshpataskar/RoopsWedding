import type { CSSProperties } from "react";

/**
 * Marigold and rose petals drifting down over the hero. Pure CSS animation;
 * positions are derived from the index so server and client markup match.
 * Hidden entirely under prefers-reduced-motion (see `.petal` in globals.css).
 */

const COLORS = ["#e8892a", "#f2b233", "#9a5fb0", "#f0a3a0", "#e8892a", "#f6c75a"];

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37 + 7) % 100,
  size: 9 + ((i * 7) % 8),
  duration: 9 + ((i * 5) % 7),
  delay: (i * 0.85) % 11,
  drift: (i % 2 ? 1 : -1) * (24 + ((i * 13) % 40)),
  spin: (i % 2 ? 1 : -1) * (200 + ((i * 47) % 300)),
  color: COLORS[i % COLORS.length],
}));

export function FallingPetals({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden ${className}`}>
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal absolute top-0 block opacity-0"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              "--drift": `${p.drift}px`,
              "--spin": `${p.spin}deg`,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 20 20" className="h-full w-full">
            <path
              d="M10 1 C 16 5, 17 12, 10 19 C 3 12, 4 5, 10 1 Z"
              fill={p.color}
              fillOpacity="0.85"
            />
            <path d="M10 3 V17" stroke="#000" strokeOpacity="0.08" strokeWidth="0.8" />
          </svg>
        </span>
      ))}
    </div>
  );
}
