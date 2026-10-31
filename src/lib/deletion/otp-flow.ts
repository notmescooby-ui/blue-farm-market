import type { VerifiedIdentifier } from "@/lib/deletion/verification";
import { supabase } from "@/lib/supabase/client";

/**
 * Sends a one-time sign-in code to the given email or phone.
 *
 * All outcomes are deliberately collapsed: the caller always advances to the
 * code-entry step with the generic "if an account exists..." message, so the
 * site never reveals whether an account exists. Real errors are logged for
 * debugging only.
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

/** Verifies the 6-digit code. Returns null on success, a safe error string otherwise. */
export async function verifyOtpCode(
  contact: VerifiedIdentifier,
  token: string,
): Promise<string | null> {
  const result =
    contact.kind === "email"
      ? await supabase.auth.verifyOtp({ email: contact.value, token, type: "email" })
      : await supabase.auth.verifyOtp({ phone: contact.value, token, type: "sms" });
  if (result.error) {
    console.error("otp verify error:", result.error.code);
    return "That code didn't match, or it has expired. Double-check the code and try again, or request a new one.";
  }
  return null;
}
