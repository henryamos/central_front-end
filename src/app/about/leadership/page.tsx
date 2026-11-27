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
        image="/images/ChurhcBuilding.jpg"
      />
      <Section>
        <Container className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="grid gap-4">
            <Heading level={2}>Leadership directory</Heading>
            <LeadershipDirectory />
          </section>
          <aside className="grid justify-items-start gap-4 border-l-4 border-primary bg-surface-muted p-6">
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
