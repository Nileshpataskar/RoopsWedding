"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildChibi, type Role } from "./chibi";
import { characterFrame, characterMatrix, type Side, type StageLayout } from "./choreography";
import type { RigProfile } from "./proceduralRig";
import { ENTRANCE, type StageClock } from "./timeline";

type CoupleCharacterProps = {
  role: Role;
  layout: StageLayout;
  rig: RigProfile;
  shadow: THREE.Texture;
  clock: () => StageClock;
  onReady: () => void;
};

/** A chibi bride or groom, posed by the choreography through the opening. */
export function CoupleCharacter({ role, layout, rig, shadow, clock, onReady }: CoupleCharacterProps) {
  const side: Side = role === "bride" ? -1 : 1;
  const groupRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const chibi = useMemo(() => buildChibi(role, rig), [role, rig]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => () => chibi.dispose(), [chibi]);

  useFrame(() => {
    const group = groupRef.current;
    const blob = shadowRef.current;
    if (!group || !blob) return;
    const now = clock();
    group.visible = now.entrance >= ENTRANCE.walk[0] - 0.05;
    blob.visible = group.visible;
    if (!group.visible) return;

    const frame = characterFrame(now, side, layout, rig);
    characterMatrix(frame, group.matrix);
    group.matrixWorldNeedsUpdate = true;
    chibi.pose(frame.pose, frame.mood);
    // the shadow shrinks as they leave the floor
    blob.position.set(frame.position.x, layout.floorY + 0.005, frame.position.z);
    blob.scale.setScalar(1 - Math.min(0.5, frame.lift / frame.scale));
  });

  return (
    <>
      <group ref={groupRef} visible={false} matrixAutoUpdate={false}>
        <primitive object={chibi.root} />
      </group>
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} visible={false} renderOrder={1}>
        <planeGeometry args={[layout.charHeight * 0.6, layout.charHeight * 0.3]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
    </>
  );
}
