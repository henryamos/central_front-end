import Link from "next/link";
/** Foundation empty state; replace through an approved feature ticket. */
export function PagePlaceholder({ title }: { title: string }) {
  return (
    <section className="section container" aria-labelledby="page-title">
      <h1 id="page-title">{title}</h1>
      <p>Content is not available yet.</p>
      <Link href="/">Return home</Link>
    </section>
  );
}
