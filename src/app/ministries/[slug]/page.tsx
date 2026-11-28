import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoHeader } from "@/features/public-site/photo-header";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading } from "@/components/ui/typography/typography";
import { defaultServices } from "@/features/church-life/schedule";
import { PageLinks } from "@/features/public-site/public-page";
import { ministries } from "@/features/ministries";
import { YouthChoirSongs } from "@/features/ministries/components/youth-choir-songs";
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
  const isMusic =
    slug === "music" || groups.some((group) => group.slug === slug);
  const gathering = defaultServices.find((item) => item.id === slug);
  return (
    <>
      <PhotoHeader
        title={ministry.name}
        description={ministry.description}
        image={isMusic ? "/images/General2.jpg" : "/images/ChurhcBuilding.jpg"}
      />
      <Section>
        <Container className="grid gap-8">
          <section className="grid gap-3">
            <Heading level={2}>Ministry profile</Heading>
            <p className="m-0">
              {isMusic && slug !== "music" ? (
                <Link className="underline" href="/ministries/music">
                  Part of the Music ministry
                </Link>
              ) : (
                ministry.name +
                " is one of the ministries at Cape Coast Central SDA Church."
              )}
            </p>
            {gathering && (
              <p>
                {gathering.day}, {gathering.time}
              </p>
            )}
          </section>
          {slug === "youth-choir" && <YouthChoirSongs />}
          {slug === "music" && (
            <section>
              <Heading level={2}>Music groups</Heading>
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
        </Container>
      </Section>
    </>
  );
}
