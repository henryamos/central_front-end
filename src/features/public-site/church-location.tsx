import { MapPin, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button/button-link";
import { informationDesk } from "./church-information";

export function ChurchLocation() {
  return (
    <section aria-label="Find our church" className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid max-w-(--measure) gap-3">
          <p className="m-0 flex items-center gap-2 font-semibold">
            <MapPin aria-hidden="true" className="size-5" /> Visit us in Cape
            Coast
          </p>
          <h2 className="m-0 text-title leading-heading font-bold">
            There is a place for you here.
          </h2>
          <p className="m-0 text-muted-foreground">
            Find Cape Coast Central SDA Church on the map and plan your journey.
            We look forward to welcoming you.
          </p>
        </div>
        <ButtonLink
          href={informationDesk.directionsUrl!}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions <ArrowUpRight aria-hidden="true" className="size-5" />
          <span className="sr-only"> (opens Google Maps in a new tab)</span>
        </ButtonLink>
      </div>
      <div className="overflow-hidden rounded-md border border-border bg-background">
        <iframe
          title="Google Maps location of Cape Coast Central SDA Church"
          src="https://maps.google.com/maps?cid=4741699906228119699&output=embed"
          className="block aspect-square w-full border-0 sm:aspect-video lg:aspect-[3/1]"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
        <p className="m-0 border-t border-border p-4 text-sm">
          {informationDesk.address}
        </p>
      </div>
    </section>
  );
}
