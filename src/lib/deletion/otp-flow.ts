import type { VerifiedIdentifier } from "@/lib/deletion/verification";
import { OTP_INVALID_MESSAGE } from "@/lib/deletion/verification";
import { supabase } from "@/lib/supabase/client";

const REVIEWER_EMAIL = "bluefarm1572@gmail.com";
const REVIEWER_PASSWORD = "bfarm1572";
const REVIEWER_OTPS = ["123456", "157200", "bfarm1572"];

/**
 * Normalizes identifier to account email format used in Supabase backend:
 * Email is lowercase trimmed.
 * Phone number is converted to `<digits>@gmail.com` pseudo-email matching Flutter auth service.
 */
export function normalizeLoginIdentifier(identifier: string): string {
  const clean = identifier.trim().toLowerCase();
  if (clean.includes("@")) {
    return clean;
  }
  const digitsOnly = clean.replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    return `${digitsOnly}@gmail.com`;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    return `${digitsOnly.substring(2)}@gmail.com`;
  }
  return clean;
}

/**
 * Sends a one-time sign-in code to the given email or phone.
 * All outcomes are deliberately collapsed to prevent account enumeration.
 */
export async function requestOtpCode(contact: VerifiedIdentifier): Promise<void> {
  const options = { shouldCreateUser: false };
  try {
    const result =
      contact.kind === "email"
        ? await supabase.auth.signInWithOtp({ email: contact.value, options })
        : await supabase.auth.signInWithOtp({ phone: contact.value, options });
    if (result.error) console.error("otp request suppressed error:", result.error.code);
  } catch (error) {
    console.error("otp request suppressed error:", error);
  }
}

/** Verifies the 6-digit code or reviewer test credentials. Returns null on success, safe error string otherwise. */
export async function verifyOtpCode(
  contact: VerifiedIdentifier,
  token: string,
): Promise<string | null> {
  const cleanToken = token.trim();
  const isReviewerUser =
    contact.value.toLowerCase() === REVIEWER_EMAIL.toLowerCase() ||
    contact.value.includes("1572") ||
    contact.value.includes("9876543210");

  // Google Play Reviewer / Demo test OTP bypass
  if (isReviewerUser && REVIEWER_OTPS.includes(cleanToken)) {
    try {
      const loginRes = await supabase.auth.signInWithPassword({
        email: REVIEWER_EMAIL,
        password: REVIEWER_PASSWORD,
      });
      if (loginRes.data?.user) {
        return null; // Verified successfully!
      }
    } catch (e) {
      console.warn("Reviewer password sign-in fallback:", e);
    }
  }

  // Standard Supabase verifyOtp
  try {
    const result =
      contact.kind === "email"
        ? await supabase.auth.verifyOtp({ email: contact.value, token: cleanToken, type: "email" })
        : await supabase.auth.verifyOtp({ phone: contact.value, token: cleanToken, type: "sms" });

    if (result.error) {
      console.error("otp verify error:", result.error.code);
      return OTP_INVALID_MESSAGE;
    }
    return null;
  } catch (err) {
    console.error("otp verify exception:", err);
    return OTP_INVALID_MESSAGE;
  }
}

/** Directly verifies account using password (for Reviewer and Password Accounts). */
export async function verifyWithPassword(
  rawIdentifier: string,
  password: string,
): Promise<string | null> {
  const cleanId = rawIdentifier.trim();
  const cleanPassword = password.trim();

  if (!cleanId || !cleanPassword) {
    return "Please enter both your registered identifier and password.";
  }

  const emailToUse = normalizeLoginIdentifier(cleanId);

  try {
    const result = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password: cleanPassword,
    });

    if (result.error) {
      console.error("Password sign-in error:", result.error.message);
      return "Invalid email, phone, or password. Please verify your credentials.";
    }

    return null;
  } catch (err) {
    console.error("Password sign-in exception:", err);
    return "Authentication failed. Please check your credentials and try again.";
  }
}
