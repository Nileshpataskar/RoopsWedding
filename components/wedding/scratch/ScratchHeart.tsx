"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { HEART_PATH } from "../ui/Heart";

type ScratchHeartProps = {
  /** Content hidden under the green foil — rendered inside the heart. */
  children: ReactNode;
  /** Share of the heart that must be scratched before auto-completing. */
  threshold?: number;
};

// HEART_PATH lives in a 24×24 box; its ink spans roughly x 0.9–23.1, y 4.1–21.
const PATH_BOX = { x: 0.6, y: 3.8, w: 22.8, h: 17.5 };
const ASPECT = PATH_BOX.h / PATH_BOX.w;
const BRUSH = 36;
const SAMPLE_STEP = 6;

function applyHeartTransform(ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number) {
  ctx.setTransform(dpr * (w / PATH_BOX.w), 0, 0, dpr * (h / PATH_BOX.h), -PATH_BOX.x * dpr * (w / PATH_BOX.w), -PATH_BOX.y * dpr * (h / PATH_BOX.h));
}

/** Paints the textured sage foil, clipped to the heart. */
function paintFoil(ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number, fontFamily: string) {
  const heart = new Path2D(HEART_PATH);
  ctx.globalCompositeOperation = "source-over";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.save();
  applyHeartTransform(ctx, w, h, dpr);
  ctx.clip(heart);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const base = ctx.createRadialGradient(w * 0.4, h * 0.3, 10, w * 0.5, h * 0.5, w * 0.7);
  base.addColorStop(0, "#9aa37c");
  base.addColorStop(0.55, "#7b855d");
  base.addColorStop(1, "#56613f");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // fine paper grain
  for (let i = 0; i < (w * h) / 5; i++) {
    const light = Math.random() > 0.5;
    ctx.fillStyle = light ? "rgba(235,240,215,0.07)" : "rgba(30,38,20,0.09)";
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
  // metallic flecks
  for (let i = 0; i < (w * h) / 260; i++) {
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? "226,203,150" : "245,236,210"},${0.35 + Math.random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.2 + 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.font = `italic ${Math.round(w * 0.065)}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(247,240,229,0.55)";
  ctx.fillText("scratch here", w / 2, h * 0.52);
  ctx.restore();

  // embossed rim: a light inner line and a soft gold edge
  ctx.save();
  applyHeartTransform(ctx, w, h, dpr);
  ctx.lineWidth = 0.35;
  ctx.strokeStyle = "rgba(214,191,143,0.85)";
  ctx.stroke(heart);
  ctx.restore();
}

/** Grid of pixel offsets that fall inside the heart, used to measure progress. */
function sampleHeart(ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number) {
  const data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
  const samples: number[] = [];
  for (let y = 0; y < h; y += SAMPLE_STEP) {
    for (let x = 0; x < w; x += SAMPLE_STEP) {
      const offset = (Math.floor(y * dpr) * ctx.canvas.width + Math.floor(x * dpr)) * 4 + 3;
      if (data[offset] > 200) samples.push(offset);
    }
  }
  return samples;
}

export function ScratchHeart({ children, threshold = 0.55 }: ScratchHeartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const samplesRef = useRef<number[]>([]);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const [touched, setTouched] = useState(false);

  // Paint the foil on mount and whenever the heart's width really changes.
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || revealed) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let paintedWidth = 0;
    const paint = () => {
      const w = wrap.clientWidth;
      if (Math.abs(w - paintedWidth) < 2) return;
      paintedWidth = w;
      const h = w * ASPECT;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // canvas fonts cannot resolve CSS variables, so read the loaded family
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-cormorant").trim();
      paintFoil(ctx, w, h, dpr, `${family || "Georgia"}, serif`);
      samplesRef.current = sampleHeart(ctx, w, h, dpr);
      ctx.globalCompositeOperation = "destination-out";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = BRUSH;
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [revealed]);

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    const samples = samplesRef.current;
    if (!canvas || !ctx || samples.length === 0) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    for (const offset of samples) if (data[offset] < 60) cleared++;
    if (cleared / samples.length >= threshold) setRevealed(true);
  }, [threshold]);

  const scratchTo = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const from = lastPoint.current ?? point;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(point.x + 0.01, point.y);
    ctx.stroke();
    lastPoint.current = point;
    if (++moves.current % 6 === 0) measure();
  };

  return (
    <div className="mx-auto w-[min(78vw,320px)]">
      <div ref={wrapRef} className="relative w-full" style={{ aspectRatio: `${PATH_BOX.w} / ${PATH_BOX.h}` }}>
        {/* the revealed card beneath */}
        <svg
          viewBox={`${PATH_BOX.x} ${PATH_BOX.y} ${PATH_BOX.w} ${PATH_BOX.h}`}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <path d={HEART_PATH} fill="#fbf6ee" stroke="#c6a779" strokeWidth="0.25" />
          <path d={HEART_PATH} fill="none" stroke="#c6a779" strokeWidth="0.08" transform="translate(12 12.6) scale(0.9) translate(-12 -12.6)" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pb-[8%]">{children}</div>

        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full touch-none select-none transition-opacity duration-700 ease-out ${
            revealed ? "pointer-events-none opacity-0" : "cursor-grab active:cursor-grabbing"
          }`}
          onPointerDown={(event) => {
            event.preventDefault(); // no text selection while dragging
            event.currentTarget.setPointerCapture(event.pointerId);
            lastPoint.current = null;
            if (!touched) setTouched(true);
            scratchTo(event);
          }}
          onPointerMove={(event) => {
            if (event.buttons === 0 && event.pointerType === "mouse") return;
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            scratchTo(event);
          }}
          onPointerUp={() => {
            lastPoint.current = null;
            measure();
          }}
          onPointerCancel={() => {
            lastPoint.current = null;
          }}
        />
      </div>

      <p className="mt-3 min-h-6 text-center" aria-live="polite">
        {revealed ? (
          <span className="font-sans text-[0.7rem] uppercase tracking-[0.25em] text-muted">
            Date revealed
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="font-sans text-[0.7rem] uppercase tracking-[0.25em] text-muted underline decoration-line underline-offset-4 transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
          >
            {touched ? "Reveal it all" : "Reveal without scratching"}
          </button>
        )}
      </p>
    </div>
  );
}
