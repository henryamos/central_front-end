import type { Metadata } from "next";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading } from "@/components/ui/typography/typography";
import { EventBrowser } from "@/features/church-life/event-browser";
export const metadata: Metadata = { title: "Events" };
export default function Page() {
  return (
    <Section>
      <Container className="grid gap-6">
        <Heading level={1}>Events</Heading>
        <EventBrowser />
      </Container>
    </Section>
  );
}
