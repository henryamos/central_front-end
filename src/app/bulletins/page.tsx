import { bulletins } from "@/features/public-site/publications";
import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";

export const metadata: Metadata = { title: "Church bulletins" };
export default function Page() {
  return (
    <PublicPage
      title={"Church bulletins"}
      intro={"Find Sabbath programmes and downloadable bulletins."}
    >
      {bulletins.length ? (
        <ul className="m-0 grid list-none gap-3 p-0">
          {bulletins.map((item) => (
            <li key={item.fileUrl} className="border-t border-border py-3">
              <a
                className="inline-flex min-h-12 items-center underline"
                download
                href={item.fileUrl}
              >
                {item.title} ({item.date})
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bulletins are available to download yet.</p>
      )}
      <PageLinks
        items={[
          ["View the worship schedule", "/visit"],
          ["Church events", "/events"],
        ]}
      />
    </PublicPage>
  );
}
