import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading } from "@/components/ui/typography/typography";
import { MinistryBoard } from "@/features/ministries/components/ministry-board";
export function MinistrySpotlight() {
  return (
    <Section aria-labelledby="ministries-title">
      <Container className="grid gap-6 md:gap-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <Heading level={2} id="ministries-title" size="title" weight="bold">
            Our ministries
          </Heading>
          <Link
            href="/ministries"
            className="inline-flex min-h-12 items-center gap-2 font-semibold hover:underline"
          >
            Explore ministries{" "}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <MinistryBoard />
      </Container>
    </Section>
  );
}
