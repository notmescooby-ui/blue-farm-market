import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ShieldCheck, Mail } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "BlueFarm Privacy Policy | BlueFarm" },
      {
        name: "description",
        content:
          "Official Privacy Policy for BlueFarm mobile application and services, explaining data processing, on-device Aadhaar verification, location services, and account deletion.",
      },
      { property: "og:title", content: "BlueFarm Privacy Policy" },
      {
        property: "og:description",
        content: "Official Privacy Policy for BlueFarm mobile application and services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-foam py-12 border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-4 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              Official Policy
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-primary sm:text-4xl">
              BlueFarm Privacy Policy
            </h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Effective Date: October 27, 2026
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10 text-foreground/90 space-y-8 leading-relaxed">
            <p className="text-base text-foreground/85">
              BlueFarm helps aquaculture farmers manage farm profiles and access aquaculture-related
              information, including nearby fish markets, collection hubs and cold-storage
              facilities. This policy explains what information BlueFarm processes, why it is used,
              and the choices available to you.
            </p>

            {/* Privacy Highlights Callout */}
            <div className="rounded-xl border-l-4 border-primary bg-foam p-5 text-sm">
              <strong className="font-semibold text-primary block text-base mb-1">
                Privacy Highlights
              </strong>
              <p className="text-foreground/85">
                Aadhaar document images and Aadhaar numbers are processed locally on your device for
                verification and are not uploaded to BlueFarm servers. BlueFarm stores a readable
                farm-location address and related region/PIN-code text. Live GPS coordinates used to
                find nearby markets are held temporarily in memory and are not stored in the
                BlueFarm database.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                1. Information We Collect or Process
              </h2>
              <ul className="mt-4 list-disc pl-6 space-y-2.5 text-sm text-foreground/85">
                <li>
                  <strong>Account Information:</strong> Information you provide to register or sign
                  in, such as your email address and authentication-related identifiers.
                </li>
                <li>
                  <strong>Profile and Farm Information:</strong> Details you enter during onboarding
                  or profile editing, which may include your name, age, phone number, farm name,
                  pond area, waterbody type, species, region, PIN code, and farm address.
                </li>
                <li>
                  <strong>Farm Location Text:</strong> When you choose automatic location detection,
                  BlueFarm may reverse-geocode device coordinates into a readable address and save
                  that address in your profile. Region and PIN code may also be saved. If reverse
                  geocoding fails, a coordinate string may be saved in the address field. You may
                  manually edit your location text.
                </li>
                <li>
                  <strong>Water-Quality and Farm Readings:</strong> Sensor readings or monitoring
                  information that you submit or connect to BlueFarm, where those features are
                  enabled.
                </li>
                <li>
                  <strong>Aadhaar Verification Result:</strong> The app may store a boolean
                  verification status (for example,{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">
                    aadhaar_verified
                  </code>
                  ) in your profile.
                </li>
                <li>
                  <strong>Technical Information:</strong> The app platform and diagnostic
                  information may be processed by the operating system, Google Play, or
                  infrastructure providers as part of operating, securing, and troubleshooting the
                  service.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                2. Aadhaar Document Processing
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                When you choose to scan or select an Aadhaar image for verification, BlueFarm uses
                on-device text recognition through Google ML Kit to check for government-issuer
                text, a 12-digit Aadhaar-number pattern, and a name match. In this described flow,
                text recognition occurs on your device. BlueFarm does not upload or store the
                Aadhaar image, full Aadhaar number, Aadhaar address, or date of birth on its
                servers. The image is held temporarily on the device for the session, and the app
                stores only the verification-status flag. Do not use the verification feature if you
                do not wish to provide the document for local processing.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                3. How We Use Information
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                BlueFarm uses information to create and manage accounts, display and update farmer
                profiles, support farm-management features, show relevant aquaculture resources,
                find nearby markets when requested, perform the selected verification flow, maintain
                security, troubleshoot errors, and respond to support or privacy requests.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                4. Location and Third-Party Services
              </h2>
              <ul className="mt-4 list-disc pl-6 space-y-2.5 text-sm text-foreground/85">
                <li>
                  <strong>Device Location:</strong> BlueFarm requests location access when you
                  initiate a feature that needs it. The app does not continuously track your
                  movements or run background location tracking. Live coordinates used by the
                  &ldquo;Market Near Me&rdquo; feature are used temporarily in memory to find nearby
                  facilities and calculate distances, and are not saved to the BlueFarm database.
                </li>
                <li>
                  <strong>OpenStreetMap Nominatim:</strong> When you request automatic address
                  detection, coordinates may be sent to the Nominatim geocoding service to obtain a
                  readable address. The resulting address text, region, and PIN code may then be
                  saved to your BlueFarm profile. Nominatim is a third-party service governed by its
                  own terms and privacy practices.
                </li>
                <li>
                  <strong>Supabase:</strong> BlueFarm uses Supabase for authentication and database
                  storage of account/profile information and other data described above. Information
                  stored there is subject to the app&apos;s configuration and the provider&apos;s
                  infrastructure and privacy terms.
                </li>
                <li>
                  <strong>Google ML Kit:</strong> The described Aadhaar text recognition is
                  performed on-device; the Aadhaar image is not sent by BlueFarm to a remote OCR
                  server in this flow.
                </li>
                <li>
                  <strong>Google Play and Device Providers:</strong> They may process information
                  under their own policies in connection with app distribution, device operation,
                  security, and diagnostics.
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                5. When Information Is Shared
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                BlueFarm does not sell your personal information. Information may be processed by
                service providers where needed to operate the app, as described in this policy, or
                disclosed where required by law, to protect users and the service, or to address
                security or abuse. We do not intend to share Aadhaar images or full Aadhaar numbers
                with BlueFarm servers or service providers.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                6. Storage, Security and Retention
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                Profile information is stored in the BlueFarm backend while needed to provide the
                service. Live coordinates used for nearby-market calculations are temporary and are
                not written to the BlueFarm database. Aadhaar images and numbers are not retained by
                BlueFarm servers in the described verification flow. We use the security controls
                available through the app and its infrastructure, but no method of electronic
                storage or transmission can be guaranteed to be completely secure. Retention of
                information held by third-party providers may be governed by their own policies.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                7. Your Choices and Account Deletion
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                You can edit profile and farm-location text in the app where those features are
                available, and you can choose whether to grant location permission. To request
                account deletion or ask us to access, correct, or delete information associated with
                your account, email{" "}
                <a
                  href="mailto:bluefarm1572@gmail.com"
                  className="font-medium text-primary underline hover:text-primary/80"
                >
                  bluefarm1572@gmail.com
                </a>{" "}
                from the address associated with your account where possible. Include
                &ldquo;BlueFarm privacy request&rdquo; in the subject line and describe your
                request. We may need to verify your identity before acting. We will handle requests
                subject to applicable law, security needs, and any information we are legally
                required to retain.
              </p>
              <div className="mt-4 rounded-xl bg-foam p-4 text-sm">
                You can also submit an online account deletion request anytime via our official{" "}
                <Link
                  to="/account-deletion"
                  className="font-semibold text-primary underline hover:text-primary/80"
                >
                  Account Deletion Portal
                </Link>
                .
              </div>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                8. Children&apos;s Privacy
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                BlueFarm is intended for individuals involved in aquaculture and farm management,
                not for children. If you believe a child has provided personal information to
                BlueFarm, contact us so we can review the request.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                9. Changes to This Policy
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                We may update this policy as BlueFarm&apos;s features, data practices, or legal
                requirements change. The updated policy will be published at this address with a
                revised effective date. Please review it periodically.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                10. Contact Us
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                For questions, concerns, or privacy and account-deletion requests, contact:
              </p>
              <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-5">
                <p className="font-semibold text-primary">BlueFarm Privacy Support</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-foreground/85">
                  <Mail className="h-4 w-4 text-primary" />
                  Email:{" "}
                  <a
                    href="mailto:bluefarm1572@gmail.com"
                    className="font-medium text-primary underline hover:text-primary/80"
                  >
                    bluefarm1572@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
