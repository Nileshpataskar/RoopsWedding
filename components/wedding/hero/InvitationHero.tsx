"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { wedding, type Person } from "@/lib/wedding-config";
import { Mandala } from "../illustrations/Mandala";
import { Heart } from "../ui/Heart";
import { HeartDivider } from "../ui/HeartDivider";
import { CurtainDrape } from "./CurtainDrape";
import { CurtainSwags } from "./CurtainSwags";
import { FallingPetals } from "./FallingPetals";
import { GardenScene } from "./GardenScene";
import { MarigoldString } from "./MarigoldString";

type InvitationHeroProps = {
  /** Becomes true when the envelope starts opening; drives the entrance. */
  active: boolean;
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.9 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function PersonDetails({ person }: { person: Person }) {
  return (
    <motion.p variants={item} className="mt-1 text-[0.95rem] leading-snug text-muted">
      {person.parents}
      {person.qualification && (
        <>
          <br />
          {person.qualification}
        </>
      )}
      {person.profession && (
        <>
          <br />
          {person.profession}
        </>
      )}
    </motion.p>
  );
}

const nameClass = "font-script text-[clamp(3.3rem,15vw,4.4rem)] leading-[1.05] text-royal";

// Hanging marigold strings over the side drapes: [left %, blossoms, sway offset].
const STRINGS = [
  [3, 22, 0],
  [8.5, 14, 1.4],
  [91.5, 14, 2.1],
  [97, 22, 0.7],
] as const;

export function InvitationHero({ active }: InvitationHeroProps) {
  const { groom, bride } = wedding;

  return (
    <section
      aria-labelledby="hero-title"
      className="paper relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      {/* side drapes sit behind the swags and garden */}
      <CurtainDrape className="pointer-events-none absolute inset-y-0 left-0 -z-10 h-full w-[13%]" />
      <CurtainDrape className="pointer-events-none absolute inset-y-0 right-0 -z-10 h-full w-[13%] -scale-x-100" />

      {STRINGS.map(([left, count, delay], index) => (
        <motion.div
          key={left}
          className="pointer-events-none absolute top-[3%] z-[5] w-[4.6%] -translate-x-1/2"
          style={{ left: `${left}%` }}
          initial={{ y: "-110%" }}
          animate={active ? { y: 0 } : { y: "-110%" }}
          transition={{ type: "spring", stiffness: 60, damping: 11, delay: 0.7 + index * 0.12 }}
        >
          <MarigoldString count={count} delay={delay} className="block w-full" />
        </motion.div>
      ))}

      <CurtainSwags className="pointer-events-none relative z-10 w-full" />

      {active && <FallingPetals className="absolute inset-0 z-20" />}

      <motion.div
        className="relative z-0 -mt-[6%] flex flex-1 flex-col items-center justify-center px-[15%] pb-2 text-center"
        variants={container}
        initial="hidden"
        animate={active ? "show" : "hidden"}
      >
        {/* slowly turning rangoli behind the names */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 text-champagne"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={active ? { opacity: 0.22, scale: 1 } : { opacity: 0, scale: 0.6 }}
          transition={{ duration: 2.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Mandala className="spin-slow block w-full" />
        </motion.div>

        <motion.div variants={item}>
          <Heart className="mx-auto h-3.5 w-3.5 text-plum" />
        </motion.div>
        <motion.p
          variants={item}
          id="hero-title"
          className="mt-2 font-sans text-[0.72rem] uppercase tracking-[0.35em] text-plum"
        >
          We&rsquo;re getting married
        </motion.p>
        <motion.div variants={item} className="mt-2 w-full">
          <HeartDivider width="w-32" />
        </motion.div>

        <motion.p variants={item} className={`${nameClass} mt-3`}>
          {bride.name}
        </motion.p>
        {/* <PersonDetails person={bride} /> */}

        <motion.p
          variants={item}
          aria-label="and"
          className="font-script gold-shimmer my-1 px-2 text-[2.6rem] leading-none"
        >
          &amp;
        </motion.p>
        <motion.h1 variants={item} className={`${nameClass} mt-3`}>
          {groom.name}
        </motion.h1>
        {/* <PersonDetails person={groom} /> */}



      </motion.div>

      <div className="pointer-events-none relative">
        <GardenScene className="block w-full" />
        <a
          href="#welcome"
          aria-label="Scroll to the invitation message"
          className="animate-float-down pointer-events-auto absolute bottom-1.5 left-1/2 -ml-5 flex h-10 w-10 items-center justify-center rounded-full text-antique"
        >
          <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
}
