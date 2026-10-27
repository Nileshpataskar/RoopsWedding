import * as THREE from "three";
import { calmMood, type Mood } from "./chibi";
import { handPosition, REST_ARM, restPose, type ArmPose, type RigPose, type RigProfile } from "./proceduralRig";
import { bump, clamp01, ENTRANCE, easeInOut, easeOut, easeOutBack, lerp, OPENING, progress, PROMPT_AT, type StageClock, type Window } from "./timeline";

/** -1 = bride, entering from the left; +1 = groom, entering from the right. */
export type Side = -1 | 1;

export const CAMERA_DISTANCE = 10;
export const CAMERA_FOV = 30;

/** Stage dimensions in world units, derived from the visible area at z = 0. */
export type StageLayout = {
  width: number;
  height: number;
  /** Where the curtains meet the floor. */
  floorY: number;
  /** Top of the curtains (hidden under the valance). */
  topY: number;
  /** Height of the pulleys, just below the valance swags. */
  pulleyY: number;
  /** Character height and distance in front of the curtains. */
  charHeight: number;
  charZ: number;
  /** Final distance of each character from the centre, and where they start. */
  homeX: number;
  startX: number;
  /** Where they stand hand in hand once the curtains are open. */
  meetX: number;
};

/** Visible half-width at a given depth in front of the curtains. */
const halfWidthAt = (width: number, z: number) => ((width / 2) * CAMERA_DISTANCE) / (CAMERA_DISTANCE - z);

export function computeLayout(width: number, height: number): StageLayout {
  const charZ = 0.6;
  const charHeight = Math.min(height * 0.3, width * 0.62);
  // how far the rope hand reaches out from the body centre (see GRAB)
  const reach = 0.36 * (charHeight / 2);
  const visible = halfWidthAt(width, charZ);
  return {
    width,
    height,
    floorY: -height / 2 + height * 0.12,
    topY: height / 2 + 0.2,
    // the valance SVG is 130/400 of the column width tall; its swags dip to ~98/400
    pulleyY: height / 2 - width * 0.27,
    charHeight,
    charZ,
    homeX: Math.min(visible - reach - 0.34, width * 0.3),
    // just out of sight, so they pop in as soon as they start walking
    startX: visible + charHeight * 0.24,
    meetX: 0.6 * (charHeight / 2),
  };
}

/** The arm on the outboard side (towards the rope) and the free inboard arm. */
const ropeArmOf = (side: Side) => (side < 0 ? "armR" : "armL");
const freeArmOf = (side: Side) => (side < 0 ? "armL" : "armR");
/** Model-space z sign of the rope arm (the bride uses her right, the groom his left). */
const ropeArmSign = (side: Side): 1 | -1 => (side < 0 ? 1 : -1);

// Short chibi arms: poses keep the hands clear of the big round head.
const GRAB: ArmPose = { raise: 0.95, swing: -0.25, elbow: 0.3 };
/** Where the shoulder ends the pull; the elbow is solved so the hand follows the rope. */
const PULLED = { raise: -0.75, swing: 0.3 };
const WAVE: ArmPose = { raise: 0.8, swing: -0.15, elbow: 0.45 };
const CHEER: ArmPose = { raise: 0.85, swing: 0.05, elbow: 0.35 };
const YAY: ArmPose = { raise: 0.55, swing: -0.1, elbow: 0.5 };
/** Bride's bashful hands, clasped in front. */
const SHY: ArmPose = { raise: -1.0, swing: 0.8, elbow: 1.3 };
/** Groom's sheepish scratch at the back of his turban. */
const SCRATCH: ArmPose = { raise: 0.75, swing: -0.55, elbow: 2.0 };
/** Inboard hands reaching for each other. */
const HOLD: ArmPose = { raise: -0.2, swing: 0.3, elbow: 0 };

const mixArm = (a: ArmPose, b: ArmPose, k: number): ArmPose => ({
  raise: lerp(a.raise, b.raise, k),
  swing: lerp(a.swing, b.swing, k),
  elbow: lerp(a.elbow, b.elbow, k),
});

