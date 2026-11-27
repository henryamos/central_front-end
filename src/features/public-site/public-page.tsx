import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/layout/section/section";
import { Container } from "@/components/layout/container/container";
import { Heading, Text } from "@/components/ui/typography/typography";

export function PublicPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <Section className="bg-background pb-0">
        <Container>
          <div className="grid items-end gap-4 border-b border-primary pb-6 sm:pb-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
            <Heading level={1} weight="bold">
              {title}
            </Heading>
            <Text size="lead" tone="muted">
              {intro}
            </Text>
          </div>
        </Container>
      </Section>
      <Section className="pt-8 sm:pt-12">
        <Container className="grid gap-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold md:[&_h2]:text-2xl">
          {children}
        </Container>
      </Section>
    </>
  );
}
export function PageLinks({
  items,
}: {
  items: readonly (readonly [string, string])[];
}) {
  return (
    <ul className="m-0 grid list-none gap-x-8 p-0 md:grid-cols-2">
      {items.map(([label, href]) => (
        <li key={href} className="border-t border-border">
          <Link
            href={href}
            className="flex min-h-12 items-center justify-between gap-2 py-3 font-semibold hover:underline"
          >
            {label}
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
