import * as THREE from "three";
import { elbowEuler, headEuler, shoulderEuler, type RigPose, type RigProfile } from "./proceduralRig";

/**
 * Chibi bride and groom built from primitives: a big round head, a small
 * body and stubby limbs, dressed for an Indian wedding. Every limb hangs from
 * a pivot at its joint, so posing is just setting rotations.
 */

export type Role = "bride" | "groom";

export const CHIBI_RIG: RigProfile = {
  armX: 0,
  armY: -0.02,
  shoulder: 0.19,
  elbow: 0.34,
  hand: 0.5,
  hipY: -0.5,
  hipZ: 0.1,
  neckY: 0.1,
};

/** Facial expression and cloth follow-through, all 0 → 1 unless noted. */
export type Mood = {
  /** Eyelids closing for a blink. */
  blink: number;
  /** Eyes curved into happy ^ ^ arcs. */
  happy: number;
  /** Cheeks glowing pink. */
  blush: number;
  /** The lehenga flaring out, for twirls and hops. */
  flare: number;
  /** Skirt, dupatta and turban tail lagging behind, in radians. */
  trail: number;
};

export const calmMood = (): Mood => ({ blink: 0, happy: 0, blush: 0, flare: 0, trail: 0 });

const HEAD_R = 0.38;
/** Head centre relative to the neck pivot. */
const HEAD_C = new THREE.Vector3(0, 0.4, 0);

const PALETTE = {
  skin: "#f6cfae",
  hair: "#2e1b1f",
  eye: "#2a1420",
  mouth: "#a3364b",
  blush: "#ff8fa8",
  gold: "#e3b45a",
  marigold: "#f39a1e",
  marigoldLight: "#ffc93c",
  rose: "#e8466d",
  jasmine: "#fff8ee",
  groom: { coat: "#fbf1dc", trim: "#d9a646", safa: "#e2507d", sash: "#7b3a8c", trousers: "#f3e4c6", shoe: "#c98d2e" },
  bride: { lehenga: "#d4164a", choli: "#c01241", dupatta: "#ff5a7e", trim: "#f0c060", shoe: "#b0123d" },
};

/** A three-tone ramp for a soft, hand-painted cel look. */
function toonRamp() {
  const texture = new THREE.DataTexture(new Uint8Array([110, 175, 230, 255]), 4, 1, THREE.RedFormat);
  texture.minFilter = texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

/** Turns a profile of [radius, height] pairs into a lathe around the y axis. */
const lathe = (profile: [number, number][], segments = 32) =>
  new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );

/** Radius of a lathe profile at a height, for placing trims on its surface. */
function radiusAt(profile: [number, number][], y: number) {
  for (let i = 1; i < profile.length; i++) {
    const [r0, y0] = profile[i - 1];
    const [r1, y1] = profile[i];
    if ((y - y0) * (y - y1) <= 0 && y0 !== y1) return r0 + ((r1 - r0) * (y - y0)) / (y1 - y0);
  }
  return profile[0][0];
}

/** A cylinder lying along +z (or -z), from its base at the origin. */
function limb(radius: number, length: number, side: 1 | -1, taper = 1) {
  return new THREE.CylinderGeometry(radius * taper, radius, length, 14)
    .translate(0, length / 2, 0)
    .rotateX((side * Math.PI) / 2);
}

export type Chibi = {
  root: THREE.Group;
  pose: (pose: RigPose, mood: Mood) => void;
  dispose: () => void;
};

