"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { foundationStatusSchema } from "@/mocks/foundation";
export function QueryDemo() {
  const query = useQuery({
    queryKey: ["foundation", "status"],
    queryFn: ({ signal }) =>
      apiGet("/api/v1/_foundation/status", foundationStatusSchema, { signal }),
  });
  return (
    <section
      className="section site-container"
      aria-labelledby="foundation-title"
    >
      <h1 id="foundation-title">Infrastructure check</h1>
      {query.isPending ? (
        <p role="status">Loading mock response...</p>
      ) : query.isError ? (
        <>
          <p role="alert">{query.error.message}</p>
          <button type="button" onClick={() => void query.refetch()}>
            Try again
          </button>
        </>
      ) : (
        <>
          <p>Response source: {query.data.source}</p>
          <p role="status">Query request ready</p>
          <button
            type="button"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            {query.isFetching ? "Refreshing..." : "Refresh request"}
          </button>
        </>
      )}
    </section>
  );
}
