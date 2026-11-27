import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";

export const metadata: Metadata = { title: "Our history" };
export default function Page() {
  return (
    <PublicPage
      title={"Our history"}
      intro={"The story of Cape Coast Central SDA Church."}
    >
      <p>The church history has yet to be published.</p>
      <PageLinks
        items={[
          ["Our church", "/about"],
          ["Church leadership", "/about/leadership"],
          ["Church photographs", "/gallery"],
        ]}
      />
    </PublicPage>
  );
}
