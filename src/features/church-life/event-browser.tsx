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
        className="flex flex-wrap gap-x-1 border-b border-border"
      >
        {(["Upcoming", "Latest", "Past"] as const).map((label) => (
          <Button
            key={label}
            variant="secondary"
            aria-pressed={view === label}
            onClick={() => setView(label)}
            className="rounded-none border-0 border-b-2 border-transparent px-3 py-2 aria-pressed:border-primary aria-pressed:bg-surface-muted"
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
          <p className="m-0 flex items-start gap-3 py-4 text-muted-foreground">
            <CalendarDays aria-hidden="true" className="size-5 shrink-0" />
            {emptyText[view]}
          </p>
        )}
      </div>
    </div>
  );
}
