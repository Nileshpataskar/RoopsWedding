import { MapPin } from "lucide-react";
import { wedding } from "@/lib/wedding-config";
import { PalaceLineArt } from "../illustrations/PalaceLineArt";
import { pillClass } from "../ui/PillButton";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const { venue } = wedding;
const query = encodeURIComponent(venue.mapQuery);
const embedUrl = `https://www.google.com/maps?q=${query}&output=embed`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

export function VenueSection() {
  return (
    <section aria-labelledby="venue-title" className="paper px-6 py-20">
      <SectionHeading id="venue-title" icon={<MapPin className="h-5 w-5" strokeWidth={1.3} />}>
        Venue
      </SectionHeading>

      <Reveal delay={0.1} className="mt-6 text-center">
        <p className="text-[1.6rem] font-medium leading-tight text-ink">{venue.name}</p>
        <p className="mt-1 text-[1.05rem] italic text-muted">{venue.address}</p>
      </Reveal>

      <Reveal delay={0.2} className="mx-auto mt-8 max-w-sm">
        <div className="overflow-hidden rounded-xl border border-line bg-cream p-1.5">
          <iframe
            title={`Map showing ${venue.name}`}
            src={embedUrl}
            className="block aspect-[4/3] w-full rounded-lg border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        {venue.isPlaceholder && (
          <p className="mt-2 text-center font-sans text-[0.62rem] uppercase tracking-[0.15em] text-muted">
            Sample location — map to be confirmed
          </p>
        )}
      </Reveal>

      <Reveal delay={0.25} className="mt-7 text-center">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={pillClass}>
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
          View on Google Maps
        </a>
      </Reveal>

      <Reveal y={0} delay={0.3} className="mt-12">
        <PalaceLineArt className="mx-auto w-full max-w-sm text-antique/35" />
      </Reveal>
    </section>
  );
}
