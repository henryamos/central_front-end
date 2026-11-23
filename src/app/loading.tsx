import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Text } from "@/components/ui/typography/typography";
export default function Loading() {
  return (
    <Section aria-label="Loading">
      <Container>
        <Text role="status">Loading...</Text>
      </Container>
    </Section>
  );
}
