"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { ropeHand, type Side, type StageLayout } from "./choreography";
import type { RigProfile } from "./proceduralRig";
import { leadingEdgeX } from "./StageCurtain";
import { easeOutBack, ENTRANCE, OPENING, progress, READY_TO_PULL, type StageClock } from "./timeline";

const RADIUS = 0.022;
/** Rope that hangs below the gripping hand, ending in the tassel. */
const TAIL = 0.42;
/** Texture repeats per world unit of rope. */
const TWIST = 9;

const DOWN = new THREE.Vector3(0, -1, 0);
const UP = new THREE.Vector3(0, 1, 0);

type CurtainRopeProps = {
  side: Side;
  layout: StageLayout;
  rig: RigProfile;
  textures: { rope: THREE.Texture; fringe: THREE.Texture };
  clock: () => StageClock;
};

/**
 * A pull rope hanging from a gold pulley under the valance. A traveller cord
 * runs from the pulley to the curtain's leading edge, so pulling the rope is
 * visibly what draws the curtain aside.
 */
export function CurtainRope({ side, layout, rig, textures, clock }: CurtainRopeProps) {
  const swingRef = useRef<THREE.Group>(null);
  const ropeRef = useRef<THREE.Mesh>(null);
  const tasselRef = useRef<THREE.Group>(null);
  const cordRef = useRef<THREE.Mesh>(null);
  const rootRef = useRef<THREE.Group>(null);

  // The rope hangs exactly where the hand will close on it.
  const { pulley, restLength } = useMemo(() => {
    const grip = ropeHand(READY_TO_PULL, side, layout, rig);
    const top = new THREE.Vector3(grip.x, layout.pulleyY, grip.z);
    return { pulley: top, restLength: top.y - grip.y + TAIL };
  }, [side, layout, rig]);

  const ropeMap = useMemo(() => {
    const map = textures.rope.clone();
    map.needsUpdate = true;
    return map;
  }, [textures.rope]);

  const materials = useMemo(
    () => ({
      rope: new THREE.MeshStandardMaterial({ map: ropeMap, roughness: 0.45, metalness: 0.25 }),
      gold: new THREE.MeshStandardMaterial({ color: "#d9ad55", roughness: 0.3, metalness: 0.55, emissive: "#3a2205" }),
      fringe: new THREE.MeshStandardMaterial({ map: textures.fringe, roughness: 0.55, metalness: 0.2 }),
      plum: new THREE.MeshStandardMaterial({ color: "#6b2f7a", roughness: 0.5 }),
    }),
    [ropeMap, textures.fringe],
  );

  const ropeGeometry = useMemo(() => new THREE.CylinderGeometry(RADIUS, RADIUS, 1, 10, 1, true).translate(0, -0.5, 0), []);
  const cordGeometry = useMemo(() => new THREE.CylinderGeometry(0.009, 0.009, 1, 6, 1, true).translate(0, 0.5, 0), []);

  const scratch = useRef({ hand: new THREE.Vector3(), dir: new THREE.Vector3(), edge: new THREE.Vector3() });
  const release = useRef<{ angle: THREE.Vector3; length: number } | null>(null);

  useFrame((state) => {
    const now = clock();
    const opened = now.opened ?? -1;
    const root = rootRef.current;
    const swing = swingRef.current;
    const rope = ropeRef.current;
    const tassel = tasselRef.current;
    const cord = cordRef.current;
    if (!root || !swing || !rope || !tassel || !cord) return;
    const { hand, dir, edge } = scratch.current;
    const map = (rope.material as THREE.MeshStandardMaterial).map!;

    // drop down from the pelmet
    const drop = progress(now.entrance, ENTRANCE.ropes);
    root.visible = drop > 0;
    if (!root.visible) return;

    let length = restLength * Math.max(0.001, easeOutBack(drop, 1.1));
    dir.copy(DOWN);
    const letGo = opened >= OPENING.release[0];
    const gripped = now.entrance >= ENTRANCE.reach[1] && !letGo;

    if (gripped) {
      ropeHand(now, side, layout, rig, hand);
      dir.subVectors(hand, pulley);
      length = dir.length() + TAIL;
      dir.normalize();
      release.current = { angle: dir.clone(), length };
    } else if (letGo && release.current) {
      // let go: settle back to hanging straight with a damped swing
      const since = opened - OPENING.release[0];
      const k = Math.exp(-since * 2.4) * Math.cos(since * 6.5);
      dir.copy(release.current.angle).lerp(DOWN, 1 - k).normalize();
      length = release.current.length;
    } else {
      // a whisper of sway while hanging
      dir.x += Math.sin(state.clock.elapsedTime * 1.3 + side) * 0.012;
      dir.normalize();
    }

    swing.quaternion.setFromUnitVectors(DOWN, dir);
    rope.scale.set(1, length, 1);
    map.repeat.set(1, length * TWIST);
    // the twist scrolls as rope is drawn down through the pulley
    map.offset.y = (length - restLength) * TWIST;
    tassel.position.set(0, -length, 0);

    // traveller cord from the pulley to the curtain's leading edge
    const span = edge.set(leadingEdgeX(now, side, layout), layout.pulleyY + 0.02, 0.04).sub(pulley);
    cord.scale.set(1, span.length(), 1);
    cord.quaternion.setFromUnitVectors(UP, span.normalize());
  });

  return (
    <group ref={rootRef} position={pulley} visible={false}>
      {/* pulley wheel with a bracket back to the curtain rail */}
      <mesh material={materials.gold} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.016, 8, 20]} />
      </mesh>
      <mesh material={materials.gold}>
        <sphereGeometry args={[0.024, 12, 8]} />
      </mesh>
      <mesh material={materials.gold} position={[0, 0, -pulley.z / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.011, 0.011, pulley.z, 6]} />
      </mesh>
      <mesh ref={cordRef} geometry={cordGeometry} material={materials.gold} />

      <group ref={swingRef}>
        <mesh ref={ropeRef} geometry={ropeGeometry} material={materials.rope} />
        <group ref={tasselRef}>
          <mesh material={materials.gold} position={[0, -0.03, 0]}>
            <sphereGeometry args={[0.045, 16, 12]} />
          </mesh>
          <mesh material={materials.plum} position={[0, -0.075, 0]}>
            <cylinderGeometry args={[0.03, 0.036, 0.03, 16]} />
          </mesh>
          <mesh material={materials.fringe} position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.036, 0.072, 0.19, 20, 1, true]} />
          </mesh>
          <mesh material={materials.gold} position={[0, -0.28, 0]}>
            <sphereGeometry args={[0.018, 10, 8]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
