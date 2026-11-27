import type { Metadata } from "next";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading } from "@/components/ui/typography/typography";
import { LeadershipDirectory } from "@/features/church-life/leadership-directory";
export const metadata: Metadata = { title: "Leadership" };
export default function Page() {
  return (
    <Section>
      <Container className="grid gap-6">
        <Heading level={1}>Leadership</Heading>
        <LeadershipDirectory />
      </Container>
    </Section>
  );
}
