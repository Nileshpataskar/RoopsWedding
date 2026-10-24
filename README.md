# RoopsWedding

An animated digital wedding invitation built with Next.js (App Router), React, TypeScript, Tailwind CSS v4 and Framer Motion.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Personalise

All content lives in [`lib/wedding-config.ts`](lib/wedding-config.ts): names, families, date and time zone, schedule, venue, dress code, extra details, RSVP settings, photo and music. Values marked `PLACEHOLDER` must be replaced before sharing.

- **Photo:** put your image in `public/images/wedding/` and update `photo.src`, `width`, `height` and `alt`.
- **Venue map:** set `venue.mapQuery` to the real address and `isPlaceholder: false`.
- **Music:** add a licensed track (e.g. `public/audio/theme.mp3`) and set `music.src`. The sound toggle appears only when a track is configured, and playback starts on the envelope tap.

## RSVP storage

The form posts JSON to `NEXT_PUBLIC_RSVP_ENDPOINT` (see [`lib/rsvp.ts`](lib/rsvp.ts)). Create `.env.local`:

```
NEXT_PUBLIC_RSVP_ENDPOINT=https://formspree.io/f/your-id
```

Any JSON-accepting service works: Formspree, Getform, a Google Apps Script writing to a Sheet, or your own API route. Without it, guests see a clear note that their reply was **not** saved; set `rsvp.email` to offer a pre-filled email fallback.

## Structure

```
app/                      layout (fonts, metadata), page, globals.css
components/wedding/
  WeddingExperience.tsx   envelope state machine: closed → opening → revealed
  envelope/               gatefold panels, leaf pattern, seal
  hero/                   curtains, garden & fountain, names
  scratch/                scratch-to-reveal canvas, save-the-date
  sections/               welcome, photo, countdown, timeline, venue, dress code, details, closing
  rsvp/                   RSVP section and form
  illustrations/          palace line art, dress-code icons
  ui/                     heart, divider, headings, reveal, buttons, sound toggle
lib/                      config, formatting, countdown, calendar (.ics), validation, RSVP submit
```
