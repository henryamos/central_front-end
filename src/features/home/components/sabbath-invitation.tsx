"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Church,
  CirclePlay,
  MapPin,
  HandHeart,
  UsersRound,
  MessageCircle,
  MonitorPlay,
  UserRoundCheck,
} from "lucide-react";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
import { Button } from "@/components/ui/button/button";
import { ButtonLink } from "@/components/ui/button/button-link";
import { cn } from "@/lib/utils";
const modes = [
  { id: "in-person", label: "In person", icon: MapPin },
  { id: "online", label: "Online", icon: MonitorPlay },
] as const;
const textLink =
  "inline-flex min-h-(--touch-target) min-w-(--touch-target) max-w-full items-center gap-2 rounded-sm text-base font-semibold text-primary no-underline hover:underline focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden";
export type WorshipGathering = {
  id: string;
  label: string;
  kind: "study" | "worship" | "prayer" | "activity";
  day?: string;
  time?: string;
  speaker?: string;
};
const defaultServices: readonly WorshipGathering[] = [
  {
    id: "sabbath-school",
    label: "Sabbath School",
    kind: "study",
    day: "Saturday",
  },
  { id: "worship", label: "Worship service", kind: "worship", day: "Saturday" },
  {
    id: "midweek-prayer",
    label: "Midweek prayer",
    kind: "prayer",
    day: "Wednesday",
  },
  { id: "bible-study", label: "Bible study", kind: "study" },
];
/** Display supplied programme details; unconfirmed fields remain explicitly pending. */
export function SabbathInvitation({
  services = defaultServices,
}: { services?: readonly WorshipGathering[] } = {}) {
  const [mode, setMode] = useState<"in-person" | "online">("in-person");
  const id = useId();
  const awaitingDetails =
    services.length === 0 ||
    services.some((service) => !service.time?.trim() || !service.day?.trim());
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <Section
      aria-labelledby="sabbath-title"
      className="relative z-(--layer-popover) -mt-(--home-invitation-overlap) pt-0 md:pt-0 lg:pt-0"
    >
      <Container>
        <div
          data-sabbath-panel
          className="grid gap-6 rounded-md border-(length:--control-border-width) border-border bg-background p-4 shadow-invitation md:gap-8 md:p-8"
        >
          <div className="border-b-(length:--control-border-width) border-border pb-4">
            <Heading
              level={2}
              id="sabbath-title"
              size="section"
              weight="bold"
              className="text-primary"
            >
              Worship & weekly gatherings.
            </Heading>
          </div>
          <div className="grid items-stretch gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-8">
            <div className="grid min-w-0 content-start gap-4">
              <div
                role="tablist"
                aria-label="How to join us"
                className="flex max-w-full shrink-0 border-b-(length:--control-border-width) border-border"
              >
                {modes.map((item, index) => (
                  <Button
                    key={item.id}
                    ref={(element) => {
                      tabs.current[index] = element;
                    }}
                    role="tab"
                    variant="secondary"
                    id={id + "-" + item.id}
                    aria-selected={mode === item.id}
                    aria-controls={id + "-panel-" + item.id}
                    tabIndex={mode === item.id ? 0 : -1}
                    onClick={() => setMode(item.id)}
                    onKeyDown={(event) => {
                      let next = index;
                      if (event.key === "ArrowRight")
                        next = (index + 1) % modes.length;
                      else if (event.key === "ArrowLeft")
                        next = (index + modes.length - 1) % modes.length;
                      else if (event.key === "Home") next = 0;
                      else if (event.key === "End") next = modes.length - 1;
                      else return;
                      event.preventDefault();
                      setMode(modes[next].id);
                      tabs.current[next]?.focus();
                    }}
                    className={cn(
                      "rounded-none border-x-0 border-t-0 border-b-(length:--focus-width) border-transparent bg-transparent px-4 text-muted-foreground not-disabled:hover:bg-transparent not-disabled:hover:text-primary",
                      mode === item.id && "border-primary text-primary",
                    )}
                  >
                    <span className="flex min-w-0 items-center justify-center gap-2">
                      <item.icon
                        aria-hidden="true"
                        className="size-4 shrink-0"
                        strokeWidth={1.75}
                      />
                      <span>{item.label}</span>
                    </span>
                  </Button>
                ))}
              </div>

              {mode === "in-person" && awaitingDetails && (
                <Text size="small" tone="muted">
                  Days and times to be confirmed.
                </Text>
              )}
              <div
                role="tabpanel"
                id={id + "-panel-in-person"}
                aria-labelledby={id + "-in-person"}
                hidden={mode !== "in-person"}
                tabIndex={0}
                className="grid gap-6 rounded-sm focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden"
              >
                <dl className="m-0 grid divide-y divide-border">
                  {services.map((service) => {
                    const Icon = {
                      study: BookOpen,
                      worship: Church,
                      prayer: HandHeart,
                      activity: UsersRound,
                    }[service.kind];
                    return (
                      <div
                        key={service.id}
                        className="grid gap-2 py-4 first:pt-0 sm:grid-cols-2 sm:gap-6"
                      >
                        <dt className="flex min-w-0 items-start gap-2 text-lg font-semibold text-primary">
                          <Icon
                            aria-hidden="true"
                            className="mt-1 size-6 shrink-0"
                            strokeWidth={1.75}
                          />
                          <span className="grid min-w-0 gap-1">
                            <span>{service.label}</span>
                            <span className="text-sm font-normal text-muted-foreground">
                              {service.day?.trim() || "Day to be confirmed"}
                            </span>
                            {service.speaker?.trim() && (
                              <span className="text-sm font-normal text-muted-foreground">
                                {service.speaker}
                              </span>
                            )}
                          </span>
                        </dt>
                        <dd
                          className={cn(
                            "m-0 pl-8 sm:self-start sm:pl-0 sm:text-right",
                            service.time?.trim()
                              ? "text-lg font-semibold text-primary tabular-nums"
                              : "text-base text-muted-foreground",
                          )}
                        >
                          {service.time?.trim() || "Time to be confirmed"}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
                {services.length === 0 && (
                  <Text tone="muted">
                    Programme details will be confirmed here.
                  </Text>
                )}
                <div className="flex flex-wrap items-center gap-6">
                  <ButtonLink href="/visit">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    Plan a Visit
                  </ButtonLink>
                  <Link href="/guest" className={textLink}>
                    <UserRoundCheck
                      aria-hidden="true"
                      className="size-4 shrink-0"
                      strokeWidth={1.75}
                    />
                    Guest check-in
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  </Link>
                </div>
              </div>
              <div
                role="tabpanel"
                id={id + "-panel-online"}
                aria-labelledby={id + "-online"}
                hidden={mode !== "online"}
                tabIndex={0}
                className="grid gap-6 rounded-sm focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden"
              >
                <dl className="m-0">
                  <div className="grid gap-2 sm:grid-cols-2 sm:gap-6">
                    <dt className="flex min-w-0 items-start gap-2 text-lg font-semibold text-primary">
                      <MonitorPlay
                        aria-hidden="true"
                        className="mt-1 size-6 shrink-0"
                        strokeWidth={1.75}
                      />
                      <span className="min-w-0">Next broadcast</span>
                    </dt>
                    <dd className="m-0 pl-8 text-base text-muted-foreground sm:pl-0 sm:text-right">
                      Schedule to be confirmed
                    </dd>
                  </div>
                </dl>
                <Text tone="muted">
                  Broadcast details are awaiting confirmation.
                </Text>
                <div>
                  <ButtonLink href="/watch">
                    <CirclePlay aria-hidden="true" className="size-4" />
                    Watch online
                  </ButtonLink>
                </div>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-sm md:aspect-auto">
              <Image
                src="/images/dance2.jpg"
                alt="People gathered together beside windows in a church hall."
                fill
                sizes="(min-width: 1280px) 384px, (min-width: 768px) 35vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t-(length:--control-border-width) border-border pt-4">
            <Text size="small" tone="muted">
              For service times and directions
            </Text>
            <Link href="/contact" className={textLink}>
              <MessageCircle
                aria-hidden="true"
                className="size-4 shrink-0"
                strokeWidth={1.75}
              />
              Contact the information desk
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
