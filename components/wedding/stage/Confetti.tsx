"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { StageLayout } from "./choreography";
import { OPENING, type StageClock } from "./timeline";

const COUNT = 110;
const COLORS = ["#f3cf7a", "#ffffff", "#ff8fb1", "#f39a1e", "#c9a0ff", "#ffd9e6"];
const GRAVITY = 3.2;

/** A small seeded random so the burst looks the same on every visit. */
function random(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** Two confetti poppers firing from the stage corners as the couple cheer. */
export function Confetti({ layout, clock }: { layout: StageLayout; clock: () => StageClock }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const pieces = useMemo(() => {
    const rand = random(11);
    return Array.from({ length: COUNT }, (_, i) => {
      const side = i % 2 ? 1 : -1;
      return {
        side,
        delay: rand() * 0.25,
        vx: -side * (0.6 + rand() * 1.8),
        vy: 3 + rand() * 2.4,
        spin: new THREE.Vector3(rand() * 9, rand() * 9, rand() * 9),
        flutter: rand() * Math.PI * 2,
        size: 0.6 + rand() * 0.6,
        color: new THREE.Color(COLORS[i % COLORS.length]),
      };
    });
  }, []);

  const scratch = useMemo(
    () => ({
      matrix: new THREE.Matrix4(),
      quat: new THREE.Quaternion(),
      euler: new THREE.Euler(),
      pos: new THREE.Vector3(),
      scale: new THREE.Vector3(),
    }),
    [],
  );

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    pieces.forEach((p, i) => mesh.setColorAt(i, p.color));
    mesh.instanceColor!.needsUpdate = true;
  }, [pieces]);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const opened = clock().opened;
    const t0 = opened === null ? -1 : opened - OPENING.cheer[0];
    mesh.visible = t0 > 0;
    if (!mesh.visible) return;
    const { matrix, quat, euler, pos, scale } = scratch;
    const unit = layout.charHeight * 0.035;
    pieces.forEach((p, i) => {
      const s = Math.max(0, t0 - p.delay);
      // air drag: they shoot up fast, then drift down fluttering
      const drag = 1 - Math.exp(-s * 1.6);
      pos.set(
        p.side * layout.width * 0.46 + (p.vx / 1.6) * drag + 0.12 * Math.sin(s * 3 + p.flutter),
        layout.floorY + (p.vy / 1.6) * drag - 0.5 * GRAVITY * 0.35 * s * s,
        // some flutter behind the couple, some in front
        layout.charZ + (i % 3 ? -0.3 : 0.35),
      );
      euler.set(p.spin.x * s, p.spin.y * s, p.spin.z * s);
      quat.setFromEuler(euler);
      scale.set(unit * p.size, unit * p.size * 1.6, 1).multiplyScalar(s > 0 ? 1 : 0);
      mesh.setMatrixAt(i, matrix.compose(pos, quat, scale));
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} visible={false} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  );
}
