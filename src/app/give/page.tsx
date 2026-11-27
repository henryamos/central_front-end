import { givingChannels } from "@/features/public-site/church-information";
import type { Metadata } from "next";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";

export const metadata: Metadata = { title: "Giving" };
export default function Page() {
  return (
    <PublicPage
      title={"Giving"}
      intro={"Tithe, offerings, harvest and ministry support."}
    >
      <section>
        <h2>Ways to give</h2>
        {givingChannels.length ? (
          <dl className="m-0 grid gap-4">
            {givingChannels.map((channel) => (
              <div key={channel.name} className="border-t border-border py-4">
                <dt className="font-semibold">{channel.name}</dt>
                <dd>{channel.accountHolder}</dd>
                <dd className="tabular-nums select-all">
                  {channel.accountNumber}
                </dd>
                <dd>{channel.instructions}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p>
            Payment instructions will appear here once confirmed by the church
            treasurer. For help giving in person, ask at the information desk.
          </p>
        )}
      </section>
      <PageLinks
        items={[
          ["Information desk", "/contact"],
          ["Plan a visit", "/visit"],
        ]}
      />
    </PublicPage>
  );
}
