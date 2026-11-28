import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { WorshipGathering } from "./schedule";
import type { ChurchEvent } from "./records";
const fullDate = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "Africa/Accra",
});
const month = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  timeZone: "Africa/Accra",
});
export function EventCard(
  props:
    { event: ChurchEvent } | { gathering: WorshipGathering; image: string },
) {
  const event = "event" in props ? props.event : undefined;
  const gathering = "gathering" in props ? props.gathering : undefined;
  const image = "image" in props ? props.image : event?.image;
  const title = event?.title ?? gathering!.label;
  const href = event ? "/events/" + event.id : "/visit";
  const date = event ? new Date(event.startDate) : undefined;
  return (
    <article className="event-card">
      {image && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={event?.imageAlt ?? ""}
            fill
            sizes="(min-width:768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="event-card-content">
        {event && date ? (
          <time dateTime={event.startDate} className="event-date">
            <span>{month.format(date)}</span>
            <strong>{date.getUTCDate()}</strong>
            <span>{date.getUTCFullYear()}</span>
          </time>
        ) : (
          <div className="event-date">
            <span>Every</span>
            <strong className="text-lg!">{gathering?.day}</strong>
            <span>Weekly</span>
          </div>
        )}
        <div className="grid min-w-0 content-start gap-3">
          <h3 className="m-0 text-2xl leading-heading font-bold">
            <Link href={href} className="hover:underline">
              {title}
            </Link>
          </h3>
          <p className="m-0 text-sm text-muted-foreground">
            {date ? fullDate.format(date) : gathering?.time}
            {event?.endDate &&
              event.endDate !== event.startDate &&
              " to " + fullDate.format(new Date(event.endDate))}
          </p>
          {event?.description && <p className="m-0">{event.description}</p>}
          {event?.location && (
            <p className="m-0 flex items-start gap-2 text-muted-foreground">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0" />
              {event.location}
            </p>
          )}
          <Link
            href={href}
            aria-label={
              event
                ? "Event details for " + title
                : "View schedule for " + title
            }
            className="mt-1 inline-flex min-h-12 w-fit items-center gap-2 border-t border-border font-semibold"
          >
            {event ? "Event details" : "View schedule"}{" "}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
