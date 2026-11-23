import { expect, it } from "vitest";
import { makeQueryClient, shouldRetryQuery } from "@/lib/query/query-client";
import { ApiError } from "@/lib/api/api-error";
it("isolates query caches and never retries mutations automatically", () => {
  const first = makeQueryClient(),
    second = makeQueryClient();
  first.setQueryData(["private"], { name: "synthetic" });
  expect(second.getQueryData(["private"])).toBeUndefined();
  expect(second.getDefaultOptions().mutations?.retry).toBe(false);
  expect(second.getDefaultOptions().queries).toMatchObject({
    staleTime: 60000,
    gcTime: 300000,
  });
  first.clear();
  second.clear();
});
it.each([
  [new ApiError("HTTP_ERROR", 401), false],
  [new ApiError("HTTP_ERROR", 403), false],
  [new ApiError("HTTP_ERROR", 404), false],
  [new ApiError("INVALID_RESPONSE"), false],
  [new ApiError("HTTP_ERROR", 503), true],
  [new ApiError("NETWORK_ERROR"), true],
  [new ApiError("TIMEOUT"), true],
  [new Error("unexpected error"), false],
])("retries only known transient failures once: %s", (error, expected) => {
  expect(shouldRetryQuery(0, error)).toBe(expected);
  expect(shouldRetryQuery(1, error)).toBe(false);
});
