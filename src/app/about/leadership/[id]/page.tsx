import { notFound } from "next/navigation";
import Image from "next/image";
import { PageLinks } from "@/features/public-site/public-page";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading } from "@/components/ui/typography/typography";
import { UserRound } from "lucide-react";
import { publishedLeaders } from "@/features/church-life/records";
export const dynamicParams = false;
export const generateStaticParams = () =>
  publishedLeaders.map(({ id }) => ({ id }));
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leader = publishedLeaders.find((item) => item.id === id);
  if (!leader) notFound();
  return (
    <Section className="bg-surface-muted">
      <Container className="grid gap-8">
        <article className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-background">
            {leader.portrait ? (
              <Image
                src={leader.portrait}
                alt=""
                fill
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover object-top"
              />
            ) : (
              <UserRound
                aria-hidden="true"
                className="absolute inset-0 m-auto size-24"
              />
            )}
          </div>
          <header className="grid content-center justify-items-start gap-4">
            <p className="m-0 font-semibold">{leader.role}</p>
            <Heading level={1}>{leader.name}</Heading>
            <p className="m-0">{leader.team}</p>
          </header>
        </article>
        <section className="grid max-w-(--measure) gap-4">
          <Heading level={2}>About {leader.name}</Heading>
          {leader.biography && (
            <p className="m-0 whitespace-pre-line">{leader.biography}</p>
          )}
        </section>
        <PageLinks
          items={[
            ["Leadership directory", "/about/leadership"],
            ["Information desk", "/contact"],
          ]}
        />
      </Container>
    </Section>
  );
}
