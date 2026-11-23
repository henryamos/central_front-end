import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section site-container">
      <h1>Page not found</h1>
      <p>This page is unavailable.</p>
      <Link href="/">Return home</Link>
    </section>
  );
}
