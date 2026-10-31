import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ban,
  BellRing,
  ClipboardList,
  FileWarning,
  Landmark,
  Lock,
  ScrollText,
  ShieldCheck,
  Trash2,
  UserCheck,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DeletionRequestForm } from "@/components/deletion/DeletionRequestForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Account Deletion Request | BlueFarm" },
      {
        name: "description",
        content:
          "Request permanent deletion of your BlueFarm account and personal data. Verify ownership securely, submit your request and track its progress.",
      },
      { property: "og:title", content: "Account Deletion Request | BlueFarm" },
      {
        property: "og:description",
        content:
          "Request permanent deletion of your BlueFarm account and personal data, with secure ownership verification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const BEFORE_DELETE = [
  {
    icon: Lock,
    title: "Access is removed",
    body: "Once your deletion is processed, you will no longer be able to sign in to BlueFarm with this account.",
  },
  {
    icon: Trash2,
    title: "Profile and farm data are deleted",
    body: "Your profile and associated farm information are deleted where applicable.",
  },
  {
    icon: FileWarning,
    title: "Active orders may be held",
    body: "Active orders, pending deliveries, payment disputes or legally required records may need to be resolved or retained as permitted by law.",
  },
  {
    icon: Ban,
    title: "Deletion is permanent",
    body: "Once completed, deletion is irreversible. Your account, listings and history cannot be restored.",
  },
  {
    icon: ScrollText,
    title: "Review the Privacy Policy",
    body: "Read how BlueFarm handles your data, and what may be retained, before submitting your request.",
  },
];

const FAQ = [
  {
    q: "Is deleting my account the same as uninstalling the app?",
    a: "No. Uninstalling the app only removes it from your device - your BlueFarm account and data remain. Submitting a request on this page starts the process of permanently removing your account and associated personal data.",
  },
  {
    q: "Can someone delete my account by entering my email or phone number?",
    a: "No. Every request must pass ownership verification: a 6-digit one-time code is sent to the registered email or phone number, and only the person who can read that code can submit a request. This site also never reveals whether an email or phone number belongs to an existing account.",
  },
  {
    q: "What happens to my active orders or pending deliveries?",
    a: "Deletion is not immediate. BlueFarm reviews active orders, pending deliveries, payment disputes and other obligations before your data is deleted. Anything that must legally or operationally be retained is kept for the required period; the rest is deleted or anonymised.",
  },
  {
    q: "How long does deletion take?",
    a: "BlueFarm confirms the expected processing timeline once its backend deletion policy is finalised. Your request is timestamped the moment it is submitted, and you can follow its status on the Track request page.",
  },
  {
    q: "Can I cancel or undo a deletion request?",
    a: "If you change your mind while your request is still being reviewed, contact support at bluefarm1572@gmail.com with your reference ID. Once deletion has been completed, it cannot be reversed.",
  },
  {
    q: "What if I have trouble deleting my account?",
    a: "Contact support at bluefarm1572@gmail.com with your deletion request reference ID and a description of the problem, and we will help you complete the process.",
  },
];

function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-foam">
          <div className="pointer-events-none absolute inset-0 scale-pattern opacity-60" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-14 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-4 py-1.5 text-xs font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" />
                BlueFarm Account Deletion Portal
              </span>
              <h1 className="text-balance-tight mt-5 font-display text-4xl font-extrabold leading-[1.05] text-primary sm:text-5xl">
                Account Deletion Request
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/80">
                We're sorry to see you go. If you no longer wish to use BlueFarm, you can request
                permanent deletion of your account and associated personal data here.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#request-form"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Start deletion request
                </a>
                <Link
                  to="/track"
                  className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-card px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
                >
                  Track my request
                </Link>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-sm rounded-3xl bg-card p-6 shadow-lg shadow-primary/5">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
                How it works
              </h2>
              <ol className="mt-4 space-y-4">
                {[
                  { icon: ClipboardList, text: "Submit the request form with your registered email or phone number." },
                  { icon: UserCheck, text: "Verify ownership with the 6-digit code sent to you." },
                  { icon: Landmark, text: "BlueFarm reviews active orders and applicable retention rules." },
                  { icon: Trash2, text: "Eligible data is deleted and your account is removed." },
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <s.icon className="h-4 w-4 text-primary" />
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/85">{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="relative block h-8 w-full text-background" aria-hidden="true">
            <path
              d="M0 30 C 120 10 240 50 360 30 C 480 10 600 50 720 30 C 840 10 960 50 1080 30 C 1200 10 1320 50 1440 30 L 1440 60 L 0 60 Z"
              fill="currentColor"
            />
          </svg>
        </section>

        {/* Before you delete */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-primary">
            Before you delete
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            Please take a moment to understand what deleting your BlueFarm account involves.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BEFORE_DELETE.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                  <item.icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
            <a
              href="/privacy"
              className="flex items-center justify-between rounded-2xl bg-deep p-6 text-deep-foreground shadow-sm transition-opacity hover:opacity-95"
            >
              <div>
                <h3 className="font-display text-lg font-semibold">Read the Privacy Policy</h3>
                <p className="mt-1 text-sm text-deep-foreground/70">
                  What is deleted, what may be retained, and why.
                </p>
              </div>
              <span aria-hidden="true" className="text-2xl">&rarr;</span>
            </a>
          </div>
        </section>

        {/* Request form */}
        <section id="request-form" className="scroll-mt-20 bg-foam py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-primary">Submit your request</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Fill in the form below. You'll receive a one-time verification code to confirm you
                own the account before anything is recorded.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-xl">
              <DeletionRequestForm />
            </div>
          </div>
        </section>

        {/* Data handling */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-primary">
            What happens to your data
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            BlueFarm deletes your personal data wherever possible, and retains only what the law or
            the legitimate operation of the marketplace requires.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-primary/15 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Trash2 className="h-5 w-5 text-primary" />
                </span>
                <h3 className="font-display text-lg font-semibold text-primary">Deleted or anonymised</h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-foreground/85">
                <li>- Your login credentials and account profile</li>
                <li>- Your name, contact details and profile photo</li>
                <li>- Farm and pond details tied to your account</li>
                <li>- Your listings and marketplace activity where it identifies you</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foam">
                  <BellRing className="h-5 w-5 text-primary" />
                </span>
                <h3 className="font-display text-lg font-semibold text-primary">May be retained</h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-foreground/85">
                <li>- Records required by tax, accounting or commercial law</li>
                <li>- Order and transaction records tied to active or disputed payments</li>
                <li>- Information needed to resolve disputes, fraud or safety issues</li>
                <li>- Aggregated data that no longer identifies you</li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Retained records are kept only for as long as required, with access restricted.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-foam py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-center font-display text-3xl font-bold text-primary">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="mt-10">
              {FAQ.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-display text-base font-semibold text-foreground">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
