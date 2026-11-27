import { notFound } from "next/navigation";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";
import { publishedEvents } from "@/features/church-life/records";
export const dynamicParams = false;
export const generateStaticParams = () =>
  publishedEvents.map(({ id }) => ({ slug: id }));
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = publishedEvents.find((item) => item.id === slug);
  if (!event) notFound();
  return (
    <PublicPage title={event.title} intro={event.description ?? "Church event"}>
      <dl className="grid gap-2">
        <dt className="font-semibold">Date</dt>
        <dd>
          {event.startDate}
          {event.endDate && " – " + event.endDate}
        </dd>
        {event.location && (
          <>
            <dt className="font-semibold">Venue</dt>
            <dd>{event.location}</dd>
          </>
        )}
      </dl>
      {event.registrationUrl && (
        <a className="w-fit py-3 underline" href={event.registrationUrl}>
          Register for this event
        </a>
      )}
      <PageLinks items={[["All events", "/events"]]} />
    </PublicPage>
  );
}
