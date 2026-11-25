import Link from "next/link";
import { ArrowRight, CalendarDays, CirclePlay } from "lucide-react";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
import { ButtonLink } from "@/components/ui/button/button-link";
import { homeSlides, homeMinistries } from "../constants/home.constants";
import { HomeHero } from "./home-hero";
import { SabbathInvitation } from "./sabbath-invitation";
import { ChurchIntroduction } from "./church-introduction";
const textLink =
  "inline-flex min-h-(--touch-target) min-w-(--touch-target) max-w-full items-center justify-between gap-4 rounded-sm py-3 text-base font-semibold no-underline hover:underline focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden";
export function HomePage() {
  return (
    <>
      <HomeHero slides={homeSlides}>
        <div className="grid w-full max-w-(--home-copy-max) justify-items-start gap-4 text-left sm:gap-6">
          <Heading
            level={1}
            id="home-title"
            size="display"
            weight="extrabold"
            className="text-4xl leading-display font-bold tracking-display motion-safe:animate-hero-enter sm:text-display sm:font-extrabold"
          >
            Cape Coast
            <br />
            Central SDA
          </Heading>
          <Text
            size="lead"
            className="text-hero-lead leading-ui motion-safe:animate-hero-enter motion-safe:[animation-delay:var(--hero-copy-delay)]"
          >
            <span className="sr-only">
              Come as you are and find a place to belong. Join us this Sabbath
              for worship, Bible study and fellowship.
            </span>
            <span aria-hidden="true" className="grid gap-3 sm:gap-1">
              <span className="text-balance sm:hidden">
                Come as you are and find a place to belong. Join us this Sabbath
                for worship, Bible study and fellowship.
              </span>
              <span className="hidden sm:block">
                Come as you are and find a place to belong.
              </span>
              <span className="hidden sm:block">
                <span>Join us this Sabbath</span>{" "}
                <span className="inline-block w-max max-w-full">
                  <span>for</span>{" "}
                  <span className="relative isolate inline-grid min-h-[calc(1em*var(--leading-ui))] max-w-full overflow-hidden align-baseline">
                    <span className="hero-phrase col-start-1 row-start-1 font-bold">
                      worship
                    </span>
                    <span className="hero-phrase col-start-1 row-start-1 font-bold">
                      Bible study
                    </span>
                    <span className="hero-phrase col-start-1 row-start-1 font-bold">
                      fellowship
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </Text>
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
      <Section aria-labelledby="ministries-title" className="bg-surface-muted">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div className="grid content-start gap-6">
            <Text size="small" tone="muted" className="font-semibold">
              LIFE TOGETHER
            </Text>
            <Heading level={2} id="ministries-title">
              Our ministries.
            </Heading>
            <Text tone="muted">
              Discover the different ways to take part in church life.
            </Text>
            <div>
              <ButtonLink href="/ministries" variant="secondary">
                Explore ministries{" "}
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </div>
          </div>
          <ul className="m-0 grid gap-x-8 p-0 sm:grid-cols-2">
            {homeMinistries.map((name) => (
              <li
                key={name}
                className="flex min-h-(--touch-target) items-center border-b-(length:--control-border-width) border-border py-4 text-lg font-medium"
              >
                {name}
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section aria-labelledby="church-life-title">
        <Container className="grid gap-8">
          <Heading level={2} id="church-life-title">
            Explore church life.
          </Heading>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Sermons",
                body: "Messages and recorded worship.",
                href: "/sermons",
              },
              {
                title: "Events",
                body: "Church programmes and gatherings.",
                href: "/events",
              },
              {
                title: "News",
                body: "Updates from our church.",
                href: "/news",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  textLink +
                  " items-start border-t-(length:--control-border-width) border-border py-6"
                }
              >
                <span className="grid min-w-0 gap-2">
                  <span className="text-xl font-semibold">{item.title}</span>
                  <span className="text-base font-normal text-muted-foreground">
                    {item.body}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1 size-6 shrink-0"
                />
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
