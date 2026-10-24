export type Attendance = "attending" | "declining";

export type RsvpValues = {
  name: string;
  attendance: Attendance | "";
  guests: number;
  dietary: string;
  message: string;
};

export type RsvpErrors = Partial<Record<keyof RsvpValues, string>>;

export function validateRsvp(values: RsvpValues, maxGuests: number): RsvpErrors {
  const errors: RsvpErrors = {};
  const name = values.name.trim();

  if (name.length < 2) errors.name = "Please enter your full name.";
  else if (name.length > 80) errors.name = "Please keep your name under 80 characters.";

  if (!values.attendance) errors.attendance = "Please let us know whether you can attend.";

  if (values.attendance === "attending") {
    if (!Number.isInteger(values.guests) || values.guests < 1 || values.guests > maxGuests) {
      errors.guests = `Please choose between 1 and ${maxGuests} guests.`;
    }
  }

  if (values.dietary.length > 200) errors.dietary = "Please keep this under 200 characters.";
  if (values.message.length > 500) errors.message = "Please keep your message under 500 characters.";

  return errors;
}
