import { WeddingExperience } from "@/components/wedding/WeddingExperience";
import { RsvpSection } from "@/components/wedding/rsvp/RsvpSection";
import { ScratchSection } from "@/components/wedding/scratch/ScratchSection";
import { AdditionalDetails } from "@/components/wedding/sections/AdditionalDetails";
import { ClosingSection } from "@/components/wedding/sections/ClosingSection";
import { CouplePhoto } from "@/components/wedding/sections/CouplePhoto";
import { DressCodeSection } from "@/components/wedding/sections/DressCodeSection";
import { ProgramTimeline } from "@/components/wedding/sections/ProgramTimeline";
import { VenueSection } from "@/components/wedding/sections/VenueSection";
import { WeddingCountdown } from "@/components/wedding/sections/WeddingCountdown";
import { WelcomeSection } from "@/components/wedding/sections/WelcomeSection";

export default function Home() {
  return (
    <WeddingExperience>
      <WelcomeSection />
      <ScratchSection />
      <CouplePhoto />
      <WeddingCountdown />
      <ProgramTimeline />
      <VenueSection />
      <DressCodeSection />
      <AdditionalDetails />
      {/* <RsvpSection /> */}
      <ClosingSection />
    </WeddingExperience>
  );
}
