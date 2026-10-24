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
  /** ISO 8601 with offset, e.g. 2026-11-30T10:00:00Z */
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
    parents: "Son of Mr. & Mrs. Pataskar",
    qualification: "B.E.",
    profession: "Software Engineer",
  } satisfies Person,
  bride: {
    name: "Rupali",
    parents: "Daughter of Mr. & Mrs. Patil",
    qualification: "B.E.",
    profession: "Software Engineer",
  } satisfies Person,

  // PLACEHOLDER date. Times include an explicit offset; `timeZone` controls
  // how dates are displayed so server and browser render identical text.
  date: {
    start: "2026-11-30T10:00:00Z",
    end: "2026-11-30T16:00:00Z",
    timeZone: "Europe/London",
  },

  welcome:
    "We are delighted to invite you to celebrate our wedding and the beginning of our journey together. Your presence would make this special occasion even more meaningful.",

  // PLACEHOLDER illustration — replace `src` with a real photograph
  // (e.g. /images/wedding/couple-photo.webp) and set isPlaceholder to false.
  photo: {
    src: "/images/wedding/couple-photo-placeholder.svg",
    alt: "Illustration of two gold wedding rings resting among blush roses",
    width: 800,
    height: 1000,
    isPlaceholder: true,
  },

  // PLACEHOLDER schedule
  events: [
    {
      id: "arrival",
      title: "Guest Arrival",
      start: "2026-11-30T10:00:00Z",
      description: "We welcome you.",
    },
    {
      id: "ceremony",
      title: "Wedding Ceremony",
      start: "2026-11-30T10:30:00Z",
      description: "Your presence means a lot.",
    },
    {
      id: "lunch",
      title: "Wedding Lunch",
      start: "2026-11-30T13:00:00Z",
      description: "Join us at the table.",
    },
    {
      id: "farewell",
      title: "Farewell",
      start: "2026-11-30T15:30:00Z",
      description: "With love and gratitude.",
    },
  ] satisfies ProgramEvent[],

  // PLACEHOLDER venue. While `isPlaceholder` is true the site shows a small
  // note that the map location is a sample and not yet confirmed.
  venue: {
    name: "Grand Palace Hall",
    address: "City centre, London",
    mapQuery: "Grand Palace Hall, London",
    isPlaceholder: true,
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
      id: "pre-wedding",
      title: "Pre-wedding Ceremonies",
      description:
        "Details of the Haldi and other celebrations will be shared with family and close friends closer to the date.",
    },
    {
      id: "travel",
      title: "Travel & Stay",
      description:
        "Guests travelling from afar — please reach out to us and we will gladly help with transport and accommodation.",
    },
  ] satisfies DetailItem[],

  rsvp: {
    /** Inclusive date by which responses are requested. */
    deadline: "2026-11-15T23:59:00Z",
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
