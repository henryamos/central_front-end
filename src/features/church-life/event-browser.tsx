"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { eventsForView, publishedEvents, type EventView } from "./records";

const emptyText = {
  Upcoming: "No upcoming events have been announced.",
  Latest: "No event announcements have been published yet.",
  Past: "No past events have been published yet.",
};
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "Africa/Accra",
});

export function EventBrowser() {
  const [view, setView] = useState<EventView>("Upcoming");
  const [today, setToday] = useState("");
  useEffect(() => {
    // Accra observes UTC year-round.
    const update = () => setToday(new Date().toISOString().slice(0, 10));
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, []);
  const events = eventsForView(publishedEvents, view, today);
  return (
    <div className="grid gap-4">
      <div
        role="group"
        aria-label="Filter events"
        className="flex w-fit max-w-full flex-wrap gap-1 rounded-md border border-border bg-background p-1"
      >
        {(["Upcoming", "Latest", "Past"] as const).map((label) => (
          <Button
            key={label}
            variant="secondary"
            aria-pressed={view === label}
            onClick={() => setView(label)}
            className="border-transparent px-3 py-1 aria-pressed:bg-primary aria-pressed:text-background aria-pressed:not-disabled:hover:bg-primary-hover aria-pressed:focus-visible:inset-ring-background"
          >
            {label}
          </Button>
        ))}
      </div>
      <div aria-live="polite">
        {events.length ? (
          <ul className="m-0 grid list-none gap-4 p-0">
            {events.map((event) => (
              <li
                key={event.id}
                className="grid gap-1 border-b border-border pb-4"
              >
                <Link
                  className="w-fit py-3 text-lg font-semibold underline"
                  href={"/events/" + event.id}
                >
                  {event.title}
                </Link>
                <span>
                  <time dateTime={event.startDate}>
                    {dateFormat.format(new Date(event.startDate))}
                  </time>
                  {event.endDate && event.endDate !== event.startDate && (
                    <>
                      {" "}
                      –{" "}
                      <time dateTime={event.endDate}>
                        {dateFormat.format(new Date(event.endDate))}
                      </time>
                    </>
                  )}
                </span>
                {event.location && <span>{event.location}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-start gap-4 border-t border-border py-4">
            <CalendarDays
              aria-hidden="true"
              className="mt-1 size-6 shrink-0"
              strokeWidth={1.5}
            />
            <div>
              <p className="m-0">{emptyText[view]}</p>
              {view === "Upcoming" && (
                <Link
                  href="/visit"
                  className="inline-flex min-h-12 items-center font-semibold underline"
                >
                  See weekly worship times
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
