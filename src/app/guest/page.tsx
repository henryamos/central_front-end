import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";
import { VisitorForm } from "@/features/public-site/visitor-form";
export const metadata: Metadata = { title: "Guest check-in" };
export default function Page() {
  return (
    <PublicPage
      title={"Guest check-in"}
      intro={"Already at church? Check in for the gathering you are attending."}
    >
      <VisitorForm />
      <PageLinks
        items={[
          ["Plan a visit", "/visit"],
          ["Information desk", "/contact"],
        ]}
      />
    </PublicPage>
  );
}
