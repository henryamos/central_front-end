import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";

export const metadata: Metadata = { title: "Our beliefs" };
export default function Page() {
  return (
    <PublicPage
      title={"Our beliefs"}
      intro={
        "Seventh-day Adventists look to the Bible as the foundation of their faith."
      }
    >
      <section>
        <h2>The 28 Fundamental Beliefs</h2>
        <p>
          Explore what Adventists believe about God, humanity, salvation, the
          church, daily life and restoration.
        </p>
      </section>
      <PageLinks
        items={[
          [
            "Read the beliefs on Adventist.org",
            "https://adventist.org/beliefs",
          ],
          ["Join us for Bible study", "/visit"],
        ]}
      />
    </PublicPage>
  );
}
