import Image from "next/image";
import { wedding } from "@/lib/wedding-config";
import { Reveal } from "../ui/Reveal";

export function CouplePhoto() {
  const { photo } = wedding;
  return (
    <section aria-label="Couple photograph" className="paper-warm px-7 py-16">
      <Reveal className="mx-auto max-w-sm">
        <figure className="rounded-[14px] border border-line/80 bg-paper p-2 shadow-[0_6px_24px_rgba(81,67,53,.08)]">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 480px) 86vw, 384px"
            // SVG placeholders are served as-is; real photos go through the optimizer
            unoptimized={photo.src.endsWith(".svg")}
            className="h-auto w-full rounded-[10px] object-cover"
          />
        </figure>
      </Reveal>
    </section>
  );
}
