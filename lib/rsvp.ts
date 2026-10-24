import type { RsvpValues } from "./validation";

export type RsvpResult =
  /** The response was accepted by the configured endpoint. */
  | { status: "stored" }
  /** No endpoint configured — nothing was saved anywhere. */
  | { status: "not-configured" };

/**
 * Sends an RSVP to NEXT_PUBLIC_RSVP_ENDPOINT as JSON (POST).
 *
 * Any service that accepts a JSON POST works: Formspree, Getform, a Google
 * Apps Script web app writing to a Sheet, or your own API route backed by a
 * database. Without the variable the form reports honestly that the
 * response was not saved.
 */
export async function submitRsvp(values: RsvpValues): Promise<RsvpResult> {
  const endpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT;
  if (!endpoint) return { status: "not-configured" };

  const payload = {
    name: values.name.trim(),
    attendance: values.attendance,
    guests: values.attendance === "attending" ? values.guests : 0,
    dietary: values.dietary.trim(),
    message: values.message.trim(),
    submittedAt: new Date().toISOString(),
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`RSVP request failed with ${response.status}`);
  return { status: "stored" };
}
