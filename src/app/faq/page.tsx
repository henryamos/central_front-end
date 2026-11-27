import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";

export const metadata: Metadata = { title: "Visitor questions" };
export default function Page() {
  return (
    <PublicPage
      title={"Visitor questions"}
      intro={"Find answers about attending worship and getting involved."}
    >
      <div className="grid max-w-(--measure)">
        {[
          [
            "When is Sabbath worship?",
            "Sabbath School runs from 8:00 AM to 10:00 AM on Saturdays. Worship follows from 10:00 AM to 1:00 PM.",
          ],
          [
            "When can I join Bible study?",
            "Bible study meets on Sunday from 6:00 PM to 8:00 PM.",
          ],
          [
            "When is midweek prayer?",
            "Midweek prayer meets on Wednesday from 6:00 PM to 8:00 PM.",
          ],
          [
            "Where do I check in?",
            "When you arrive, ask for the information desk. They can help you check in.",
          ],
        ].map(([q, a]) => (
          <details key={q} className="border-t border-border">
            <summary className="min-h-12 cursor-pointer py-4 font-semibold">
              {q}
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      <PageLinks
        items={[
          ["Plan a visit", "/visit"],
          ["Information desk", "/contact"],
        ]}
      />
    </PublicPage>
  );
}
