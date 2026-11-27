"use client";

import { Heading, Text } from "@/components/ui/typography/typography";
import { useHeroGreeting } from "../hooks/use-hero-greeting";
import { heroMessages } from "../lib/hero-greeting";

export function HeroGreeting() {
  const greeting = useHeroGreeting();
  const message = heroMessages[greeting];
  return (
    <>
      <Heading
        level={1}
        id="home-title"
        data-hero-welcome
        size="display"
        weight="extrabold"
        className="grid gap-2 text-home-welcome leading-display font-bold tracking-display motion-safe:animate-hero-enter sm:font-extrabold"
      >
        <span className="block text-xl leading-ui font-medium tracking-normal sm:text-2xl">
          Welcome to
        </span>{" "}
        <span>
          <span className="block">Cape Coast</span>{" "}
          <span className="block">Central SDA Church</span>
        </span>
      </Heading>
      <Text
        size="lead"
        data-hero-greeting={greeting}
        className="max-w-(--home-visit-measure) text-hero-lead leading-body motion-safe:animate-hero-enter motion-safe:[animation-delay:var(--hero-copy-delay)]"
      >
        {message}
      </Text>
    </>
  );
}
