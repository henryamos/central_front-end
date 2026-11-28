import { PhotoHeader } from "@/features/public-site/photo-header";
import { ButtonLink } from "@/components/ui/button/button-link";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading } from "@/components/ui/typography/typography";
import { LeadershipDirectory } from "@/features/church-life/leadership-directory";
import { PageLinks } from "@/features/public-site/public-page";
export const metadata = { title: "Church leadership" };
export default function Page() {
  return (
    <>
      <PhotoHeader
        title="Church leadership"
        description="Meet the people who lead and serve Cape Coast Central SDA Church."
        image="/images/dance2.jpg"
      />
      <Section>
        <Container className="grid items-start gap-8">
          <section className="grid gap-4">
            <Heading level={2}>Leadership directory</Heading>
            <LeadershipDirectory />
          </section>
          <aside className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
            <Heading level={2} size="subsection">
              Reach the church
            </Heading>
            <p className="m-0">
              For help reaching a ministry or church officer, start with the
              information desk.
            </p>
            <ButtonLink href="/contact">Information desk</ButtonLink>
          </aside>
          <PageLinks
            items={[
              ["Explore our ministries", "/ministries"],
              ["About our church", "/about"],
            ]}
          />
        </Container>
      </Section>
    </>
  );
}
