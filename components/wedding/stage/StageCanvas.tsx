"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { CAMERA_DISTANCE, CAMERA_FOV, computeLayout, type Side } from "./choreography";
import { CHIBI_RIG } from "./chibi";
import { Confetti } from "./Confetti";
import { CoupleCharacter } from "./CoupleCharacter";
import { CurtainRope } from "./CurtainRope";
import { LoveHearts } from "./LoveHearts";
import { StageCurtain } from "./StageCurtain";
import {
  fringeTexture,
  floorTexture,
  glowTexture,
  heartTexture,
  ropeTexture,
  shadowTexture,
  velvetTexture,
} from "./stageTextures";
import { ENTRANCE, progress, type StageClock } from "./timeline";

// @react-three/fiber 9 still creates a THREE.Clock internally, which three r183+
// flags as deprecated on every mount. Drop just that notice; pass everything else on.
THREE.setConsoleFunction((type: "log" | "warn" | "error", message: string, ...params: unknown[]) => {
  if (message.startsWith("THREE.Clock: This module has been deprecated")) return;
  console[type](message, ...params);
});

export type CastStatus = "loading" | "ready" | "failed";

export type StageCanvasProps = {
  /** Read every frame: the entrance time, the guest's pull and the opening. */
  clock: () => StageClock;
  /** Whether the couple joins the entrance (false if they failed to load in time). */
  withCast: boolean;
  onGlReady: () => void;
  onCastStatus: (status: CastStatus) => void;
};

/** Catches a character that fails to build so the rest of the stage still works. */
class CastBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Wedding stage: the couple failed to appear.", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function GlowMotes({ width, height, map }: { width: number; height: number; map: THREE.Texture }) {
  const count = 46;
  const ref = useRef<THREE.Points>(null);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ((i * 7919) % 1000) / 1000), []);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    const points = ref.current;
    if (!points) return;
    const position = points.geometry.attributes.position;
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      const rise = (s * height + t * (0.12 + s * 0.12)) % height;
      position.setXYZ(
        i,
        (((s * 13.7) % 1) - 0.5) * width * 0.95 + Math.sin(t * 0.6 + i) * 0.08,
        -height / 2 + rise,
        0.3 + ((s * 5.3) % 1) * 1.6,
      );
    });
    position.needsUpdate = true;
    (points.material as THREE.PointsMaterial).opacity = 0.55 + 0.25 * Math.sin(t * 1.7);
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        map={map}
        size={0.07}
        color="#ffd27a"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function StageScene({ clock, withCast, onCastStatus }: Omit<StageCanvasProps, "onGlReady">) {
  const viewport = useThree((state) => state.viewport);
  const layout = useMemo(() => computeLayout(viewport.width, viewport.height), [viewport.width, viewport.height]);

  const textures = useMemo(
    () => ({
      velvet: velvetTexture(),
      rope: ropeTexture(),
      fringe: fringeTexture(),
      floor: floorTexture(),
      glow: glowTexture(),
      shadow: shadowTexture(),
      heart: heartTexture(),
    }),
    [],
  );
  useEffect(() => () => Object.values(textures).forEach((texture) => texture.dispose()), [textures]);

  const keyRef = useRef<THREE.SpotLight>(null);
  const fillRef = useRef<THREE.SpotLight>(null);
  const ambientRef = useRef<THREE.HemisphereLight>(null);
  useFrame(() => {
    const now = clock();
    const warm = 0.78 + 0.32 * progress(now.entrance, ENTRANCE.lightsUp) + 0.12 * progress(now.opened ?? -1, [0, 1]);
    if (keyRef.current) keyRef.current.intensity = 2.6 * warm;
    if (fillRef.current) fillRef.current.intensity = 2.0 * warm;
    if (ambientRef.current) ambientRef.current.intensity = 1.25 * warm;
  });

  const target = useMemo(() => {
    const object = new THREE.Object3D();
    object.position.set(0, layout.floorY + layout.charHeight * 0.6, 0);
    return object;
  }, [layout]);

  const cast = useRef({ bride: false, groom: false });
  const markReady = useCallback(
    (who: "bride" | "groom") => {
      cast.current[who] = true;
      if (cast.current.bride && cast.current.groom) onCastStatus("ready");
    },
    [onCastStatus],
  );
  const onBrideReady = useCallback(() => markReady("bride"), [markReady]);
  const onGroomReady = useCallback(() => markReady("groom"), [markReady]);
  const onCastError = useCallback(() => onCastStatus("failed"), [onCastStatus]);

  return (
    <>
      <hemisphereLight ref={ambientRef} args={["#f3e0ff", "#3a1844", 1]} />
      <primitive object={target} />
      <spotLight
        ref={keyRef}
        position={[-2.2, layout.height * 0.55, 6]}
        angle={0.55}
        penumbra={0.8}
        decay={0}
        color="#ffe2bf"
        target={target}
      />
      <spotLight
        ref={fillRef}
        position={[2.4, layout.height * 0.4, 6]}
        angle={0.6}
        penumbra={0.9}
        decay={0}
        color="#ffd6a8"
        target={target}
      />

      {([-1, 1] as Side[]).map((side) => (
        <StageCurtain key={side} side={side} layout={layout} map={textures.velvet} clock={clock} />
      ))}

      {/* stage floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, layout.floorY, 2]}>
        <planeGeometry args={[layout.width * 2.4, 4]} />
        <meshStandardMaterial map={textures.floor} roughness={0.42} metalness={0.05} />
      </mesh>

      {([-1, 1] as Side[]).map((side) => (
        <CurtainRope key={side} side={side} layout={layout} rig={CHIBI_RIG} textures={textures} clock={clock} />
      ))}

      <CastBoundary onError={onCastError}>
        <Suspense fallback={null}>
          <group visible={withCast}>
            <CoupleCharacter
              role="bride"
              layout={layout}
              rig={CHIBI_RIG}
              shadow={textures.shadow}
              clock={clock}
              onReady={onBrideReady}
            />
            <CoupleCharacter
              role="groom"
              layout={layout}
              rig={CHIBI_RIG}
              shadow={textures.shadow}
              clock={clock}
              onReady={onGroomReady}
            />
            <LoveHearts layout={layout} map={textures.heart} clock={clock} />
          </group>
        </Suspense>
      </CastBoundary>

      <Confetti layout={layout} clock={clock} />
      <GlowMotes width={layout.width} height={layout.height} map={textures.glow} />
    </>
  );
}

/** The WebGL stage. Loaded only in the browser (see StageOpening). */
export default function StageCanvas({ onGlReady, ...props }: StageCanvasProps) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: CAMERA_FOV, position: [0, 0, CAMERA_DISTANCE], near: 0.1, far: 50 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        // give the first frame a moment to paint before hiding the poster curtains
        requestAnimationFrame(() => requestAnimationFrame(onGlReady));
      }}
    >
      <StageScene {...props} />
    </Canvas>
  );
}
