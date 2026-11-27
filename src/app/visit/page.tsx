import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";
import { WeeklySchedule } from "@/features/public-site/weekly-schedule";
import { VisitorForm } from "@/features/public-site/visitor-form";
export const metadata: Metadata = { title: "Plan a visit" };
export default function Page() {
  return (
    <PublicPage
      title={"Plan a visit"}
      intro={
        "Join us in Cape Coast for Sabbath School and worship on Saturday."
      }
    >
      <WeeklySchedule />
      <VisitorForm planned />
      <PageLinks
        items={[
          ["Guest check-in", "/guest"],
          ["Information desk", "/contact"],
          ["Watch online", "/watch"],
        ]}
      />
    </PublicPage>
  );
}
