"use client";

import { motion } from "framer-motion";

/** A full-height closed curtain panel: vertical folds with a gold inner hem. Drawn as the left one. */
function CurtainPanel({ id, mirrored }: { id: string; mirrored: boolean }) {
  return (
    <svg
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-full w-full ${mirrored ? "-scale-x-100" : ""}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0" spreadMethod="repeat" gradientTransform="scale(0.25 1)">
          <stop offset="0" stopColor="#3a1844" />
          <stop offset="0.3" stopColor="#66307a" />
          <stop offset="0.55" stopColor="#421d4d" />
          <stop offset="0.8" stopColor="#5e2b6b" />
          <stop offset="1" stopColor="#3a1844" />
        </linearGradient>
      </defs>
      <rect width="100" height="1000" fill={`url(#${id})`} />
      {[12.5, 37.5, 62.5, 87.5].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="1000" stroke="#1e0a24" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      <rect x="86" width="14" height="1000" fill="#c99a45" />
      <line x1="90" y1="0" x2="90" y2="1000" stroke="#f0d08a" strokeWidth="1.5" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      <rect y="960" width="100" height="40" fill="#c99a45" />
    </svg>
  );
}

type CurtainFallbackProps = {
  /** Draw the curtains back to the sides. */
  open: boolean;
  className?: string;
};

/**
 * SVG curtains. They are painted with the server HTML so the invitation is
 * concealed before the 3D stage loads, and they perform the opening on their
 * own when WebGL is unavailable or the guest prefers reduced motion.
 */
export function CurtainFallback({ open, className = "" }: CurtainFallbackProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {(["left", "right"] as const).map((side) => (
        <motion.div
          key={side}
          className={`absolute inset-y-0 w-[51%] drop-shadow-[0_0_14px_rgba(30,10,36,.45)] ${side === "left" ? "left-0" : "right-0"}`}
          style={{ originX: side === "left" ? 0 : 1 }}
          initial={false}
          animate={{ scaleX: open ? 0.26 : 1 }}
          transition={{ duration: 1.4, ease: [0.6, 0, 0.25, 1] }}
        >
          <CurtainPanel id={`fallback-curtain-${side}`} mirrored={side === "right"} />
        </motion.div>
      ))}
    </div>
  );
}