/**
 * The pulling arm. As the shoulder lowers, the elbow bends just enough to keep
 * the hand at the same distance from the body, so it draws the rope straight
 * down instead of sweeping out in an arc.
 */
function pullArm(k: number, rig: RigProfile): ArmPose {
  const upper = rig.elbow - rig.shoulder;
  const fore = rig.hand - rig.elbow;
  const lateral = (upper + fore * Math.cos(GRAB.elbow)) * Math.cos(GRAB.raise);
  const raise = lerp(GRAB.raise, PULLED.raise, k);
  const cosElbow = (lateral / Math.cos(raise) - upper) / fore;
  return {
    raise,
    swing: lerp(GRAB.swing, PULLED.swing, k),
    elbow: Math.acos(Math.min(Math.cos(GRAB.elbow), Math.max(0, cosElbow))),
  };
}

/** sin bump across [a, b] of an already normalised 0–1 value. */
const arc = (q: number, a: number, b: number) => (q <= a || q >= b ? 0 : Math.sin((Math.PI * (q - a)) / (b - a)));

/** Eases in, holds, then eases out across a window: for gestures that linger. */
const hold = (t: number, w: Window, edge = 0.3) => {
  const p = progress(t, w);
  return easeInOut(clamp01(Math.min(p / edge, (1 - p) / edge)));
};

/** Eases in across a window and stays. */
const settle = (t: number, w: Window) => easeInOut(progress(t, w));

/** A cartoon hop: crouch, stretch in the air, squash on landing. */
function hop(q: number) {
  return {
    lift: arc(q, 0.25, 0.8),
    squash: 0.14 * arc(q, 0, 0.25) - 0.1 * arc(q, 0.25, 0.8) + 0.12 * arc(q, 0.8, 1),
  };
}

/** Gait strength through a travelling window: eases in and out at the ends. */
const gaitIn = (p: number) => (p <= 0 || p >= 1 ? 0 : Math.min(1, p / 0.1, (1 - p) / 0.15));

// One leg's length in model units (hip pivot to sole) and the skipping stride.
const LEG = 0.64;
const STRIDE_SWING = 0.5;

export type CharacterFrame = {
  /** Point between the feet on the floor. */
  position: THREE.Vector3;
  yaw: number;
  scale: number;
  /** Height above the floor while hopping, in world units. */
  lift: number;
  /** Squash (positive: shorter and wider) or stretch (negative). */
  squash: number;
  /** Whole-body sway towards the model's +z side, pivoting at the feet. */
  roll: number;
  /** Whole-body lean forwards, pivoting at the feet. */
  lean: number;
  pose: RigPose;
  mood: Mood;
};

