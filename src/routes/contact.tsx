import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageSquareText, ShieldQuestion } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Support | BlueFarm" },
      {
        name: "description",
        content:
          "Contact BlueFarm support for help with your account deletion request, verification codes or any account problem.",
      },
      { property: "og:title", content: "Contact Support | BlueFarm" },
      {
        property: "og:description",
        content: "Get help from BlueFarm support with your account or deletion request.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-foam py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h1 className="font-display text-4xl font-extrabold text-primary">Contact Support</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Stuck on the deletion flow, lost your verification code, or seeing an error? We're
              here to help.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <a
              href="mailto:bluefarm1572@gmail.com?subject=BlueFarm%20account%20deletion%20support"
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/30"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                <Mail className="h-5 w-5 text-primary" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                Email support
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">bluefarm1572@gmail.com</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The fastest way to reach us for account deletion problems.
              </p>
            </a>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                <MessageSquareText className="h-5 w-5 text-primary" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                What to include
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>- Your deletion request reference ID (starts with BF-), if you have one</li>
                <li>- The email address or phone number on your account</li>
                <li>- A short description of the problem</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-deep p-6 text-deep-foreground">
            <div className="flex items-start gap-3">
              <ShieldQuestion className="mt-0.5 h-5 w-5 shrink-0 text-aqua" />
              <div className="text-sm leading-relaxed">
                <p className="font-semibold">Concerned about a deletion request you didn't make?</p>
                <p className="mt-1 text-deep-foreground/80">
                  Requests can only be submitted after verifying a code sent to the registered email
                  or phone number. If you received a code you didn't ask for, or believe someone is
                  trying to delete your account, email us immediately and change your account
                  password in the app.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            You can also review the{" "}
            <Link to="/privacy" className="font-semibold text-primary underline">
              Privacy Policy
            </Link>{" "}
            or{" "}
            <Link to="/" className="font-semibold text-primary underline">
              submit a deletion request
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
