"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronsDown } from "lucide-react";
import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type ReactNode,
} from "react";
import { CurtainSwags } from "../hero/CurtainSwags";
import { FallingPetals } from "../hero/FallingPetals";
import { CurtainFallback } from "./CurtainFallback";
import { createDirector, readClock } from "./director";
import type { CastStatus } from "./StageCanvas";
import { clamp01, OPENING, PROMPT_AT, REVEAL_AT } from "./timeline";

const StageCanvas = dynamic(() => import("./StageCanvas"), { ssr: false });

export type OpeningState = "closed" | "opening" | "revealed";

/** How long to wait for the stage and couple to load before going without them. */
const LOAD_WAIT_MS = 6000;
/** Drag distance, as a share of the stage height, for a full pull. */
const FULL_PULL = 0.3;
/** Letting go past this much of a pull opens the curtains; less springs back. */
const OPEN_THRESHOLD = 0.3;
/** Movement under this many pixels counts as a tap, which also opens. */
const TAP_SLOP = 8;

const SIMPLE = { reveal: 0.15, fade: [1.2, 1.8] } as const;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Hydration-safe reduced-motion preference (the server always renders the full stage). */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/** If WebGL cannot start, fall back to the SVG curtains. */
class GlBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Wedding stage: WebGL is unavailable, using the simple curtains.", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type StageOpeningProps = {
  /** The guest pulled the rope (a user gesture, so music may start). */
  onOpen: () => void;
  /** The curtains have begun to part; the invitation can start its entrance. */
  onReveal: () => void;
  /** The stage has faded away and can be removed. */
  onFinished: () => void;
};

/**
 * Full-viewport wedding stage that conceals the invitation behind closed
 * curtains. Once loaded, the couple walk in and take hold of the curtain
 * ropes; the guest then pulls the rope (drag down, tap or keyboard) and the
 * couple pull with them, opening the curtains onto the invitation.
 */