/** Where a character stands and how it is posed for the given stage clock. */
export function characterFrame(clock: StageClock, side: Side, layout: StageLayout, rig: RigProfile): CharacterFrame {
  const t = clock.entrance;
  const opened = clock.opened ?? -1;
  const scale = layout.charHeight / 2;
  const bride = side < 0;
  const pose = restPose();
  const mood = calmMood();
  const ropeArm = ropeArmOf(side);
  const freeArm = freeArmOf(side);
  let lift = 0;
  let squash = 0;
  let roll = 0;
  let lean = 0;

  // skip in from the wings, and later into the middle to meet
  const walk = progress(t, ENTRANCE.walk);
  const meet = progress(opened, OPENING.meet);
  const x = side * lerp(lerp(layout.startX, layout.homeX, easeInOut(walk)), layout.meetX, easeInOut(meet));
  const travelled =
    Math.abs(layout.startX - layout.homeX) * easeInOut(walk) + Math.abs(layout.homeX - layout.meetX) * easeInOut(meet);

  // a bouncy, waddling skip: legs step with distance covered, arms flap out
  const step = 2 * LEG * Math.sin(STRIDE_SWING) * scale;
  const phase = (travelled / step) * Math.PI;
  const gait = Math.max(gaitIn(walk), gaitIn(meet));
  const stride = Math.sin(phase);
  const up = Math.cos(phase) ** 2;
  pose.hipR = STRIDE_SWING * stride * gait;
  pose.hipL = -pose.hipR;
  for (const [arm, sign] of [["armR", -1], ["armL", 1]] as const) {
    pose[arm] = {
      raise: REST_ARM.raise + (bride ? 0.5 : 0.3) * gait,
      swing: REST_ARM.swing + sign * (bride ? 0.45 : 0.75) * stride * gait,
      elbow: REST_ARM.elbow + 0.5 * gait,
    };
  }
  lift += 0.11 * scale * up * gait;
  squash += (0.08 * stride ** 4 - 0.05 * up) * gait;
  roll += 0.13 * stride * gait;
  lean += 0.07 * gait;
  pose.nod += 0.1 * Math.cos(2 * phase) * gait;
  pose.tilt -= 0.12 * stride * gait;
  mood.trail += (0.3 + 0.2 * up) * gait;

  // turn to face the guests with a springy overshoot; the bride twirls round
  const walkYaw = bride ? 0 : Math.PI;
  const faceYaw = bride ? -Math.PI / 2 + 0.2 : (3 * Math.PI) / 2 - 0.2;
  const turn = progress(t, ENTRANCE.turn);
  const spin = bride ? -2 * Math.PI : 0;
  // (starting a full turn back, which looks the same, so she ends exactly at faceYaw)
  let yaw = walkYaw - spin + (faceYaw - walkYaw + spin) * (bride ? easeOut(turn) : easeOutBack(turn, 1.8));
  const twirl = bump(t, ENTRANCE.turn);
  if (bride) {
    mood.flare += twirl;
    lift += 0.05 * scale * twirl;
    pose.armR.raise += 0.6 * twirl;
    pose.armL.raise += 0.6 * twirl;
  }

  // a happy hop on arrival, arms up in a "yay"
  const arrive = hop(progress(t, ENTRANCE.hop));
  lift += 0.16 * scale * arrive.lift;
  squash += arrive.squash;
  mood.flare += 0.6 * arrive.lift;
  const yay = hold(t, [ENTRANCE.hop[0] - 0.05, ENTRANCE.hop[1] + 0.25], 0.35);
  pose.armR = mixArm(pose.armR, YAY, yay);
  pose.armL = mixArm(pose.armL, YAY, yay);
  mood.happy = Math.max(mood.happy, yay);

  // glance shyly at each other: turn in, tilt the head, blush
  const glance = hold(t, ENTRANCE.glance, 0.25);
  const g = t - ENTRANCE.glance[0];
  yaw += -side * 0.8 * glance;
  pose.tilt += side * 0.35 * glance;
  roll += side * 0.07 * glance;
  pose.nod += 0.25 * bump(t, [ENTRANCE.glance[0] + 0.3, ENTRANCE.glance[1] - 0.3]);
  mood.blush = Math.max(mood.blush, glance);
  if (bride) {
    // hands clasped, swaying bashfully from side to side
    pose.armR = mixArm(pose.armR, SHY, glance);
    pose.armL = mixArm(pose.armL, SHY, glance);
    yaw += 0.15 * Math.sin(g * 6) * glance;
    pose.tilt += 0.08 * Math.sin(g * 6) * glance;
  } else {
    // a sheepish scratch with the outer hand
    pose[ropeArm] = mixArm(pose[ropeArm], { ...SCRATCH, elbow: SCRATCH.elbow + 0.18 * Math.sin(g * 22) }, glance);
    pose.nod += 0.1 * glance;
  }

  // waiting for the guest: sway to a rhythm, bounce on the toes, swing the free hand
  const waiting = clock.opened === null ? clamp01((t - PROMPT_AT) / 0.6) : 0;
  const beat = t - PROMPT_AT;
  roll += 0.06 * Math.sin(beat * 2.6) * waiting;
  squash += 0.03 * Math.sin(beat * 5.2) * waiting;
  pose.tilt += 0.18 * Math.sin(beat * 1.3 + side) * waiting;
  pose[freeArm].swing += 0.35 * Math.sin(beat * 2.6) * waiting;
  mood.trail += 0.1 * Math.sin(beat * 2.6) * waiting;

  // reach for the rope (with a little overshoot), then pull it with the guest
  const reach = easeOutBack(progress(t, ENTRANCE.reach), 1.4);
  let arm = clock.pull > 0 ? pullArm(clock.pull, rig) : mixArm(pose[ropeArm], GRAB, reach);
  // heave: lean back, squat and lean away from the rope
  lean -= 0.14 * clock.pull;
  squash += 0.08 * clock.pull;
  roll += side * 0.08 * clock.pull;

  // let go, jump for joy with both arms up
  arm = mixArm(arm, REST_ARM, easeOut(progress(opened, OPENING.release)));
  const joy = hop(progress(opened, OPENING.cheer));
  lift += 0.22 * scale * joy.lift;
  squash += joy.squash;
  mood.flare += joy.lift;
  const arms = hold(opened, [OPENING.cheer[0], OPENING.cheer[1] + 0.3]);
  pose[ropeArm] = mixArm(arm, CHEER, arms);
  pose[freeArm] = mixArm(pose[freeArm], CHEER, arms);

  // skip into the middle facing each other, then turn to the guests hand in hand
  yaw = lerp(yaw, walkYaw, hold(opened, OPENING.meet, 0.25));
  const together = settle(opened, [OPENING.meet[1] - 0.25, OPENING.meet[1] + 0.2]);
  const after = opened - OPENING.meet[1];
  yaw += -side * 0.3 * together;
  pose.tilt += side * 0.2 * together;
  roll += side * 0.05 * together;
  pose[freeArm] = mixArm(pose[freeArm], { ...HOLD, raise: HOLD.raise + 0.1 * Math.sin(after * 4) }, together);
  pose[ropeArm] = mixArm(pose[ropeArm], REST_ARM, together * (1 - arms));
  mood.happy = Math.max(mood.happy, arms, together);
  mood.blush = Math.max(mood.blush, together);

  // a bounce together as the heart pops
  const boing = hop(progress(opened, OPENING.heart));
  lift += 0.1 * scale * boing.lift;
  squash += boing.squash;
  mood.flare += 0.6 * boing.lift;

  const waveIn = hold(opened, OPENING.wave, 0.2);
  const wag = Math.sin((opened - OPENING.wave[0]) * 13) * 0.25 * waveIn;
  pose[ropeArm] = mixArm(pose[ropeArm], { ...WAVE, raise: WAVE.raise + wag }, waveIn);

  // blinks, the couple slightly out of step
  mood.blink = bump((t + (bride ? 1.3 : 0)) % 3.6, [0, 0.16]);
  mood.flare = Math.min(1.2, mood.flare);
  mood.trail += lift / scale;

  return {
    position: new THREE.Vector3(x, layout.floorY + lift, layout.charZ),
    yaw,
    scale,
    lift,
    squash,
    roll,
    lean,
    pose,
    mood,
  };
}

