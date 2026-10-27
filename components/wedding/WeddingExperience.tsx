"use client";

import { MotionConfig } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { wedding } from "@/lib/wedding-config";
import { InvitationHero } from "./hero/InvitationHero";
import { StageOpening, type OpeningState } from "./stage/StageOpening";
import { SoundToggle } from "./ui/SoundToggle";

type WeddingExperienceProps = {
  /** Server-rendered sections that follow the hero. */
  children: ReactNode;
};

/**
 * Owns the opening state machine: closed → opening → revealed.
 * The page stays locked under the curtained stage until the sequence finishes;
 * the hero starts its entrance as soon as the curtains begin to part.
 */
export function WeddingExperience({ children }: WeddingExperienceProps) {
  const [state, setState] = useState<OpeningState>("closed");
  const [heroActive, setHeroActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const music = wedding.music.src;

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = state === "revealed" ? "" : "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [state]);

  const open = () => {
    setState("opening");
    // Pulling the rope is a user gesture, so starting music here is permitted.
    audioRef.current?.play().catch(() => undefined);
  };
  const reveal = useCallback(() => setHeroActive(true), []);
  const finish = useCallback(() => setState("revealed"), []);

  return (
    <MotionConfig reducedMotion="user">
      {state !== "revealed" && (
        <StageOpening onOpen={open} onReveal={reveal} onFinished={finish} />
      )}
      {music && <SoundToggle src={music} title={wedding.music.title} audioRef={audioRef} />}

      <main
        className="relative mx-auto w-full max-w-[520px] overflow-x-clip md:shadow-[0_0_80px_rgba(15,4,20,.55)]"
        aria-hidden={state === "closed" ? true : undefined}
        inert={state === "closed" ? true : undefined}
      >
        <InvitationHero active={heroActive} />
        {children}
      </main>
    </MotionConfig>
  );
}
