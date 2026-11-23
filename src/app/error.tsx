"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section container" aria-labelledby="error-title">
      <h1 id="error-title">Something went wrong</h1>
      <p>Please try loading this page again.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
