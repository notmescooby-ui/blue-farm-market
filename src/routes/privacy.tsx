import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | BlueFarm" },
      {
        name: "description",
        content:
          "How BlueFarm collects, uses, retains and deletes personal data, including account deletion requests submitted through the BlueFarm account deletion portal.",
      },
      { property: "og:title", content: "Privacy Policy | BlueFarm" },
      {
        property: "og:description",
        content:
          "How BlueFarm handles your personal data, including account deletion and data retention.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "About this policy",
    body: [
      "This Privacy Policy explains how BlueFarm - a smart aquaculture, fish farming and digital fish marketplace platform - handles personal data, and how account deletion works. It applies to the BlueFarm mobile application and to this account deletion portal.",
    ],
  },
  {
    title: "Data we process",
    body: [
      "Account data: your name, email address and/or phone number, profile photo and account type (Farmer or Buyer).",
      "Farm data: ponds, aquaculture activity and other farm information you record in the app.",
      "Marketplace data: listings, orders, deliveries, messages and payment records created through the app.",
      "Deletion portal data: when you submit a deletion request, we process the email address or phone number you enter, the one-time verification code, the account type you select, your optional reason for leaving, and the timestamp and status of the request.",
    ],
  },
  {
    title: "How ownership is verified",
    body: [
      "Before a deletion request is accepted, we verify that you own the account by sending a one-time 6-digit code to the registered email address or phone number. Only someone who can read that code can submit a request. We do not reveal whether an email address or phone number belongs to an existing account, and nobody can request deletion of an account by simply knowing its contact details.",
    ],
  },
  {
    title: "What is deleted when your account is deleted",
    body: [
      "When a deletion request is processed, BlueFarm deletes or anonymises your login credentials, profile and contact details, profile photo, and associated farm and pond information where applicable.",
      "Your listings and marketplace activity that identifies you are deleted or anonymised as part of the same process.",
    ],
  },
  {
    title: "What may be retained, and why",
    body: [
      "Some information may be retained after deletion where it is required or permitted by law or necessary for the legitimate operation of the marketplace. This may include: records BlueFarm must keep for tax, accounting or commercial law purposes; order and transaction records connected to active orders, pending deliveries or payment disputes; and information needed to resolve disputes, prevent fraud, or comply with legal claims.",
      "Retained records are kept only for as long as required for the purpose they were kept for, and access to them is restricted. Deletion of your account does not remove data that must legally or operationally be retained; everything else is deleted or anonymised so that it no longer identifies you.",
    ],
  },
  {
    title: "The deletion process",
    body: [
      "Submitting a request does not delete your account immediately. First your ownership is verified, then the request is recorded with a unique reference ID. BlueFarm then reviews the request, including any active orders, pending deliveries, payment disputes or other applicable obligations. Eligible personal data is then deleted or anonymised, your sign-in account is removed, and the request status is updated to completed. You can follow the status of your request at any time on the Track request page using your account.",
      "Submitting a request on this portal does not delete your account on its own, and deleting the app from your device does not delete your account.",
    ],
  },
  {
    title: "Security",
    body: [
      "Deletion requests are stored in a database protected by row-level security, so a signed-in user can only see and create requests for their own account. Verification codes are issued by BlueFarm's authentication service and expire shortly after being issued. Privileged deletion operations are performed server-side and are never exposed to the browser.",
    ],
  },
  {
    title: "Your rights and contact",
    body: [
      "You may request access, correction or deletion of your personal data, or raise a concern about how your data is handled, by contacting us at bluefarm1572@gmail.com.",
      "If you have a deletion request reference ID, include it in your message so we can locate your request quickly.",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-foam py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h1 className="font-display text-4xl font-extrabold text-primary">Privacy Policy</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              How BlueFarm handles your personal data - including account deletion and what may be
              retained.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="mb-10">
              <h2 className="font-display text-xl font-bold text-primary">{section.title}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-foreground/85">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
          <div className="rounded-2xl bg-foam p-6 text-sm text-foreground/85">
            Ready to delete your account? Submit a request from the{" "}
            <Link to="/" className="font-semibold text-primary underline">
              home page
            </Link>
            , or read about{" "}
            <Link to="/track" className="font-semibold text-primary underline">
              tracking your request
            </Link>
            .
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