export function StageOpening({ onOpen, onReveal, onFinished }: StageOpeningProps) {
  const reduce = usePrefersReducedMotion();
  const [gl, setGl] = useState<"pending" | "ready" | "failed">("pending");
  const [timedOut, setTimedOut] = useState(false);
  const [entrance, setEntrance] = useState<{ withCast: boolean } | null>(null);
  const [stagePrompt, setStagePrompt] = useState(false);
  const [opened, setOpened] = useState<{ at: number; mode: "stage" | "simple" } | null>(null);
  const [fading, setFading] = useState(false);

  const director = useRef(createDirector());
  const loading = useRef({ gl: "pending", cast: "loading" as CastStatus });
  const drag = useRef<{ y: number; height: number } | null>(null);
  // The 3D scene reads the cue sheet every frame, never waiting on React renders.
  const clock = useCallback(() => readClock(director.current), []);

  const mode =
    reduce || gl === "failed" || (timedOut && gl !== "ready") ? "simple" : entrance ? "stage" : "loading";
  const canPull = opened === null && (mode === "simple" || stagePrompt);

  /** Starts the couple's entrance once the stage (and ideally the couple) has loaded. */
  const startEntrance = useCallback((force: boolean) => {
    const { gl, cast } = loading.current;
    if (director.current.entranceAt !== null || gl !== "ready") return;
    if (cast === "loading" && !force) return;
    director.current.entranceAt = performance.now();
    setEntrance({ withCast: cast === "ready" });
    setTimeout(() => setStagePrompt(true), PROMPT_AT * 1000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
      startEntrance(true);
    }, LOAD_WAIT_MS);
    return () => clearTimeout(timer);
  }, [startEntrance]);

  const handleGlReady = useCallback(() => {
    loading.current.gl = "ready";
    setGl("ready");
    startEntrance(false);
  }, [startEntrance]);

  const handleGlError = useCallback(() => {
    loading.current.gl = "failed";
    setGl("failed");
  }, []);

  const handleCast = useCallback(
    (status: CastStatus) => {
      loading.current.cast = status;
      startEntrance(false);
    },
    [startEntrance],
  );

  const open = () => {
    const d = director.current;
    if (d.openedAt !== null || !canPull) return;
    const now = performance.now();
    d.pullAtOpen = readClock(d, now).pull;
    d.dragging = false;
    d.openedAt = now;
    setOpened({ at: now, mode: mode === "stage" ? "stage" : "simple" });
    onOpen();
  };

  // Hand the reveal and fade to the invitation at the choreographed moments.
  useEffect(() => {
    if (!opened) return;
    const at = (seconds: number, fn: () => void) =>
      setTimeout(fn, Math.max(0, opened.at + seconds * 1000 - performance.now()));
    const stage = opened.mode === "stage";
    const timers = [
      at(stage ? REVEAL_AT : SIMPLE.reveal, onReveal),
      at(stage ? OPENING.fade[0] : SIMPLE.fade[0], () => setFading(true)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [opened, onReveal]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!canPull) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { y: event.clientY, height: event.currentTarget.clientHeight };
    director.current.dragging = true;
    director.current.drag = 0;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    director.current.drag = clamp01((event.clientY - drag.current.y) / (drag.current.height * FULL_PULL));
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    if (!drag.current) return;
    const moved = Math.abs(event.clientY - drag.current.y);
    drag.current = null;
    const d = director.current;
    if (!cancelled && (d.drag >= OPEN_THRESHOLD || moved < TAP_SLOP)) {
      open();
      return;
    }
    // not far enough: the rope springs back up
    d.dragging = false;
    d.springFrom = d.drag;
    d.springAt = performance.now();
    d.drag = 0;
  };

  const fadeSeconds = mode === "stage" ? OPENING.fade[1] - OPENING.fade[0] : SIMPLE.fade[1] - SIMPLE.fade[0];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center"
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: fadeSeconds, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (fading) onFinished();
      }}
    >
      <div
        className={`relative h-full w-full max-w-[520px] touch-none overflow-hidden select-none md:shadow-[0_0_80px_rgba(15,4,20,.6)] ${canPull ? "cursor-grab active:cursor-grabbing" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endDrag(event, false)}
        onPointerCancel={(event) => endDrag(event, true)}
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: gl !== "ready" || mode === "simple" ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <CurtainFallback open={opened?.mode === "simple"} />
        </motion.div>

        {!reduce && gl !== "failed" && mode !== "simple" && (
          <GlBoundary onError={handleGlError}>
            <StageCanvas
              clock={clock}
              withCast={entrance?.withCast ?? true}
              onGlReady={handleGlReady}
              onCastStatus={handleCast}
            />
          </GlBoundary>
        )}

        {/* warm stage lighting from above */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 42% 55% at 22% 18%, rgba(255,196,110,.22), transparent 70%), radial-gradient(ellipse 42% 55% at 78% 18%, rgba(255,196,110,.22), transparent 70%), radial-gradient(ellipse 70% 30% at 50% 100%, rgba(255,170,80,.18), transparent 75%)",
          }}
          initial={false}
          animate={{ opacity: mode === "loading" ? 0.7 : 1 }}
          transition={{ duration: 1.2 }}
        />

        <CurtainSwags className="pointer-events-none absolute inset-x-0 top-0 z-10 w-full" />
        <FallingPetals className="absolute inset-0 z-20" />

        <div className="pointer-events-none absolute inset-x-0 bottom-[3svh] z-30 flex justify-center">
          <AnimatePresence>
            {mode === "loading" && (
              <motion.p
                key="loading"
                role="status"
                className="mb-6 font-sans text-[0.7rem] uppercase tracking-[0.3em] text-champagne"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.8 } }}
                exit={{ opacity: 0 }}
              >
                Preparing the stage…
              </motion.p>
            )}
            {canPull && (
              <motion.button
                key="prompt"
                type="button"
                onClick={open}
                aria-label="Pull the rope to open the wedding invitation"
                className="pointer-events-auto flex flex-col items-center rounded-3xl px-8 pt-2 pb-1 [background:radial-gradient(ellipse_at_center,rgba(30,8,36,.8),rgba(30,8,36,.45)_55%,transparent_75%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-script text-[2.2rem] leading-tight text-[#fff1d6] [text-shadow:0_0_14px_rgba(240,190,100,.55),0_2px_4px_rgba(20,4,24,.8)]">
                  Pull the rope
                </span>
                <span className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-champagne">
                  Drag down to open
                </span>
                <ChevronsDown className="animate-float-down mt-1 h-5 w-5 text-champagne" strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
