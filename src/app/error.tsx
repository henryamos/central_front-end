"use client";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
import { Button } from "@/components/ui/button/button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section aria-labelledby="error-title">
      <Container className="grid justify-items-start gap-6">
        <Heading level={1} id="error-title">
          Something went wrong
        </Heading>
        <Text>Please try loading this page again.</Text>
        <Button onClick={reset}>Try again</Button>
      </Container>
    </Section>
  );
}
