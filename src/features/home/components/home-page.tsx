import { LeadershipDirectory } from "@/features/church-life/leadership-directory";
import { newestSermons } from "@/features/public-site/sermons";
import { EventBrowser } from "@/features/church-life/event-browser";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CirclePlay,
  Newspaper,
  BookOpen,
} from "lucide-react";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading } from "@/components/ui/typography/typography";
import { ButtonLink } from "@/components/ui/button/button-link";
import { MinistrySpotlight } from "./ministry-spotlight";
import { homeSlides } from "../constants/home.constants";
import { HomeHero } from "./home-hero";
import { HeroGreeting } from "./hero-greeting";
import { SabbathInvitation } from "./sabbath-invitation";
import { ChurchIntroduction } from "./church-introduction";
const textLink =
  "inline-flex min-h-(--touch-target) min-w-(--touch-target) max-w-full items-center justify-between gap-4 rounded-sm py-3 text-base font-semibold no-underline hover:underline focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden";
export function HomePage() {
  const latest = newestSermons()[0];
  return (
    <>
      <HomeHero slides={homeSlides}>
        <div className="grid w-full max-w-(--home-copy-max) justify-items-start gap-4 text-left sm:gap-6">
          <HeroGreeting />
          <div className="mt-2 flex w-full flex-col items-stretch gap-3 motion-safe:animate-hero-enter motion-safe:[animation-delay:var(--hero-actions-delay)] sm:mt-0 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <ButtonLink href="/visit" className="w-full sm:w-auto">
              <CalendarDays aria-hidden="true" className="size-4" />
              Plan a Visit
            </ButtonLink>
            <ButtonLink
              href="/watch"
              aria-label="Watch online"
              variant="secondary"
              className="w-full border-background bg-transparent text-background not-disabled:hover:bg-primary focus-visible:inset-ring-background not-disabled:active:border-background not-disabled:active:text-background sm:w-auto sm:border-primary sm:bg-background sm:text-primary sm:not-disabled:hover:bg-surface-muted sm:focus-visible:inset-ring-primary sm:not-disabled:active:border-primary-active sm:not-disabled:active:text-primary-active"
            >
              <CirclePlay aria-hidden="true" className="size-4" />
              Watch online
            </ButtonLink>
          </div>
        </div>
      </HomeHero>
      <SabbathInvitation />
      <ChurchIntroduction />
      <MinistrySpotlight />
      <Section aria-label="Leadership board" className="bg-surface-muted">
        <Container className="grid gap-8">
          <div className="grid gap-3 border-b border-border pb-6">
            <Heading level={2} size="title" weight="bold">
              The people who serve our church
            </Heading>
            <p className="m-0 max-w-(--measure) text-muted-foreground">
              Meet our pastoral team, elders, board members and departmental
              heads.
            </p>
          </div>
          <LeadershipDirectory homepage />
        </Container>
      </Section>
      <Section aria-label="Church events" className="bg-surface-muted">
        <Container className="grid gap-6">
          <section
            aria-labelledby="home-events"
            className="grid content-start gap-6"
          >
            <Heading level={2} size="title" weight="bold" id="home-events">
              Church events
            </Heading>
            <EventBrowser />
            <Link className={textLink + " justify-self-start"} href="/events">
              All events <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </section>
        </Container>
      </Section>
      <Section
        aria-labelledby="church-life-title"
        className="bg-primary text-background"
      >
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)] lg:gap-16">
          <div className="grid content-start justify-items-start gap-4">
            <CirclePlay
              aria-hidden="true"
              className="size-8"
              strokeWidth={1.5}
            />
            <Heading
              id="church-life-title"
              level={2}
              size="title"
              weight="bold"
            >
              {latest?.title ?? "Sermon library"}
            </Heading>
            <p className="m-0">
              {latest
                ? latest.speaker
                : "Recorded messages from Cape Coast Central."}
            </p>
            <ButtonLink
              href={latest ? "/sermons/" + latest.slug : "/sermons"}
              variant="secondary"
            >
              {latest ? "View latest sermon" : "Browse sermons"}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
          <div className="grid content-center">
            {[
              { title: "Church news", href: "/news", icon: Newspaper },
              {
                title: "Sabbath bulletins",
                href: "/bulletins",
                icon: BookOpen,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-16 items-center gap-3 border-t border-background/50 py-4 text-lg font-semibold text-background last:border-b hover:underline"
              >
                <item.icon aria-hidden="true" className="size-5 shrink-0" />
                {item.title}
                <ArrowRight
                  aria-hidden="true"
                  className="ml-auto size-4 shrink-0"
                />
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
