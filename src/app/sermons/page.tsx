import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";
import { newestSermons } from "@/features/public-site/sermons";
export const metadata: Metadata = { title: "Sermons" };
export default function Page() {
  const sermons = newestSermons();
  return (
    <PublicPage
      title="Sermon library"
      intro="Watch recorded messages and read the accompanying summaries."
    >
      {sermons.length ? (
        <PageLinks
          items={sermons.map((s) => [s.title, "/sermons/" + s.slug])}
        />
      ) : (
        <p>No sermons have been published yet.</p>
      )}
      <PageLinks
        items={[
          ["Watch online", "/watch"],
          ["Worship times", "/visit"],
        ]}
      />
    </PublicPage>
  );
}
