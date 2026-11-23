import type { ZodType } from "zod";
import { ApiError } from "./api-error";
/** Browser JSON reads. Feature-owned schemas validate all responses. Server Components use server fetch. */
export async function apiGet<T>(
  path: string,
  schema: ZodType<T>,
  {
    signal,
    timeoutMs = 10000,
  }: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<T> {
  const parsedUrl = new URL(path, "http://validation.invalid");
  if (
    !path.startsWith("/api/v1/") ||
    path.includes("\\") ||
    !parsedUrl.pathname.startsWith("/api/v1/") ||
    parsedUrl.hash
  )
    throw new Error("Expected a relative /api/v1/ endpoint.");
  const timeout = AbortSignal.timeout(timeoutMs);
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const url =
    typeof window === "undefined"
      ? path
      : new URL(path, window.location.origin).href;
  try {
    const response = await fetch(url, {
      credentials: "same-origin",
      cache: "no-store",
      signal: requestSignal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new ApiError("HTTP_ERROR", response.status);
    const payload: unknown =
      response.status === 204 ? undefined : await response.json();
    const result = schema.safeParse(payload);
    if (!result.success) throw new ApiError("INVALID_RESPONSE");
    return result.data;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (timeout.aborted) throw new ApiError("TIMEOUT");
    if (error instanceof ApiError) throw error;
    if (error instanceof SyntaxError) throw new ApiError("INVALID_RESPONSE");
    throw new ApiError("NETWORK_ERROR");
  }
}
