import { ArrowUpRight, Music2 } from "lucide-react";
export function YouthChoirSongs() {
  return (
    <section aria-label="Youth Choir songs" className="grid gap-6">
      <div className="grid gap-3">
        <p className="m-0 flex items-center gap-2 font-semibold">
          <Music2 aria-hidden="true" className="size-5" /> Listen to our choir
        </p>
        <h2 className="m-0 text-title leading-heading font-bold">
          My Help Comes From The Lord
        </h2>
        <p className="m-0 max-w-(--measure) text-muted-foreground">
          Join Cape Coast Central Youth Choir in song. Listen, be encouraged and
          share with a friend.
        </p>
      </div>
      <div className="overflow-hidden rounded-md border border-border bg-charcoal">
        <iframe
          title="Youth Choir - My Help Comes From The Lord"
          src="https://www.youtube-nocookie.com/embed/2KV6TXiTf0k"
          className="block aspect-video w-full border-0"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <a
        href="https://www.youtube.com/watch?v=2KV6TXiTf0k"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 w-fit items-center gap-2 font-semibold underline"
      >
        Watch on YouTube <ArrowUpRight aria-hidden="true" className="size-5" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </section>
  );
}
