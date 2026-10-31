import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  OTP_INVALID_MESSAGE,
  OTP_SENT_MESSAGE,
  REQUEST_FAILED_MESSAGE,
  REQUEST_SETUP_MESSAGE,
  deletionRequestSchema,
  isDuplicateRequestError,
  isMissingTableError,
  parseIdentifier,
  type VerifiedIdentifier,
} from "@/lib/deletion/verification";
import { requestOtpCode, verifyOtpCode } from "@/lib/deletion/otp-flow";
import { supabase } from "@/lib/supabase/client";

type Step = "form" | "code" | "done";

interface RequestResult {
  referenceCode: string;
  requestedAt: string;
}

export function DeletionRequestForm() {
  const [step, setStep] = useState<Step>("form");

  // Form fields
  const [identifier, setIdentifier] = useState("");
  const [accountType, setAccountType] = useState<"farmer" | "buyer">("farmer");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  // Code step
  const [contact, setContact] = useState<VerifiedIdentifier | null>(null);
  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Done step
  const [result, setResult] = useState<RequestResult | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = {
      identifier,
      accountType,
      reason,
      confirmed,
    };
    const validation = deletionRequestSchema.safeParse(parsed);
    const identifierVerified = validation.success
      ? parseIdentifier(validation.data.identifier)
      : null;
    if (!validation.success || !identifierVerified) {
      const errors: Record<string, string> = {};
      if (!validation.success) {
        for (const issue of validation.error.issues) {
          const key = issue.path[0] as string;
          if (!errors[key]) errors[key] = issue.message;
        }
      }
      if (validation.success && !identifierVerified) {
        errors.identifier =
          "Enter the email address or phone number registered to your BlueFarm account.";
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSending(true);
    setContact(identifierVerified);
    await requestOtpCode(identifierVerified);
    setSending(false);
    setStep("code");
    setCooldown(60);
    setCode("");
    setVerifyError(null);
  }

  async function handleResend() {
    if (!contact || cooldown > 0) return;
    setWorking(true);
    await requestOtpCode(contact);
    setWorking(false);
    setCooldown(60);
    setCode("");
    setVerifyError(null);
    toast.info("A new verification code has been sent, if your account exists.");
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    if (!contact || code.length !== 6 || working) return;
    setWorking(true);
    setVerifyError(null);
    const otpError = await verifyOtpCode(contact, code);
    if (otpError) {
      setVerifyError(OTP_INVALID_MESSAGE);
      setWorking(false);
      return;
    }
    await recordRequest(contact);
  }

  async function recordRequest(contact: VerifiedIdentifier) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userError ? null : userData?.user ?? null;
    if (!user) {
      setVerifyError(
        "We couldn't confirm your sign-in. Please request a new verification code.",
      );
      setWorking(false);
      return;
    }

    const payload = {
      user_id: user.id,
      account_type: accountType,
      reason: reason.trim() || null,
      contact_email: contact.kind === "email" ? contact.value : null,
      contact_phone: contact.kind === "phone" ? contact.value : null,
    };
    const { data, error } = await supabase
      .from("account_deletion_requests")
      .insert(payload)
      .select("reference_code, requested_at")
      .single();

    if (!error && data) {
      finish(data.reference_code, data.requested_at);
      return;
    }

    // Duplicate active request: show the existing reference instead.
    if (error && isDuplicateRequestError(error.code)) {
      const { data: existing } = await supabase
        .from("account_deletion_requests")
        .select("reference_code, requested_at")
        .in("processing_status", ["received", "processing"])
        .maybeSingle();
      if (existing) {
        finish(existing.reference_code, existing.requested_at);
        toast.info("You already have an active deletion request for this account.");
        return;
      }
    }

    console.error("deletion request insert error:", error?.code);
    setVerifyError(
      error && isMissingTableError(error.code) ? REQUEST_SETUP_MESSAGE : REQUEST_FAILED_MESSAGE,
    );
    setWorking(false);
  }

  function finish(referenceCode: string, requestedAt: string) {
    setResult({ referenceCode, requestedAt });
    setWorking(false);
    setStep("done");
  }

  if (step === "done" && result) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-primary" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold text-primary">Request received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Your deletion request has been recorded and will be processed after verification checks
          and BlueFarm's review of active orders, pending deliveries and other applicable
          obligations. Deletion is completed only after these checks pass.
        </p>
        <div className="mx-auto mt-6 w-fit rounded-2xl bg-foam px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your reference ID
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(result.referenceCode);
              toast.success("Reference ID copied");
            }}
            className="mt-1 font-display text-xl font-bold tracking-wide text-primary"
            title="Copy to clipboard"
          >
            {result.referenceCode}
          </button>
        </div>
        <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-foreground/85">
          <li className="flex gap-2"><span className="text-primary">1.</span> Keep this reference ID - you'll need it if you contact support.</li>
          <li className="flex gap-2"><span className="text-primary">2.</span> BlueFarm reviews the request and any active orders or disputes.</li>
          <li className="flex gap-2"><span className="text-primary">3.</span> Eligible data is deleted or anonymised, and your account is removed.</li>
          <li className="flex gap-2"><span className="text-primary">4.</span> You can check the status anytime on the{" "}
            <a href="/track" className="font-medium text-primary underline">Track request</a> page.
          </li>
        </ul>
        <p className="mx-auto mt-5 max-w-md text-xs text-muted-foreground">
          Please save your reference ID now - a confirmation email or SMS isn't sent automatically
          yet, so this screen is your confirmation.
        </p>
      </div>
    );
  }

  if (step === "code" && contact) {
    return (
      <form onSubmit={handleVerify} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h3 className="font-display text-2xl font-bold text-primary">Verify it's you</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{OTP_SENT_MESSAGE}</p>
        <div className="mt-6 flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            disabled={working}
            aria-label="6-digit verification code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSeparator />
              <InputOTPSlot index={1} />
              <InputOTPSeparator />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSeparator />
              <InputOTPSlot index={4} />
              <InputOTPSeparator />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {verifyError && (
          <p role="alert" className="mt-4 text-center text-sm font-medium text-destructive">
            {verifyError}
          </p>
        )}
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button type="submit" size="lg" className="w-full max-w-xs" disabled={working || code.length !== 6}>
            {working ? "Checking..." : "Verify and submit request"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={working || cooldown > 0}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => {
              setStep("form");
              setCode("");
              setVerifyError(null);
            }}
          >
            Back to the form
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h3 className="font-display text-2xl font-bold text-primary">Request account deletion</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        We verify ownership with a one-time code before recording any request, so nobody can delete
        your account by knowing just your email or phone number.
      </p>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="identifier">Registered email or phone number</Label>
          <Input
            id="identifier"
            type="text"
            inputMode="email"
            autoComplete="username"
            placeholder="you@example.com or 98765 43210"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            aria-invalid={Boolean(fieldErrors.identifier)}
          />
          {fieldErrors.identifier && (
            <p role="alert" className="text-sm font-medium text-destructive">{fieldErrors.identifier}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Account type</Label>
          <RadioGroup
            value={accountType}
            onValueChange={(v) => setAccountType(v as "farmer" | "buyer")}
            className="flex gap-4"
          >
            {(["farmer", "buyer"] as const).map((t) => (
              <Label
                key={t}
                className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60"
              >
                <RadioGroupItem value={t} />
                <span className="font-medium capitalize">{t}</span>
              </Label>
            ))}
          </RadioGroup>
          {fieldErrors.accountType && (
            <p role="alert" className="text-sm font-medium text-destructive">{fieldErrors.accountType}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reason">Reason for deletion (optional)</Label>
          <Textarea
            id="reason"
            rows={3}
            maxLength={500}
            placeholder="Tell us why you're leaving - it helps us improve BlueFarm."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">{reason.length}/500 characters</p>
          {fieldErrors.reason && (
            <p role="alert" className="text-sm font-medium text-destructive">{fieldErrors.reason}</p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-foam px-4 py-3 text-sm">
          <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" />
          <span>
            I understand that I am requesting permanent deletion of my BlueFarm account and
            associated data.
          </span>
        </label>
        {fieldErrors.confirmed && (
          <p role="alert" className="text-sm font-medium text-destructive">{fieldErrors.confirmed}</p>
        )}

        <Button type="submit" size="lg" disabled={sending}>
          {sending ? "Sending verification code..." : "Submit Deletion Request"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Submitting does not delete anything immediately - your account stays active until the
          request is verified and processed.
        </p>
      </div>
    </form>
  );
}
