"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EnvelopePanel } from "./EnvelopePanel";
import { EnvelopeSeal } from "./EnvelopeSeal";

export type EnvelopeState = "closed" | "opening" | "revealed";

type InvitationEnvelopeProps = {
  state: EnvelopeState;
  onOpen: () => void;
  onOpened: () => void;
};

const DOOR_EASE = [0.65, 0, 0.3, 1] as const;

/**
 * Full-viewport gatefold envelope. Tapping the seal swings both panels open
 * from the centre seam, revealing the invitation that is already rendered
 * beneath it. The parent unmounts it once the sequence reports completion.
 */
export function InvitationEnvelope({ state, onOpen, onOpened }: InvitationEnvelopeProps) {
  const reduce = useReducedMotion();
  const opening = state === "opening";

  const doorTransition = reduce
    ? { duration: 0.3 }
    : { duration: 1.5, delay: 0.45, ease: DOOR_EASE };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center"
      aria-hidden={opening}
      animate={opening ? { opacity: 0 } : { opacity: 1 }}
      transition={reduce ? { duration: 0.35 } : { duration: 0.6, delay: 1.55, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (opening) onOpened();
      }}
    >
      {/* desktop backdrop surrounding the portrait envelope */}
      <motion.div
        className="backdrop absolute inset-0"
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: reduce ? 0.2 : 1, delay: reduce ? 0 : 0.5 }}
      />

      <div
        className="relative h-full w-full max-w-[520px] md:shadow-[0_0_60px_rgba(60,50,30,.25)]"
        style={{ perspective: 1800 }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2"
          style={{ transformOrigin: "left center", backfaceVisibility: "hidden" }}
          animate={opening ? (reduce ? { opacity: 0 } : { rotateY: -112, x: -6 }) : { rotateY: 0 }}
          transition={doorTransition}
        >
          <EnvelopePanel side="left" />
        </motion.div>
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{ transformOrigin: "right center", backfaceVisibility: "hidden" }}
          animate={opening ? (reduce ? { opacity: 0 } : { rotateY: 112, x: 6 }) : { rotateY: 0 }}
          transition={{ ...doorTransition, delay: reduce ? 0 : 0.5 }}
        >
          <EnvelopePanel side="right" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            type="button"
            onClick={() => {
              if (state === "closed") onOpen();
            }}
            disabled={state !== "closed"}
            aria-label="Tap to open the wedding invitation"
            className="relative h-[min(42svh,300px)] w-auto cursor-pointer rounded-full drop-shadow-[0_8px_14px_rgba(30,35,20,.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper disabled:cursor-default"
            style={{ aspectRatio: "160 / 240" }}
            whileTap={state === "closed" ? { scale: 0.95 } : undefined}
            animate={
              opening
                ? reduce
                  ? { opacity: 0 }
                  : { scale: [1, 1.08, 0.6], opacity: [1, 1, 0], rotate: [0, 0, -6] }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: reduce ? 0.2 : 0.6, ease: "easeInOut", times: [0, 0.35, 1] }}
          >
            <span className={`block h-full w-full ${state === "closed" ? "seal-breathe" : ""}`}>
              <EnvelopeSeal />
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
