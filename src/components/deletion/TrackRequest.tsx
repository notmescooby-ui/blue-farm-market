import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  OTP_SENT_MESSAGE,
  STATUS_LABELS,
  parseIdentifier,
  type VerifiedIdentifier,
} from "@/lib/deletion/verification";
import { requestOtpCode, verifyOtpCode } from "@/lib/deletion/otp-flow";
import { supabase } from "@/lib/supabase/client";

interface DeletionRequestRow {
  id: string;
  reference_code: string;
  account_type: string;
  processing_status: string;
  requested_at: string;
  completed_at: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "completed"
      ? "bg-primary text-primary-foreground"
      : status === "rejected"
        ? "bg-destructive/15 text-destructive"
        : "bg-secondary text-secondary-foreground";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function TrackRequest() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Verification flow
  const [identifier, setIdentifier] = useState("");
  const [contact, setContact] = useState<VerifiedIdentifier | null>(null);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);

  // Requests
  const [requests, setRequests] = useState<DeletionRequestRow[] | null>(null);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setSession(nextSession);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setRequests(null);
      return;
    }
    setLoadingRequests(true);
    supabase
      .from("account_deletion_requests")
      .select("id, reference_code, account_type, processing_status, requested_at, completed_at")
      .order("requested_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("track request load error:", error.code);
        setRequests(data ?? []);
        setLoadingRequests(false);
      });
  }, [session]);

  async function handleSendCode(event: React.FormEvent) {
    event.preventDefault();
    const parsed = parseIdentifier(identifier);
    if (!parsed) {
      setVerifyError("Enter the email address or phone number registered to your account.");
      return;
    }
    setVerifyError(null);
    setSending(true);
    setContact(parsed);
    await requestOtpCode(parsed);
    setSending(false);
    setCodeSent(true);
    setCode("");
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    if (!contact || code.length !== 6 || verifying) return;
    setVerifying(true);
    setVerifyError(null);
    const otpError = await verifyOtpCode(contact, code);
    if (otpError) {
      setVerifyError(otpError);
      setVerifying(false);
      return;
    }
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setVerifying(false);
  }

  if (loadingSession) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Loading...</p>;
  }

  if (!session) {
    if (!codeSent || !contact) {
      return (
        <form onSubmit={handleSendCode} className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
          <h3 className="font-display text-xl font-bold text-primary">Sign in to track your request</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the email or phone number registered to your BlueFarm account. We'll send a
            one-time verification code to confirm it's you.
          </p>
          <div className="mt-5 grid gap-2">
            <Label htmlFor="track-identifier">Email or phone number</Label>
            <Input
              id="track-identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or 98765 43210"
            />
          </div>
          {verifyError && (
            <p role="alert" className="mt-3 text-sm font-medium text-destructive">{verifyError}</p>
          )}
          <Button type="submit" className="mt-5 w-full" size="lg" disabled={sending}>
            {sending ? "Sending code..." : "Send verification code"}
          </Button>
        </form>
      );
    }
    return (
      <form onSubmit={handleVerify} className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <h3 className="font-display text-xl font-bold text-primary">Enter your code</h3>
        <p className="mt-2 text-sm text-muted-foreground">{OTP_SENT_MESSAGE}</p>
        <div className="mt-6 flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode} disabled={verifying}>
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
          <p role="alert" className="mt-4 text-sm font-medium text-destructive">{verifyError}</p>
        )}
        <Button type="submit" className="mt-6 w-full" size="lg" disabled={verifying || code.length !== 6}>
          {verifying ? "Checking..." : "Verify"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 text-muted-foreground"
          onClick={() => {
            setCodeSent(false);
            setContact(null);
            setCode("");
            setVerifyError(null);
          }}
        >
          Use a different email or number
        </Button>
      </form>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-primary">Your deletion requests</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={async () => {
            await supabase.auth.signOut();
            setSession(null);
            setRequests(null);
          }}
        >
          Sign out
        </Button>
      </div>
      {loadingRequests && (
        <p className="mt-6 text-sm text-muted-foreground">Loading your requests...</p>
      )}
      {!loadingRequests && requests && requests.length === 0 && (
        <div className="mt-6 rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          There is no deletion request on this account. If you'd like to delete your account, you
          can submit a request from the <a href="/" className="font-medium text-primary underline">home page</a>.
        </div>
      )}
      <div className="mt-6 grid gap-4">
        {requests?.map((req) => (
          <div key={req.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold tracking-wide text-primary">
                  {req.reference_code}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {req.account_type.charAt(0).toUpperCase() + req.account_type.slice(1)} account ·
                  requested {new Date(req.requested_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  {req.completed_at &&
                    ` · completed ${new Date(req.completed_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}`}
                </p>
              </div>
              <StatusBadge status={req.processing_status} />
            </div>
            {req.processing_status === "received" && (
              <p className="mt-3 text-sm text-muted-foreground">
                BlueFarm will review this request, including any active orders or pending
                obligations, before data is deleted.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
