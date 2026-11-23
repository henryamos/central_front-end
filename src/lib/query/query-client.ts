import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/api-error";
export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= 1 || !(error instanceof ApiError)) return false;
  return (
    error.code === "NETWORK_ERROR" ||
    error.code === "TIMEOUT" ||
    (error.code === "HTTP_ERROR" &&
      error.status !== undefined &&
      error.status >= 500 &&
      error.status <= 599)
  );
}
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60000, gcTime: 300000, retry: shouldRetryQuery },
      mutations: { retry: false },
    },
  });
}
