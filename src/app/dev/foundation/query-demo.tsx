"use client";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
import { Button } from "@/components/ui/button/button";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { foundationStatusSchema } from "@/mocks/foundation";
export function QueryDemo() {
  const query = useQuery({
    queryKey: ["foundation", "status"],
    queryFn: ({ signal }) =>
      apiGet("/api/v1/_foundation/status", foundationStatusSchema, { signal }),
  });
  return (
    <Section aria-labelledby="foundation-title">
      <Container className="grid justify-items-start gap-6">
        <Heading level={1} id="foundation-title">
          Infrastructure check
        </Heading>
        {query.isPending ? (
          <Text role="status">Loading mock response...</Text>
        ) : query.isError ? (
          <>
            <Text role="alert">{query.error.message}</Text>
            <Button onClick={() => void query.refetch()}>Try again</Button>
          </>
        ) : (
          <>
            <Text>Response source: {query.data.source}</Text>
            <Text role="status">Query request ready</Text>
            <Button
              onClick={() => void query.refetch()}
              loading={query.isFetching}
              loadingLabel="Refreshing..."
            >
              Refresh request
            </Button>
          </>
        )}
      </Container>
    </Section>
  );
}
