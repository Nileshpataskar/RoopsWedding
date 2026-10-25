"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type FormEvent } from "react";
import { submitRsvp, type RsvpResult } from "@/lib/rsvp";
import { validateRsvp, type RsvpErrors, type RsvpValues } from "@/lib/validation";
import { wedding } from "@/lib/wedding-config";
import { Heart } from "../ui/Heart";
import { PillButton } from "../ui/PillButton";

const INITIAL: RsvpValues = { name: "", attendance: "", guests: 1, dietary: "", message: "" };
const labelClass = "mb-1.5 block font-sans text-[0.66rem] uppercase tracking-[0.2em] text-muted";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "done"; result: RsvpResult; values: RsvpValues }
  | { kind: "error" };

function mailtoFor(values: RsvpValues, email: string) {
  const subject = `RSVP — ${values.name.trim()}`;
  const body = [
    `Name: ${values.name.trim()}`,
    `Attendance: ${values.attendance === "attending" ? "Joyfully accepts" : "Regretfully declines"}`,
    values.attendance === "attending" ? `Guests: ${values.guests}` : "",
    values.dietary.trim() && `Dietary requirements: ${values.dietary.trim()}`,
    values.message.trim() && `Message: ${values.message.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function RsvpForm() {
  const id = useId();
  const [values, setValues] = useState<RsvpValues>(INITIAL);
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { maxGuests, email } = wedding.rsvp;

  const update = <K extends keyof RsvpValues>(key: K, value: RsvpValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateRsvp(values, maxGuests);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const result = await submitRsvp(values);
      setStatus({ kind: "done", result, values });
    } catch {
      setStatus({ kind: "error" });
    }
  }

  if (status.kind === "done") {
    const attending = status.values.attendance === "attending";
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-sm text-center"
        role="status"
      >
        <Heart className="mx-auto h-5 w-5 text-marigold" />
        <p className="font-script mt-3 text-[2.6rem] leading-tight text-ink">
          {attending ? "See you there!" : "You'll be missed"}
        </p>
        <p className="mt-3 text-[1.08rem] leading-relaxed text-ink">
          Thank you, {status.values.name.trim()}.{" "}
          {attending
            ? "We are so happy you will celebrate with us."
            : "Thank you for letting us know — you will be in our thoughts."}
        </p>
        {status.result.status === "not-configured" && (
          <p className="mt-4 rounded-lg border border-line bg-cream/70 px-4 py-3 text-[0.98rem] leading-relaxed text-muted">
            Please note: online RSVP collection isn&rsquo;t connected yet, so this response has not
            been saved.{" "}
            {email ? (
              <a className="text-plum underline underline-offset-4" href={mailtoFor(status.values, email)}>
                Send it to us by email
              </a>
            ) : (
              "Kindly share your reply with the couple directly."
            )}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setValues(INITIAL);
            setStatus({ kind: "idle" });
          }}
          className="mt-6 font-sans text-[0.66rem] uppercase tracking-[0.2em] text-muted underline decoration-line underline-offset-4 hover:text-ink"
        >
          Edit response
        </button>
      </motion.div>
    );
  }

  const submitting = status.kind === "submitting";
  const fieldError = (key: keyof RsvpValues) =>
    errors[key] ? (
      <p id={`${id}-${key}-error`} className="mt-1 text-sm text-[#a5544a]">
        {errors[key]}
      </p>
    ) : null;
  const describedBy = (key: keyof RsvpValues) => (errors[key] ? `${id}-${key}-error` : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-sm space-y-5 text-left">
      <div>
        <label htmlFor={`${id}-name`} className={labelClass}>
          Your name
        </label>
        <input
          id={`${id}-name`}
          className="field"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("name")}
          placeholder="Full name"
        />
        {fieldError("name")}
      </div>

      <fieldset aria-describedby={describedBy("attendance")}>
        <legend className={labelClass}>Will you attend?</legend>
        <div className="grid grid-cols-2 gap-2" id={`${id}-attendance`} tabIndex={-1}>
          {(
            [
              ["attending", "Joyfully accepts"],
              ["declining", "Regretfully declines"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex min-h-12 cursor-pointer items-center justify-center rounded-lg border px-2 text-center text-[1.02rem] leading-tight transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-plum/40 ${
                values.attendance === value
                  ? "border-plum bg-plum text-paper"
                  : "border-line bg-paper/70 text-ink hover:border-marigold"
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value={value}
                className="sr-only"
                checked={values.attendance === value}
                onChange={() => update("attendance", value)}
              />
              {label}
            </label>
          ))}
        </div>
        {fieldError("attendance")}
      </fieldset>

      <AnimatePresence initial={false}>
        {values.attendance === "attending" && (
          <motion.div
            key="attending-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-5 overflow-hidden"
          >
            <div>
              <label htmlFor={`${id}-guests`} className={labelClass}>
                Number of guests (including you)
              </label>
              <select
                id={`${id}-guests`}
                className="field"
                value={values.guests}
                onChange={(e) => update("guests", Number(e.target.value))}
                aria-invalid={Boolean(errors.guests)}
                aria-describedby={describedBy("guests")}
              >
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              {fieldError("guests")}
            </div>
            <div>
              <label htmlFor={`${id}-dietary`} className={labelClass}>
                Dietary requirements <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id={`${id}-dietary`}
                className="field"
                value={values.dietary}
                onChange={(e) => update("dietary", e.target.value)}
                aria-invalid={Boolean(errors.dietary)}
                aria-describedby={describedBy("dietary")}
                placeholder="Vegetarian, allergies…"
              />
              {fieldError("dietary")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label htmlFor={`${id}-message`} className={labelClass}>
          Wishes for the couple <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id={`${id}-message`}
          className="field min-h-24 resize-y"
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          placeholder="A few words for us…"
        />
        {fieldError("message")}
      </div>

      {status.kind === "error" && (
        <p role="alert" className="text-center text-[#a5544a]">
          Something went wrong sending your RSVP. Please try again.
        </p>
      )}

      <div className="pt-2 text-center">
        <PillButton type="submit" disabled={submitting} className="w-full max-w-60">
          {submitting ? "Sending…" : "Send RSVP"}
        </PillButton>
      </div>
    </form>
  );
}
