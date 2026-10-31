import { z } from "zod";

export type IdentifierKind = "email" | "phone";

export interface VerifiedIdentifier {
  kind: IdentifierKind;
  value: string;
}

/**
 * Detects whether the user typed an email address or a phone number and
 * normalizes it. Indian mobile numbers entered without a country code are
 * assumed to be +91 (BlueFarm's primary market).
 */
export function normalizePhone(raw: string): string | null {
  const compact = raw.replace(/[\s()\-.]/g, "");
  if (!/^\+?\d{6,15}$/.test(compact)) return null;
  if (compact.startsWith("+")) return compact;
  if (compact.length === 10) return `+91${compact}`;
  if (compact.length === 12 && compact.startsWith("91")) return `+${compact}`;
  return null;
}

export function parseIdentifier(raw: string): VerifiedIdentifier | null {
  const value = raw.trim();
  if (!value) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 255) {
    return { kind: "email", value: value.toLowerCase() };
  }
  const phone = normalizePhone(value);
  if (phone) return { kind: "phone", value: phone };
  return null;
}

/** The deletion request form, as typed by the user (before identifier parsing). */
export const deletionRequestSchema = z.object({
  identifier: z.string().trim().min(1, "Enter the email or phone number registered to your account.").max(255),
  accountType: z.enum(["farmer", "buyer"], { message: "Choose whether this is a Farmer or Buyer account." }),
  reason: z.string().trim().max(500, "Keep the reason under 500 characters.").optional().default(""),
  confirmed: z.boolean().refine((v) => v === true, {
    message: "Please confirm you understand this request is for permanent deletion.",
  }),
});

export type DeletionRequestInput = z.infer<typeof deletionRequestSchema>;

/**
 * Anti-enumeration messaging: the site must never reveal whether an email or
 * phone number belongs to an existing account, so every "code sent" outcome
 * (including accounts that do not exist) shows exactly this text.
 */
export const OTP_SENT_MESSAGE =
  "If a BlueFarm account exists for the details you entered, we've sent a 6-digit verification code to it. The code expires shortly - you can request a new one from this screen.";

/** Safe, non-revealing error shown when a verification code is rejected. */
export const OTP_INVALID_MESSAGE =
  "That code didn't match, or it has expired. Double-check the code and try again, or request a new one.";

/** Safe error when the request could not be recorded. */
export const REQUEST_FAILED_MESSAGE =
  "We couldn't record your request right now. Please try again in a moment, or contact support at bluefarm1572@gmail.com.";

/** Safe error when the requests table has not been created yet (migration pending). */
export const REQUEST_SETUP_MESSAGE =
  "The deletion service is being set up. Please try again soon, or contact support at bluefarm1572@gmail.com.";

export function isMissingTableError(code?: string): boolean {
  return code === "PGRST205" || code === "42P01";
}

export function isDuplicateRequestError(code?: string): boolean {
  return code === "23505" || code === "409";
}

/** Human labels for the processing statuses stored in the database. */
export const STATUS_LABELS: Record<string, string> = {
  received: "Received - awaiting review",
  processing: "Being processed",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Not eligible",
};
