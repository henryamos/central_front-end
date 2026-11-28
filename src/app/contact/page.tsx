import { informationDesk as desk } from "@/features/public-site/church-information";
import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";
import { ChurchLocation } from "@/features/public-site/church-location";

export const metadata: Metadata = { title: "Information desk" };
export default function Page() {
  const channels: [string, string][] = [];
  if (desk.phone) channels.push([desk.phone, "tel:" + desk.phone]);
  if (desk.email) channels.push([desk.email, "mailto:" + desk.email]);
  if (desk.directionsUrl)
    channels.push(["Map and directions", desk.directionsUrl]);
  for (const social of desk.social) channels.push([social.label, social.url]);
  return (
    <PublicPage
      title={"Information desk"}
      intro={"Find help with visiting, worship times and guest check-in."}
    >
      <section>
        <h2>Contact and directions</h2>
        {desk.address && <p>{desk.address}</p>}
        {channels.length ? (
          <PageLinks items={channels} />
        ) : (
          <p>
            During a visit, ask for the information desk at church. Verified
            contact links and directions will appear here when available.
          </p>
        )}
      </section>
      <ChurchLocation />
      <PageLinks
        items={[
          ["Plan a visit", "/visit"],
          ["Guest check-in", "/guest"],
          ["Visitor questions", "/faq"],
        ]}
      />
    </PublicPage>
  );
}
