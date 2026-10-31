import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TrackRequest } from "@/components/deletion/TrackRequest";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Deletion Request | BlueFarm" },
      {
        name: "description",
        content:
          "Check the status of your BlueFarm account deletion request. Verify your identity with a one-time code to see your request.",
      },
      { property: "og:title", content: "Track Deletion Request | BlueFarm" },
      {
        property: "og:description",
        content: "Check the status of your BlueFarm account deletion request.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-foam py-12">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h1 className="font-display text-4xl font-extrabold text-primary">
              Track your request
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Verify your account with a one-time code to see the status of your deletion request.
              Your reference ID (starts with BF-) is shown with each request.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <TrackRequest />
        </section>
      </main>
      <Footer />
    </div>
  );
}
