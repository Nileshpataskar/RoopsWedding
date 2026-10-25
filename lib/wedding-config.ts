/**
 * Every piece of wedding content lives here. Edit this file to personalise
 * the invitation — components never hardcode names, dates or places.
 *
 * Values marked PLACEHOLDER are sample data from the design reference and
 * must be replaced before the invitation is shared.
 */

export type Person = {
  name: string;
  parents: string;
  qualification?: string;
  profession?: string;
};

export type ProgramEvent = {
  id: string;
  title: string;
  /** ISO 8601 with offset, e.g. 2026-12-18T10:00:00Z */
  start: string;
  description: string;
  location?: string;
};

export type DetailItem = {
  id: string;
  title: string;
  description: string;
};

export const wedding = {
  siteName: "RoopsWedding",

  // PLACEHOLDER couple details
  groom: {
    name: "Nilesh",
    parents: "Son of Kailas Pataskar & Mayuri Pataskar",
    qualification: "B.E.",
    profession: "Software Engineer",
  } satisfies Person,
  bride: {
    name: "Rupali",
    parents: "Daughter of Bharat Patil & Sangeeta Patil",
    qualification: "B.E.",
    profession: "E&TC Engineer",
  } satisfies Person,

  // Times include an explicit offset; `timeZone` controls how dates are
  // displayed so server and browser render identical text.
  date: {
    start: "2026-12-18T10:00:00+05:30",
    end: "2026-12-18T22:00:00+05:30",
    timeZone: "Asia/Kolkata",
  },

  welcome:
    "We are delighted to invite you to celebrate our wedding and the beginning of our journey together. Your presence would make this special occasion even more meaningful.",

  photo: {
    src: "/images/wedding/couple-photo.png",
    alt: "Illustrated caricature of Nilesh in an ivory sherwani and purple pheta, smiling down at Rupali in a purple Paithani saree, framed by marigold garlands and a gold mandala",
    width: 927,
    height: 1152,
    isPlaceholder: false,
  },

  events: [
    {
      id: "engagement",
      title: "Engagement Ceremony",
      start: "2026-12-18T10:00:00+05:30",
      description: "The exchange of rings to begin celebrations.",
    },
    {
      id: "haldi",
      title: "Haldi",
      start: "2026-12-18T12:30:00+05:30",
      description: "Turmeric, laughter and blessings.",
    },
    {
      id: "vidhi",
      title: "Wedding Rituals (Vidhi)",
      start: "2026-12-18T15:30:00+05:30",
      description: "Traditional rituals performed with family.",
    },
    {
      id: "ceremony",
      title: "Wedding Ceremony",
      start: "2026-12-18T19:00:00+05:30",
      description: "Your presence means a lot.",
    },
  ] satisfies ProgramEvent[],

  // While `isPlaceholder` is true the site shows a small note that the map
  // location is a sample and not yet confirmed.
  venue: {
    name: "Murlidhar Banquet Hall",
    address:
      "Dattanagar, Alandi - Moshi Rd, Dudulgaon, PCMC, Pimpri-Chinchwad, Maharashtra 412105",
    mapQuery:
      "Murlidhar Pure Veg, Dattanagar, Alandi - Moshi Rd, Dudulgaon, Pimpri-Chinchwad, Maharashtra 412105",
    isPlaceholder: false,
  },

  dressCode: {
    women:
      "Elegant formal attire in soft, neutral or blush tones. Floor-length gowns or traditional wear are warmly welcomed.",
    men: "Formal suits or traditional attire appropriate for the occasion. Muted neutrals and deep greens are ideal.",
  },

  // Rendered only when the list is non-empty. These entries are deliberately
  // non-specific — replace with real arrangements or remove them.
  details: [
    {
      id: "travel",
      title: "Travel & Stay",
      description:
        "Guests travelling from afar — please reach out to us and we will gladly help with transport and accommodation.",
    },
  ] satisfies DetailItem[],

  rsvp: {
    /** Inclusive date by which responses are requested. */
    deadline: "2026-12-15T23:59:00+05:30",
    /** Maximum number of guests one response may include (incl. the guest). */
    maxGuests: 4,
    /**
     * Optional address for the "send by email" fallback shown when no RSVP
     * endpoint is configured. Set NEXT_PUBLIC_RSVP_ENDPOINT to store replies.
     */
    email: null as string | null,
  },

  // Add a licensed track at e.g. /audio/wedding-theme.mp3 to enable the
  // sound toggle. With `src: null` no sound control is rendered.
  music: {
    src: null as string | null,
    title: "Background music",
  },

  closing: {
    heading: "We can't wait to celebrate with you",
    message:
      "Thank you for being part of our story. With love and gratitude, we look forward to sharing this day with you.",
  },
} as const;

export type WeddingConfig = typeof wedding;
