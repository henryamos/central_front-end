import Image from "next/image";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";
import { broadcast } from "@/features/public-site/publications";
import { newestSermons } from "@/features/public-site/sermons";
import { defaultServices } from "@/features/church-life/schedule";
import { ButtonLink } from "@/components/ui/button/button-link";
export const metadata = { title: "Watch online" };
export default function Page() {
  const latest = newestSermons()[0];
  const service = defaultServices.find((item) => item.id === "worship");
  return (
    <PublicPage
      title="Watch online"
      intro="Worship with Cape Coast Central SDA Church."
    >
      <section className="relative isolate overflow-hidden rounded-sm bg-primary text-background">
        <Image
          src="/images/New.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-church-overlay" />
        <div className="relative grid justify-items-start gap-3 px-4 py-12 sm:p-12">
          <h2>
            {broadcast.url ? "Worship broadcast" : "Next worship service"}
          </h2>
          {service && (
            <p className="m-0">
              {service.day}, {service.time} (Ghana time)
            </p>
          )}
          {broadcast.url ? (
            <ButtonLink href={broadcast.url}>Open the broadcast</ButtonLink>
          ) : (
            <p className="m-0">No livestream has been announced.</p>
          )}
        </div>
      </section>
      {latest && (
        <section>
          <h2>Latest recording</h2>
          <PageLinks items={[[latest.title, "/sermons/" + latest.slug]]} />
        </section>
      )}
      <PageLinks
        items={[
          ["Sermon library", "/sermons"],
          ["Plan a visit", "/visit"],
        ]}
      />
    </PublicPage>
  );
}
