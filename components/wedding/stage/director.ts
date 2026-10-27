import { bump, easeInOut, easeOut, lerp, OPENING, progress, PROMPT_AT, type StageClock } from "./timeline";

/**
 * Mutable cue sheet shared between the stage overlay (which handles the
 * guest's gestures) and the 3D scene (which reads it every frame).
 */
export type Director = {
  /** performance.now() when the couple began their entrance, or null while loading. */
  entranceAt: number | null;
  /** How far the guest has dragged the rope, 0 → 1. */
  drag: number;
  dragging: boolean;
  /** A short drag that was let go springs back from this pull. */
  springFrom: number;
  springAt: number;
  /** performance.now() when the guest opened the curtains. */
  openedAt: number | null;
  pullAtOpen: number;
};

export const createDirector = (): Director => ({
  entranceAt: null,
  drag: 0,
  dragging: false,
  springFrom: 0,
  springAt: 0,
  openedAt: null,
  pullAtOpen: 0,
});

/** Seconds between the couple's inviting tugs while they wait for the guest. */
const TUG_EVERY = 3.2;

export function readClock(d: Director, now = performance.now()): StageClock {
  const entrance = d.entranceAt === null ? -1 : (now - d.entranceAt) / 1000;

  if (d.openedAt !== null) {
    const opened = (now - d.openedAt) / 1000;
    const pull = lerp(d.pullAtOpen, 1, easeInOut(progress(opened, OPENING.pull)));
    return { entrance, pull, pullAtOpen: d.pullAtOpen, opened };
  }

  if (d.dragging) return { entrance, pull: d.drag, pullAtOpen: 0, opened: null };

  const spring = d.springFrom * (1 - easeOut(progress((now - d.springAt) / 1000, [0, 0.35])));
  const waiting = entrance - PROMPT_AT - 1;
  const tug = waiting > 0 ? 0.08 * bump(waiting % TUG_EVERY, [0, 0.9]) : 0;
  return { entrance, pull: Math.max(spring, tug), pullAtOpen: 0, opened: null };
}
