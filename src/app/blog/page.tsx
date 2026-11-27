import { churchArticles } from "@/features/public-site/publications";
import { PublicationList } from "@/features/public-site/publication-list";
import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";

export const metadata: Metadata = { title: "Articles and reflections" };
export default function Page() {
  return (
    <PublicPage
      title={"Articles and reflections"}
      intro={"Read contributions from our church community."}
    >
      <PublicationList
        items={churchArticles}
        empty="No articles have been published yet."
      />
      <PageLinks
        items={[
          ["Church news", "/news"],
          ["Sermon library", "/sermons"],
        ]}
      />
    </PublicPage>
  );
}
