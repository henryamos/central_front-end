import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading } from "@/components/ui/typography/typography";
import { PhotoHeader } from "@/features/public-site/photo-header";
import { PageLinks } from "@/features/public-site/public-page";
export const metadata = { title: "Our history" };
const milestones: readonly {
  date: string;
  title: string;
  description: string;
}[] = [];
export default function Page() {
  return (
    <>
      <PhotoHeader
        title="Our history"
        description="The story of Cape Coast Central SDA Church."
        image="/images/ChurhcBuilding.jpg"
      />
      <Section>
        <Container className="grid gap-8 md:grid-cols-2">
          <section className="grid content-start gap-4">
            <Heading level={2}>The church archive</Heading>
            {milestones.length ? (
              <ol className="m-0 grid list-none gap-4 border-l border-primary pl-6">
                {milestones.map((item) => (
                  <li key={item.date + item.title}>
                    <span className="text-sm font-semibold">{item.date}</span>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="m-0">
                Our historical account has yet to be published. Explore
                photographs of the congregation as it gathers today.
              </p>
            )}
            <PageLinks items={[["About our church", "/about"]]} />
          </section>
          <Link href="/gallery" className="group grid content-start">
            <Image
              src="/images/General.jpg"
              width={640}
              height={360}
              alt="Choir and musicians performing together."
              className="aspect-video w-full object-cover"
            />
            <span className="flex min-h-12 items-center border-b border-border font-semibold group-hover:underline">
              Explore church photographs
            </span>
          </Link>
        </Container>
      </Section>
    </>
  );
}
