"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, History, UsersRound } from "lucide-react";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
import { Button } from "@/components/ui/button/button";
import { ButtonLink } from "@/components/ui/button/button-link";
import { cn } from "@/lib/utils";

const discoveries = [
  {
    id: "history",
    label: "History",
    icon: History,
    title: "Our roots in Cape Coast",
    description: "Trace the story of the congregation that gathers here today.",
    action: "Explore our history",
    href: "/about/history",
  },
  {
    id: "beliefs",
    label: "Beliefs",
    icon: BookOpen,
    title: "The faith we share",
    description:
      "Explore the Seventh-day Adventist beliefs that shape our church.",
    action: "Explore our beliefs",
    href: "/about/beliefs",
  },
  {
    id: "leadership",
    label: "Leadership",
    icon: UsersRound,
    title: "People behind the ministry",
    description: "Get to know the people who lead and serve our church.",
    action: "Meet our leadership",
    href: "/about/leadership",
  },
] as const;

export function ChurchIntroduction() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <Section
      aria-labelledby="church-title"
      className="relative isolate text-primary-foreground"
    >
      <div
        data-church-background
        aria-hidden="true"
        className="absolute inset-0"
      >
        <Image
          src="/images/ChurhcBuilding.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-church-overlay" />
      </div>
      <Container className="relative grid gap-8 md:gap-16">
        <div className="grid max-w-(--church-discovery-max) justify-items-start gap-3">
          <Heading level={2} id="church-title" size="title" weight="bold">
            Get to know our church
          </Heading>
          <Link
            href="/about"
            className="inline-flex min-h-(--touch-target) min-w-(--touch-target) items-center rounded-sm py-3 text-base font-semibold text-primary-foreground underline underline-offset-(--spacing-1) hover:no-underline focus-visible:outline-focus-inverse"
          >
            About our church{" "}
            <ArrowUpRight aria-hidden="true" className="ml-1 size-4" />
          </Link>
        </div>
        <div className="grid w-full gap-6 border-t border-background/50 pt-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-12">
          <div
            role="tablist"
            aria-label="Explore our church"
            className="relative grid grid-cols-3 before:absolute before:inset-x-0 before:top-0 before:border-t before:border-background/50"
          >
            {discoveries.map((item, index) => (
              <Button
                key={item.id}
                ref={(element) => {
                  tabs.current[index] = element;
                }}
                role="tab"
                variant="secondary"
                id={`${id}-tab-${item.id}`}
                aria-controls={`${id}-panel-${item.id}`}
                aria-label={item.label}
                aria-selected={active === index}
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  let next = index;
                  if (event.key === "ArrowRight")
                    next = (index + 1) % discoveries.length;
                  else if (event.key === "ArrowLeft")
                    next =
                      (index + discoveries.length - 1) % discoveries.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = discoveries.length - 1;
                  else return;
                  event.preventDefault();
                  setActive(next);
                  tabs.current[next]?.focus();
                }}
                className={cn(
                  "relative flex min-w-0 flex-col gap-3 rounded-none border-x-0 border-t-0 border-b-(length:--focus-width) border-transparent bg-transparent px-1 py-3 text-background before:absolute before:top-0 before:left-1/2 before:size-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-background not-disabled:hover:bg-transparent not-disabled:hover:underline focus-visible:inset-ring-background not-disabled:active:border-transparent not-disabled:active:text-background sm:px-4 sm:py-2",
                  active === index &&
                    "border-background not-disabled:active:border-background",
                )}
              >
                <span className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                  <item.icon
                    aria-hidden="true"
                    className="size-5 shrink-0"
                    strokeWidth={1.75}
                  />
                  <span className="sm:hidden">
                    {item.id === "leadership" ? "Leaders" : item.label}
                  </span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </Button>
            ))}
          </div>
          <div className="grid">
            {discoveries.map((item, index) => (
              <div
                key={item.id}
                role="tabpanel"
                id={`${id}-panel-${item.id}`}
                aria-labelledby={`${id}-tab-${item.id}`}
                aria-hidden={active !== index}
                tabIndex={active === index ? 0 : -1}
                className={cn(
                  "col-start-1 row-start-1 grid content-start justify-items-start gap-4 rounded-sm focus-visible:outline-primary",
                  active === index
                    ? "motion-safe:animate-church-panel-enter"
                    : "pointer-events-none invisible",
                )}
              >
                <div className="grid gap-3">
                  <Heading level={3} size="section" weight="bold">
                    {item.title}
                  </Heading>
                  <Text>{item.description}</Text>
                </div>
                <ButtonLink
                  href={item.href}
                  variant="secondary"
                  className="w-fit"
                >
                  {item.action}
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
