import * as THREE from "three";

/**
 * The joint layout shared by the couple and the props that follow their hands.
 *
 * Coordinates are in the model's own space: feet at y = -1, crown near
 * y = +1, facing +x, arms out along ±z in the rest (T) pose. The characters
 * are built as a hierarchy of pivots at these joints (see chibi.ts), and
 * `handPosition` repeats the same maths so the curtain ropes can follow a
 * palm exactly.
 */
export type RigProfile = {
  /** Forward (x) and vertical (y) centre line of the arms. */
  armX: number;
  armY: number;
  /** Lateral distance from the centre to the shoulder, elbow and palm. */
  shoulder: number;
  elbow: number;
  hand: number;
  /** Hip pivot height and lateral offset. */
  hipY: number;
  hipZ: number;
  /** Neck pivot height for nods. */
  neckY: number;
};

/**
 * Joint angles in radians.
 * - raise: arm lifted in the frontal plane (0 = T-pose, negative = down).
 * - swing: arm rotated about the shoulder's lateral axis (positive brings a
 *   hanging hand forward).
 * - elbow: forearm bend towards the front of the body.
 */
export type ArmPose = { raise: number; swing: number; elbow: number };

export type RigPose = {
  /** The arm on the model's +z side (its right hand). */
  armR: ArmPose;
  /** The arm on the model's -z side (its left hand). */
  armL: ArmPose;
  /** Leg swings, positive = foot forward. */
  hipR: number;
  hipL: number;
  /** Head nod, positive = forward. */
  nod: number;
  /** Head tilt towards a shoulder, positive = towards the model's +z side. */
  tilt: number;
};

export const REST_ARM: ArmPose = { raise: -1.2, swing: 0.06, elbow: 0.15 };

export const restPose = (): RigPose => ({
  armR: { ...REST_ARM },
  armL: { ...REST_ARM },
  hipR: 0,
  hipL: 0,
  nod: 0,
  tilt: 0,
});

/** Shoulder rotation: raise about the forward axis, then swing about the lateral axis. */
export const shoulderEuler = (pose: ArmPose, side: 1 | -1, out = new THREE.Euler()) =>
  out.set(-side * pose.raise, 0, pose.swing, "ZXY");

/** Elbow rotation: the forearm folds about the vertical axis towards the front. */
export const elbowEuler = (pose: ArmPose, side: 1 | -1, out = new THREE.Euler()) => out.set(0, side * pose.elbow, 0);

/** Head rotation: nod about the lateral axis, then tilt towards a shoulder. */
export const headEuler = (pose: RigPose, out = new THREE.Euler()) => out.set(pose.tilt, 0, -pose.nod, "XYZ");

const elbowRotation = new THREE.Euler();
const shoulderRotation = new THREE.Euler();

/** The palm of one arm in model space for the given arm pose. */
export function handPosition(rig: RigProfile, pose: ArmPose, side: 1 | -1, out = new THREE.Vector3()) {
  const elbow = new THREE.Vector3(rig.armX, rig.armY, side * rig.elbow);
  const shoulder = new THREE.Vector3(rig.armX, rig.armY, side * rig.shoulder);
  out.set(rig.armX, rig.armY, side * rig.hand).sub(elbow);
  out.applyEuler(elbowEuler(pose, side, elbowRotation)).add(elbow).sub(shoulder);
  out.applyEuler(shoulderEuler(pose, side, shoulderRotation));
  return out.add(shoulder);
}
