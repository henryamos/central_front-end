import { churchNews } from "@/features/public-site/publications";
import { PublicationList } from "@/features/public-site/publication-list";
import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";

export const metadata: Metadata = { title: "Church news" };
export default function Page() {
  return (
    <PublicPage
      title={"Church news"}
      intro={
        "Announcements from Cape Coast and news from the worldwide Adventist Church."
      }
    >
      <section>
        <h2>Local updates</h2>
        <PublicationList
          items={churchNews}
          empty="No local news stories have been published yet."
        />
      </section>
      <PageLinks
        items={[
          [
            "International news on Adventist News Network",
            "https://adventist.news/",
          ],
          ["Church events", "/events"],
        ]}
      />
    </PublicPage>
  );
}
