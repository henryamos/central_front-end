import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { ChurchEvent } from "./records";
const fullDate = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "Africa/Accra",
});
const month = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  timeZone: "Africa/Accra",
});
export function EventCard({ event }: { event: ChurchEvent }) {
  const date = new Date(event.startDate);
  return (
    <article className="event-card">
      {event.image && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={event.image}
            alt={event.imageAlt ?? ""}
            fill
            sizes="(min-width:768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="event-card-content">
        <time dateTime={event.startDate} className="event-date">
          <span>{month.format(date)}</span>
          <strong>{date.getUTCDate()}</strong>
          <span>{date.getUTCFullYear()}</span>
        </time>
        <div className="grid min-w-0 content-start gap-3">
          <h3 className="m-0 text-2xl leading-heading font-bold">
            <Link href={"/events/" + event.id} className="hover:underline">
              {event.title}
            </Link>
          </h3>
          <p className="m-0 text-sm text-muted-foreground">
            {fullDate.format(date)}
            {event.endDate &&
              event.endDate !== event.startDate &&
              " to " + fullDate.format(new Date(event.endDate))}
          </p>
          {event.description && <p className="m-0">{event.description}</p>}
          {event.location && (
            <p className="m-0 flex items-start gap-2 text-muted-foreground">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0" />
              {event.location}
            </p>
          )}
          <Link
            href={"/events/" + event.id}
            aria-label={"Event details for " + event.title}
            className="mt-1 inline-flex min-h-12 w-fit items-center gap-2 border-t border-border font-semibold"
          >
            Event details <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
