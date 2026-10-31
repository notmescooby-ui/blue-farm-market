import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ban,
  Clock,
  FileWarning,
  Lock,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DeletionRequestForm } from "@/components/deletion/DeletionRequestForm";

export const Route = createFileRoute("/account-deletion")({
  head: () => ({
    meta: [
      { title: "Delete Your BlueFarm Account | BlueFarm" },
      {
        name: "description",
        content:
          "Request deletion of your BlueFarm account and associated personal data. Secure verification for Farmer and Buyer accounts.",
      },
      { property: "og:title", content: "Delete Your BlueFarm Account | BlueFarm" },
      {
        property: "og:description",
        content:
          "Official account deletion request portal for BlueFarm users. Verified and secure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountDeletionPage,
});

const BEFORE_YOU_CONTINUE = [
  {
    icon: Lock,
    title: "Account access will be removed",
    description:
      "When deletion is completed, you will no longer be able to log in to the BlueFarm app or access your account.",
  },
  {
    icon: Trash2,
    title: "Personal profile data will be deleted",
    description:
      "Personal profile information, including your name, contact details, and account credentials, will be deleted where applicable.",
  },
  {
    icon: UserCheck,
    title: "Farm or buyer profiles anonymized or deleted",
    description:
      "Related farm or buyer profile information will be deleted or anonymized where applicable, preventing personal identification.",
  },
  {
    icon: FileWarning,
    title: "Certain transaction records may be retained",
    description:
      "Certain transaction, order, payment, dispute or legal records may be retained where required by applicable law or legitimate operational obligations.",
  },
  {
    icon: Clock,
    title: "Restricted retention periods",
    description:
      "Any retained information will be strictly restricted and kept only for the relevant legally or operationally mandated retention period.",
  },
  {
    icon: Ban,
    title: "Account deletion may be irreversible",
    description:
      "Once the deletion process has finished, the account cannot be restored. Please ensure you have backed up any necessary farm or purchase details.",
  },
];

function AccountDeletionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-foam py-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 scale-pattern opacity-60" />
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
              <ShieldCheck className="h-4 w-4" />
              Official BlueFarm Account Deletion Portal
            </span>
            <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
              Delete Your BlueFarm Account
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
              We&apos;re sorry to see you go. You can use this page to request deletion of your
              BlueFarm account and associated personal data.
            </p>
          </div>
        </section>

        {/* Before You Continue Section */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Important Notice
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
              Before You Continue
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              Please review how your data and records are handled upon account deletion.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BEFORE_YOU_CONTINUE.map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3.5 font-display text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-primary/20 bg-foam p-5 text-sm text-foreground/85 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ScrollText className="h-5 w-5 text-primary shrink-0" />
              <span>Want to read our complete data collection and handling policies?</span>
            </div>
            <Link
              to="/privacy"
              className="inline-flex items-center justify-center shrink-0 font-semibold text-primary underline hover:text-primary/85"
            >
              Read BlueFarm Privacy Policy &rarr;
            </Link>
          </div>
        </section>

        {/* Deletion Request Form Section */}
        <section id="deletion-form" className="bg-foam/60 py-12 border-t border-border">
          <div className="mx-auto max-w-xl px-4 sm:px-6">
            <DeletionRequestForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