export function buildChibi(role: Role, rig: RigProfile = CHIBI_RIG): Chibi {
  const gradientMap = toonRamp();
  const materials = new Map<string, THREE.Material>();
  const toon = (color: string, extra: THREE.MeshToonMaterialParameters = {}) => {
    const key = `toon${color}${JSON.stringify(extra)}`;
    if (!materials.has(key)) materials.set(key, new THREE.MeshToonMaterial({ color, gradientMap, ...extra }));
    return materials.get(key)!;
  };
  const flat = (color: string, opacity = 1) => {
    const key = `flat${color}${opacity}`;
    if (!materials.has(key))
      materials.set(key, new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity === 1 }));
    return materials.get(key)!;
  };

  const mesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Object3D,
    position?: [number, number, number],
    scale?: [number, number, number],
  ) => {
    const m = new THREE.Mesh(geometry, material);
    if (position) m.position.set(...position);
    if (scale) m.scale.set(...scale);
    parent.add(m);
    return m;
  };

  const ball = (r: number, w = 18, h = 14) => new THREE.SphereGeometry(r, w, h);
  const isBride = role === "bride";
  const skin = toon(PALETTE.skin);
  const gold = toon(PALETTE.gold, { emissive: "#4a2c00" });

  const root = new THREE.Group();

  // --- body ---------------------------------------------------------------
  const body = new THREE.Group();
  root.add(body);

  let skirt: THREE.Group | undefined;
  if (isBride) {
    // choli with a peek of waist, then a full, flared lehenga with gold bands
    const choli: [number, number][] = [[0.001, -0.3], [0.165, -0.3], [0.16, -0.18], [0.18, -0.04], [0.19, 0.02], [0.14, 0.08], [0.001, 0.1]];
    mesh(lathe(choli), toon(PALETTE.bride.choli), body);
    skirt = new THREE.Group();
    skirt.position.set(0, -0.26, 0);
    body.add(skirt);
    const lehenga: [number, number][] = [[0.15, 0], [0.19, -0.1], [0.27, -0.3], [0.37, -0.52], [0.43, -0.66]];
    mesh(lathe(lehenga, 40), toon(PALETTE.bride.lehenga, { side: THREE.DoubleSide }), skirt);
    for (const [y, tube] of [[-0.64, 0.028], [-0.5, 0.014], [-0.02, 0.022]] as const) {
      const ring = mesh(new THREE.TorusGeometry(radiusAt(lehenga, y) + 0.004, tube, 8, 48), gold, skirt, [0, y, 0]);
      ring.rotation.x = Math.PI / 2;
    }
    // little gold butis scattered over the skirt
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const y = i % 2 ? -0.4 : -0.27;
      const r = radiusAt(lehenga, y) + 0.004;
      mesh(ball(0.016, 8, 6), gold, skirt, [Math.cos(a) * r, y, Math.sin(a) * r]);
    }
    // dupatta draped down the back
    const drape = mesh(
      new THREE.CylinderGeometry(0.22, 0.36, 0.72, 20, 1, true, Math.PI * 1.12, Math.PI * 0.76).translate(0, -0.36, 0),
      toon(PALETTE.bride.dupatta, { side: THREE.DoubleSide, transparent: true, opacity: 0.88 }),
      body,
      [-0.03, 0.06, 0],
    );
    drape.name = "drape";
  } else {
    // knee-length sherwani with a gold placket, buttons and a plum sash
    const coat: [number, number][] = [[0.001, -0.7], [0.25, -0.7], [0.235, -0.5], [0.2, -0.3], [0.19, -0.1], [0.2, 0.0], [0.15, 0.08], [0.001, 0.1]];
    mesh(lathe(coat), toon(PALETTE.groom.coat), body);
    const hem = mesh(new THREE.TorusGeometry(0.25, 0.02, 8, 40), gold, body, [0, -0.69, 0]);
    hem.rotation.x = Math.PI / 2;
    for (let y = -0.62; y < 0.02; y += 0.012) {
      const r = radiusAt(coat, y);
      mesh(new THREE.BoxGeometry(0.01, 0.0125, 0.045), toon(PALETTE.groom.trim), body, [r, y, 0]);
    }
    for (const y of [-0.04, -0.16, -0.28, -0.4]) mesh(ball(0.02, 10, 8), gold, body, [radiusAt(coat, y) + 0.012, y, 0]);
    const sash = mesh(new THREE.TorusGeometry(0.205, 0.03, 8, 40), toon(PALETTE.groom.sash), body, [0, -0.2, 0]);
    sash.rotation.x = Math.PI / 2 + 0.55;
    sash.scale.set(1, 1.05, 1);
  }

  // band collar
  mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.07, 16), isBride ? gold : toon(PALETTE.groom.trim), body, [0, 0.1, 0]);

  // marigold varmala around the neck, hanging lower in front
  const beads = 26;
  for (let i = 0; i < beads; i++) {
    const a = (i / beads) * Math.PI * 2;
    const front = (1 + Math.cos(a)) / 2;
    const y = 0.05 - 0.36 * front ** 2;
    const r = 0.205 + 0.03 * front + (y < -0.2 ? 0.01 : 0);
    const color = i % 6 === 0 ? PALETTE.rose : i % 2 ? PALETTE.marigold : PALETTE.marigoldLight;
    mesh(ball(0.036, 10, 8), toon(color), body, [Math.cos(a) * r, y, Math.sin(a) * r]);
  }

  // --- legs ---------------------------------------------------------------
  const legs = ([1, -1] as const).map((side) => {
    const hip = new THREE.Group();
    hip.position.set(0, rig.hipY, side * rig.hipZ);
    body.add(hip);
    const length = -1 - rig.hipY + 0.06;
    mesh(new THREE.CylinderGeometry(0.06, 0.068, length, 12).translate(0, -length / 2, 0), isBride ? skin : toon(PALETTE.groom.trousers), hip);
    const shoe = mesh(ball(0.07, 14, 10), toon((isBride ? PALETTE.bride.shoe : PALETTE.groom.shoe)), hip, [0.035, -length - 0.005, 0], [1.45, 0.7, 1]);
    if (!isBride) {
      // mojari toe curling up
      const toe = mesh(new THREE.ConeGeometry(0.022, 0.07, 8), gold, hip, [0.13, -length + 0.02, 0]);
      toe.rotation.z = -0.9;
    }
    shoe.renderOrder = 0;
    return hip;
  });

  // --- arms ---------------------------------------------------------------
  const arms = ([1, -1] as const).map((side) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(rig.armX, rig.armY, side * rig.shoulder);
    body.add(shoulder);
    const upper = rig.elbow - rig.shoulder;
    const fore = rig.hand - rig.elbow;
    const sleeve = toon(isBride ? PALETTE.bride.choli : PALETTE.groom.coat);
    mesh(ball(0.066), sleeve, shoulder);
    if (isBride) {
      mesh(limb(0.064, upper * 0.45, side), sleeve, shoulder);
      mesh(limb(0.05, upper, side, 0.95), skin, shoulder);
    } else {
      mesh(limb(0.062, upper, side, 0.92), sleeve, shoulder);
    }

    const elbow = new THREE.Group();
    elbow.position.set(0, 0, side * upper);
    shoulder.add(elbow);
    mesh(ball(isBride ? 0.05 : 0.058), isBride ? skin : sleeve, elbow);
    mesh(limb(isBride ? 0.048 : 0.056, fore, side, 0.9), isBride ? skin : sleeve, elbow);
    if (isBride) {
      // a stack of red and gold bangles at the wrist
      [0.66, 0.78, 0.9].forEach((k, i) => {
        mesh(new THREE.TorusGeometry(0.05, 0.011, 6, 18), i === 1 ? toon(PALETTE.bride.choli) : gold, elbow, [0, 0, side * fore * k]);
      });
    } else {
      mesh(new THREE.TorusGeometry(0.052, 0.013, 6, 18), gold, elbow, [0, 0, side * fore * 0.92]);
    }
    mesh(ball(0.062), skin, elbow, [0, 0, side * (fore + 0.02)], [1, 1.05, 0.9]);
    return { shoulder, elbow };
  });

  // --- head ---------------------------------------------------------------
  const neck = new THREE.Group();
  neck.position.set(0, rig.neckY, 0);
  body.add(neck);
  mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.16, 12), skin, neck, [0, 0.02, 0]);

  const head = new THREE.Group();
  head.position.copy(HEAD_C);
  neck.add(head);
  mesh(ball(HEAD_R, 32, 24), skin, head, undefined, [1, 0.96, 1.02]);
  // ears
  for (const side of [1, -1]) mesh(ball(0.06, 12, 10), skin, head, [-0.01, -0.03, side * HEAD_R * 0.98], [0.6, 1, 0.5]);

  /** A group sitting on the face, with +x pointing out of the skin. */
  const onFace = (direction: [number, number, number], lift = 1) => {
    const n = new THREE.Vector3(...direction).normalize();
    const g = new THREE.Group();
    g.position.copy(n).multiplyScalar(HEAD_R * lift);
    g.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), n);
    head.add(g);
    return g;
  };

  const eyes: THREE.Object3D[] = [];
  const happyEyes: THREE.Object3D[] = [];
  const cheeks: THREE.Mesh[] = [];
  for (const side of [1, -1]) {
    const eye = onFace([0.9, -0.1, side * 0.37], 0.985);
    mesh(ball(0.064, 20, 16), flat(PALETTE.eye), eye, undefined, [0.35, 1.18, 0.9]);
    mesh(ball(0.022, 10, 8), flat("#ffffff"), eye, [0.022, 0.028, side * 0.012]);
    mesh(ball(0.011, 8, 6), flat("#ffffff"), eye, [0.024, -0.025, -side * 0.018]);
    eyes.push(eye);

    const happy = onFace([0.9, -0.1, side * 0.37], 1.0);
    const arc = mesh(new THREE.TorusGeometry(0.048, 0.012, 6, 16, Math.PI), flat(PALETTE.eye), happy);
    arc.rotation.y = Math.PI / 2;
    happy.visible = false;
    happyEyes.push(happy);

    const cheek = onFace([0.72, -0.34, side * 0.6], 0.99);
    cheeks.push(mesh(ball(0.06, 14, 10), flat(PALETTE.blush, 0.5), cheek, undefined, [0.15, 0.62, 1]));

    // a tiny lash flick at the outer corner
    if (isBride) {
      const lash = onFace([0.82, 0.02, side * 0.52], 0.995);
      const flick = mesh(new THREE.CapsuleGeometry(0.007, 0.03, 2, 4), flat(PALETTE.eye), lash);
      flick.rotation.x = side * 0.9;
    }
  }

  // a small smile
  const mouth = onFace([1, -0.42, 0], 0.995);
  const smile = new THREE.Group();
  smile.rotation.x = Math.PI;
  mouth.add(smile);
  const lips = mesh(new THREE.TorusGeometry(0.034, 0.009, 6, 14, Math.PI), flat(PALETTE.mouth), smile);
  lips.rotation.y = Math.PI / 2;

  // hair: a fringe cap over the crown and a fuller back
  const hair = toon(PALETTE.hair);
  mesh(new THREE.SphereGeometry(HEAD_R * 1.04, 32, 16, 0, Math.PI * 2, 0, 0.95), hair, head);
  mesh(
    new THREE.SphereGeometry(HEAD_R * 1.035, 32, 20, -Math.PI / 2 - 0.42, Math.PI + 0.84, 0, isBride ? 2.25 : 1.95),
    hair,
    head,
  );

  let tail: THREE.Object3D | undefined;
  if (isBride) {
    // centre parting with sindoor, maang tikka and a bindi
    const parting = onFace([0.55, 1, 0], 1.04);
    mesh(new THREE.BoxGeometry(0.01, 0.2, 0.012), flat("#d0102c"), parting).rotation.z = 0.5;
    const tikka = onFace([0.86, 0.5, 0], 1.0);
    mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.16, 4), gold, tikka, [0.004, 0.06, 0]);
    mesh(ball(0.03, 12, 10), gold, tikka, [0.012, -0.03, 0], [0.5, 1, 1]);
    mesh(ball(0.014, 8, 6), toon("#d0102c"), tikka, [0.024, -0.03, 0]);
    mesh(ball(0.012, 8, 6), flat("#d0102c"), onFace([1, 0.16, 0], 0.995), undefined, [0.4, 1, 1]);
    // jhumkas
    for (const side of [1, -1]) {
      const ear = new THREE.Group();
      ear.position.set(0, -0.12, side * HEAD_R * 0.97);
      head.add(ear);
      mesh(ball(0.016, 8, 6), gold, ear);
      mesh(new THREE.ConeGeometry(0.035, 0.05, 12, 1, true).translate(0, -0.035, 0), gold, ear);
    }
    // bun ringed with jasmine gajra
    const bun = new THREE.Group();
    bun.position.set(-HEAD_R * 0.98, -0.05, 0);
    head.add(bun);
    mesh(ball(0.14, 18, 14), hair, bun);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      mesh(ball(0.025, 8, 6), toon(PALETTE.jasmine), bun, [0.06, Math.cos(a) * 0.13, Math.sin(a) * 0.13]);
    }
    // dupatta over the crown, edged in gold
    const veil = mesh(
      new THREE.SphereGeometry(HEAD_R * 1.12, 32, 16, -Math.PI / 2 - 0.5, Math.PI + 1, 0, 1.55),
      toon(PALETTE.bride.dupatta, { side: THREE.DoubleSide, transparent: true, opacity: 0.9 }),
      head,
      [-0.03, 0.02, 0],
    );
    veil.rotation.z = 0.35;
    const edge = mesh(
      new THREE.TorusGeometry(HEAD_R * 1.12 * Math.sin(1.55), 0.012, 6, 40, Math.PI + 1),
      gold,
      veil,
      [0, HEAD_R * 1.12 * Math.cos(1.55), 0],
    );
    edge.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.5 - Math.PI / 2 + Math.PI);
  } else {
    // safa: wrapped turban with a jewelled kalgi and a feather, tail at the back
    const safa = toon(PALETTE.groom.safa);
    const crown = new THREE.Group();
    crown.position.set(0, 0.06, 0);
    crown.rotation.z = 0.12;
    head.add(crown);
    mesh(new THREE.SphereGeometry(HEAD_R * 1.1, 32, 16, 0, Math.PI * 2, 0, 1.2), safa, crown, [0, 0.02, 0], [1, 1.08, 1]);
    [
      [0.15, 0.36, 0.075],
      [0.24, 0.33, 0.06],
      [0.32, 0.25, 0.05],
    ].forEach(([y, r, tube], i) => {
      const wrap = mesh(new THREE.TorusGeometry(r, tube, 10, 36), i === 1 ? toon(PALETTE.gold) : safa, crown, [0, y, 0], [1, 1, 1.02]);
      wrap.rotation.x = Math.PI / 2;
      wrap.rotation.y = -0.18 + i * 0.05;
    });
    const kalgi = new THREE.Group();
    kalgi.position.set(0.36, 0.28, 0);
    crown.add(kalgi);
    mesh(ball(0.04, 12, 10), gold, kalgi, undefined, [0.6, 1, 1]);
    mesh(ball(0.02, 8, 6), toon("#e23b5a"), kalgi, [0.022, 0, 0]);
    const feather = mesh(new THREE.ConeGeometry(0.03, 0.22, 10).translate(0, 0.11, 0), toon("#fffaf0"), kalgi, [-0.01, 0.02, 0], [1, 1, 0.5]);
    feather.rotation.z = 0.35;
    for (let i = 0; i < 5; i++) mesh(ball(0.012, 6, 5), toon(PALETTE.rose), kalgi, [0.03, -0.05 - i * 0.022, 0]);
    tail = new THREE.Group();
    tail.position.set(-0.32, 0.12, 0);
    crown.add(tail);
    mesh(new THREE.BoxGeometry(0.03, 0.3, 0.13).translate(0, -0.15, 0), safa, tail);
    mesh(new THREE.BoxGeometry(0.032, 0.03, 0.13), gold, tail, [0, -0.3, 0]);
  }

  const drape = body.getObjectByName("drape");
  const shoulderRotation = new THREE.Euler();
  const elbowRotation = new THREE.Euler();

  return {
    root,
    pose(pose, mood) {
      ([pose.armR, pose.armL] as const).forEach((arm, i) => {
        const side = i === 0 ? 1 : -1;
        arms[i].shoulder.rotation.copy(shoulderEuler(arm, side, shoulderRotation));
        arms[i].elbow.rotation.copy(elbowEuler(arm, side, elbowRotation));
      });
      legs[0].rotation.z = pose.hipR;
      legs[1].rotation.z = pose.hipL;
      headEuler(pose, neck.rotation);

      const closed = Math.max(mood.blink, mood.happy);
      for (const eye of eyes) {
        eye.scale.set(1, Math.max(0.08, 1 - closed), 1);
        eye.visible = mood.happy < 0.6;
      }
      for (const eye of happyEyes) eye.visible = mood.happy >= 0.6;
      for (const cheek of cheeks) (cheek.material as THREE.MeshBasicMaterial).opacity = 0.4 + 0.45 * mood.blush;
      smile.scale.setScalar(1 + 0.5 * mood.happy);

      if (skirt) {
        skirt.scale.set(1 + 0.22 * mood.flare, 1 - 0.1 * mood.flare, 1 + 0.22 * mood.flare);
        skirt.rotation.z = -0.5 * mood.trail;
      }
      if (drape) drape.rotation.z = -Math.min(0.35, 0.3 * Math.max(0, mood.trail));
      if (tail) tail.rotation.z = -0.25 - 1.2 * Math.max(0, mood.trail);
    },
    dispose() {
      root.traverse((object) => (object as THREE.Mesh).geometry?.dispose());
      materials.forEach((material) => material.dispose());
      gradientMap.dispose();
    },
  };
}
