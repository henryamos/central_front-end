import Link from "next/link";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
/** Foundation empty state; replace through an approved feature ticket. */
export function PagePlaceholder({ title }: { title: string }) {
  return (
    <Section aria-labelledby="page-title">
      <Container className="grid gap-6">
        <Heading level={1} id="page-title">
          {title}
        </Heading>
        <Text>Content is not available yet.</Text>
        <Link href="/">Return home</Link>
      </Container>
    </Section>
  );
}
