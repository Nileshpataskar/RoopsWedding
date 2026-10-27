"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { StageLayout } from "./choreography";
import { bump, clamp01, easeOutBack, ENTRANCE, OPENING, progress, type StageClock } from "./timeline";

/** Little hearts rising while the couple glance at each other. */
const SHY_HEARTS = 6;
/** Hearts bursting out of the big one once they hold hands. */
const BURST = 8;
const RISE = 1.5;

type LoveHeartsProps = {
  layout: StageLayout;
  map: THREE.Texture;
  clock: () => StageClock;
};

/** Floating hearts between the couple, and a big one when they meet. */
export function LoveHearts({ layout, map, clock }: LoveHeartsProps) {
  const shyRefs = useRef<(THREE.Sprite | null)[]>([]);
  const burstRefs = useRef<(THREE.Sprite | null)[]>([]);
  const bigRef = useRef<THREE.Sprite>(null);
  // one material each, so every heart fades on its own
  const materials = useMemo(
    () =>
      Array.from(
        { length: SHY_HEARTS + BURST + 1 },
        () => new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false }),
      ),
    [map],
  );
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  useFrame(() => {
    const now = clock();
    const size = layout.charHeight;
    const headY = layout.floorY + size * 0.82;

    shyRefs.current.forEach((sprite, i) => {
      if (!sprite) return;
      const born = ENTRANCE.glance[0] + 0.15 + i * 0.17;
      const age = (now.entrance - born) / RISE;
      sprite.visible = age > 0 && age < 1 && now.opened === null;
      if (!sprite.visible) return;
      const drift = (i % 2 ? 1 : -1) * (0.05 + 0.03 * (i % 3));
      sprite.position.set(drift * size + Math.sin(age * 7 + i) * 0.04 * size, headY + age * 0.45 * size, layout.charZ + 0.1);
      sprite.scale.setScalar((0.06 + 0.02 * (i % 3)) * size * easeOutBack(clamp01(age * 4), 2));
      sprite.material.opacity = Math.min(1, (1 - age) * 3);
      sprite.material.rotation = Math.sin(age * 9 + i) * 0.3;
    });

    const opened = now.opened ?? -1;
    const big = bigRef.current;
    if (big) {
      const pop = progress(opened, OPENING.heart);
      big.visible = pop > 0;
      // pops with an elastic overshoot, then beats like a heart
      const beat = 1 + 0.08 * Math.max(0, Math.sin((opened - OPENING.heart[0]) * 9)) * clamp01(pop * 3);
      big.scale.setScalar(0.17 * size * easeOutBack(clamp01(pop * 1.6), 2.6) * beat);
      big.position.set(0, layout.floorY + size * 1.02 + 0.04 * size * pop, layout.charZ + 0.05);
    }

    burstRefs.current.forEach((sprite, i) => {
      if (!sprite) return;
      const age = progress(opened, [OPENING.heart[0] + 0.1, OPENING.heart[1] + 0.6]);
      sprite.visible = age > 0 && age < 1;
      if (!sprite.visible) return;
      const angle = (i / BURST) * Math.PI * 2 + 0.3;
      const reach = (0.08 + 0.2 * (1 - (1 - age) ** 3)) * size;
      sprite.position.set(Math.cos(angle) * reach, layout.floorY + size * 1.02 + Math.sin(angle) * reach * 0.8, layout.charZ);
      sprite.scale.setScalar(0.045 * size * bump(age, [0, 1]) ** 0.5);
      sprite.material.opacity = 1 - age ** 2;
    });
  });

  return (
    <>
      {Array.from({ length: SHY_HEARTS }, (_, i) => (
        <sprite key={`shy${i}`} ref={(s) => void (shyRefs.current[i] = s)} material={materials[i]} visible={false} />
      ))}
      {Array.from({ length: BURST }, (_, i) => (
        <sprite key={`burst${i}`} ref={(s) => void (burstRefs.current[i] = s)} material={materials[SHY_HEARTS + i]} visible={false} />
      ))}
      <sprite ref={bigRef} material={materials[SHY_HEARTS + BURST]} visible={false} />
    </>
  );
}
