import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CirclePlay } from "lucide-react";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
import { ButtonLink } from "@/components/ui/button/button-link";
import { homeSlides, homeMinistries } from "../constants/home.constants";
import { HomeHero } from "./home-hero";
import { SabbathInvitation } from "./sabbath-invitation";
const textLink =
  "inline-flex min-h-(--touch-target) min-w-(--touch-target) max-w-full items-center justify-between gap-4 rounded-sm py-3 text-base font-semibold no-underline hover:underline focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden";
export function HomePage() {
  return (
    <>
      <HomeHero slides={homeSlides}>
        <div className="grid w-full max-w-(--home-copy-max) justify-items-start gap-6 text-left">
          <Heading
            level={1}
            id="home-title"
            size="display"
            weight="extrabold"
            className="leading-display tracking-display motion-safe:animate-hero-enter"
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
            <span aria-hidden="true" className="grid gap-1">
              <span>Come as you are and find a place to belong.</span>
              <span>
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
          <div className="flex flex-wrap items-center gap-4 motion-safe:animate-hero-enter motion-safe:[animation-delay:var(--hero-actions-delay)]">
            <ButtonLink href="/visit">
              <CalendarDays aria-hidden="true" className="size-4" />
              Plan a Visit
            </ButtonLink>
            <ButtonLink href="/watch" variant="secondary">
              <CirclePlay aria-hidden="true" className="size-4" />
              Watch online
            </ButtonLink>
          </div>
        </div>
      </HomeHero>
      <SabbathInvitation />
      <Section aria-labelledby="church-title">
        <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-4/3">
            <Image
              src="/images/Elder2.jpg"
              alt="People gathered together in a church hall."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="grid gap-6">
            <Text size="small" tone="muted" className="font-semibold">
              OUR CHURCH
            </Text>
            <Heading level={2} id="church-title">
              Get to know
              <br />
              Cape Coast Central.
            </Heading>
            <Text tone="muted">
              Explore our beliefs, our story and the people who serve our
              church.
            </Text>
            <div className="grid divide-y divide-border">
              <Link href="/about" className={textLink}>
                About our church{" "}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link href="/about/beliefs" className={textLink}>
                Our beliefs <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link href="/about/leadership" className={textLink}>
                Meet our leadership{" "}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
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
