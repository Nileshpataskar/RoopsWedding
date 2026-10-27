/**
 * The opening choreography. Every moving part of the stage reads its pose
 * from these windows, so the whole sequence can be re-timed from here.
 */

/** Plays by itself once the stage has loaded; seconds since it began. */
export const ENTRANCE = {
  /** Stage lights warm up. */
  lightsUp: [0, 1.4],
  /** Bride and groom skip in from the wings, straight away. */
  walk: [0, 2.6],
  /** They turn to face the guests (the bride with a twirl). */
  turn: [2.3, 3.2],
  /** A happy little hop on arrival. */
  hop: [3.2, 3.7],
  /** They glance at each other, blushing: she is shy, he scratches his head. */
  glance: [3.7, 5.0],
  /** The pull ropes drop down from the pelmet. */
  ropes: [4.5, 5.1],
  /** Each reaches up and takes hold of their rope. */
  reach: [5.0, 5.7],
} as const;

/** When the guest is invited to pull the rope. */
export const PROMPT_AT = ENTRANCE.reach[1];

/** After the guest pulls the rope; seconds since they let go. */
export const OPENING = {
  /** The couple finish the pull from wherever the guest left it. */
  pull: [0, 0.8],
  /** The curtains travel outwards (with a little follow-through). */
  curtains: [0, 1.8],
  /** Hands let go of the ropes. */
  release: [0.85, 1.15],
  /** A jump for joy with both arms in the air, and confetti. */
  cheer: [1.0, 1.6],
  /** They skip into the middle and take each other's hand. */
  meet: [1.6, 2.6],
  /** A heart pops up above them as they bounce together. */
  heart: [2.6, 3.3],
  /** A wave to the guests with the outer hand. */
  wave: [3.0, 4.0],
  /** The stage (couple, floor, ropes) fades away over the revealed invitation. */
  fade: [3.9, 4.7],
} as const;

/** The invitation underneath starts its own entrance as the curtains part. */
export const REVEAL_AT = OPENING.curtains[0];

export type Window = readonly [number, number];

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** 0 → 1 progress through a window. */
export const progress = (t: number, [a, b]: Window) => clamp01((t - a) / (b - a));

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
export const easeOut = (x: number) => 1 - (1 - x) ** 3;

/** Ease out with a small overshoot, for fabric and rope follow-through. */
export const easeOutBack = (x: number, overshoot = 1.2) => {
  const c3 = overshoot + 1;
  return 1 + c3 * (x - 1) ** 3 + overshoot * (x - 1) ** 2;
};

/** A smooth 0 → 1 → 0 bump across a window. */
export const bump = (t: number, w: Window) => Math.sin(progress(t, w) * Math.PI);

/** Everything the stage needs to know to pose itself for a frame. */
export type StageClock = {
  /** Seconds since the couple began their entrance; -1 while the stage loads. */
  entrance: number;
  /** How far the ropes are pulled, 0 → 1. */
  pull: number;
  /** Rope pull at the moment the guest let go to open the curtains. */
  pullAtOpen: number;
  /** Seconds since the guest opened the curtains, or null before that. */
  opened: number | null;
};

/** A clock frozen with the couple holding their ropes, ready to pull. */
export const READY_TO_PULL: StageClock = { entrance: PROMPT_AT, pull: 0, pullAtOpen: 0, opened: null };
