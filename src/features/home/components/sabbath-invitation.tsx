"use client";
import { useCallback, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Church,
  CirclePlay,
  MapPin,
  UsersRound,
  MessageCircle,
  MonitorPlay,
  UserRoundCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
import { Button } from "@/components/ui/button/button";
import { ButtonLink } from "@/components/ui/button/button-link";
import { cn } from "@/lib/utils";
import { useWeeklyEntrance } from "../hooks/use-weekly-entrance";
import { useCarouselEnvironment } from "../hooks/use-carousel-environment";
import { PrayingHandsIcon } from "./praying-hands-icon";
const modes = [
  { id: "in-person", label: "In person", icon: MapPin },
  { id: "online", label: "Online", icon: MonitorPlay },
] as const;
const textLink =
  "inline-flex min-h-(--touch-target) min-w-(--touch-target) max-w-full items-center gap-2 rounded-sm text-base font-semibold text-primary no-underline hover:underline focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden";
function InformationDeskLink() {
  return (
    <Link
      href="/contact"
      aria-label="Contact the information desk"
      className={textLink + " justify-center sm:justify-start"}
    >
      <MessageCircle
        aria-hidden="true"
        className="size-4 shrink-0"
        strokeWidth={1.75}
      />
      <span className="sm:hidden">Contact</span>
      <span className="hidden sm:inline">Information desk</span>
    </Link>
  );
}
function compactTimeRange(value: string) {
  return value
    .replace(/:00(?= [AP]M)/g, "")
    .replace(/^(.+?) (AM|PM) [–-] (.+?) \2$/, "$1–$3 $2")
    .replace(/ [–-] /g, "–");
}
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
    time: "8:00 AM – 10:00 AM",
  },
  {
    id: "worship",
    label: "Worship service",
    kind: "worship",
    day: "Saturday",
    time: "10:00 AM – 1:00 PM",
  },
  {
    id: "midweek-prayer",
    label: "Midweek prayer",
    kind: "prayer",
    day: "Wednesday",
    time: "6:00 PM – 8:00 PM",
  },
  {
    id: "bible-study",
    label: "Bible study",
    kind: "study",
    day: "Sunday",
    time: "6:00 PM – 8:00 PM",
  },
];
/** Display supplied programme details; unconfirmed fields remain explicitly pending. */
export function SabbathInvitation({
  services = defaultServices,
}: { services?: readonly WorshipGathering[] } = {}) {
  const [mode, setMode] = useState<"in-person" | "online">("in-person");
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fullSchedule, setFullSchedule] = useState(false);
  const { reducedMotion, visible } = useCarouselEnvironment();
  const pageCount = Math.max(1, Math.ceil(services.length / 2));
  const currentPage = page % pageCount;
  const advance = useCallback(
    () => setPage((value) => (value + 1) % pageCount),
    [pageCount],
  );
  const panelRef = useWeeklyEntrance({
    automatic:
      !paused &&
      !fullSchedule &&
      !reducedMotion &&
      visible &&
      mode === "in-person" &&
      pageCount > 1,
    reducedMotion,
    fullSchedule,
    page: currentPage,
    services,
    onAdvance: advance,
  });
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
          ref={panelRef}
          data-sabbath-panel
          className="grid gap-4 rounded-md border-(length:--control-border-width) border-border bg-background p-4 shadow-invitation sm:gap-6 md:gap-8 md:p-8"
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
          <div className="grid gap-8">
            <div className="grid min-w-0 content-start gap-4">
              <div className="flex flex-wrap items-center justify-between gap-x-2 border-b-(length:--control-border-width) border-border sm:gap-x-6 sm:gap-y-2">
                <div
                  role="tablist"
                  aria-label="How to join us"
                  className="flex max-w-full min-w-0"
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
                        "shrink-0 rounded-none border-x-0 border-t-0 border-b-(length:--focus-width) border-transparent bg-transparent px-1 text-muted-foreground not-disabled:hover:bg-transparent not-disabled:hover:text-primary sm:px-4",
                        mode === item.id && "border-primary text-primary",
                      )}
                    >
                      <span className="flex min-w-0 items-center justify-center gap-2">
                        <item.icon
                          aria-hidden="true"
                          className="hidden size-4 shrink-0 sm:block"
                          strokeWidth={1.75}
                        />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </span>
                    </Button>
                  ))}
                </div>
                {mode === "in-person" && services.length > 2 && (
                  <Button
                    data-weekly-controls
                    variant="secondary"
                    aria-expanded={fullSchedule}
                    aria-label={
                      fullSchedule ? "Rotate gatherings" : "View all gatherings"
                    }
                    className="border-transparent bg-transparent px-0 text-sm hover:underline not-disabled:hover:bg-transparent"
                    onClick={() => setFullSchedule(!fullSchedule)}
                  >
                    {fullSchedule ? "Rotate" : "View all"}
                  </Button>
                )}
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
                <dl
                  data-weekly-programme
                  className="m-0 grid gap-x-12 md:grid-cols-2"
                >
                  {services.map((service, index) => {
                    const time = service.time?.trim() || "Time to be confirmed";
                    const compactTime = compactTimeRange(time);
                    const shown =
                      fullSchedule || Math.floor(index / 2) === currentPage;
                    const Icon = {
                      study: BookOpen,
                      worship: Church,
                      prayer: PrayingHandsIcon,
                      activity: UsersRound,
                    }[service.kind];
                    return (
                      <div
                        key={service.id}
                        data-weekly-reveal
                        aria-hidden={!shown}
                        className={cn(
                          "grid content-start gap-2 border-b-(length:--control-border-width) border-border py-4",
                          !fullSchedule &&
                            "col-start-1 row-start-1 even:row-start-2 md:even:col-start-2 md:even:row-start-1",
                          !shown && "pointer-events-none invisible",
                        )}
                      >
                        <dt className="min-w-0 overflow-hidden text-lg font-semibold text-primary">
                          <span
                            data-weekly-roll
                            className="flex min-w-0 items-start gap-2"
                          >
                            <Icon
                              aria-hidden="true"
                              className="mt-1 size-6 shrink-0"
                              strokeWidth={1.75}
                            />
                            <span className="grid min-w-0 gap-1">
                              <span>{service.label}</span>
                              {service.speaker?.trim() && (
                                <span className="text-sm font-normal text-muted-foreground">
                                  {service.speaker}
                                </span>
                              )}
                            </span>
                          </span>
                        </dt>
                        <dd className="m-0 overflow-hidden pl-8 text-base text-muted-foreground">
                          <span
                            data-weekly-roll
                            className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                          >
                            <span>
                              {service.day?.trim() || "Day to be confirmed"}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-primary tabular-nums">
                              {compactTime === time ? (
                                time
                              ) : (
                                <>
                                  <span className="sm:hidden">
                                    {compactTime}
                                  </span>
                                  <span className="hidden sm:inline">
                                    {time}
                                  </span>
                                </>
                              )}
                            </span>
                          </span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>
                <noscript data-weekly-fallback>
                  <style>
                    {
                      "noscript[data-weekly-fallback]{display:block!important}[data-weekly-programme],[data-weekly-controls]{display:none!important}"
                    }
                  </style>
                  <p>
                    {services
                      .map(
                        (service) =>
                          `${service.label}: ${service.day?.trim() || "Day to be confirmed"}, ${service.time?.trim() || "Time to be confirmed"}`,
                      )
                      .join(". ")}
                  </p>
                </noscript>
                <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
                  {services.length === 0 && (
                    <Text tone="muted">
                      Programme details will be confirmed here.
                    </Text>
                  )}
                  <div className="grid w-full grid-cols-2 items-center gap-3 sm:flex sm:w-auto sm:flex-wrap sm:gap-6">
                    <ButtonLink
                      href="/visit"
                      className="col-span-2 w-full sm:w-auto"
                    >
                      <CalendarDays aria-hidden="true" className="size-4" />
                      Plan a Visit
                    </ButtonLink>
                    <Link
                      href="/guest"
                      aria-label="Guest check-in"
                      className={textLink + " justify-center sm:justify-start"}
                    >
                      <UserRoundCheck
                        aria-hidden="true"
                        className="size-4 shrink-0"
                        strokeWidth={1.75}
                      />
                      <span className="sm:hidden">Check-in</span>
                      <span className="hidden sm:inline">Guest check-in</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="hidden size-4 shrink-0 sm:block"
                      />
                    </Link>
                    <InformationDeskLink />
                  </div>
                  {services.length > 2 && !fullSchedule && (
                    <div
                      data-weekly-controls
                      className="flex w-full items-center gap-2 sm:w-auto"
                    >
                      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
                        {!fullSchedule && (
                          <>
                            <Button
                              variant="secondary"
                              aria-label="Previous gatherings"
                              className="size-12 border-transparent bg-transparent p-0"
                              onClick={() => {
                                setPaused(true);
                                setPage(
                                  (currentPage + pageCount - 1) % pageCount,
                                );
                              }}
                            >
                              <ChevronLeft
                                aria-hidden="true"
                                className="size-4"
                              />
                            </Button>
                            <span
                              aria-live={paused ? "polite" : "off"}
                              aria-atomic="true"
                              className="px-2 text-sm text-muted-foreground tabular-nums"
                            >
                              {currentPage * 2 + 1}–
                              {Math.min(currentPage * 2 + 2, services.length)}{" "}
                              of {services.length}
                            </span>
                            <Button
                              variant="secondary"
                              aria-label="Next gatherings"
                              className="size-12 border-transparent bg-transparent p-0"
                              onClick={() => {
                                setPaused(true);
                                advance();
                              }}
                            >
                              <ChevronRight
                                aria-hidden="true"
                                className="size-4"
                              />
                            </Button>
                            <Button
                              variant="secondary"
                              className="size-12 border-transparent bg-transparent p-0"
                              disabled={reducedMotion}
                              title={
                                reducedMotion
                                  ? "Reduced motion enabled"
                                  : paused
                                    ? "Resume automatic rotation"
                                    : "Pause automatic rotation"
                              }
                              aria-label={
                                paused
                                  ? "Resume weekly rotation"
                                  : "Pause weekly rotation"
                              }
                              onClick={() => setPaused(!paused)}
                            >
                              {paused ? (
                                <Play aria-hidden="true" className="size-4" />
                              ) : (
                                <Pause aria-hidden="true" className="size-4" />
                              )}
                              <span className="sr-only">
                                {reducedMotion
                                  ? "Motion off"
                                  : paused
                                    ? "Resume"
                                    : "Pause"}
                              </span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
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
                <div className="flex flex-wrap items-center gap-6">
                  <ButtonLink href="/watch">
                    <CirclePlay aria-hidden="true" className="size-4" />
                    Watch online
                  </ButtonLink>
                  <InformationDeskLink />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
