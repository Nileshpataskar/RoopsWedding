"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Side, StageLayout } from "./choreography";
import { easeOutBack, lerp, OPENING, progress, type StageClock } from "./timeline";

const COLS = 56;
const ROWS = 28;
const FOLDS = 7;
/** Seconds the hem trails behind the top rail as the curtain travels. */
const HEM_LAG = 0.24;
/** Gathered width as a share of the stage, matching the hero's side drapes (13%). */
const GATHERED = 0.13;

/** How far the curtains part while the guest is still pulling the rope. */
const PEEK = 0.14;

/** How far open a row of the curtain is (0 closed → ~1 gathered), v = 0 at the hem. */
export function curtainOpen(clock: StageClock, v: number) {
  if (clock.opened === null) return PEEK * clock.pull;
  const travel = easeOutBack(progress(clock.opened - HEM_LAG * (1 - v), OPENING.curtains), 0.55);
  return lerp(PEEK * clock.pullAtOpen, 1, travel);
}

/** The curtain's leading edge (top corner) x position for the rope's traveller cord. */
export function leadingEdgeX(clock: StageClock, side: Side, layout: StageLayout) {
  const { outer, width } = extent(layout, side);
  return outer - side * width * lerp(1, gatherFactor(layout), curtainOpen(clock, 1));
}

function extent(layout: StageLayout, side: Side) {
  const outer = side * (layout.width / 2 + 0.06);
  // closed curtains cross slightly at the centre
  return { outer, width: layout.width / 2 + 0.06 + 0.05 };
}

const gatherFactor = (layout: StageLayout) => (layout.width * GATHERED) / extent(layout, 1).width;

type StageCurtainProps = {
  side: Side;
  layout: StageLayout;
  map: THREE.Texture;
  clock: () => StageClock;
};

/** One velvet curtain, gathered by deforming a grid every frame. */
export function StageCurtain({ side, layout, map, clock }: StageCurtainProps) {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1, COLS, ROWS);
    // PlaneGeometry runs u left → right; flip it on the left curtain so u = 1 is
    // always the leading (centre) edge where the zari border is woven.
    const uv = g.attributes.uv;
    if (side > 0) for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
    return g;
  }, [side]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map,
        roughness: 0.78,
        sheen: 1,
        sheenColor: new THREE.Color("#b58ad6"),
        sheenRoughness: 0.4,
        side: THREE.DoubleSide,
      }),
    [map],
  );

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const now = clock();
    const idle = state.clock.elapsedTime;
    const { outer, width } = extent(layout, side);
    const gathered = gatherFactor(layout);
    const { geometry } = mesh;
    const position = geometry.attributes.position;
    const uv = geometry.attributes.uv;

    for (let i = 0; i < position.count; i++) {
      const u = uv.getX(i);
      const v = uv.getY(i);
      const open = curtainOpen(now, v);
      // fabric speed drives a ripple that runs down the cloth while it travels
      const before = now.opened === null ? open : curtainOpen({ ...now, opened: now.opened - 0.06 }, v);
      const speed = (open - before) / 0.06;
      const g = lerp(1, gathered, open);

      const fold = Math.sin(u * FOLDS * Math.PI * 2 + side * 0.6);
      const depth = 0.035 + 0.13 * Math.min(1, Math.max(0, open));
      const ripple = speed * 0.06 * Math.sin(v * 9 - idle * 8 + u * 3) * u;
      const breathe = 0.012 * Math.sin(idle * 1.1 + u * 5 + v * 2) * u;

      position.setXYZ(
        i,
        outer - side * u * width * g,
        lerp(layout.floorY - 0.02, layout.topY, v),
        (side < 0 ? 0.03 : 0) + depth * fold + ripple + breathe,
      );
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} frustumCulled={false} />;
}