const rotation = new THREE.Euler();
const stretch = new THREE.Vector3();
const local = new THREE.Matrix4();

/**
 * Model space → world: stand on the feet, turn, sway and lean about the feet,
 * then squash and stretch. Shared by the character and its rope hand.
 */
export function characterMatrix(frame: CharacterFrame, out = new THREE.Matrix4()) {
  const { scale, squash } = frame;
  out.makeTranslation(frame.position.x, frame.position.y, frame.position.z);
  out.multiply(local.makeRotationY(frame.yaw));
  out.multiply(local.makeRotationFromEuler(rotation.set(frame.roll, 0, -frame.lean)));
  out.multiply(local.makeScale(...stretch.set(1 + squash / 2, 1 - squash, 1 + squash / 2).multiplyScalar(scale).toArray()));
  return out.multiply(local.makeTranslation(0, 1, 0));
}

/** World-space palm of the rope hand, matching the character's arm. */
export function ropeHand(clock: StageClock, side: Side, layout: StageLayout, rig: RigProfile, out = new THREE.Vector3()) {
  const frame = characterFrame(clock, side, layout, rig);
  handPosition(rig, frame.pose[ropeArmOf(side)], ropeArmSign(side), out);
  return out.applyMatrix4(characterMatrix(frame));
}
