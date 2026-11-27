import Image from "next/image";
import { Container } from "@/components/layout/container/container";
import { Heading, Text } from "@/components/ui/typography/typography";
import type { ReactNode } from "react";
export function PhotoHeader({
  title,
  description,
  image,
  level = 1,
  children,
}: {
  title: string;
  description: string;
  image: string;
  level?: 1 | 2;
  children?: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="relative isolate bg-primary text-background"
    >
      <Image alt="" src={image} fill sizes="100vw" className="object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-church-overlay" />
      <Container className="relative grid justify-items-start gap-4 py-16 md:py-24">
        <Heading level={level} size="title" weight="bold">
          {title}
        </Heading>
        <Text size="lead">{description}</Text>
        {children}
      </Container>
    </section>
  );
}
