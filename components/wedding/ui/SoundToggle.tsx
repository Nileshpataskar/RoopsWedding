"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useState, type RefObject } from "react";

type SoundToggleProps = {
  src: string;
  title: string;
  audioRef: RefObject<HTMLAudioElement | null>;
};

/**
 * Small floating music control. The parent starts playback from the envelope
 * tap (a user gesture) through `audioRef`; the icon mirrors the real audio
 * state via the element's play/pause events.
 */
export function SoundToggle({ src, title, audioRef }: SoundToggleProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        aria-pressed={playing}
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;
          if (audio.paused) audio.play().catch(() => setPlaying(false));
          else audio.pause();
        }}
        className="fixed top-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper/85 text-olive shadow-sm transition hover:bg-paper active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive md:right-[calc(50%-260px+1rem)]"
      >
        {playing ? (
          <Volume2 className="h-4 w-4" strokeWidth={1.6} />
        ) : (
          <VolumeX className="h-4 w-4" strokeWidth={1.6} />
        )}
      </button>
    </>
  );
}
