import Link from "next/link";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
export default function NotFound() {
  return (
    <Section aria-labelledby="missing-title">
      <Container className="grid gap-6">
        <Heading level={1} id="missing-title">
          Page not found
        </Heading>
        <Text>This page is unavailable.</Text>
        <Link href="/">Return home</Link>
      </Container>
    </Section>
  );
}
