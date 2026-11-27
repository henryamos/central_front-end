import { notFound } from "next/navigation";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";
import { ministries } from "@/features/ministries";
const music = ministries.find((item) => item.slug === "music")!;
const groups = music.groups.map((name) => ({
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  description: "A music group at Cape Coast Central SDA Church.",
}));
const directory = [...ministries, ...groups];
export const dynamicParams = false;
export const generateStaticParams = () =>
  directory.map(({ slug }) => ({ slug }));
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ministry = directory.find((item) => item.slug === slug);
  if (!ministry) notFound();
  return (
    <PublicPage title={ministry.name} intro={ministry.description}>
      {slug === "music" && (
        <section>
          <h2>Music groups</h2>
          <PageLinks
            items={groups.map((group) => [
              group.name,
              "/ministries/" + group.slug,
            ])}
          />
        </section>
      )}
      <PageLinks
        items={[
          ["All ministries", "/ministries"],
          ["Information desk", "/contact"],
        ]}
      />
    </PublicPage>
  );
}
