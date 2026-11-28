import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { PhotoHeader } from "@/features/public-site/photo-header";
import { MinistryBoard } from "./ministry-board";
export function MinistriesPage() {
  return (
    <>
      <PhotoHeader
        title="Our ministries."
        description="Find a ministry for worship, study, fellowship or service."
        image="/images/General.jpg"
      />
      <Section className="bg-surface-muted">
        <Container>
          <h2 className="sr-only">Ministry directory</h2>
          <MinistryBoard />
        </Container>
      </Section>
    </>
  );
}
