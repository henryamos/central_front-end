import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading } from "@/components/ui/typography/typography";
import { MinistryBoard } from "@/features/ministries/components/ministry-board";
export function MinistrySpotlight() {
  return (
    <Section aria-labelledby="ministries-title" className="bg-surface-muted">
      <Container className="grid gap-6 md:gap-8">
        <div className="grid gap-3 border-b border-border pb-6">
          <Heading level={2} id="ministries-title" size="title" weight="bold">
            Our ministries
          </Heading>
        </div>
        <MinistryBoard />
        <div className="flex justify-end border-t border-border pt-3">
          <Link
            href="/ministries"
            className="inline-flex min-h-12 items-center gap-2 font-semibold hover:underline"
          >
            Explore ministries{" "}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
