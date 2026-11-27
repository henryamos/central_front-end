import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";
import Image from "next/image";
export const metadata: Metadata = { title: "Our church" };
export default function Page() {
  return (
    <PublicPage
      title={"Our church"}
      intro={
        "We gather in Cape Coast for Sabbath worship, Bible study and prayer."
      }
    >
      <Image
        src="/images/ChurhcBuilding.jpg"
        width={1280}
        height={720}
        alt="The interior of Cape Coast Central SDA Church"
        className="aspect-video w-full object-cover"
      />
      <PageLinks
        items={[
          ["Our history", "/about/history"],
          ["Our beliefs", "/about/beliefs"],
          ["Church leadership", "/about/leadership"],
          ["Our ministries", "/ministries"],
        ]}
      />
    </PublicPage>
  );
}
