import type { Publication } from "./publications";
export function PublicationList({
  items,
  empty,
}: {
  items: readonly Publication[];
  empty: string;
}) {
  if (!items.length) return <p>{empty}</p>;
  return (
    <div className="grid gap-6">
      {[...items]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((item) => (
          <article
            key={item.slug}
            className="grid gap-2 border-t border-border pt-4"
          >
            <h2>{item.title}</h2>
            <p className="m-0 text-muted-foreground">
              <time dateTime={item.date}>{item.date}</time>
              {item.author && " · " + item.author}
            </p>
            <p className="whitespace-pre-line">{item.body}</p>
          </article>
        ))}
    </div>
  );
}
